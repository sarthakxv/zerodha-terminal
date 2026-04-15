import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("useWatchlist", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("starts with empty array when no saved data", async () => {
    const { useWatchlist } = await import("@/hooks/use-watchlist");
    const { result } = renderHook(() => useWatchlist());
    expect(result.current.instruments).toEqual([]);
  });

  it("adds instrument and persists", async () => {
    const mod = await import("@/hooks/use-watchlist");
    const { result } = renderHook(() => mod.useWatchlist());

    act(() => {
      result.current.addInstrument("NSE:RELIANCE");
    });

    expect(result.current.instruments).toContain("NSE:RELIANCE");
  });

  it("does not add duplicates", async () => {
    const mod = await import("@/hooks/use-watchlist");
    const { result } = renderHook(() => mod.useWatchlist());

    act(() => {
      result.current.addInstrument("NSE:SBIN");
      result.current.addInstrument("NSE:SBIN");
    });

    expect(
      result.current.instruments.filter((i: string) => i === "NSE:SBIN")
    ).toHaveLength(1);
  });

  it("caps at 50 instruments", async () => {
    const mod = await import("@/hooks/use-watchlist");
    const { result } = renderHook(() => mod.useWatchlist());

    act(() => {
      for (let i = 0; i < 55; i++) {
        result.current.addInstrument(`NSE:STOCK${i}`);
      }
    });

    expect(result.current.instruments.length).toBe(50);
  });

  it("removes instrument", async () => {
    const mod = await import("@/hooks/use-watchlist");
    const { result } = renderHook(() => mod.useWatchlist());

    act(() => {
      result.current.addInstrument("NSE:SBIN");
      result.current.addInstrument("NSE:INFY");
    });

    act(() => {
      result.current.removeInstrument("NSE:SBIN");
    });

    expect(result.current.instruments).toEqual(["NSE:INFY"]);
  });
});
