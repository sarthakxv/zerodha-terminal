import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  buildKiteInstrumentQuery,
  checkRateLimit,
  isSameOriginRequest,
  isValidInstrumentId,
  resetRateLimitBuckets,
} from "@/lib/security";

describe("instrument validation", () => {
  it("allows supported NSE and BSE instrument ids", () => {
    expect(isValidInstrumentId("NSE:RELIANCE")).toBe(true);
    expect(isValidInstrumentId("BSE:TCS")).toBe(true);
    expect(isValidInstrumentId("NSE:M&M")).toBe(true);
    expect(isValidInstrumentId("NSE:BAJAJ-AUTO")).toBe(true);
    expect(isValidInstrumentId("NSE:NIFTY 50")).toBe(true);
  });

  it("rejects malformed or unsupported instrument ids", () => {
    expect(isValidInstrumentId("NSE:RELIANCE&foo=bar")).toBe(false);
    expect(isValidInstrumentId("NSE:SBIN=bad")).toBe(false);
    expect(isValidInstrumentId("")).toBe(false);
    expect(isValidInstrumentId("MCX:GOLD")).toBe(false);
    expect(isValidInstrumentId("nse:reliance")).toBe(false);
  });

  it("builds an encoded Kite query without allowing parameter injection", () => {
    expect(buildKiteInstrumentQuery(["NSE:NIFTY 50", "NSE:M&M"])).toBe(
      "i=NSE%3ANIFTY%2050&i=NSE%3AM%26M"
    );

    expect(() => buildKiteInstrumentQuery(["NSE:RELIANCE&foo=bar"])).toThrow(
      "Invalid instrument parameter"
    );
  });
});

describe("same-origin validation", () => {
  it("allows missing origin headers", () => {
    const request = new Request("http://localhost:3000/api/auth/logout");

    expect(isSameOriginRequest(request)).toBe(true);
  });

  it("allows origin matching NEXT_PUBLIC_BASE_URL", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "http://localhost:3000");
    const request = new Request("http://localhost:3000/api/auth/logout", {
      headers: { Origin: "http://localhost:3000" },
    });

    expect(isSameOriginRequest(request)).toBe(true);
  });

  it("rejects mismatched origin headers", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "http://localhost:3000");
    const request = new Request("http://localhost:3000/api/auth/logout", {
      headers: { Origin: "https://evil.example" },
    });

    expect(isSameOriginRequest(request)).toBe(false);
  });
});

describe("rate limiting", () => {
  beforeEach(() => {
    resetRateLimitBuckets();
  });

  it("rejects requests after the configured limit", () => {
    const options = { namespace: "test", limit: 2, windowMs: 60_000 };

    expect(checkRateLimit("session:user", options, 1_000).allowed).toBe(true);
    expect(checkRateLimit("session:user", options, 2_000).allowed).toBe(true);
    expect(checkRateLimit("session:user", options, 3_000).allowed).toBe(false);
  });

  it("allows requests after the rate-limit window resets", () => {
    const options = { namespace: "test", limit: 1, windowMs: 60_000 };

    expect(checkRateLimit("session:user", options, 1_000).allowed).toBe(true);
    expect(checkRateLimit("session:user", options, 2_000).allowed).toBe(false);
    expect(checkRateLimit("session:user", options, 62_000).allowed).toBe(true);
  });
});
