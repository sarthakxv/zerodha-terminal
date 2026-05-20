function getISTParts(date: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hours: Number(values.hour),
    minutes: Number(values.minute),
  };
}

export function isMarketOpen(): boolean {
  const ist = getISTParts();
  const weekday = new Date(
    Date.UTC(ist.year, ist.month - 1, ist.day)
  ).getUTCDay();
  if (weekday === 0 || weekday === 6) return false;

  const timeInMinutes = ist.hours * 60 + ist.minutes;

  const marketOpen = 9 * 60 + 15;
  const marketClose = 15 * 60 + 30;

  return timeInMinutes >= marketOpen && timeInMinutes <= marketClose;
}

export function getMarketStatus(): "open" | "closed" | "pre-open" {
  const ist = getISTParts();
  const weekday = new Date(
    Date.UTC(ist.year, ist.month - 1, ist.day)
  ).getUTCDay();
  if (weekday === 0 || weekday === 6) return "closed";

  const timeInMinutes = ist.hours * 60 + ist.minutes;

  const preOpen = 9 * 60;
  const marketOpen = 9 * 60 + 15;
  const marketClose = 15 * 60 + 30;

  if (timeInMinutes >= preOpen && timeInMinutes < marketOpen) return "pre-open";
  if (timeInMinutes >= marketOpen && timeInMinutes <= marketClose) return "open";
  return "closed";
}

export function getNextSixAMIST(): number {
  const now = Date.now();
  const ist = getISTParts(new Date(now));
  const oneDay = 24 * 60 * 60 * 1000;

  let target = Date.UTC(ist.year, ist.month - 1, ist.day, 0, 30, 0, 0);
  if (now >= target) target += oneDay;

  return target;
}

export function getPollingInterval(
  baseInterval: number,
  enabled: boolean = true
): number | false {
  if (!enabled || !isMarketOpen()) return false;
  return baseInterval;
}

export function getWatchlistPollingInterval(instrumentCount: number): number | false {
  if (!isMarketOpen()) return false;
  if (instrumentCount <= 20) return 5000;
  return 10000;
}
