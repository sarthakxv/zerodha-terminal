"use client";

import { KiteTrade } from "@/lib/types";
import { formatCurrencyDecimal, formatTime } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";
import { SkeletonTable } from "@/components/shared/Skeleton";

export default function TradesTable({ trades, isLoading }: { trades?: KiteTrade[]; isLoading: boolean }) {
  if (isLoading) {
    return (<div className="bg-bg-surface-alt border border-border"><SectionHeader title="TRADES" /><SkeletonTable rows={3} cols={6} /></div>);
  }
  if (!trades || trades.length === 0) {
    return (<div className="bg-bg-surface-alt border border-border"><SectionHeader title="TRADES" subtitle="0 today" /><div className="text-text-dim text-[11px] px-3 py-8 text-center">No trades today</div></div>);
  }

  return (
    <div className="bg-bg-surface-alt border border-border">
      <SectionHeader title="TRADES" subtitle={`${trades.length} today`} />
      <div className="grid grid-cols-[0.8fr_1.2fr_0.6fr_0.5fr_1fr_1fr] px-3 py-1.5 text-text-dim text-[10px] uppercase tracking-wider border-b border-[#161616]">
        <span>Time</span><span>Symbol</span><span>Type</span><span className="text-right">Qty</span><span className="text-right">Price</span><span className="text-right">Order ID</span>
      </div>
      {trades.map((t) => (
        <div key={t.trade_id} className="grid grid-cols-[0.8fr_1.2fr_0.6fr_0.5fr_1fr_1fr] px-3 py-1.5 text-[11px] border-b border-[#111] items-center">
          <span className="text-text-secondary">{formatTime(t.fill_timestamp)}</span>
          <span className="text-text-primary font-medium">{t.tradingsymbol}</span>
          <span className={t.transaction_type === "BUY" ? "text-profit" : "text-loss"}>{t.transaction_type}</span>
          <span className="text-right text-text-secondary">{t.quantity}</span>
          <span className="text-right text-text-primary">{formatCurrencyDecimal(t.average_price)}</span>
          <span className="text-right text-text-dim font-mono text-[10px]">{t.order_id.slice(-8)}</span>
        </div>
      ))}
    </div>
  );
}
