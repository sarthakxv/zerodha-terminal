import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./use-api";
import { KiteMargins } from "@/lib/types";
import { getPollingInterval } from "@/lib/market-hours";

export function useMargins() {
  return useQuery<KiteMargins>({
    queryKey: ["margins"],
    queryFn: () => apiFetch<KiteMargins>("/api/margins"),
    refetchInterval: () => getPollingInterval(30_000),
  });
}
