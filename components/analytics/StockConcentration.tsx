"use client";

import { KiteHolding } from "@/lib/types";
import { formatPercent } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";

export default function StockConcentration({
  holdings,
}: {
  holdings: KiteHolding[];
}) {
  const totalValue = holdings.reduce(
    (sum, h) => sum + h.last_price * h.quantity,
    0
  );

  const stocks = holdings
    .map((h) => ({
      symbol: h.tradingsymbol,
      value: h.last_price * h.quantity,
      pct: totalValue > 0 ? ((h.last_price * h.quantity) / totalValue) * 100 : 0,
    }))
    .sort((a, b) => b.pct - a.pct);

  // Top concentration stat for hero strip
  const top3 = stocks.slice(0, 3).reduce((sum, s) => sum + s.pct, 0);

  return (
    <div className="border border-border bg-bg-surface">
      <SectionHeader
        title="Concentration"
        subtitle="By holding value"
        action={
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-text-secondary flex items-baseline gap-1.5">
            <span className="text-text-display text-[14px] font-mono">
              {top3.toFixed(0)}%
            </span>
            <span className="text-text-muted text-[9px]">in top 3</span>
          </div>
        }
      />

      <div className="p-4 flex flex-col gap-2.5">
        {stocks.map((s, i) => {
          // Opacity ramp: largest holding 100%, ramping down to 30%
          const opacity = Math.max(0.3, 1 - i * 0.08);
          return (
            <div key={s.symbol} className="flex items-center gap-3">
              <span className="text-text-display text-[12px] w-24 shrink-0 truncate">
                {s.symbol}
              </span>
              <div className="flex-1 bg-bg-raised h-3 relative">
                <div
                  className="h-full bg-text-display"
                  style={{ width: `${s.pct}%`, opacity }}
                />
              </div>
              <span className="font-mono text-[11px] text-text-secondary w-12 text-right shrink-0 tabular-nums">
                {formatPercent(s.pct).replace("+", "")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
