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
  const [instruments, setInstruments] = useState<string[]>([]);
  const hasHydrated = useRef(false);

  // Load from localStorage after hydration (avoids SSR mismatch)
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved.length > 0) setInstruments(saved);
    hasHydrated.current = true;
  }, []);

  // Persist to localStorage on changes (skip the initial hydration load)
  useEffect(() => {
    if (!hasHydrated.current) return;
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
