"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/hooks/use-api";
import { KiteInstrument } from "@/lib/types";
import useDebounce from "@/hooks/use-debounce";

interface InstrumentSearchProps {
  onAdd: (instrument: string) => void;
  existingInstruments: string[];
}

export default function InstrumentSearch({
  onAdd,
  existingInstruments,
}: InstrumentSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  const { data: results, isLoading } = useQuery<KiteInstrument[]>({
    queryKey: ["instruments-search", debouncedQuery],
    queryFn: () =>
      apiFetch<KiteInstrument[]>(
        `/api/instruments?q=${encodeURIComponent(debouncedQuery)}`
      ),
    enabled: debouncedQuery.length >= 2,
  });

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
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

  const filteredResults = results?.filter(
    (r) => !existingInstruments.includes(`${r.exchange}:${r.tradingsymbol}`)
  );

  return (
    <div className="relative">
      <label className="block">
        <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-text-muted mb-2">
          / Search instruments
        </div>
        <div className="relative border border-border-visible bg-bg-surface focus-within:border-text-display transition-colors">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-[0.18em] uppercase text-text-dim pointer-events-none">
            Q
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="RELIANCE, INFY, NIFTY…"
            className="w-full bg-transparent text-text-primary text-[13px] pl-9 pr-3 py-3.5 outline-none placeholder:text-text-dim"
          />
        </div>
      </label>

      {isOpen && debouncedQuery.length >= 2 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-bg-surface border border-border-visible max-h-80 overflow-y-auto z-20"
        >
          <div className="px-3 py-2 border-b border-border flex items-center justify-between">
            <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-text-muted">
              Results
            </span>
            <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-text-dim">
              {isLoading
                ? "[…]"
                : filteredResults
                  ? `${filteredResults.length} found`
                  : ""}
            </span>
          </div>

          {isLoading && (
            <div className="px-3 py-4 text-center">
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-muted blink">
                [SEARCHING…]
              </span>
            </div>
          )}

          {filteredResults?.map((inst) => (
            <button
              key={inst.instrument_token}
              onClick={() => handleSelect(inst)}
              className="w-full text-left px-3 py-2.5 text-[12px] hover:bg-bg-raised flex items-center justify-between gap-3 border-b border-border last:border-b-0 transition-colors group"
            >
              <div className="min-w-0 flex-1">
                <div className="text-text-display font-medium truncate">
                  {inst.tradingsymbol}
                </div>
                <div className="text-text-muted text-[11px] truncate">
                  {inst.name}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-text-dim">
                  {inst.exchange}
                </span>
                <span className="font-mono text-[10px] text-text-muted group-hover:text-accent transition-colors">
                  +
                </span>
              </div>
            </button>
          ))}

          {filteredResults?.length === 0 && !isLoading && (
            <div className="px-3 py-4 text-center">
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-muted">
                No matches
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
