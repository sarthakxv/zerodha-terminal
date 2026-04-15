"use client";

import { useState, useRef, useEffect } from "react";
import { useLTP } from "@/hooks/use-ltp";
import { formatCurrencyDecimal } from "@/lib/format";
import MarketStatus from "@/components/shared/MarketStatus";

const INDICES = ["NSE:NIFTY 50", "NSE:NIFTY BANK"];

function IndexTicker({
  label,
  data,
}: {
  label: string;
  data?: { last_price: number };
}) {
  if (!data) {
    return (
      <span className="text-text-dim text-[10px]">
        {label} <span className="animate-pulse">---</span>
      </span>
    );
  }

  return (
    <span className="text-text-secondary text-[10px]">
      {label}{" "}
      <span className="text-text-primary">
        {formatCurrencyDecimal(data.last_price)}
      </span>
    </span>
  );
}

function CurrentTime() {
  return (
    <span className="text-text-dim text-[10px]" suppressHydrationWarning>
      {new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      })}{" "}
      IST
    </span>
  );
}

function AvatarMenu({ initials }: { initials: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-6 h-6 rounded-full bg-[#1a1a1a] border border-border flex items-center justify-center text-text-secondary text-[9px] hover:border-accent/50 transition-colors"
      >
        {initials}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-bg-surface border border-border rounded shadow-lg z-20 min-w-[120px]">
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="w-full text-left px-3 py-2 text-[11px] text-text-secondary hover:text-loss hover:bg-border/30 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function TopBar({ userInitials }: { userInitials?: string }) {
  const { data: ltpData } = useLTP(INDICES);

  return (
    <header className="h-9 bg-[#111111] border-b border-border flex items-center px-3 gap-3 shrink-0">
      <span className="text-accent font-bold text-sm tracking-widest">ZT</span>
      <div className="w-px h-4 bg-border" />

      <div className="flex gap-4 flex-1">
        {/*<IndexTicker label="NIFTY" data={ltpData?.["NSE:NIFTY 50"]} />
        <IndexTicker label="BANKNIFTY" data={ltpData?.["NSE:NIFTY BANK"]} />*/}
        <MarketStatus />
      </div>

      <CurrentTime />

      {userInitials && <AvatarMenu initials={userInitials} />}
    </header>
  );
}
