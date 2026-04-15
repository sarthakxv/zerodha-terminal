"use client";

import { KiteHolding, KiteMargins } from "@/lib/types";
import { formatCurrency, formatPnl, formatPercent } from "@/lib/format";
import StatCard from "@/components/shared/StatCard";
import { SkeletonStrip } from "@/components/shared/Skeleton";

interface SummaryStripProps {
  holdings?: KiteHolding[];
  margins?: KiteMargins;
  isLoading: boolean;
}

export default function SummaryStrip({ holdings, margins, isLoading }: SummaryStripProps) {
  if (isLoading || !holdings) return <SkeletonStrip />;

  const invested = holdings.reduce((sum, h) => sum + h.average_price * h.quantity, 0);
  const current = holdings.reduce((sum, h) => sum + h.last_price * h.quantity, 0);
  const totalPnl = holdings.reduce((sum, h) => sum + h.pnl, 0);
  const totalPnlPct = invested > 0 ? (totalPnl / invested) * 100 : 0;
  const dayPnl = holdings.reduce((sum, h) => sum + h.day_change * h.quantity, 0);
  const dayPnlPct = current > 0 ? (dayPnl / (current - dayPnl)) * 100 : 0;
  const cash = margins?.equity?.net ?? 0;

  return (
    <div className="flex gap-px">
      <StatCard label="Invested" value={formatCurrency(invested)} />
      <StatCard label="Current" value={formatCurrency(current)} />
      <StatCard label="Total P&L" value={formatPnl(totalPnl)} colorByValue subValue={{ text: formatPercent(totalPnlPct), value: totalPnl }} />
      <StatCard label="Day P&L" value={formatPnl(dayPnl)} colorByValue subValue={{ text: formatPercent(dayPnlPct), value: dayPnl }} />
      <StatCard label="Available" value={formatCurrency(cash)} />
    </div>
  );
}
