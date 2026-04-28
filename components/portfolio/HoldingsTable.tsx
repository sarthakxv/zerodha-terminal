"use client";

import { KiteHolding } from "@/lib/types";
import {
  formatCurrencyDecimal,
  formatPnl,
  formatPercent,
  pnlColor,
} from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";
import { SkeletonTable } from "@/components/shared/Skeleton";

interface HoldingsTableProps {
  holdings?: KiteHolding[];
  isLoading: boolean;
}

const COLS = "grid-cols-[1.4fr_0.6fr_1fr_1fr_1fr_0.9fr]";

export default function HoldingsTable({
  holdings,
  isLoading,
}: HoldingsTableProps) {
  if (isLoading) {
    return (
      <div className="border border-border bg-bg-surface">
        <SectionHeader title="Holdings" />
        <SkeletonTable />
      </div>
    );
  }

  if (!holdings || holdings.length === 0) {
    return (
      <div className="border border-border bg-bg-surface">
        <SectionHeader title="Holdings" subtitle="Empty" />
        <div className="py-16 text-center">
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-muted">
            No holdings on file
          </span>
        </div>
      </div>
    );
  }

  const sorted = [...holdings].sort((a, b) => b.pnl - a.pnl);

  return (
    <div className="border border-border bg-bg-surface">
      <SectionHeader
        title="Holdings"
        subtitle={`${holdings.length} instruments`}
      />

      {/* Header row */}
      <div
        className={`grid ${COLS} px-4 py-2.5 border-b border-border font-mono text-[9px] tracking-[0.16em] uppercase text-text-muted`}
      >
        <span>Symbol</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Avg</span>
        <span className="text-right">LTP</span>
        <span className="text-right">P&L</span>
        <span className="text-right">Change</span>
      </div>

      {sorted.map((h, i) => {
        const changePct =
          h.average_price > 0
            ? ((h.last_price - h.average_price) / h.average_price) * 100
            : 0;
        return (
          <div
            key={h.tradingsymbol + h.exchange}
            className={`grid ${COLS} px-4 py-3 items-center text-[13px] hover:bg-bg-raised/40 transition-colors ${
              i !== sorted.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="text-text-display font-medium truncate">
                {h.tradingsymbol}
              </span>
              <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-text-dim">
                {h.exchange}
              </span>
            </div>
            <span className="text-right font-mono text-text-secondary text-[12px]">
              {h.quantity}
            </span>
            <span className="text-right font-mono text-text-secondary text-[12px]">
              {formatCurrencyDecimal(h.average_price)}
            </span>
            <span className="text-right font-mono text-text-primary text-[12px]">
              {formatCurrencyDecimal(h.last_price)}
            </span>
            <span
              className={`text-right font-mono text-[13px] ${pnlColor(h.pnl)}`}
            >
              {formatPnl(h.pnl)}
            </span>
            <span
              className={`text-right font-mono text-[12px] ${pnlColor(changePct)}`}
            >
              {formatPercent(changePct)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
