"use client";

import { KiteHolding } from "@/lib/types";
import { formatPnl, formatPercent } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";

type RankedHolding = KiteHolding & { returnPct: number };

const COLS = "grid-cols-[0.4fr_1.4fr_0.9fr_1.1fr]";

function RankedList({
  rows,
  variant,
  emptyLabel,
}: {
  rows: RankedHolding[];
  variant: "gainers" | "losers";
  emptyLabel: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="py-8 text-center">
        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-muted">
          {emptyLabel}
        </span>
      </div>
    );
  }

  const valClass = variant === "gainers" ? "text-profit" : "text-accent";

  return (
    <>
      <div
        className={`grid ${COLS} px-4 py-2 border-b border-border font-mono text-[9px] tracking-[0.16em] uppercase text-text-muted`}
      >
        <span>#</span>
        <span>Symbol</span>
        <span className="text-right">Return</span>
        <span className="text-right">P&L</span>
      </div>

      {rows.map((h, i) => (
        <div
          key={h.tradingsymbol}
          className={`grid ${COLS} px-4 py-2.5 items-center text-[12px] ${
            i !== rows.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <span className="font-mono text-[10px] text-text-dim tabular-nums">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-text-display truncate">{h.tradingsymbol}</span>
          <span className={`text-right font-mono text-[11px] ${valClass}`}>
            {formatPercent(h.returnPct)}
          </span>
          <span className={`text-right font-mono text-[12px] ${valClass}`}>
            {formatPnl(h.pnl)}
          </span>
        </div>
      ))}
    </>
  );
}

export default function TopGainersLosers({
  holdings,
}: {
  holdings: KiteHolding[];
}) {
  const withReturn: RankedHolding[] = holdings.map((h) => ({
    ...h,
    returnPct:
      h.average_price > 0
        ? ((h.last_price - h.average_price) / h.average_price) * 100
        : 0,
  }));

  const gainers = [...withReturn]
    .filter((h) => h.returnPct > 0)
    .sort((a, b) => b.returnPct - a.returnPct);
  const losers = [...withReturn]
    .filter((h) => h.returnPct < 0)
    .sort((a, b) => a.returnPct - b.returnPct);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="border border-border bg-bg-surface">
        <SectionHeader
          title="Top gainers"
          subtitle={`${String(gainers.length).padStart(2, "0")} above zero`}
        />
        <RankedList
          rows={gainers}
          variant="gainers"
          emptyLabel="No gainers"
        />
      </div>

      <div className="border border-border bg-bg-surface">
        <SectionHeader
          title="Top losers"
          subtitle={`${String(losers.length).padStart(2, "0")} below zero`}
        />
        <RankedList rows={losers} variant="losers" emptyLabel="No losers" />
      </div>
    </div>
  );
}
