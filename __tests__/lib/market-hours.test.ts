import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("market-hours", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetModules();
  });

  it("returns closed on Saturday", async () => {
    // 2025-04-19 is a Saturday. 06:30 UTC = 12:00 IST
    vi.setSystemTime(new Date("2025-04-19T06:30:00Z"));
    const { getMarketStatus } = await import("@/lib/market-hours");
    expect(getMarketStatus()).toBe("closed");
  });

  it("returns open during market hours on weekday", async () => {
    // 2025-04-15 is a Tuesday. 04:30 UTC = 10:00 IST (market open 9:15-15:30)
    vi.setSystemTime(new Date("2025-04-15T04:30:00Z"));
    const { isMarketOpen } = await import("@/lib/market-hours");
    expect(isMarketOpen()).toBe(true);
  });

  it("returns closed before market opens on weekday", async () => {
    // 02:30 UTC = 08:00 IST (before 9:15)
    vi.setSystemTime(new Date("2025-04-15T02:30:00Z"));
    const { isMarketOpen } = await import("@/lib/market-hours");
    expect(isMarketOpen()).toBe(false);
  });

  it("returns closed after market closes on weekday", async () => {
    // 10:30 UTC = 16:00 IST (after 15:30)
    vi.setSystemTime(new Date("2025-04-15T10:30:00Z"));
    const { isMarketOpen } = await import("@/lib/market-hours");
    expect(isMarketOpen()).toBe(false);
  });

  it("returns pre-open during 9:00-9:15 window", async () => {
    // 03:40 UTC = 09:10 IST (pre-open window 9:00-9:15)
    vi.setSystemTime(new Date("2025-04-15T03:40:00Z"));
    const { getMarketStatus } = await import("@/lib/market-hours");
    expect(getMarketStatus()).toBe("pre-open");
  });

  it("getWatchlistPollingInterval returns 5000 for small lists during market hours", async () => {
    vi.setSystemTime(new Date("2025-04-15T04:30:00Z"));
    const { getWatchlistPollingInterval } = await import("@/lib/market-hours");
    expect(getWatchlistPollingInterval(10)).toBe(5000);
  });

  it("getWatchlistPollingInterval returns 10000 for larger lists", async () => {
    vi.setSystemTime(new Date("2025-04-15T04:30:00Z"));
    const { getWatchlistPollingInterval } = await import("@/lib/market-hours");
    expect(getWatchlistPollingInterval(30)).toBe(10000);
  });

  it("getWatchlistPollingInterval returns false outside market hours", async () => {
    vi.setSystemTime(new Date("2025-04-15T15:00:00Z"));
    const { getWatchlistPollingInterval } = await import("@/lib/market-hours");
    expect(getWatchlistPollingInterval(10)).toBe(false);
  });
});
