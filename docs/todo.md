# Zerodha Terminal — TODO

> Pre-requisites before starting the agentic intelligence layer.
> Build = ✅ passing. Tests = ✅ 25/25 passing. Lint = ✅ clean (0 errors, 0 warnings).

---

## 1. ~~Fix the lone lint error~~ ✅ Done

**File:** `hooks/use-watchlist.ts`
**Status:** `eslint-disable-next-line react-hooks/set-state-in-effect` added on line 22. `npm run lint` exits 0.

---

## 2. Index Ticker in TopBar (NIFTY 50 / NIFTY BANK)

**File:** `components/layout/TopBar.tsx`
The slot exists in the design; the ticker was removed because `/quote/ltp` rejects `NSE:NIFTY 50` style symbols.

**Fix:**
1. Find the correct `instrument_token` for NIFTY 50 and NIFTY BANK indices via `GET /instruments/NSE` (token-based LTP works where symbol-based doesn't).
2. Create a `/api/index-ltp` route handler that calls `GET /quote/ltp?i=<token>` using instrument tokens (integers), not exchange:symbol strings.
3. Create a `useIndexLTP` hook polling every 5 s during market hours (use `getWatchlistPollingInterval`).
4. Re-implement the `IndexTicker` component in `TopBar.tsx` (was removed — check git history for reference).

---

## 3. Order Placement UI

**Why it blocks the intelligence layer:** The agentic layer needs to be able to trigger trades. Without a working order-placement UI + API route, you can't verify the full loop end-to-end even manually.

**What's missing:**
- `POST /api/orders` route handler → `KiteClient.placeOrder()`
- `placeOrder()` method in `lib/kite.ts` (only `getOrders` exists today)
- Order ticket component (symbol, side BUY/SELL, qty, order type MKT/LMT, price)
- Confirmation / error feedback in the UI

**Kite API:** `POST https://api.kite.trade/orders/{variety}` with form-encoded body (`tradingsymbol`, `exchange`, `transaction_type`, `order_type`, `quantity`, `product`, `price` for LMT).

---

## 4. Real-time WebSocket Price Feed (Kite Connect WebSocket)

**Why it blocks the intelligence layer:** The current polling approach (every 5–30 s via REST) is too coarse for intraday signals or agent decision loops. The intelligence layer will need tick-level or at least sub-second data.

**What's needed:**
- `lib/kite-ws.ts` — thin wrapper around the Kite Connect WebSocket (`wss://ws.kite.trade`). Subscribes to instrument tokens, parses the binary quote packets (mode `full` or `ltp`), and emits price events.
- A Next.js API route or standalone Node WebSocket server that holds the WS connection server-side and fans out to the browser via Server-Sent Events (`/api/stream`) or a browser WebSocket proxy.
- Replace `useLTP` / watchlist polling with the streaming feed when the market is open. Fall back to polling when closed.

---

## 5. `sectors.json` Coverage & Maintenance

**File:** `data/sectors.json`
**Problem:** The file only covers the current holdings. Any new instrument added to the watchlist or holdings that isn't in the JSON will silently fall into the `"Unmapped"` bucket in `SectorAllocation`.

**Fix:**
- Expand `sectors.json` to cover at minimum the Nifty 500 universe (NSE sector classifications are public).
- Add a build-time or server-side lookup as a fallback: if `tradingsymbol` is missing from the JSON, fetch sector from an instrument metadata source (NSE website CSV / Kite instrument data).
- Or accept "Unmapped" and surface it visibly so it's obvious when something needs to be added.

---

## 6. Portfolio — T1 Holdings Display

**File:** `components/portfolio/HoldingsTable.tsx`, `lib/types.ts`
**Problem:** `KiteHolding` has a `t1_quantity` field (shares bought today, not yet settled) but the Holdings table doesn't show it. Users can't tell which shares are locked until T+1.

**Fix:** Add a `T1` sub-label or badge next to `Qty` when `t1_quantity > 0`. E.g. `15 (+ 5 T1)`.

---

## 7. Analytics — Historical P&L Chart

**Why it matters:** The current Analytics page has only a static snapshot (today's values). A time-series chart of portfolio value / day P&L over weeks/months would be the first meaningful step toward the intelligence layer (gives the agent historical context).

**What's needed:**
- Kite doesn't expose a historical portfolio-value endpoint. Approach: store a daily snapshot (date → `{invested, current, pnl}`) in a lightweight store (SQLite via `better-sqlite3`, or just a JSON file in `/data/snapshots/`).
- A cron job or Next.js scheduled route (`/api/cron/snapshot`) that runs at 15:30 IST on market days and records the day's closing P&L from the holdings API.
- A `PnlChart` component (Recharts or a pure SVG sparkline) on the Analytics page.

---

## 8. Error Boundaries Per Page

**Files:** All `app/(dashboard)/*/page.tsx`
**Problem:** An unhandled render error in one widget (e.g. a bad value from the API) crashes the entire page. Currently there are only `ErrorBanner` components for API errors, not React error boundaries for render errors.

**Fix:** Wrap each page (or each widget section) in a `<ErrorBoundary fallback={<ErrorBanner message="..." />}>`. Can use the `react-error-boundary` package (zero deps beyond React).

---

## 9. `lib/kite.ts` — Deduplicate LTP / OHLC fetch logic

**File:** `lib/kite.ts`
**Problem:** `getLTP` and `getOHLC` both inline the same `fetch → error-check → 403 → KiteSessionExpiredError` pattern that `request<T>()` already handles. DRY violation — bug fixes need to be applied in three places.

**Fix:** Refactor `getLTP` and `getOHLC` to build the URL manually (preserving the `i=` query-string format that Kite requires) and then call `this.request<T>()` directly.

---

## 10. Environment / Deployment Hygiene

- `npm run dev` still uses Turbopack (good for dev speed) but `.next/` needs to be deleted after `globals.css` edits — document this in a comment at the top of `globals.css`.
- `NEXT_PUBLIC_BASE_URL` is needed for the OAuth redirect; make sure it's set to the production URL before any non-localhost deploy.
- Add a `/.env.local` gitignore check — currently `.env.local` is absent from the repo but if someone accidentally commits secrets, there's no pre-commit hook stopping it. Add `husky` + `detect-secrets` or at minimum a `.gitignore` reminder.

---

## Intelligence Layer Pre-conditions Checklist

Before starting the agentic / intelligence layer, all of the following should be true:

- [x] `npm run lint` exits 0 ✅ (done — item 1)
- [ ] `npm run build` exits 0 ✅ (already passing)
- [ ] `npm run test` — all tests pass ✅ (25/25)
- [ ] Order placement works end-to-end manually (item 3)
- [ ] WebSocket / streaming feed in place (item 4) — or at minimum a documented decision to start with polling and upgrade later
- [ ] `sectors.json` covers the stocks you actually hold (item 5, partial is fine)
- [ ] Historical snapshot store seeded with at least a few days of data (item 7, needed for agent context)
- [ ] Error boundaries in place so an agent-driven component can't crash the whole UI (item 8)
