# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js, port 3000)
npm run build        # TypeScript compile + Next.js build
npm run lint         # ESLint
npm run test         # Run all tests (Vitest, jsdom)
npm run test:watch   # Watch mode
```

Run a single test file:
```bash
npx vitest run __tests__/lib/format.test.ts
```

## Environment Variables

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
|---|---|
| `KITE_API_KEY` | Kite Connect app key |
| `KITE_API_SECRET` | Kite Connect app secret |
| `COOKIE_SECRET` | 32+ char random string for `iron-session` |
| `NEXT_PUBLIC_BASE_URL` | Base URL for OAuth redirect (e.g. `http://localhost:3000`) |

## Architecture

### Auth Flow

`/api/auth/login` redirects to Kite OAuth → Kite redirects to `/api/auth/callback?request_token=...` → `KiteClient.createSession()` exchanges the token for an `access_token` → stored in an `iron-session` encrypted cookie (`zt-session`) expiring at next 6 AM IST (Kite's daily session boundary).

The dashboard layout (`app/(dashboard)/layout.tsx`) is a server component that reads the session and redirects to `/login` if no `accessToken` is present.

### Data Layer

All Kite API calls flow through a single path:

```
React hook (hooks/)
  → apiFetch() (hooks/use-api.ts)  — checks for 401/session_expired
  → Next.js Route Handler (app/api/*/route.ts)
  → getAuthenticatedClient() (lib/session.ts)
  → KiteClient method (lib/kite.ts)
  → https://api.kite.trade
```

`KiteClient` in `lib/kite.ts` is the sole HTTP client for Kite. It throws `KiteSessionExpiredError` on 403 responses where `error_type` is a session/token error. Route handlers return `sessionExpiredResponse()` (HTTP 401 with `{ error: "session_expired" }`) which `apiFetch` detects and re-throws so the UI can redirect to login.

### React Query Hooks

Every data hook in `hooks/` wraps `useQuery` with a `refetchInterval` driven by `getPollingInterval()` or `getWatchlistPollingInterval()` from `lib/market-hours.ts`. These return `false` when the market is closed, pausing all polling automatically.

Hooks: `useHoldings`, `usePositions`, `useOrders`, `useTrades`, `useMargins`, `useLTP`, `useOHLC`, `useWatchlist`.

### Key Utilities

- **`lib/kite.ts`** — `KiteClient` class. `getLTP`/`getOHLC` build instrument query strings manually (not via `URLSearchParams`) because the Kite API requires comma-separated `NSE:SYMBOL` strings and rejects `+`-encoded spaces.
- **`lib/market-hours.ts`** — IST-aware helpers: `isMarketOpen()`, `getMarketStatus()`, `getPollingInterval(baseMs)` → `false` when closed, `getNextSixAMIST()` for session expiry.
- **`lib/types.ts`** — All Kite API response interfaces (`KiteHolding`, `KitePosition`, `KiteOrder`, `KiteTrade`, `KiteLTP`, `KiteOHLC`, `KiteInstrument`, etc.) and `SessionData`.
- **`lib/instruments.ts`** — Instrument search helpers. Instruments are `segment=NSE` + `instrument_type=EQ` (not `exchange=NSE-EQ`).

### Pages

All dashboard pages live under `app/(dashboard)/` and are protected by the layout auth check:

| Route | Page |
|---|---|
| `/portfolio` | Holdings + Positions tables |
| `/orders` | Orders + Trades tables |
| `/analytics` | Day heatmap, top gainers/losers, stock concentration, sector allocation |
| `/watchlist` | Instrument search + live price table |

### Known Limitations

See `docs/todo.md`. The Kite `/quote/ltp` API does not accept index symbols (`NSE:NIFTY 50`) — the `IndexTicker` in the TopBar was removed for this reason.
