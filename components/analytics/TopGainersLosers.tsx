"use client";

import { KiteHolding } from "@/lib/types";
import { formatPnl, formatPercent } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";

type RankedHolding = KiteHolding & { returnPct: number };

function RankTable({
  rows,
  variant,
  emptyLabel,
}: {
  rows: RankedHolding[];
  variant: "gainers" | "losers";
  emptyLabel: string;
}) {
  if (rows.length === 0) {
    return <div className="text-text-dim text-[10px] px-3 py-4 text-center">{emptyLabel}</div>;
  }

  const valClass = variant === "gainers" ? "text-profit" : "text-loss";

  return (
    <table className="w-full text-[11px] border-collapse">
      <thead>
        <tr className="text-text-dim text-[10px]">
          <th className="text-left font-normal pl-3 pr-1 py-1.5 w-6">#</th>
          <th className="text-left font-normal px-1 py-1.5">Symbol</th>
          <th className="text-right font-normal px-1 py-1.5 w-20">Return</th>
          <th className="text-right font-normal pl-1 pr-3 py-1.5 w-24">P&L</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((h, i) => (
          <tr key={h.tradingsymbol} className="border-t border-[#111]">
            <td className="text-text-dim text-[10px] pl-3 pr-1 py-1.5">{i + 1}</td>
            <td className="text-text-primary font-medium px-1 py-1.5">{h.tradingsymbol}</td>
            <td className={`${valClass} text-[10px] text-right px-1 py-1.5`}>
              {formatPercent(h.returnPct)}
            </td>
            <td className={`${valClass} text-right pl-1 pr-3 py-1.5`}>
              {formatPnl(h.pnl)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function TopGainersLosers({ holdings }: { holdings: KiteHolding[] }) {
  const withReturn = holdings.map((h) => ({
    ...h,
    returnPct: h.average_price > 0 ? ((h.last_price - h.average_price) / h.average_price) * 100 : 0,
  }));

  const gainers = [...withReturn].filter((h) => h.returnPct > 0).sort((a, b) => b.returnPct - a.returnPct);
  const losers = [...withReturn].filter((h) => h.returnPct < 0).sort((a, b) => a.returnPct - b.returnPct);

  return (
    <div className="grid grid-cols-2 gap-1.5">
      <div className="bg-bg-surface-alt border border-border">
        <SectionHeader title="TOP GAINERS" subtitle={`${gainers.length}`} />
        <RankTable rows={gainers} variant="gainers" emptyLabel="No gainers" />
      </div>
      <div className="bg-bg-surface-alt border border-border">
        <SectionHeader title="TOP LOSERS" subtitle={`${losers.length}`} />
        <RankTable rows={losers} variant="losers" emptyLabel="No losers" />
      </div>
    </div>
  );
}
