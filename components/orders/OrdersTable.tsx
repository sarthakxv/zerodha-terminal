"use client";

import { KiteOrder } from "@/lib/types";
import { formatCurrencyDecimal, formatTime } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";
import { SkeletonTable } from "@/components/shared/Skeleton";

const STATUS_COLORS: Record<string, string> = {
  COMPLETE: "text-profit",
  REJECTED: "text-loss",
  CANCELLED: "text-text-dim",
  OPEN: "text-accent",
  "TRIGGER PENDING": "text-accent",
};

export default function OrdersTable({ orders, isLoading }: { orders?: KiteOrder[]; isLoading: boolean }) {
  if (isLoading) {
    return (<div className="bg-bg-surface-alt border border-border"><SectionHeader title="ORDERS" /><SkeletonTable rows={3} cols={6} /></div>);
  }
  if (!orders || orders.length === 0) {
    return (<div className="bg-bg-surface-alt border border-border"><SectionHeader title="ORDERS" subtitle="0 today" /><div className="text-text-dim text-[11px] px-3 py-8 text-center">No orders today</div></div>);
  }

  return (
    <div className="bg-bg-surface-alt border border-border">
      <SectionHeader title="ORDERS" subtitle={`${orders.length} today`} />
      <div className="grid grid-cols-[0.8fr_1.2fr_0.6fr_0.5fr_1fr_0.8fr] px-3 py-1.5 text-text-dim text-[10px] uppercase tracking-wider border-b border-[#161616]">
        <span>Time</span><span>Symbol</span><span>Type</span><span className="text-right">Qty</span><span className="text-right">Price</span><span className="text-right">Status</span>
      </div>
      {orders.map((o) => (
        <div key={o.order_id} className="grid grid-cols-[0.8fr_1.2fr_0.6fr_0.5fr_1fr_0.8fr] px-3 py-1.5 text-[11px] border-b border-[#111] items-center">
          <span className="text-text-secondary">{formatTime(o.order_timestamp)}</span>
          <span className="text-text-primary font-medium">{o.tradingsymbol}</span>
          <span className={o.transaction_type === "BUY" ? "text-profit" : "text-loss"}>{o.transaction_type}</span>
          <span className="text-right text-text-secondary">{o.quantity}</span>
          <span className="text-right text-text-primary">{formatCurrencyDecimal(o.average_price || o.price)}</span>
          <span className={`text-right ${STATUS_COLORS[o.status] || "text-text-secondary"}`}>{o.status}</span>
        </div>
      ))}
    </div>
  );
}
