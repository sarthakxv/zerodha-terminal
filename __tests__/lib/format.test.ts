import { describe, it, expect } from "vitest";
import { formatPnl, formatPercent, pnlColor } from "@/lib/format";

describe("formatPnl", () => {
  it("adds + prefix for positive values", () => {
    expect(formatPnl(1962)).toBe("+1,962");
  });

  it("keeps - prefix for negative values", () => {
    expect(formatPnl(-780)).toMatch(/-780/);
  });

  it("handles zero", () => {
    expect(formatPnl(0)).toBe("+0");
  });
});

describe("pnlColor", () => {
  it("returns profit class for positive", () => {
    expect(pnlColor(100)).toBe("text-profit");
  });

  it("returns loss class for negative", () => {
    expect(pnlColor(-50)).toBe("text-loss");
  });

  it("returns secondary class for zero", () => {
    expect(pnlColor(0)).toBe("text-text-secondary");
  });
});

describe("formatPercent", () => {
  it("formats with sign and percent symbol", () => {
    const result = formatPercent(12.34);
    expect(result).toContain("12.34");
    expect(result).toContain("%");
  });
});
