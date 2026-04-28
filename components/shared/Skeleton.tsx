/**
 * Per the Nothing design system: NO pulsing skeleton screens.
 * Loading states are mechanical text — `[LOADING…]` — that reads like
 * an instrument-panel readout. The same components are kept (with the
 * same export names) for backwards compatibility with callers.
 */

function LoadingText({ label = "LOADING" }: { label?: string }) {
  return (
    <span
      className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-muted blink"
      aria-busy="true"
      aria-live="polite"
    >
      [{label}…]
    </span>
  );
}

export function SkeletonRow({ cols }: { cols?: number }) {
  // cols accepted for API compatibility but unused — the new pattern is
  // a single readout, not per-column shimmer
  void cols;
  return (
    <div className="px-4 py-6 flex items-center justify-center">
      <LoadingText />
    </div>
  );
}

export function SkeletonTable({
  rows,
  cols,
}: {
  rows?: number;
  cols?: number;
}) {
  void rows;
  void cols;
  return (
    <div className="px-4 py-12 flex items-center justify-center">
      <LoadingText />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="flex-1 bg-bg-surface border-r border-border last:border-r-0 px-4 py-5 flex items-center justify-center min-h-[80px]">
      <LoadingText />
    </div>
  );
}

export function SkeletonStrip({ cards = 5 }: { cards?: number }) {
  return (
    <div className="flex border border-border bg-bg-surface">
      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
