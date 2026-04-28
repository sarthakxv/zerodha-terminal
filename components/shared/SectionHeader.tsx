export default function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-4">
      <div className="flex items-baseline gap-3 min-w-0">
        <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-text-secondary">
          {title}
        </span>
        {subtitle && (
          <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-text-muted truncate">
            / {subtitle}
          </span>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
