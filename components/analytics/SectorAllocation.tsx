"use client";

import { KiteHolding } from "@/lib/types";
import sectors from "@/data/sectors.json";
import SectionHeader from "@/components/shared/SectionHeader";

export default function SectorAllocation({
  holdings,
}: {
  holdings: KiteHolding[];
}) {
  const sectorMap = sectors as Record<string, string>;
  const totalValue = holdings.reduce(
    (sum, h) => sum + h.last_price * h.quantity,
    0
  );

  const sectorValues: Record<string, number> = {};
  holdings.forEach((h) => {
    const sector = sectorMap[h.tradingsymbol] || "Unmapped";
    sectorValues[sector] =
      (sectorValues[sector] || 0) + h.last_price * h.quantity;
  });

  const sectorData = Object.entries(sectorValues)
    .map(([sector, value]) => ({
      sector,
      value,
      pct: totalValue > 0 ? (value / totalValue) * 100 : 0,
    }))
    .sort((a, b) => b.pct - a.pct);

  return (
    <div className="border border-border bg-bg-surface">
      <SectionHeader
        title="Sectors"
        subtitle={`${sectorData.length} segments`}
        action={
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-text-secondary flex items-baseline gap-1.5">
            <span className="text-text-display text-[14px] font-mono">
              {sectorData[0]?.pct.toFixed(0)}%
            </span>
            <span className="text-text-muted text-[9px]">
              {sectorData[0]?.sector ?? "—"}
            </span>
          </div>
        }
      />

      <div className="p-4">
        {/* Stacked horizontal bar — segments differentiated by opacity */}
        <div className="flex h-2 w-full overflow-hidden">
          {sectorData.map((s, i) => {
            const opacity = Math.max(0.25, 1 - i * 0.13);
            return (
              <div
                key={s.sector}
                className="bg-text-display"
                style={{ width: `${s.pct}%`, opacity }}
                title={`${s.sector} — ${s.pct.toFixed(1)}%`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-5 flex flex-col gap-2">
          {sectorData.map((s, i) => {
            const opacity = Math.max(0.25, 1 - i * 0.13);
            return (
              <div
                key={s.sector}
                className="flex items-center gap-3 text-[12px]"
              >
                <span
                  className="w-2.5 h-2.5 shrink-0 bg-text-display"
                  style={{ opacity }}
                />
                <span className="text-text-secondary flex-1 truncate">
                  {s.sector}
                </span>
                <span className="font-mono text-[11px] text-text-primary tabular-nums">
                  {s.pct.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
