"use client";

import { KiteHolding } from "@/lib/types";
import { formatPnl, formatPercent, pnlColor } from "@/lib/format";

interface HeroPnlProps {
  holdings?: KiteHolding[];
  isLoading: boolean;
}

export default function HeroPnl({ holdings, isLoading }: HeroPnlProps) {
  if (isLoading || !holdings) {
    return (
      <div className="py-6">
        <div className="font-mono text-[10px] tracking-[0.20em] uppercase text-text-muted">
          / Day P&L
        </div>
        <div
          className="mt-4 font-display text-[96px] leading-[0.85] tracking-[-0.04em] text-text-dim blink"
          style={{ fontFamily: "var(--font-display)" }}
        >
          [LOADING…]
        </div>
      </div>
    );
  }

  const dayPnl = holdings.reduce((sum, h) => sum + h.day_change * h.quantity, 0);
  const current = holdings.reduce((sum, h) => sum + h.last_price * h.quantity, 0);
  const dayPnlPct = current > 0 ? (dayPnl / (current - dayPnl)) * 100 : 0;

  const totalPnl = holdings.reduce((sum, h) => sum + h.pnl, 0);
  const invested = holdings.reduce(
    (sum, h) => sum + h.average_price * h.quantity,
    0
  );
  const totalPnlPct = invested > 0 ? (totalPnl / invested) * 100 : 0;

  const sign = dayPnl >= 0 ? "+" : "−";
  const absDayPnl = Math.abs(dayPnl);

  return (
    <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
      <div className="md:col-span-8">
        <div className="font-mono text-[10px] tracking-[0.20em] uppercase text-text-muted flex items-baseline gap-3">
          <span>/ Day P&L</span>
          <span className="text-text-dim">·</span>
          <span className="text-text-dim">Live</span>
        </div>
        <div
          className={`mt-4 font-display font-medium leading-[0.85] tracking-[-0.04em] text-[clamp(64px,10vw,120px)] ${pnlColor(
            dayPnl
          )}`}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {sign}
          {new Intl.NumberFormat("en-IN", {
            maximumFractionDigits: 0,
          }).format(absDayPnl)}
        </div>
        <div
          className={`mt-3 font-mono text-[14px] tracking-wide ${pnlColor(dayPnl)}`}
        >
          {formatPercent(dayPnlPct)} today
        </div>
      </div>

      {/* Right rail — total P&L (secondary tier) */}
      <div className="md:col-span-4 flex flex-col gap-1.5 md:border-l md:border-border md:pl-6">
        <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-text-muted">
          Total P&L
        </div>
        <div
          className={`font-mono text-[26px] leading-tight ${pnlColor(totalPnl)}`}
        >
          {formatPnl(totalPnl)}
        </div>
        <div className={`font-mono text-[11px] ${pnlColor(totalPnl)}`}>
          {formatPercent(totalPnlPct)}
        </div>
      </div>
    </div>
  );
}
