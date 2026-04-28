"use client";

import { KiteHolding, KiteMargins } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import StatCard from "@/components/shared/StatCard";
import { SkeletonStrip } from "@/components/shared/Skeleton";

interface SummaryStripProps {
  holdings?: KiteHolding[];
  margins?: KiteMargins;
  isLoading: boolean;
}

export default function SummaryStrip({
  holdings,
  margins,
  isLoading,
}: SummaryStripProps) {
  if (isLoading || !holdings) return <SkeletonStrip cards={4} />;

  const invested = holdings.reduce(
    (sum, h) => sum + h.average_price * h.quantity,
    0
  );
  const current = holdings.reduce(
    (sum, h) => sum + h.last_price * h.quantity,
    0
  );
  const cash = margins?.equity?.net ?? 0;

  return (
    <div className="flex border border-border bg-bg-surface">
      <StatCard label="Invested" value={formatCurrency(invested)} />
      <StatCard label="Current value" value={formatCurrency(current)} />
      <StatCard label="Available cash" value={formatCurrency(cash)} />
      <StatCard
        label="Holdings"
        value={String(holdings.length).padStart(2, "0")}
      />
    </div>
  );
}
