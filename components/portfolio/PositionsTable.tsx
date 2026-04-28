"use client";

import { KitePosition } from "@/lib/types";
import { formatCurrencyDecimal, formatPnl, pnlColor } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";

interface PositionsTableProps {
  positions?: KitePosition[];
}

const COLS = "grid-cols-[1.4fr_0.7fr_0.5fr_1fr_1fr_1fr]";

export default function PositionsTable({ positions }: PositionsTableProps) {
  if (!positions || positions.length === 0) return null;

  return (
    <div className="border border-border bg-bg-surface">
      <SectionHeader
        title="Positions"
        subtitle={`${positions.length} active`}
      />

      <div
        className={`grid ${COLS} px-4 py-2.5 border-b border-border font-mono text-[9px] tracking-[0.16em] uppercase text-text-muted`}
      >
        <span>Symbol</span>
        <span>Product</span>
        <span className="text-right">Qty</span>
        <span className="text-right">LTP</span>
        <span className="text-right">P&L</span>
        <span className="text-right">M2M</span>
      </div>

      {positions.map((p, i) => (
        <div
          key={p.tradingsymbol + p.exchange + p.product}
          className={`grid ${COLS} px-4 py-3 items-center text-[13px] hover:bg-bg-raised/40 transition-colors ${
            i !== positions.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-text-display font-medium truncate">
              {p.tradingsymbol}
            </span>
            <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-text-dim">
              {p.exchange}
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-text-muted">
            {p.product}
          </span>
          <span className="text-right font-mono text-text-secondary text-[12px]">
            {p.quantity}
          </span>
          <span className="text-right font-mono text-text-primary text-[12px]">
            {formatCurrencyDecimal(p.last_price)}
          </span>
          <span
            className={`text-right font-mono text-[13px] ${pnlColor(p.pnl)}`}
          >
            {formatPnl(p.pnl)}
          </span>
          <span
            className={`text-right font-mono text-[12px] ${pnlColor(p.m2m)}`}
          >
            {formatPnl(p.m2m)}
          </span>
        </div>
      ))}
    </div>
  );
}
