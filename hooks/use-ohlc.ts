import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./use-api";

type OHLCData = Record<string, { instrument_token: number; last_price: number; ohlc: { open: number; high: number; low: number; close: number } }>;

export function useOHLC(instruments: string[]) {
  const params = instruments.map((i) => `i=${encodeURIComponent(i)}`).join("&");
  const sortedKey = [...instruments].sort();

  return useQuery<OHLCData>({
    queryKey: ["ohlc", ...sortedKey],
    queryFn: () => apiFetch<OHLCData>(`/api/ohlc?${params}`),
    enabled: instruments.length > 0,
    staleTime: 60_000,
  });
}
