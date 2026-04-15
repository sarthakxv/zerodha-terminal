"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/hooks/use-api";
import { KiteInstrument } from "@/lib/types";

interface InstrumentSearchProps {
  onAdd: (instrument: string) => void;
  existingInstruments: string[];
}

export default function InstrumentSearch({ onAdd, existingInstruments }: InstrumentSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  const { data: results, isLoading } = useQuery<KiteInstrument[]>({
    queryKey: ["instruments-search", debouncedQuery],
    queryFn: () => apiFetch<KiteInstrument[]>(`/api/instruments?q=${encodeURIComponent(debouncedQuery)}`),
    enabled: debouncedQuery.length >= 2,
  });

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(instrument: KiteInstrument) {
    const id = `${instrument.exchange}:${instrument.tradingsymbol}`;
    onAdd(id);
    setQuery("");
    setIsOpen(false);
  }

  const filteredResults = results?.filter((r) => !existingInstruments.includes(`${r.exchange}:${r.tradingsymbol}`));

  return (
    <div className="relative">
      <input ref={inputRef} type="text" value={query} onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }} onFocus={() => setIsOpen(true)} placeholder="Search instruments..." className="w-full bg-bg-surface border border-border text-text-primary text-[11px] px-3 py-2 rounded outline-none focus:border-accent/50 placeholder:text-text-dim" />
      {isOpen && debouncedQuery.length >= 2 && (
        <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-1 bg-bg-surface border border-border rounded shadow-lg max-h-60 overflow-y-auto z-10">
          {isLoading && <div className="text-text-dim text-[10px] px-3 py-2 animate-pulse">Searching...</div>}
          {filteredResults?.map((inst) => (
            <button key={inst.instrument_token} onClick={() => handleSelect(inst)} className="w-full text-left px-3 py-2 text-[11px] hover:bg-border/50 flex items-center justify-between">
              <div>
                <span className="text-text-primary font-medium">{inst.tradingsymbol}</span>
                <span className="text-text-dim ml-2">{inst.name}</span>
              </div>
              <span className="text-text-dim text-[9px]">{inst.exchange}</span>
            </button>
          ))}
          {filteredResults?.length === 0 && !isLoading && <div className="text-text-dim text-[10px] px-3 py-2">No results found</div>}
        </div>
      )}
    </div>
  );
}

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
