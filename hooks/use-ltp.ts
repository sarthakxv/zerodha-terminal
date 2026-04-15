import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./use-api";
import { getWatchlistPollingInterval } from "@/lib/market-hours";

type LTPData = Record<string, { instrument_token: number; last_price: number }>;

export function useLTP(instruments: string[]) {
  const params = instruments.map((i) => `i=${encodeURIComponent(i)}`).join("&");
  const sortedKey = [...instruments].sort();

  return useQuery<LTPData>({
    queryKey: ["ltp", ...sortedKey],
    queryFn: () => apiFetch<LTPData>(`/api/ltp?${params}`),
    enabled: instruments.length > 0,
    refetchInterval: () => getWatchlistPollingInterval(instruments.length),
  });
}
