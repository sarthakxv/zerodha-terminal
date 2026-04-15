const SKELETON_WIDTHS = [64, 48, 72, 56, 60, 44, 68, 52];

export function SkeletonRow({ cols = 6 }: { cols?: number }) {
  return (
    <div className="flex gap-4 px-3 py-2">
      {Array.from({ length: cols }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-border rounded animate-pulse"
          style={{ width: `${SKELETON_WIDTHS[i % SKELETON_WIDTHS.length]}px` }}
        />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} cols={cols} />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-bg-surface border border-border p-3 flex flex-col gap-2">
      <div className="h-2 w-16 bg-border rounded animate-pulse" />
      <div className="h-5 w-24 bg-border rounded animate-pulse" />
    </div>
  );
}

export function SkeletonStrip({ cards = 5 }: { cards?: number }) {
  return (
    <div className="flex gap-px">
      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
