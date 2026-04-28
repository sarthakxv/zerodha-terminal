"use client";

import { KiteOrder } from "@/lib/types";
import { formatCurrencyDecimal, formatTime } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";
import { SkeletonTable } from "@/components/shared/Skeleton";

const STATUS_COLORS: Record<string, string> = {
  COMPLETE: "text-profit",
  REJECTED: "text-accent",
  CANCELLED: "text-text-muted",
  OPEN: "text-warning",
  "TRIGGER PENDING": "text-warning",
};

const COLS = "grid-cols-[0.9fr_1.4fr_0.6fr_0.5fr_1fr_0.9fr]";

export default function OrdersTable({
  orders,
  isLoading,
}: {
  orders?: KiteOrder[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="border border-border bg-bg-surface">
        <SectionHeader title="Orders" />
        <SkeletonTable />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="border border-border bg-bg-surface">
        <SectionHeader title="Orders" subtitle="None" />
        <div className="py-16 text-center">
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-muted">
            No orders today
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border bg-bg-surface">
      <SectionHeader title="Orders" subtitle={`${orders.length} today`} />

      <div
        className={`grid ${COLS} px-4 py-2.5 border-b border-border font-mono text-[9px] tracking-[0.16em] uppercase text-text-muted`}
      >
        <span>Time</span>
        <span>Symbol</span>
        <span>Side</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Price</span>
        <span className="text-right">Status</span>
      </div>

      {orders.map((o, i) => (
        <div
          key={o.order_id}
          className={`grid ${COLS} px-4 py-3 items-center text-[13px] hover:bg-bg-raised/40 transition-colors ${
            i !== orders.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <span className="font-mono text-[11px] text-text-secondary">
            {formatTime(o.order_timestamp)}
          </span>
          <span className="text-text-display font-medium truncate">
            {o.tradingsymbol}
          </span>
          <span
            className={`font-mono text-[10px] tracking-[0.14em] uppercase ${
              o.transaction_type === "BUY" ? "text-profit" : "text-accent"
            }`}
          >
            {o.transaction_type}
          </span>
          <span className="text-right font-mono text-text-secondary text-[12px]">
            {o.quantity}
          </span>
          <span className="text-right font-mono text-text-primary text-[12px]">
            {formatCurrencyDecimal(o.average_price || o.price)}
          </span>
          <span
            className={`text-right font-mono text-[10px] tracking-[0.14em] uppercase ${
              STATUS_COLORS[o.status] ?? "text-text-secondary"
            }`}
          >
            {o.status}
          </span>
        </div>
      ))}
    </div>
  );
}
