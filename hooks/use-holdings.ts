import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./use-api";
import { KiteHolding } from "@/lib/types";
import { getPollingInterval } from "@/lib/market-hours";

export function useHoldings() {
  return useQuery<KiteHolding[]>({
    queryKey: ["holdings"],
    queryFn: () => apiFetch<KiteHolding[]>("/api/holdings"),
    refetchInterval: () => getPollingInterval(30_000),
  });
}
