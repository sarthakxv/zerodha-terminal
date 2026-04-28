"use client";

import { useLTP } from "@/hooks/use-ltp";
import { useOHLC } from "@/hooks/use-ohlc";
import {
  formatCurrencyDecimal,
  formatPnl,
  formatPercent,
  pnlColor,
} from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";
import { SkeletonTable } from "@/components/shared/Skeleton";

interface WatchlistTableProps {
  instruments: string[];
  onRemove: (instrument: string) => void;
}

const COLS = "grid-cols-[1.6fr_0.6fr_1fr_1fr_1fr_0.4fr]";

export default function WatchlistTable({
  instruments,
  onRemove,
}: WatchlistTableProps) {
  const { data: ltpData, isLoading: ltpLoading } = useLTP(instruments);
  const { data: ohlcData } = useOHLC(instruments);

  if (instruments.length === 0) {
    return (
      <div className="border border-border bg-bg-surface">
        <SectionHeader title="Live" subtitle="Empty list" />
        <div className="dot-grid-subtle py-20 px-6 flex flex-col items-center gap-4 text-center">
          <span className="font-mono text-[10px] tracking-[0.20em] uppercase text-text-muted">
            / No instruments tracked
          </span>
          <p className="text-text-secondary text-[13px] max-w-sm">
            Search for an instrument above to start watching its live price.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border bg-bg-surface">
      <SectionHeader
        title="Live"
        subtitle={`${instruments.length} instruments`}
      />

      <div
        className={`grid ${COLS} px-4 py-2.5 border-b border-border font-mono text-[9px] tracking-[0.16em] uppercase text-text-muted`}
      >
        <span>Symbol</span>
        <span>Exchange</span>
        <span className="text-right">LTP</span>
        <span className="text-right">Change</span>
        <span className="text-right">Day %</span>
        <span />
      </div>

      {ltpLoading ? (
        <SkeletonTable />
      ) : (
        instruments.map((inst, i) => {
          const ltp = ltpData?.[inst];
          const ohlc = ohlcData?.[inst];
          const lastPrice = ltp?.last_price ?? 0;
          const closePrice = ohlc?.ohlc?.close ?? 0;
          const change = closePrice > 0 ? lastPrice - closePrice : 0;
          const changePct = closePrice > 0 ? (change / closePrice) * 100 : 0;
          const [exchange, symbol] = inst.split(":");

          return (
            <div
              key={inst}
              className={`group grid ${COLS} px-4 py-3 items-center text-[13px] hover:bg-bg-raised/40 transition-colors ${
                i !== instruments.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-text-display font-medium truncate">
                {symbol}
              </span>
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-text-dim">
                {exchange}
              </span>
              <span className="text-right font-mono text-text-primary text-[13px]">
                {lastPrice > 0 ? formatCurrencyDecimal(lastPrice) : "—"}
              </span>
              <span
                className={`text-right font-mono text-[12px] ${pnlColor(change)}`}
              >
                {closePrice > 0 ? formatPnl(change) : "—"}
              </span>
              <span
                className={`text-right font-mono text-[12px] ${pnlColor(changePct)}`}
              >
                {closePrice > 0 ? formatPercent(changePct) : "—"}
              </span>
              <button
                onClick={() => onRemove(inst)}
                className="justify-self-end opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center font-mono text-[12px] text-text-dim hover:text-accent transition-all"
                title={`Remove ${symbol}`}
                aria-label={`Remove ${symbol}`}
              >
                ×
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
