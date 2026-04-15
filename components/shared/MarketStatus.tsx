"use client";

import { useMarketStatus } from "@/hooks/use-market-status";

export default function MarketStatus() {
  const status = useMarketStatus();

  if (status === "open") return null;

  return (
    <span
      className={`text-[10px] font-medium px-2 py-0.5 rounded ${
        status === "pre-open"
          ? "bg-accent/10 text-accent"
          : "bg-text-dim/10 text-text-dim"
      }`}
    >
      {status === "pre-open" ? "PRE-OPEN" : "MARKET CLOSED"}
    </span>
  );
}
