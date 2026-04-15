"use client";

import { useHoldings } from "@/hooks/use-holdings";
import { usePositions } from "@/hooks/use-positions";
import { useMargins } from "@/hooks/use-margins";
import SummaryStrip from "@/components/portfolio/SummaryStrip";
import HoldingsTable from "@/components/portfolio/HoldingsTable";
import PositionsTable from "@/components/portfolio/PositionsTable";
import ErrorBanner from "@/components/shared/ErrorBanner";

export default function PortfolioPage() {
  const holdings = useHoldings();
  const positions = usePositions();
  const margins = useMargins();

  const hasError = holdings.isError || positions.isError || margins.isError;

  return (
    <div className="flex flex-col gap-1.5">
      {hasError && <ErrorBanner />}
      <SummaryStrip holdings={holdings.data} margins={margins.data} isLoading={holdings.isLoading || margins.isLoading} />
      <HoldingsTable holdings={holdings.data} isLoading={holdings.isLoading} />
      <PositionsTable positions={positions.data?.net} />
    </div>
  );
}
