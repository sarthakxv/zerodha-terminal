import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./use-api";
import { KiteOrder } from "@/lib/types";
import { getPollingInterval } from "@/lib/market-hours";

export function useOrders() {
  return useQuery<KiteOrder[]>({
    queryKey: ["orders"],
    queryFn: () => apiFetch<KiteOrder[]>("/api/orders"),
    refetchInterval: () => getPollingInterval(30_000),
  });
}
