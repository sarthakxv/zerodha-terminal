"use client";

export default function ErrorBanner({
  message = "Failed to fetch data. Retrying...",
}: {
  message?: string;
}) {
  return (
    <div className="bg-accent/10 border border-accent/20 text-accent text-[11px] px-3 py-2 rounded flex items-center gap-2">
      <span className="font-bold">!</span>
      <span>{message}</span>
    </div>
  );
}
