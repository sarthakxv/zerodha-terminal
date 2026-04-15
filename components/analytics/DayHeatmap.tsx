"use client";

import { KiteHolding } from "@/lib/types";
import SectionHeader from "@/components/shared/SectionHeader";

export default function DayHeatmap({ holdings }: { holdings: KiteHolding[] }) {
  const sorted = [...holdings].sort((a, b) => b.day_change_percentage - a.day_change_percentage);

  return (
    <div className="bg-bg-surface-alt border border-border">
      <SectionHeader title="TODAY" />
      <div className="p-2 grid grid-cols-4 gap-1">
        {sorted.map((h) => {
          const pct = h.day_change_percentage;
          const isPositive = pct >= 0;
          const intensity = Math.min(Math.abs(pct) / 5, 1);
          const bg = isPositive ? `rgba(51, 204, 102, ${0.05 + intensity * 0.2})` : `rgba(255, 68, 68, ${0.05 + intensity * 0.2})`;
          const borderColor = isPositive ? `rgba(51, 204, 102, ${0.08 + intensity * 0.15})` : `rgba(255, 68, 68, ${0.08 + intensity * 0.15})`;
          return (
            <div key={h.tradingsymbol} className="rounded p-2 text-center" style={{ background: bg, border: `1px solid ${borderColor}` }}>
              <div className="text-text-primary text-[10px] font-medium">{h.tradingsymbol}</div>
              <div className={`text-[11px] font-bold ${isPositive ? "text-profit" : "text-loss"}`}>{pct >= 0 ? "+" : ""}{pct.toFixed(1)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
