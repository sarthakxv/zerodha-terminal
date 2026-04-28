"use client";

import { useHoldings } from "@/hooks/use-holdings";
import { usePositions } from "@/hooks/use-positions";
import { useMargins } from "@/hooks/use-margins";
import HeroPnl from "@/components/portfolio/HeroPnl";
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
    <div className="flex flex-col gap-12">
      {hasError && <ErrorBanner />}

      {/* PRIMARY — hero P&L */}
      <HeroPnl
        holdings={holdings.data}
        isLoading={holdings.isLoading}
      />

      {/* SECONDARY — summary cards */}
      <SummaryStrip
        holdings={holdings.data}
        margins={margins.data}
        isLoading={holdings.isLoading || margins.isLoading}
      />

      {/* TERTIARY — data tables */}
      <HoldingsTable
        holdings={holdings.data}
        isLoading={holdings.isLoading}
      />
      <PositionsTable positions={positions.data?.net} />
    </div>
  );
}
