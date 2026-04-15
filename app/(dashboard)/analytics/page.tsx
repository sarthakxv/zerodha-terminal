"use client";

import { useHoldings } from "@/hooks/use-holdings";
import StockConcentration from "@/components/analytics/StockConcentration";
import SectorAllocation from "@/components/analytics/SectorAllocation";
import DayHeatmap from "@/components/analytics/DayHeatmap";
import TopGainersLosers from "@/components/analytics/TopGainersLosers";
import ErrorBanner from "@/components/shared/ErrorBanner";
import { SkeletonTable } from "@/components/shared/Skeleton";

export default function AnalyticsPage() {
  const { data: holdings, isLoading, isError } = useHoldings();

  if (isLoading) {
    return <div className="flex flex-col gap-1.5"><SkeletonTable rows={7} cols={3} /></div>;
  }

  if (!holdings || holdings.length === 0) {
    return <div className="text-text-dim text-[11px] px-3 py-8 text-center">No holdings data for analytics</div>;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {isError && <ErrorBanner />}
      <StockConcentration holdings={holdings} />
      <SectorAllocation holdings={holdings} />
      <DayHeatmap holdings={holdings} />
      <TopGainersLosers holdings={holdings} />
    </div>
  );
}
