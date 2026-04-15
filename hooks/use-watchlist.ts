import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "zt-watchlist";

function loadFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function useWatchlist() {
  const [instruments, setInstruments] = useState<string[]>(loadFromStorage);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(instruments));
  }, [instruments]);

  const addInstrument = useCallback((instrument: string) => {
    setInstruments((prev) => {
      if (prev.includes(instrument)) return prev;
      if (prev.length >= 50) return prev;
      return [...prev, instrument];
    });
  }, []);

  const removeInstrument = useCallback((instrument: string) => {
    setInstruments((prev) => prev.filter((i) => i !== instrument));
  }, []);

  return { instruments, addInstrument, removeInstrument };
}
