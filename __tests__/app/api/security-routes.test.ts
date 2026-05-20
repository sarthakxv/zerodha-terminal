import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { resetRateLimitBuckets } from "@/lib/security";

vi.mock("@/lib/session", () => ({
  getSession: vi.fn(),
  getAuthenticatedClient: vi.fn(),
  getAuthenticatedContext: vi.fn(),
  sessionExpiredResponse: () =>
    Response.json({ error: "session_expired" }, { status: 401 }),
  errorResponse: (message: string, status = 500) =>
    Response.json({ error: message }, { status }),
}));

vi.mock("@/lib/kite", () => ({
  KiteClient: vi.fn(),
  KiteSessionExpiredError: class KiteSessionExpiredError extends Error {},
}));

import { getAuthenticatedClient, getAuthenticatedContext, getSession } from "@/lib/session";

const mockedGetSession = vi.mocked(getSession);
const mockedGetAuthenticatedClient = vi.mocked(getAuthenticatedClient);
const mockedGetAuthenticatedContext = vi.mocked(getAuthenticatedContext);

function nextRequest(url: string, init?: RequestInit) {
  return new NextRequest(url, init);
}

describe("quote API validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRateLimitBuckets();
    mockedGetSession.mockResolvedValue({
      accessToken: "token",
      userId: "user",
    } as never);
  });

  it("rejects malicious LTP instrument params before creating a Kite client", async () => {
    const { GET } = await import("@/app/api/ltp/route");
    const response = await GET(
      nextRequest("http://localhost:3000/api/ltp?i=NSE%3ARELIANCE%26foo%3Dbar")
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid instrument parameter",
    });
    expect(mockedGetAuthenticatedClient).not.toHaveBeenCalled();
    expect(mockedGetAuthenticatedContext).not.toHaveBeenCalled();
  });

  it("rejects malicious OHLC instrument params before creating a Kite client", async () => {
    const { GET } = await import("@/app/api/ohlc/route");
    const response = await GET(
      nextRequest("http://localhost:3000/api/ohlc?i=NSE%3ASBIN%3Dbad")
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid instrument parameter",
    });
    expect(mockedGetAuthenticatedClient).not.toHaveBeenCalled();
    expect(mockedGetAuthenticatedContext).not.toHaveBeenCalled();
  });
});

describe("logout origin validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRateLimitBuckets();
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "http://localhost:3000");
    mockedGetSession.mockResolvedValue({
      accessToken: undefined,
      destroy: vi.fn(),
    } as never);
  });

  it("rejects cross-origin logout requests", async () => {
    const { POST } = await import("@/app/api/auth/logout/route");
    const response = await POST(
      nextRequest("http://localhost:3000/api/auth/logout", {
        method: "POST",
        headers: { Origin: "https://evil.example" },
      })
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "forbidden" });
    expect(mockedGetSession).not.toHaveBeenCalled();
  });

  it("allows same-origin logout requests", async () => {
    const destroy = vi.fn();
    mockedGetSession.mockResolvedValue({
      accessToken: undefined,
      destroy,
    } as never);

    const { POST } = await import("@/app/api/auth/logout/route");
    const response = await POST(
      nextRequest("http://localhost:3000/api/auth/logout", {
        method: "POST",
        headers: { Origin: "http://localhost:3000" },
      })
    );

    expect(response.status).toBe(200);
    expect(destroy).toHaveBeenCalled();
  });

  it("allows no-origin logout requests", async () => {
    const destroy = vi.fn();
    mockedGetSession.mockResolvedValue({
      accessToken: undefined,
      destroy,
    } as never);

    const { POST } = await import("@/app/api/auth/logout/route");
    const response = await POST(
      nextRequest("http://localhost:3000/api/auth/logout", { method: "POST" })
    );

    expect(response.status).toBe(200);
    expect(destroy).toHaveBeenCalled();
  });
});

describe("API rate limiting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRateLimitBuckets();
    mockedGetSession.mockResolvedValue({
      accessToken: "token",
      userId: "rate-user",
    } as never);
    mockedGetAuthenticatedContext.mockResolvedValue({
      session: { userId: "rate-user" },
      client: { getHoldings: vi.fn().mockResolvedValue([]) },
    } as never);
  });

  it("returns 429 after the per-minute route limit is exceeded", async () => {
    const { GET } = await import("@/app/api/holdings/route");
    let response = new Response();

    for (let i = 0; i < 61; i++) {
      response = await GET(nextRequest("http://localhost:3000/api/holdings"));
    }

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({ error: "rate_limited" });
  });
});
