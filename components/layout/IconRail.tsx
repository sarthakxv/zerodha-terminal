"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  {
    label: "Portfolio",
    code: "01",
    href: "/portfolio",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="6" width="18" height="14" />
        <path d="M3 10h18" />
        <path d="M9 6V4h6v2" />
      </svg>
    ),
  },
  {
    label: "Watchlist",
    code: "02",
    href: "/watchlist",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M2 12c2.5-4.5 6-7 10-7s7.5 2.5 10 7c-2.5 4.5-6 7-10 7s-7.5-2.5-10-7Z" />
      </svg>
    ),
  },
  {
    label: "Orders",
    code: "03",
    href: "/orders",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h16v16H4z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
        <path d="M8 17h3" />
      </svg>
    ),
  },
  {
    label: "Analytics",
    code: "04",
    href: "/analytics",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3v18h18" />
        <path d="M7 14l4-4 3 3 5-6" />
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
        expanded ? "w-48" : "w-12"
      } bg-bg-primary border-r border-border flex flex-col py-3 shrink-0 transition-[width] duration-200 ease-out`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="mx-auto w-7 h-7 flex items-center justify-center text-text-dim hover:text-text-secondary transition-colors mb-4"
        title={expanded ? "Collapse" : "Expand"}
        aria-label={expanded ? "Collapse navigation" : "Expand navigation"}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {expanded && (
        <div className="px-3 mb-3">
          <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-text-muted">
            Navigation
          </span>
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={expanded ? undefined : item.label}
              className={`group relative mx-2 h-9 flex items-center transition-colors ${
                expanded ? "px-2.5 gap-3" : "justify-center"
              } ${
                isActive
                  ? "text-text-display"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {isActive && (
                <span className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-[2px] h-5 bg-accent" />
              )}

              <span>{item.icon}</span>

              {expanded && (
                <div className="flex-1 flex items-baseline justify-between min-w-0">
                  <span
                    className={`text-[13px] truncate ${
                      isActive ? "text-text-display" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.14em] text-text-dim">
                    {item.code}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex-1" />

      {/* AI — disabled */}
      <div
        title="AI Co-pilot (coming soon)"
        className={`mx-2 h-9 border border-border flex items-center cursor-not-allowed ${
          expanded ? "px-2.5 gap-3" : "justify-center"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-text-dim"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12h.01" />
          <path d="M12 12h.01" />
          <path d="M16 12h.01" />
        </svg>
        {expanded && (
          <div className="flex-1 flex items-baseline justify-between min-w-0">
            <span className="text-[12px] text-text-dim truncate">Copilot</span>
            <span className="font-mono text-[9px] tracking-[0.14em] text-text-dim">
              SOON
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}
