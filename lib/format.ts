const currencyFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const currencyFormatterDecimal = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  signDisplay: "always",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatCurrencyDecimal(value: number): string {
  return currencyFormatterDecimal.format(value);
}

export function formatPercent(value: number): string {
  return percentFormatter.format(value) + "%";
}

export function formatPnl(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return sign + currencyFormatter.format(value);
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function pnlColor(value: number): string {
  if (value > 0) return "text-profit";
  if (value < 0) return "text-loss";
  return "text-text-secondary";
}

export function pnlDimColor(value: number): string {
  if (value > 0) return "text-profit-dim";
  if (value < 0) return "text-loss-dim";
  return "text-text-muted";
}
