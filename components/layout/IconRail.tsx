"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "P", href: "/portfolio", title: "Portfolio" },
  { label: "W", href: "/watchlist", title: "Watchlist" },
  { label: "O", href: "/orders", title: "Orders" },
  { label: "A", href: "/analytics", title: "Analytics" },
];

export default function IconRail() {
  const pathname = usePathname();

  return (
    <nav className="w-10 bg-[#0d0d0d] border-r border-border flex flex-col items-center py-3 gap-1 shrink-0">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.title}
            className={`w-7 h-7 rounded flex items-center justify-center text-[11px] font-bold transition-colors ${
              isActive
                ? "bg-accent text-black"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {item.label}
          </Link>
        );
      })}

      <div className="flex-1" />

      <div
        title="AI Co-pilot (coming soon)"
        className="w-7 h-7 rounded border border-border flex items-center justify-center text-[8px] font-bold text-accent/40 cursor-not-allowed"
      >
        AI
      </div>
    </nav>
  );
}
