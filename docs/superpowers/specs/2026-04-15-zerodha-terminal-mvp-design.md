# Zerodha Terminal — MVP Design Spec

**Date**: 2026-04-15
**Author**: Sarthak Verma + Claude
**Status**: Draft
**Scope**: MVP — personal trading dashboard replacing Kite/Console/Coin

---

## Problem

Zerodha's Kite web/app has three pain points:

1. **Poor portfolio analytics** — holdings view is flat, no sector breakdown, no allocation visualization, no P&L heatmaps
2. **Fragmented experience** — switching between Kite (trading), Console (reports), and Coin (MF) for different views
3. **No smart insights** — raw data with no interpretation or analysis

The MVP solves #1 and #2. AI-powered insights (#3) are deferred to a future cycle.

## Architecture

### Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Data fetching**: TanStack Query (React Query)
- **Data source**: Kite Connect REST API (free tier)
- **Storage**: No database. Watchlist in localStorage, sector map in local JSON file
- **Deployment**: Vercel (or local `next dev` for personal use)

### Data Flow

```
Browser (React + TanStack Query)
    │ fetch('/api/*')
    ▼
Next.js API Routes (thin proxy layer)
    │ HTTPS with access_token header
    ▼
Kite Connect REST API (api.kite.trade)
```

- API routes are thin proxies — forward requests to Kite with the access token, return responses
- Input validation on all routes: LTP/OHLC batch requests capped at 50 instruments, instrument search query capped at 100 chars
- Access token stored server-side in an encrypted httpOnly cookie
- TanStack Query handles caching, polling intervals, stale data, and refetching

### Kite API Endpoints Used

| Endpoint | Purpose | Polling |
|----------|---------|---------|
| `POST /session/token` | Exchange request_token for access_token | Once on login |
| `GET /portfolio/holdings` | Holdings with P&L | 30s |
| `GET /portfolio/positions` | Intraday/F&O positions | 30s |
| `GET /user/margins` | Available funds, utilization | 30s |
| `GET /orders` | Today's orders | 30s |
| `GET /trades` | Executed trades | 30s |
| `GET /quote/ltp` | Last traded price (batched) | 5s (watchlist), 30s (top bar indices) |
| `GET /quote/ohlc` | Day OHLC + close price (batched) | Once on screen load (watchlist needs `close` for day change calc) |
| `GET /instruments` | Full instruments CSV dump (~100K rows) | Once daily on first search, cached in-memory |

All LTP/OHLC calls are batched — one request with multiple instruments (e.g., `?i=NSE:SBIN&i=NSE:HAL&i=NSE:BEL`).

## Authentication

Kite Connect uses OAuth 2.0. Sessions expire daily at 6:00 AM IST.

### Flow

1. User opens dashboard → **Login page** with "Login with Kite" button
2. Click redirects to `https://kite.zerodha.com/connect/login?api_key=<KEY>`
3. User logs in on Zerodha → redirected back to `/api/auth/callback?request_token=<TOKEN>`
4. API route calls `POST /session/token` to exchange for `access_token`
5. `access_token` stored in encrypted httpOnly cookie (never exposed to browser JS)
6. Cookie `max-age` set to expire at next 6:00 AM IST (aligned with Kite's daily session expiry) rather than a fixed duration
7. All subsequent `/api/*` calls read token from cookie, forward to Kite

### Session Expiry Handling

- Every API route checks response status
- On **403 or token error** → API returns `{ error: "session_expired" }`
- Frontend detects this via TanStack Query's global error handler
- Shows full-screen overlay: "Session expired — Log in again" with a single button
- No silent failures, no broken data states

### Logout

- Settings icon (S) in icon rail includes a "Logout" option
- Calls `/api/auth/logout` which:
  1. Calls `DELETE /session/token` on Kite to invalidate the access token
  2. Clears the httpOnly cookie
  3. Redirects to login page

## Layout

### Structure

```
┌──────────────────────────────────────────────────┐
│ [ZT]  NIFTY 23,850 +0.8%  SENSEX 78,553  │ SV │ ← Top Bar
├────┬─────────────────────────────────────────────┤
│ P  │                                             │
│ W  │                                             │
│ O  │          Content Area                       │
│ A  │                                             │
│    │                                             │
│ AI │                                             │ ← Disabled in MVP
│ S  │                                             │ ← Future
└────┴─────────────────────────────────────────────┘
  ↑
  Icon Rail (40px)
```

### Top Bar

- **Left**: ZT logo (Bloomberg orange)
- **Center**: Market indices — NIFTY 50, SENSEX, BANKNIFTY with LTP + day change %. Fetched via a single batched LTP call. Greyed out outside market hours.
- **Right**: Timestamp (IST), user initials avatar

### Icon Rail

- 40px wide, dark background (`#0d0d0d`)
- Icons: single-letter labels in 28x28px boxes
- Active icon: orange background (`#ff6e00`) with black text
- Inactive: gray text (`#555`)
- Bottom section: AI button (orange outline, disabled), Settings (future)

## Theme — Bloomberg Terminal

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | `#0a0a0a` | Page background |
| `bg-surface` | `#111111` | Cards, panels |
| `bg-surface-alt` | `#0e0e0e` | Table backgrounds |
| `border` | `#1c1c1c` | All borders |
| `accent` | `#ff6e00` | Active nav, section headers, branding |
| `text-primary` | `#d4d4d4` | Primary text, numbers |
| `text-secondary` | `#888888` | Quantities, labels |
| `text-muted` | `#555555` | Column headers, timestamps |
| `text-dim` | `#444444` | Disabled, least important |
| `profit` | `#33cc66` | Positive P&L, gains |
| `profit-dim` | `#228844` | Profit percentage text |
| `loss` | `#ff4444` | Negative P&L, losses |
| `loss-dim` | `#aa3333` | Loss percentage text |
| `loss-row` | `rgba(255,68,68,0.06)` | Faint red tint on losing rows |

### Typography

- **Font family**: `JetBrains Mono`, `SF Mono`, `Consolas`, `monospace`
- **Numbers**: Tabular (monospaced digits) for alignment in tables
- **Labels**: 10px, uppercase, letter-spacing 0.5px, `text-muted` color
- **Data values**: 11-12px, `text-primary` color
- **Large numbers**: 15-16px, used in summary strip

## Rendering Strategy

All page components (`portfolio/page.tsx`, `watchlist/page.tsx`, etc.) are **client components** (`"use client"`). Data is fetched client-side via TanStack Query, not via server-side data fetching. The App Router layout (`layout.tsx`) is server-rendered for the shell (icon rail + top bar structure), but all dynamic content renders as skeletons on initial paint and hydrates with data client-side. This is intentional — real-time polling doesn't benefit from SSR.

## Screens

### Portfolio (P) — Default Screen

The home screen. Three stacked zones:

**1. Summary Strip**
Five stat cards in a horizontal row:

| Card | Value Source | Format |
|------|-------------|--------|
| Invested | Sum of `average_price * quantity` from holdings | Currency, no decimals |
| Current Value | Sum of `last_price * quantity` from holdings | Currency, no decimals |
| Total P&L | Sum of `pnl` from holdings | Currency + %, colored green/red |
| Day P&L | Sum of `day_change * quantity` from holdings | Currency + %, colored green/red |
| Available Cash | `margins.equity.net` | Currency, no decimals |

**2. Holdings Table**
Full data grid with all holdings. Columns:

| Column | Source | Alignment | Notes |
|--------|--------|-----------|-------|
| Symbol | `tradingsymbol` | Left | Bold, white text |
| Qty | `quantity` | Right | Muted color |
| Avg Price | `average_price` | Right | Formatted with commas |
| LTP | `last_price` | Right | Formatted with commas |
| P&L | `pnl` | Right | Green/red colored |
| Change % | `(last_price - average_price) / average_price * 100` | Right | Green/red colored |

- Default sort: by P&L descending (biggest winners first)
- Rows with negative P&L get `loss-row` background tint
- Clicking column headers to sort (future enhancement)

**3. Positions Table**
Same column structure as holdings, using positions data. Additional columns: Product type (MIS/NRML), M2M P&L.

- **Hidden entirely when positions array is empty** — no "No positions" empty state, just not rendered
- Appears with a section header "POSITIONS" when data exists

**Polling**: 30 seconds during market hours.

### Watchlist (W)

**Search Bar** (top of screen)
- Input field with magnifying glass icon
- Searches against a cached instruments list (debounced 300ms, client-side filtering)
- The instruments list is a large CSV (~100K rows) from Kite's `GET /instruments` endpoint
- Backend downloads and caches this CSV once daily (on first search request), parses it, and serves a search endpoint `/api/instruments?q=<query>` that filters in-memory
- Dropdown shows matching instruments: symbol, name, exchange
- Click to add to watchlist
- Instruments list stored in localStorage as `["NSE:SBIN", "NSE:RELIANCE", ...]`

**Watchlist Table**
Each row shows:

| Column | Source | Notes |
|--------|--------|-------|
| Symbol | From stored instrument ID | Bold text |
| Exchange | NSE/BSE tag | Small muted badge |
| LTP | From batched `/quote/ltp` | Large, primary number |
| Day Change | `last_price - close_price` | Absolute value. `close_price` sourced from OHLC endpoint (fetched once on screen load) |
| Day Change % | `(last_price - close_price) / close_price * 100` | Green/red colored |

- Remove button (x) on hover for each row
- Drag to reorder (future enhancement)

**Polling**: Dynamic interval based on watchlist size during market hours. Single batched LTP call for all instruments.
- Up to 20 instruments: 5s interval
- 21-50 instruments: 10s interval
- 50+ instruments: not supported (capped at 50 by API validation)

### Orders (O)

**Tab bar**: Orders | Trades

**Orders Tab**
| Column | Source | Notes |
|--------|--------|-------|
| Time | `order_timestamp` | HH:MM:SS format |
| Symbol | `tradingsymbol` | Bold |
| Type | `transaction_type` | BUY (green) / SELL (red) |
| Qty | `quantity` | — |
| Price | `price` or `average_price` | — |
| Status | `status` | Color-coded: COMPLETE (green), REJECTED (red), OPEN (orange), CANCELLED (muted) |

**Trades Tab**
| Column | Source | Notes |
|--------|--------|-------|
| Time | `fill_timestamp` | HH:MM:SS format |
| Symbol | `tradingsymbol` | Bold |
| Type | `transaction_type` | BUY/SELL colored |
| Qty | `quantity` | — |
| Price | `average_price` | — |
| Order ID | `order_id` | Truncated, monospace |

**Polling**: 30 seconds during market hours.

### Analytics (A)

Scrollable single-page dashboard. Four sections:

**1. Stock Concentration** (always works, no mapping needed)
- Horizontal bar chart
- Each bar = one stock, width proportional to `(last_price * quantity) / total_portfolio_value`
- Label: stock symbol + percentage
- Sorted by value descending
- Uses accent colors from the palette

**2. Sector Allocation** (requires sector mapping)
- Donut chart with center showing total stock count
- Sectors grouped from `data/sectors.json` mapping file
- Format of mapping file:
  ```json
  {
    "HAL": "Defense",
    "BEL": "Defense",
    "SBIN": "Banking",
    "TMCV": "Auto",
    "TMPV": "Auto",
    "ADANIGREEN": "Energy",
    "GOLDBEES": "Gold"
  }
  ```
- Stocks without a mapping entry appear under "Unmapped" sector
- Legend below donut with sector name + percentage
- Palette: orange, green, blue, yellow, purple, gray (for unmapped)

**3. Day Heatmap**
- Grid of tiles, one per holding
- Tile color intensity based on `day_change_percentage`:
  - Positive: green with opacity scaling (higher % = more opaque)
  - Negative: red with opacity scaling
- Tile content: symbol + day change %
- Grid layout: auto-fill, wrapping rows

**4. Top Gainers / Losers**
- Two columns side by side
- **Gainers**: Holdings sorted by total return % descending (top 5 or all)
- **Losers**: Holdings sorted by total return % ascending (bottom 5 or all)
- Each item: rank, symbol, return %, P&L amount

**Data source**: All derived from holdings data already fetched on Portfolio screen. No additional API calls. TanStack Query cache shared across screens.

## Cross-Cutting Concerns

### Rate Limiting

Kite free tier allows ~3 requests/second.

- **Batch all quote calls**: LTP and OHLC support multiple instruments per request
- **Stagger polling**: Don't fire all intervals at the same instant
  - Holdings/Positions/Margins: 30s, offset 0
  - Orders/Trades: 30s, offset 10s
  - Watchlist LTP: 5s
  - Index LTP (top bar): 30s, offset 20s
- **Active screen only**: Only poll data for the currently visible screen + top bar indices. Other screens use cached data until navigated to.

### Market Hours Awareness

Indian equity market: 9:15 AM — 3:30 PM IST, Monday-Friday.

- **During market hours**: Full polling at configured intervals
- **Outside market hours**: All polling stopped. Show last known data.
- **Top bar indicator**: Show "Market Closed" badge next to indices when outside hours
- **Pre-market (9:00-9:15)**: Could show "Pre-Open" indicator (same as closed behavior for data)
- Detection: Client-side check against IST time. No server-side scheduling needed.

### Loading States

- **Initial load** (after login): Full skeleton screen matching the layout — gray pulsing blocks for summary strip, table rows, charts
- **Screen switches**: If data is cached (TanStack Query), show immediately. If stale/missing, show skeleton.
- **Polling updates**: No loading indicator — data updates silently in place. Numbers can briefly flash/highlight on change (subtle).

### Error States

- **API failure** (network error, 500): Orange warning banner at top of content area — "Failed to fetch data. Retrying..." Auto-retry with exponential backoff (1s, 2s, 4s, max 30s).
- **Session expired** (403): Full-screen overlay blocking all content — "Session expired" + "Log in again" button. No partial states.
- **Empty states**: 
  - Watchlist empty: "Add instruments to your watchlist" with search bar focused
  - Orders empty: "No orders today"
  - Positions empty: Section hidden entirely (not shown)

## File Structure

```
zerodha-terminal/
├── app/
│   ├── layout.tsx              # Root layout — icon rail + top bar shell
│   ├── page.tsx                # Redirect to /portfolio
│   ├── login/
│   │   └── page.tsx            # Login page with "Login with Kite" button
│   ├── portfolio/
│   │   └── page.tsx            # Holdings + Positions + Summary
│   ├── watchlist/
│   │   └── page.tsx            # Watchlist with search
│   ├── orders/
│   │   └── page.tsx            # Orders + Trades tabs
│   ├── analytics/
│   │   └── page.tsx            # Scrollable analytics dashboard
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts      # Redirect to Kite OAuth
│       │   ├── callback/route.ts   # Exchange token, set cookie
│       │   └── logout/route.ts     # Invalidate Kite session, clear cookie
│       ├── holdings/route.ts
│       ├── positions/route.ts
│       ├── margins/route.ts
│       ├── orders/route.ts
│       ├── trades/route.ts
│       ├── ltp/route.ts            # Batched LTP proxy
│       ├── ohlc/route.ts           # Batched OHLC proxy
│       └── instruments/route.ts    # Search proxy
├── components/
│   ├── layout/
│   │   ├── TopBar.tsx
│   │   ├── IconRail.tsx
│   │   └── AppShell.tsx
│   ├── portfolio/
│   │   ├── SummaryStrip.tsx
│   │   ├── HoldingsTable.tsx
│   │   └── PositionsTable.tsx
│   ├── watchlist/
│   │   ├── InstrumentSearch.tsx
│   │   └── WatchlistTable.tsx
│   ├── orders/
│   │   ├── OrdersTable.tsx
│   │   └── TradesTable.tsx
│   ├── analytics/
│   │   ├── StockConcentration.tsx
│   │   ├── SectorAllocation.tsx
│   │   ├── DayHeatmap.tsx
│   │   └── TopGainersLosers.tsx
│   └── shared/
│       ├── Skeleton.tsx
│       ├── ErrorBanner.tsx
│       ├── SessionExpired.tsx
│       └── MarketStatus.tsx
├── lib/
│   ├── kite.ts                 # Kite API client (server-side)
│   ├── auth.ts                 # Cookie encryption, token helpers
│   ├── instruments.ts          # Instruments CSV download, parse, in-memory cache + search
│   ├── market-hours.ts         # IST market hours check
│   └── format.ts               # Number/currency formatting
├── hooks/
│   ├── useHoldings.ts          # TanStack Query hook
│   ├── usePositions.ts
│   ├── useMargins.ts
│   ├── useOrders.ts
│   ├── useTrades.ts
│   ├── useLTP.ts               # Batched LTP with polling
│   ├── useMarketStatus.ts      # Market open/closed
│   └── useWatchlist.ts         # localStorage persistence
├── data/
│   └── sectors.json            # Symbol → Sector mapping
├── tailwind.config.ts          # Bloomberg theme tokens
├── next.config.ts
├── package.json
└── .env.local                  # KITE_API_KEY, KITE_API_SECRET, COOKIE_SECRET
```

## Environment Variables

```
KITE_API_KEY=<your kite connect api key>
KITE_API_SECRET=<your kite connect api secret>
COOKIE_SECRET=<random 32-char string for encrypting session cookie>
```

## What's NOT in the MVP

These are explicitly deferred to future cycles:

- **AI Co-pilot** — OpenRouter integration, chat sidebar, inline insights
- **Historical charts** — Candlestick charts with technical indicators (needs paid API or alternative data source)
- **WebSocket streaming** — Real-time tick-by-tick data (needs paid API)
- **Order management** — Placing, modifying, cancelling orders from the dashboard
- **Advanced analytics** — Drawdown tracking, risk metrics, portfolio returns over time
- **Column sorting** — Click-to-sort on table headers
- **Drag-to-reorder** — Watchlist reordering
- **Multiple watchlists** — Grouped/tabbed watchlists
- **Dark/light theme toggle** — Bloomberg dark only
- **Mobile responsive** — Desktop-first, no mobile optimization in MVP

## Verification Plan

1. **Auth flow**: Login → redirect → callback → cookie set → dashboard loads with real data
2. **Portfolio screen**: All 7 holdings visible with correct P&L, summary strip totals match
3. **Watchlist**: Add instrument via search, LTP updates every 5s, remove works, persists on refresh
4. **Orders**: Shows today's orders/trades (or empty state if none)
5. **Analytics**: Stock concentration shows correct percentages, sector donut groups correctly, unmapped stocks show as "Unmapped", day heatmap colors match actual day changes
6. **Session expiry**: Manually expire cookie → overlay appears → re-login works
7. **Market hours**: Open dashboard outside 9:15-15:30 IST → "Market Closed" badge shown, no polling active
8. **Error handling**: Kill network → error banner appears → reconnect → data resumes
