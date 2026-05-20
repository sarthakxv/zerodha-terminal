import type { NextRequest } from "next/server";

export class InvalidInstrumentError extends Error {
  constructor() {
    super("Invalid instrument parameter");
    this.name = "InvalidInstrumentError";
  }
}

export interface RateLimitOptions {
  namespace: string;
  limit: number;
  windowMs: number;
}

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

export const RATE_LIMITS = {
  quote: { namespace: "quote", limit: 120, windowMs: 60_000 },
  standard: { namespace: "standard", limit: 60, windowMs: 60_000 },
} as const satisfies Record<string, RateLimitOptions>;

const buckets = new Map<string, RateLimitBucket>();
let lastCleanupAt = 0;

const INSTRUMENT_ID_PATTERN = /^(NSE|BSE):[A-Z0-9 ._&-]+$/;

export function isValidInstrumentId(value: string): boolean {
  return (
    value.length > 0 &&
    value === value.trim() &&
    INSTRUMENT_ID_PATTERN.test(value)
  );
}

export function buildKiteInstrumentQuery(instruments: string[]): string {
  if (instruments.some((instrument) => !isValidInstrumentId(instrument))) {
    throw new InvalidInstrumentError();
  }

  return instruments
    .map((instrument) => `i=${encodeURIComponent(instrument)}`)
    .join("&");
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const expectedOrigin = new URL(
      process.env.NEXT_PUBLIC_BASE_URL ?? request.url
    ).origin;
    return new URL(origin).origin === expectedOrigin;
  } catch {
    return false;
  }
}

export function checkRateLimit(
  identity: string,
  options: RateLimitOptions,
  now: number = Date.now()
) {
  cleanupExpiredBuckets(now);

  const key = `${options.namespace}:${identity}`;
  const current = buckets.get(key);

  if (!current || now >= current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, remaining: options.limit - 1 };
  }

  if (current.count >= options.limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  return {
    allowed: true,
    remaining: options.limit - current.count,
    resetAt: current.resetAt,
  };
}

export async function rateLimitRequest(
  request: NextRequest,
  options: RateLimitOptions,
  identity?: string
): Promise<Response | null> {
  const key = identity ? `session:${identity}` : getRequestIdentity(request);
  const result = checkRateLimit(key, options);

  if (result.allowed) return null;

  return Response.json({ error: "rate_limited" }, { status: 429 });
}

export function resetRateLimitBuckets() {
  buckets.clear();
  lastCleanupAt = 0;
}

function getRequestIdentity(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim();
  return `ip:${ip || "unknown"}`;
}

function cleanupExpiredBuckets(now: number) {
  if (now - lastCleanupAt < 60_000) return;

  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key);
  }

  lastCleanupAt = now;
}
