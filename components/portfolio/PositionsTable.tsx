"use client";

import { KitePosition } from "@/lib/types";
import { formatCurrencyDecimal, formatPnl, pnlColor } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";

interface PositionsTableProps {
  positions?: KitePosition[];
}

export default function PositionsTable({ positions }: PositionsTableProps) {
  if (!positions || positions.length === 0) return null;

  return (
    <div className="bg-bg-surface-alt border border-border">
      <SectionHeader title="POSITIONS" subtitle={`${positions.length} active`} />
      <div className="grid grid-cols-[1.5fr_0.8fr_0.5fr_1fr_1fr_1fr] px-3 py-1.5 text-text-dim text-[11px] uppercase tracking-wider border-b border-[#161616]">
        <span>Symbol</span>
        <span>Product</span>
        <span className="text-right">Qty</span>
        <span className="text-right">LTP</span>
        <span className="text-right">P&L</span>
        <span className="text-right">M2M</span>
      </div>
      {positions.map((p) => (
        <div key={p.tradingsymbol + p.exchange + p.product} className={`grid grid-cols-[1.5fr_0.8fr_0.5fr_1fr_1fr_1fr] px-3 py-1.5 text-[12px] border-b border-[#111] items-center ${p.pnl < 0 ? "bg-loss-row" : ""}`}>
          <span className="text-text-primary font-medium">{p.tradingsymbol}</span>
          <span className="text-text-dim text-[11px]">{p.product}</span>
          <span className="text-right text-text-secondary">{p.quantity}</span>
          <span className="text-right text-text-primary">{formatCurrencyDecimal(p.last_price)}</span>
          <span className={`text-right ${pnlColor(p.pnl)}`}>{formatPnl(p.pnl)}</span>
          <span className={`text-right ${pnlColor(p.m2m)}`}>{formatPnl(p.m2m)}</span>
        </div>
      ))}
    </div>
  );
}
