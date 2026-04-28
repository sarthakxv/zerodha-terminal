# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Next.js dev server, port 3000 (Turbopack)
npm run build        # TypeScript compile + Next.js production build
npm run lint         # ESLint
npm run test         # Vitest, jsdom
npm run test:watch   # Vitest watch mode
```

Run a single test file:
```bash
npx vitest run __tests__/lib/format.test.ts
```

If Turbopack serves stale CSS after editing `app/globals.css`, restart with a clean cache:
```bash
rm -rf .next && npm run dev
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

`app/(dashboard)/layout.tsx` is a server component that reads the session, redirects to `/login` if no `accessToken` is present, and forwards `session.userName` (the full user name) into `<AppShell>`. The avatar's first-letter glyph is derived locally inside `TopBar`; do NOT pre-compute initials in the layout.

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
- **`lib/format.ts`** — `formatCurrency`, `formatCurrencyDecimal`, `formatPercent`, `formatPnl`, `formatTime`, and `pnlColor()` which returns Tailwind class names (`text-profit`/`text-loss`/`text-text-secondary`). The token names are stable; remapping happens in `globals.css`, so a palette swap doesn't require touching components.

### Pages

All dashboard pages live under `app/(dashboard)/` and are protected by the layout auth check:

| Route | Page |
|---|---|
| `/portfolio` | Day P&L hero (Doto), summary strip, Holdings + Positions tables |
| `/orders` | Today-count hero, segmented control between Orders / Trades |
| `/analytics` | Total return % hero, Stock Concentration, Sector Allocation, Day Heatmap, Top Gainers/Losers |
| `/watchlist` | Instrument count hero + search, live price table |

## Design System (Nothing-inspired)

The UI follows a Nothing/Braun/Teenage-Engineering visual language: monochrome OLED-black canvas, type-driven hierarchy, single accent red (`#D71921`), and a one-moment-of-surprise rule (Doto dot-matrix display font for hero numbers).

### Fonts

Three families load globally from `app/layout.tsx`:

- **Space Grotesk** (sans, body/UI) — `next/font/google`, exposed as `--font-space-grotesk` and the Tailwind `font-sans` utility.
- **Space Mono** (data, ALL-CAPS labels, all numeric cells) — `next/font/google`, exposed as `--font-space-mono` and `font-mono`.
- **Doto** (variable dot-matrix display) — loaded via a direct Google Fonts `<link>` in the root `<head>`, NOT through `next/font/google`. The `next/font` Doto manifest currently emits an invalid `unicode-range` (`U+??`) that excludes basic Latin, causing the browser to silently fall through the font-family chain to Space Mono. The eslint `@next/next/no-page-custom-font` warning on that `<link>` is a false positive in the App Router (where `app/layout.tsx` IS the root layout) and is suppressed inline. Don't try to move the Doto load into `globals.css` via `@import url(...)` — Tailwind v4 inlines its rules first, which violates the CSS spec rule that `@import` must precede all other statements. The Doto family is referenced in the `--font-display` token and the `font-display` Tailwind utility.

### Tokens

Defined in `app/globals.css` under `@theme inline`. Tailwind utility classes derive from these names:

- Surfaces: `bg-bg-primary` (OLED black), `bg-bg-surface`, `bg-bg-surface-alt`, `bg-bg-raised`
- Borders: `border-border` (hairline), `border-border-visible`, `border-border-strong`
- Text: `text-text-display` (white, hero only), `text-text-primary`, `text-text-secondary`, `text-text-muted`, `text-text-dim`
- Accent / status: `text-accent` (single Nothing red), `text-profit`, `text-loss`, `text-warning`, `bg-accent-soft`, `border-accent-line`
- Custom utilities: `dot-grid` / `dot-grid-subtle` (radial-gradient backgrounds), `blink` (1.2s steps animation for live readouts), `label-mono`, `display-number`

### Visual Rules (apply when adding components)

- **Three-layer hierarchy per page**: ONE primary (Doto hero, sign-colored where it represents data), secondary (cards/strips), tertiary (mono caps labels).
- **Color on the value, not the row.** No zebra striping, no per-row tinting. P&L cells use `pnlColor(value)` — that's where green/red lives.
- **No skeleton screens.** `Skeleton.tsx` exports keep their names for compatibility but render `[LOADING…]` mechanical text via the shared `LoadingText` helper.
- **No shadows, no border-radius > pill (999px).** Surfaces are flat with 1px borders.
- **Differentiate by opacity (100/60/30) before color.** `StockConcentration` and `SectorAllocation` use opacity ramps on `bg-text-display`, not multi-color palettes.
- **Section headers**: always Space Mono ALL CAPS at 9-10px with 0.16em tracking. Use the shared `<SectionHeader>` and pass `subtitle` (rendered with a `/` prefix) and an optional `action` slot.

### Known Quirks

- Kite `/quote/ltp` does not accept index symbols (`NSE:NIFTY 50`). The TopBar previously had an `IndexTicker` for this; it was removed.
- `hooks/use-watchlist.ts` triggers a `react-hooks/set-state-in-effect` lint error (pre-existing). The localStorage hydration pattern is intentional to avoid SSR mismatch — see commits `0a639ac` and `0ee02c5` for context.
- Turbopack occasionally serves stale CSS after `globals.css` edits; remove `.next/` and restart.
