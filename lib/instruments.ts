import { KiteSessionExpiredError } from "./kite";

interface CachedInstruments {
  data: ParsedInstrument[];
  fetchedAt: number;
}

interface ParsedInstrument {
  instrument_token: number;
  tradingsymbol: string;
  name: string;
  exchange: string;
  segment: string;
  instrument_type: string;
}

let cache: CachedInstruments | null = null;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

function parseCSV(csv: string): ParsedInstrument[] {
  const lines = csv.trim().split("\n");
  const headers = parseCSVLine(lines[0]);

  const tokenIdx = headers.indexOf("instrument_token");
  const symbolIdx = headers.indexOf("tradingsymbol");
  const nameIdx = headers.indexOf("name");
  const exchangeIdx = headers.indexOf("exchange");
  const segmentIdx = headers.indexOf("segment");
  const typeIdx = headers.indexOf("instrument_type");

  if ([tokenIdx, symbolIdx, nameIdx, exchangeIdx, segmentIdx, typeIdx].includes(-1)) {
    throw new Error("Unexpected CSV header format from Kite instruments endpoint");
  }

  const instruments: ParsedInstrument[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < headers.length) continue;

    instruments.push({
      instrument_token: parseInt(cols[tokenIdx], 10),
      tradingsymbol: cols[symbolIdx],
      name: cols[nameIdx],
      exchange: cols[exchangeIdx],
      segment: cols[segmentIdx],
      instrument_type: cols[typeIdx],
    });
  }

  return instruments;
}

async function fetchInstruments(accessToken: string): Promise<ParsedInstrument[]> {
  const apiKey = process.env.KITE_API_KEY!;
  const res = await fetch("https://api.kite.trade/instruments", {
    headers: {
      "X-Kite-Version": "3",
      Authorization: `token ${apiKey}:${accessToken}`,
    },
  });

  if (res.status === 403) throw new KiteSessionExpiredError();
  if (!res.ok) throw new Error(`Failed to fetch instruments: ${res.status}`);

  const csv = await res.text();
  return parseCSV(csv);
}

export async function searchInstruments(
  query: string,
  accessToken: string,
  limit: number = 20
): Promise<ParsedInstrument[]> {
  if (!cache || Date.now() - cache.fetchedAt > CACHE_TTL) {
    const data = await fetchInstruments(accessToken);
    cache = { data, fetchedAt: Date.now() };
  }

  const q = query.toUpperCase();
  const results: ParsedInstrument[] = [];

  for (const inst of cache.data) {
    if (results.length >= limit) break;

    if (
      inst.tradingsymbol.includes(q) ||
      inst.name.toUpperCase().includes(q)
    ) {
      if (
        (inst.exchange === "NSE" || inst.exchange === "BSE") &&
        inst.segment.endsWith("EQ")
      ) {
        results.push(inst);
      }
    }
  }

  return results;
}
