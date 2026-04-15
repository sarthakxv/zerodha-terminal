import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./use-api";
import { KitePosition } from "@/lib/types";
import { getPollingInterval } from "@/lib/market-hours";

export function usePositions() {
  return useQuery<{ net: KitePosition[]; day: KitePosition[] }>({
    queryKey: ["positions"],
    queryFn: () => apiFetch("/api/positions"),
    refetchInterval: () => getPollingInterval(30_000),
  });
}
