import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./use-api";
import { KiteTrade } from "@/lib/types";
import { getPollingInterval } from "@/lib/market-hours";

export function useTrades() {
  return useQuery<KiteTrade[]>({
    queryKey: ["trades"],
    queryFn: () => apiFetch<KiteTrade[]>("/api/trades"),
    refetchInterval: () => getPollingInterval(30_000),
  });
}
