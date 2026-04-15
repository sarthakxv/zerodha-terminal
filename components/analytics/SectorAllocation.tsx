"use client";

import { KiteHolding } from "@/lib/types";
import sectors from "@/data/sectors.json";
import SectionHeader from "@/components/shared/SectionHeader";

const SECTOR_COLORS: Record<string, string> = {
  Defense: "#ff6e00", Auto: "#33cc66", Banking: "#3388ff", Energy: "#ffaa00",
  Gold: "#aa44ff", IT: "#ff6688", Pharma: "#00cccc", Unmapped: "#555555",
};

function getSectorColor(sector: string): string {
  return SECTOR_COLORS[sector] || SECTOR_COLORS["Unmapped"];
}

export default function SectorAllocation({ holdings }: { holdings: KiteHolding[] }) {
  const sectorMap = sectors as Record<string, string>;
  const totalValue = holdings.reduce((sum, h) => sum + h.last_price * h.quantity, 0);

  const sectorValues: Record<string, number> = {};
  holdings.forEach((h) => {
    const sector = sectorMap[h.tradingsymbol] || "Unmapped";
    sectorValues[sector] = (sectorValues[sector] || 0) + h.last_price * h.quantity;
  });

  const sectorData = Object.entries(sectorValues)
    .map(([sector, value]) => ({ sector, value, pct: totalValue > 0 ? (value / totalValue) * 100 : 0 }))
    .sort((a, b) => b.pct - a.pct);

  let gradientParts: string[] = [];
  let cumulative = 0;
  sectorData.forEach((s) => {
    const start = cumulative;
    cumulative += s.pct;
    gradientParts.push(`${getSectorColor(s.sector)} ${start}% ${cumulative}%`);
  });
  const gradient = `conic-gradient(${gradientParts.join(", ")})`;

  return (
    <div className="bg-bg-surface-alt border border-border">
      <SectionHeader title="SECTOR ALLOCATION" />
      <div className="p-4 flex items-start gap-6">
        <div className="relative shrink-0">
          <div className="w-[100px] h-[100px] rounded-full" style={{ background: gradient }}>
            <div className="absolute inset-[24px] bg-bg-surface-alt rounded-full flex flex-col items-center justify-center">
              <span className="text-text-dim text-[8px]">STOCKS</span>
              <span className="text-text-primary text-lg font-bold">{holdings.length}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          {sectorData.map((s) => (
            <div key={s.sector} className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2 text-text-secondary">
                <span className="w-2 h-2 rounded-sm inline-block" style={{ background: getSectorColor(s.sector) }} />
                {s.sector}
              </div>
              <span className="text-text-primary">{s.pct.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
