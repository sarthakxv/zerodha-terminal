"use client";

import { useWatchlist } from "@/hooks/use-watchlist";
import InstrumentSearch from "@/components/watchlist/InstrumentSearch";
import WatchlistTable from "@/components/watchlist/WatchlistTable";

export default function WatchlistPage() {
  const { instruments, addInstrument, removeInstrument } = useWatchlist();

  return (
    <div className="flex flex-col gap-1.5">
      <InstrumentSearch onAdd={addInstrument} existingInstruments={instruments} />
      <WatchlistTable instruments={instruments} onRemove={removeInstrument} />
    </div>
  );
}
