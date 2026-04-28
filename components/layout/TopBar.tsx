"use client";

import { useState, useRef, useEffect } from "react";
import MarketStatus from "@/components/shared/MarketStatus";

function CurrentTime() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    function update() {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        })
      );
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="font-mono text-[10px] tracking-[0.12em] text-text-secondary"
      suppressHydrationWarning
    >
      {time || "--:--:--"}
      <span className="text-text-muted ml-1.5">IST</span>
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
        className="w-7 h-7 border border-border-visible flex items-center justify-center font-mono text-[10px] tracking-wider text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors"
      >
        {initials}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-bg-surface border border-border-visible min-w-[140px] z-20">
          <div className="px-3 py-2 border-b border-border">
            <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-text-muted">
              Account
            </div>
            <div className="text-text-primary text-[12px] mt-0.5">
              {initials}
            </div>
          </div>
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="w-full text-left px-3 py-2 font-mono text-[10px] tracking-[0.12em] uppercase text-text-secondary hover:text-accent transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default function TopBar({ userInitials }: { userInitials?: string }) {
  return (
    <header className="h-11 bg-bg-primary border-b border-border flex items-center px-4 gap-5 shrink-0">
      {/* Wordmark — Doto, the one expressive moment in the chrome */}
      <div className="flex items-baseline gap-2.5">
        <span
          className="font-display text-[22px] font-bold tracking-[-0.02em] text-text-display leading-none"
          style={{ fontFamily: "var(--font-display)" }}
        >
          ZT
        </span>
        <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-text-muted">
          Terminal
        </span>
      </div>

      <div className="w-px h-4 bg-border-visible" />

      <div className="flex items-center gap-3 flex-1">
        <MarketStatus />
      </div>

      <CurrentTime />

      {userInitials && <AvatarMenu initials={userInitials} />}
    </header>
  );
}
