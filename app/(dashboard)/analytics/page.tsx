"use client";

import { useHoldings } from "@/hooks/use-holdings";
import { formatPercent, pnlColor } from "@/lib/format";
import StockConcentration from "@/components/analytics/StockConcentration";
import SectorAllocation from "@/components/analytics/SectorAllocation";
import DayHeatmap from "@/components/analytics/DayHeatmap";
import TopGainersLosers from "@/components/analytics/TopGainersLosers";
import ErrorBanner from "@/components/shared/ErrorBanner";
import { SkeletonTable } from "@/components/shared/Skeleton";

export default function AnalyticsPage() {
  const { data: holdings, isLoading, isError } = useHoldings();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <SkeletonTable />
      </div>
    );
  }

  if (!holdings || holdings.length === 0) {
    return (
      <div className="border border-border bg-bg-surface dot-grid-subtle py-24 px-6 flex flex-col items-center gap-4">
        <span className="font-mono text-[10px] tracking-[0.20em] uppercase text-text-muted">
          / Analytics
        </span>
        <p className="text-text-secondary text-[13px] text-center max-w-sm">
          No holdings data available for analysis yet.
        </p>
      </div>
    );
  }

  // Hero: total return %
  const invested = holdings.reduce(
    (sum, h) => sum + h.average_price * h.quantity,
    0
  );
  const totalPnl = holdings.reduce((sum, h) => sum + h.pnl, 0);
  const totalReturnPct = invested > 0 ? (totalPnl / invested) * 100 : 0;
  const sign = totalReturnPct >= 0 ? "+" : "−";
  const absPct = Math.abs(totalReturnPct);

  return (
    <div className="flex flex-col gap-12">
      {isError && <ErrorBanner />}

      {/* PRIMARY — total return % */}
      <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8">
          <div className="font-mono text-[10px] tracking-[0.20em] uppercase text-text-muted">
            / Total return
          </div>
          <div
            className={`mt-3 font-display font-medium leading-[0.85] tracking-[-0.04em] text-[clamp(64px,10vw,128px)] ${pnlColor(
              totalReturnPct
            )}`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {sign}
            {absPct.toFixed(2)}
            <span className="text-[0.45em] ml-3 align-baseline">%</span>
          </div>
          <div className="mt-3 font-mono text-[11px] tracking-[0.14em] uppercase text-text-secondary">
            Across {holdings.length} holdings · since inception
          </div>
        </div>

        <div className="md:col-span-4 md:border-l md:border-border md:pl-6 flex flex-col gap-1.5">
          <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-text-muted">
            P&L (abs)
          </div>
          <div className={`font-mono text-[26px] leading-tight ${pnlColor(totalPnl)}`}>
            {formatPercent(totalReturnPct)}
          </div>
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-text-dim">
            Realized + unrealized
          </div>
        </div>
      </div>

      {/* SECONDARY — composition (concentration + sectors) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockConcentration holdings={holdings} />
        <SectorAllocation holdings={holdings} />
      </div>

      {/* TERTIARY — daily movers + ranked tables */}
      <DayHeatmap holdings={holdings} />
      <TopGainersLosers holdings={holdings} />
    </div>
  );
}
