"use client";

import { KiteHolding } from "@/lib/types";
import SectionHeader from "@/components/shared/SectionHeader";

export default function DayHeatmap({ holdings }: { holdings: KiteHolding[] }) {
  const sorted = [...holdings].sort(
    (a, b) => b.day_change_percentage - a.day_change_percentage
  );

  return (
    <div className="border border-border bg-bg-surface">
      <SectionHeader title="Today · Heatmap" subtitle="Sorted by day %" />

      <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1">
        {sorted.map((h) => {
          const pct = h.day_change_percentage;
          const isPositive = pct >= 0;
          // Opacity ramp: 0% change → minimal tint, 5%+ → strong tint
          const intensity = Math.min(Math.abs(pct) / 5, 1);
          const baseAlpha = 0.06 + intensity * 0.22;
          const bg = isPositive
            ? `rgba(74, 158, 92, ${baseAlpha})`
            : `rgba(215, 25, 33, ${baseAlpha})`;

          return (
            <div
              key={h.tradingsymbol}
              className="border border-border-visible/60 px-2.5 py-3 flex flex-col gap-1"
              style={{ background: bg }}
              title={`${h.tradingsymbol} ${pct.toFixed(2)}%`}
            >
              <span className="text-text-display text-[11px] font-medium truncate">
                {h.tradingsymbol}
              </span>
              <span
                className={`font-mono text-[12px] tabular-nums ${
                  isPositive ? "text-profit" : "text-accent"
                }`}
              >
                {pct >= 0 ? "+" : ""}
                {pct.toFixed(2)}
                <span className="text-[9px] ml-0.5">%</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
