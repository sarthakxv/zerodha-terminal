"use client";

import { KiteTrade } from "@/lib/types";
import { formatCurrencyDecimal, formatTime } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";
import { SkeletonTable } from "@/components/shared/Skeleton";

const COLS = "grid-cols-[0.9fr_1.4fr_0.6fr_0.5fr_1fr_1fr]";

export default function TradesTable({
  trades,
  isLoading,
}: {
  trades?: KiteTrade[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="border border-border bg-bg-surface">
        <SectionHeader title="Trades" />
        <SkeletonTable />
      </div>
    );
  }

  if (!trades || trades.length === 0) {
    return (
      <div className="border border-border bg-bg-surface">
        <SectionHeader title="Trades" subtitle="None" />
        <div className="py-16 text-center">
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-muted">
            No trades today
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border bg-bg-surface">
      <SectionHeader title="Trades" subtitle={`${trades.length} executed`} />

      <div
        className={`grid ${COLS} px-4 py-2.5 border-b border-border font-mono text-[9px] tracking-[0.16em] uppercase text-text-muted`}
      >
        <span>Time</span>
        <span>Symbol</span>
        <span>Side</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Price</span>
        <span className="text-right">Order</span>
      </div>

      {trades.map((t, i) => (
        <div
          key={t.trade_id}
          className={`grid ${COLS} px-4 py-3 items-center text-[13px] hover:bg-bg-raised/40 transition-colors ${
            i !== trades.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <span className="font-mono text-[11px] text-text-secondary">
            {formatTime(t.fill_timestamp)}
          </span>
          <span className="text-text-display font-medium truncate">
            {t.tradingsymbol}
          </span>
          <span
            className={`font-mono text-[10px] tracking-[0.14em] uppercase ${
              t.transaction_type === "BUY" ? "text-profit" : "text-accent"
            }`}
          >
            {t.transaction_type}
          </span>
          <span className="text-right font-mono text-text-secondary text-[12px]">
            {t.quantity}
          </span>
          <span className="text-right font-mono text-text-primary text-[12px]">
            {formatCurrencyDecimal(t.average_price)}
          </span>
          <span className="text-right font-mono text-[10px] text-text-dim">
            {t.order_id.slice(-8)}
          </span>
        </div>
      ))}
    </div>
  );
}
