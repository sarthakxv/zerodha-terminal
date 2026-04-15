"use client";

import { useLTP } from "@/hooks/use-ltp";
import { useOHLC } from "@/hooks/use-ohlc";
import { formatCurrencyDecimal, formatPnl, formatPercent, pnlColor } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";
import { SkeletonTable } from "@/components/shared/Skeleton";

interface WatchlistTableProps {
  instruments: string[];
  onRemove: (instrument: string) => void;
}

export default function WatchlistTable({ instruments, onRemove }: WatchlistTableProps) {
  const { data: ltpData, isLoading: ltpLoading } = useLTP(instruments);
  const { data: ohlcData } = useOHLC(instruments);

  if (instruments.length === 0) {
    return (
      <div className="bg-bg-surface-alt border border-border">
        <SectionHeader title="WATCHLIST" subtitle="0 instruments" />
        <div className="text-text-dim text-[11px] px-3 py-12 text-center">Add instruments to your watchlist using the search bar above</div>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface-alt border border-border">
      <SectionHeader title="WATCHLIST" subtitle={`${instruments.length} instruments`} />
      <div className="grid grid-cols-[1.5fr_0.6fr_1fr_1fr_1fr] px-3 py-1.5 text-text-dim text-[10px] uppercase tracking-wider border-b border-[#161616]">
        <span>Symbol</span><span>Exchange</span><span className="text-right">LTP</span><span className="text-right">Change</span><span className="text-right">Chg%</span>
      </div>
      {ltpLoading ? (
        <SkeletonTable rows={instruments.length} cols={5} />
      ) : (
        instruments.map((inst) => {
          const ltp = ltpData?.[inst];
          const ohlc = ohlcData?.[inst];
          const lastPrice = ltp?.last_price ?? 0;
          const closePrice = ohlc?.ohlc?.close ?? 0;
          const change = closePrice > 0 ? lastPrice - closePrice : 0;
          const changePct = closePrice > 0 ? (change / closePrice) * 100 : 0;
          const [exchange, symbol] = inst.split(":");

          return (
            <div key={inst} className="grid grid-cols-[1.5fr_0.6fr_1fr_1fr_1fr] px-3 py-1.5 text-[11px] border-b border-[#111] items-center group">
              <span className="text-text-primary font-medium flex items-center gap-2">
                {symbol}
                <button onClick={() => onRemove(inst)} className="opacity-0 group-hover:opacity-100 text-text-dim hover:text-loss text-[10px] transition-opacity" title="Remove">x</button>
              </span>
              <span className="text-text-dim text-[9px]">{exchange}</span>
              <span className="text-right text-text-primary">{lastPrice > 0 ? formatCurrencyDecimal(lastPrice) : "---"}</span>
              <span className={`text-right ${pnlColor(change)}`}>{closePrice > 0 ? formatPnl(change) : "---"}</span>
              <span className={`text-right ${pnlColor(changePct)}`}>{closePrice > 0 ? formatPercent(changePct) : "---"}</span>
            </div>
          );
        })
      )}
    </div>
  );
}
