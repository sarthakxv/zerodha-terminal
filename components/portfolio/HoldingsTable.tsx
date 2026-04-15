"use client";

import { KiteHolding } from "@/lib/types";
import { formatCurrencyDecimal, formatPnl, formatPercent, pnlColor } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";
import { SkeletonTable } from "@/components/shared/Skeleton";

interface HoldingsTableProps {
  holdings?: KiteHolding[];
  isLoading: boolean;
}

export default function HoldingsTable({ holdings, isLoading }: HoldingsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-bg-surface-alt border border-border">
        <SectionHeader title="HOLDINGS" />
        <SkeletonTable rows={5} cols={6} />
      </div>
    );
  }

  if (!holdings || holdings.length === 0) {
    return (
      <div className="bg-bg-surface-alt border border-border">
        <SectionHeader title="HOLDINGS" subtitle="0 instruments" />
        <div className="text-text-dim text-[12px] px-3 py-8 text-center">No holdings found</div>
      </div>
    );
  }

  const sorted = [...holdings].sort((a, b) => b.pnl - a.pnl);

  return (
    <div className="bg-bg-surface-alt border border-border">
      <SectionHeader title="HOLDINGS" subtitle={`${holdings.length} instruments`} />
      <div className="grid grid-cols-[1.5fr_0.5fr_1fr_1fr_1fr_1fr] px-3 py-1.5 text-text-dim text-[11px] uppercase tracking-wider border-b border-[#161616]">
        <span>Symbol</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Avg</span>
        <span className="text-right">LTP</span>
        <span className="text-right">P&L</span>
        <span className="text-right">Chg%</span>
      </div>
      {sorted.map((h) => {
        const changePct = h.average_price > 0 ? ((h.last_price - h.average_price) / h.average_price) * 100 : 0;
        const isLoss = h.pnl < 0;
        return (
          <div key={h.tradingsymbol + h.exchange} className={`grid grid-cols-[1.5fr_0.5fr_1fr_1fr_1fr_1fr] px-3 py-1.5 text-[12px] border-b border-[#111] items-center ${isLoss ? "bg-loss-row" : ""}`}>
            <span className="text-text-primary font-medium">{h.tradingsymbol}</span>
            <span className="text-right text-text-secondary">{h.quantity}</span>
            <span className="text-right text-text-primary">{formatCurrencyDecimal(h.average_price)}</span>
            <span className="text-right text-text-primary">{formatCurrencyDecimal(h.last_price)}</span>
            <span className={`text-right ${pnlColor(h.pnl)}`}>{formatPnl(h.pnl)}</span>
            <span className={`text-right ${pnlColor(changePct)}`}>{formatPercent(changePct)}</span>
          </div>
        );
      })}
    </div>
  );
}
