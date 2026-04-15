"use client";

import { KiteHolding } from "@/lib/types";
import { formatPnl, formatPercent } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";

export default function TopGainersLosers({ holdings }: { holdings: KiteHolding[] }) {
  const withReturn = holdings.map((h) => ({
    ...h,
    returnPct: h.average_price > 0 ? ((h.last_price - h.average_price) / h.average_price) * 100 : 0,
  }));

  const gainers = [...withReturn].filter((h) => h.returnPct > 0).sort((a, b) => b.returnPct - a.returnPct);
  const losers = [...withReturn].filter((h) => h.returnPct < 0).sort((a, b) => a.returnPct - b.returnPct);

  return (
    <div className="grid grid-cols-2 gap-1.5">
      <div className="bg-bg-surface-alt border border-border">
        <SectionHeader title="TOP GAINERS" subtitle={`${gainers.length}`} />
        <div className="flex flex-col">
          {gainers.map((h, i) => (
            <div key={h.tradingsymbol} className="flex items-center justify-between px-3 py-1.5 text-[11px] border-b border-[#111]">
              <div className="flex items-center gap-2">
                <span className="text-text-dim text-[10px] w-4">{i + 1}</span>
                <span className="text-text-primary font-medium">{h.tradingsymbol}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-profit text-[10px]">{formatPercent(h.returnPct)}</span>
                <span className="text-profit">{formatPnl(h.pnl)}</span>
              </div>
            </div>
          ))}
          {gainers.length === 0 && <div className="text-text-dim text-[10px] px-3 py-4 text-center">No gainers</div>}
        </div>
      </div>
      <div className="bg-bg-surface-alt border border-border">
        <SectionHeader title="TOP LOSERS" subtitle={`${losers.length}`} />
        <div className="flex flex-col">
          {losers.map((h, i) => (
            <div key={h.tradingsymbol} className="flex items-center justify-between px-3 py-1.5 text-[11px] border-b border-[#111]">
              <div className="flex items-center gap-2">
                <span className="text-text-dim text-[10px] w-4">{i + 1}</span>
                <span className="text-text-primary font-medium">{h.tradingsymbol}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-loss text-[10px]">{formatPercent(h.returnPct)}</span>
                <span className="text-loss">{formatPnl(h.pnl)}</span>
              </div>
            </div>
          ))}
          {losers.length === 0 && <div className="text-text-dim text-[10px] px-3 py-4 text-center">No losers</div>}
        </div>
      </div>
    </div>
  );
}
