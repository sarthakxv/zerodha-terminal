function getISTDate(): Date {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  return new Date(utc + istOffset);
}

export function isMarketOpen(): boolean {
  const ist = getISTDate();
  const day = ist.getDay();
  if (day === 0 || day === 6) return false;

  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  const marketOpen = 9 * 60 + 15;
  const marketClose = 15 * 60 + 30;

  return timeInMinutes >= marketOpen && timeInMinutes <= marketClose;
}

export function getMarketStatus(): "open" | "closed" | "pre-open" {
  const ist = getISTDate();
  const day = ist.getDay();
  if (day === 0 || day === 6) return "closed";

  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  const preOpen = 9 * 60;
  const marketOpen = 9 * 60 + 15;
  const marketClose = 15 * 60 + 30;

  if (timeInMinutes >= preOpen && timeInMinutes < marketOpen) return "pre-open";
  if (timeInMinutes >= marketOpen && timeInMinutes <= marketClose) return "open";
  return "closed";
}

export function getNextSixAMIST(): number {
  const now = new Date();
  const ist = getISTDate();

  const target = new Date(ist);
  target.setHours(6, 0, 0, 0);

  if (ist >= target) {
    target.setDate(target.getDate() + 1);
  }

  const istOffset = 5.5 * 60 * 60 * 1000;
  return target.getTime() - istOffset + now.getTimezoneOffset() * 60 * 1000;
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
