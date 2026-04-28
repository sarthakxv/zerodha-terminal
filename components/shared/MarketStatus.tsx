"use client";

import { useMarketStatus } from "@/hooks/use-market-status";

const STATUS_MAP = {
  open: { dot: "bg-profit", text: "text-text-secondary", label: "Live" },
  "pre-open": { dot: "bg-warning", text: "text-text-secondary", label: "Pre-open" },
  closed: { dot: "bg-text-dim", text: "text-text-muted", label: "Closed" },
} as const;

export default function MarketStatus() {
  const status = useMarketStatus();
  const config = STATUS_MAP[status];

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`w-1.5 h-1.5 rounded-full ${config.dot} ${
          status === "open" ? "blink" : ""
        }`}
      />
      <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-text-muted">
        Market
      </span>
      <span
        className={`font-mono text-[10px] tracking-[0.14em] uppercase ${config.text}`}
      >
        {config.label}
      </span>
    </span>
  );
}
