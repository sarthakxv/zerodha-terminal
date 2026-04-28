"use client";

export default function ErrorBanner({
  message = "Failed to fetch data. Retrying…",
}: {
  message?: string;
}) {
  return (
    <div className="border border-accent-line bg-accent-soft px-4 py-3 flex items-center gap-3">
      <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-accent">
        Error
      </span>
      <span className="w-px h-3 bg-accent-line" />
      <span className="text-text-primary text-[12px]">{message}</span>
    </div>
  );
}
