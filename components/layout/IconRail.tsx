"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  {
    label: "Portfolio",
    href: "/portfolio",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
    ),
  },
  {
    label: "Watchlist",
    href: "/watchlist",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    label: "Orders",
    href: "/orders",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3h5v5" />
        <path d="M8 3H3v5" />
        <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
        <path d="m15 9 6-6" />
      </svg>
    ),
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
];

export default function IconRail() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <nav
      className={`${
        expanded ? "w-40" : "w-10"
      } bg-[#0d0d0d] border-r border-border flex flex-col py-3 gap-1 shrink-0 transition-[width] duration-150`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mx-auto w-7 h-7 rounded flex items-center justify-center text-text-dim hover:text-text-secondary transition-colors mb-1"
        title={expanded ? "Collapse" : "Expand"}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-150 ${expanded ? "rotate-180" : ""}`}
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            title={expanded ? undefined : item.label}
            className={`mx-1.5 h-8 rounded flex items-center gap-2.5 transition-colors ${
              expanded ? "px-2.5" : "justify-center"
            } ${
              isActive
                ? "bg-accent text-black"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {item.icon}
            {expanded && (
              <span className="text-[12px] font-medium whitespace-nowrap">
                {item.label}
              </span>
            )}
          </Link>
        );
      })}

      <div className="flex-1" />

      {/* AI — disabled in MVP */}
      <div
        title="AI Co-pilot (coming soon)"
        className={`mx-1.5 h-8 rounded border border-border flex items-center gap-2.5 cursor-not-allowed ${
          expanded ? "px-2.5" : "justify-center"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent/40"
        >
          <path d="M12 8V4H8" />
          <rect width="16" height="12" x="4" y="8" rx="2" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <path d="M15 13v2" />
          <path d="M9 13v2" />
        </svg>
        {expanded && (
          <span className="text-[11px] text-accent/40 whitespace-nowrap">
            AI (soon)
          </span>
        )}
      </div>
    </nav>
  );
}
