"use client";

import { useWatchlist } from "@/hooks/use-watchlist";
import InstrumentSearch from "@/components/watchlist/InstrumentSearch";
import WatchlistTable from "@/components/watchlist/WatchlistTable";

export default function WatchlistPage() {
  const { instruments, addInstrument, removeInstrument } = useWatchlist();

  return (
    <div className="flex flex-col gap-10">
      {/* PRIMARY — instrument count as hero */}
      <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-7">
          <div className="font-mono text-[10px] tracking-[0.20em] uppercase text-text-muted">
            / Watchlist
          </div>
          <div
            className="mt-3 font-display font-medium text-[clamp(56px,8vw,96px)] leading-[0.85] tracking-[-0.04em] text-text-display"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {String(instruments.length).padStart(2, "0")}
          </div>
          <div className="mt-3 font-mono text-[11px] tracking-[0.14em] uppercase text-text-secondary">
            Instruments tracked · cap 50
          </div>
        </div>

        <div className="md:col-span-5">
          <InstrumentSearch
            onAdd={addInstrument}
            existingInstruments={instruments}
          />
        </div>
      </div>

      {/* SECONDARY — live table */}
      <WatchlistTable
        instruments={instruments}
        onRemove={removeInstrument}
      />
    </div>
  );
}
