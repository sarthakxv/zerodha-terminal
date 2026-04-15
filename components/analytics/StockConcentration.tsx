"use client";

import { KiteHolding } from "@/lib/types";
import { formatPercent } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";

const BAR_COLORS = ["bg-accent", "bg-profit", "bg-[#3388ff]", "bg-[#ffaa00]", "bg-[#aa44ff]", "bg-[#ff6688]", "bg-text-secondary"];

export default function StockConcentration({ holdings }: { holdings: KiteHolding[] }) {
  const totalValue = holdings.reduce((sum, h) => sum + h.last_price * h.quantity, 0);

  const stocks = holdings
    .map((h) => ({
      symbol: h.tradingsymbol,
      value: h.last_price * h.quantity,
      pct: totalValue > 0 ? ((h.last_price * h.quantity) / totalValue) * 100 : 0,
    }))
    .sort((a, b) => b.pct - a.pct);

  return (
    <div className="bg-bg-surface-alt border border-border">
      <SectionHeader title="STOCK CONCENTRATION" />
      <div className="p-3 flex flex-col gap-2">
        {stocks.map((s, i) => (
          <div key={s.symbol} className="flex items-center gap-3">
            <span className="text-text-primary text-[11px] font-medium w-24">{s.symbol}</span>
            <div className="flex-1 bg-[#111] rounded h-4 overflow-hidden">
              <div className={`h-full ${BAR_COLORS[i % BAR_COLORS.length]} rounded`} style={{ width: `${s.pct}%` }} />
            </div>
            <span className="text-text-secondary text-[10px] w-12 text-right">{formatPercent(s.pct).replace("+", "")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
