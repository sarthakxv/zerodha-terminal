import { pnlColor } from "@/lib/format";

export default function StatCard({
  label,
  value,
  colorByValue = false,
  subValue,
}: {
  label: string;
  value: string;
  colorByValue?: boolean;
  subValue?: { text: string; value: number };
}) {
  return (
    <div className="flex-1 bg-bg-surface border border-border p-2.5">
      <div className="text-text-muted text-[11px] uppercase tracking-wider">{label}</div>
      <div className={`text-[16px] font-medium mt-0.5 ${colorByValue && subValue ? pnlColor(subValue.value) : "text-text-primary"}`}>
        {value}
        {subValue && (
          <span className={`text-[11px] ml-1.5 ${pnlColor(subValue.value)}`}>{subValue.text}</span>
        )}
      </div>
    </div>
  );
}
