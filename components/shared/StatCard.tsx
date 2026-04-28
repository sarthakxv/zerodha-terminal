import { pnlColor } from "@/lib/format";

export default function StatCard({
  label,
  value,
  colorByValue = false,
  subValue,
  emphasized = false,
}: {
  label: string;
  value: string;
  colorByValue?: boolean;
  subValue?: { text: string; value: number };
  /** When true, renders the value at hero size with the display font (Doto). */
  emphasized?: boolean;
}) {
  const valueColor =
    colorByValue && subValue ? pnlColor(subValue.value) : "text-text-display";

  return (
    <div className="flex-1 bg-bg-surface border-r border-border last:border-r-0 px-4 py-4 min-w-0">
      <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-text-muted">
        {label}
      </div>

      {emphasized ? (
        <div
          className={`mt-2 font-display font-medium leading-none text-[36px] tracking-[-0.02em] ${valueColor}`}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {value}
        </div>
      ) : (
        <div
          className={`mt-1.5 font-mono text-[18px] leading-none ${valueColor}`}
        >
          {value}
        </div>
      )}

      {subValue && (
        <div
          className={`mt-2 font-mono text-[11px] tracking-wide ${pnlColor(subValue.value)}`}
        >
          {subValue.text}
        </div>
      )}
    </div>
  );
}
