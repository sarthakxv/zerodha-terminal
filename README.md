# Zerodha Terminal

A personal trading dashboard for Zerodha Kite — live portfolio, positions, orders, analytics, and watchlist in one place.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · TanStack Query v5 · iron-session

## Setup

1. Create a Kite Connect app at [developers.kite.trade](https://developers.kite.trade) and set the redirect URL to `http://localhost:3000/api/auth/callback`

2. Copy env file and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```

3. Install and run:
   ```bash
   npm install
   npm run dev
   ```

4. Open `http://localhost:3000` and log in with your Zerodha account.

## Environment Variables

| Variable | Description |
|---|---|
| `KITE_API_KEY` | Kite Connect app key |
| `KITE_API_SECRET` | Kite Connect app secret |
| `COOKIE_SECRET` | Random 32+ character string |
| `NEXT_PUBLIC_BASE_URL` | Base URL, e.g. `http://localhost:3000` |

## Features

- **Portfolio** — holdings and open positions with P&L
- **Orders** — order book and trade history
- **Analytics** — calendar heatmap, sector allocation, stock concentration, top gainers/losers
- **Watchlist** — search NSE equity instruments with live LTP polling

Polling stops automatically when the market is closed.
