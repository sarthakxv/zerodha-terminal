import { useState, useEffect } from "react";
import { getMarketStatus } from "@/lib/market-hours";

export function useMarketStatus() {
  const [status, setStatus] = useState(getMarketStatus);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getMarketStatus());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return status;
}
