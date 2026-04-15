export default function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="px-3 py-2 border-b border-border flex items-center justify-between">
      <span className="text-accent text-[12px] font-bold tracking-wider">{title}</span>
      {subtitle && <span className="text-text-dim text-[11px]">{subtitle}</span>}
    </div>
  );
}
