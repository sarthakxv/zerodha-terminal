# Zerodha Terminal MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal Bloomberg-inspired trading dashboard that unifies Zerodha Kite portfolio, watchlist, orders, and analytics into a single dark-themed terminal interface.

**Architecture:** Next.js 14+ App Router with API routes as a thin proxy to Kite Connect REST API. All data fetched client-side via TanStack Query with market-hours-aware polling. No database — watchlist persisted in localStorage, sector mapping in a static JSON file.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 4, TanStack Query 5, TypeScript 5, JetBrains Mono font

**Note:** This repo already contains `docs/` and `.superpowers/` directories. The scaffold step accounts for this — we initialize Next.js in a temp directory and move files in, preserving existing content.

**Spec:** `docs/superpowers/specs/2026-04-15-zerodha-terminal-mvp-design.md`

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `.env.local`
- Create: `.gitignore`
- Create: `data/sectors.json`

- [ ] **Step 1: Initialize Next.js project (in temp dir to avoid clobbering existing files)**

```bash
cd /tmp
npx create-next-app@latest zerodha-terminal-scaffold --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

Then move scaffold files into the project, preserving existing `docs/` and `.superpowers/`:

```bash
cd /tmp/zerodha-terminal-scaffold
cp -r app components lib public next.config.* tsconfig.json tailwind.config.* postcss.config.* package.json package-lock.json .eslintrc.json /Users/sarthak/Public/zerodha-terminal/
rm -rf /tmp/zerodha-terminal-scaffold
cd /Users/sarthak/Public/zerodha-terminal
```

- [ ] **Step 2: Pin exact versions and install dependencies**

Verify `package.json` has Next.js 15.x, React 19.x, Tailwind 4.x. Then install additional deps:

```bash
npm install @tanstack/react-query iron-session
npm install -D @types/node
```

- `@tanstack/react-query` — data fetching, caching, polling
- `iron-session` — encrypted httpOnly cookie sessions (simpler than manual AES-256-GCM)

Check the installed versions match expectations:

```bash
npx next --version
npm ls react tailwindcss typescript
```

- [ ] **Step 3: Create `.env.local`**

```env
KITE_API_KEY=your_kite_api_key_here
KITE_API_SECRET=your_kite_api_secret_here
COOKIE_SECRET=replace_with_random_32_char_string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

- [ ] **Step 4: Update `.gitignore` to include sensitive files**

Append to the existing `.gitignore`:

```
.env.local
.env*.local
.superpowers/
```

- [ ] **Step 5: Configure Tailwind with Bloomberg theme**

Replace `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0a0a",
          surface: "#111111",
          "surface-alt": "#0e0e0e",
        },
        border: {
          DEFAULT: "#1c1c1c",
        },
        accent: "#ff6e00",
        text: {
          primary: "#d4d4d4",
          secondary: "#888888",
          muted: "#555555",
          dim: "#444444",
        },
        profit: {
          DEFAULT: "#33cc66",
          dim: "#228844",
        },
        loss: {
          DEFAULT: "#ff4444",
          dim: "#aa3333",
          row: "rgba(255,68,68,0.06)",
        },
      },
      fontFamily: {
        mono: [
          "var(--font-mono)",
          "SF Mono",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 6: Set up global CSS**

Replace `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Font loaded via next/font in layout.tsx — no @import needed */

html,
body {
  background-color: #0a0a0a;
  color: #d4d4d4;
  font-variant-numeric: tabular-nums;
}

/* Scrollbar styling for the terminal look */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #0a0a0a;
}

::-webkit-scrollbar-thumb {
  background: #1c1c1c;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #333;
}
```

- [ ] **Step 7: Create root layout with next/font**

Replace `app/layout.tsx`. Uses `next/font/google` to load JetBrains Mono — self-hosted, no render-blocking external CSS request, avoids `@import` ordering issues with Tailwind:

```tsx
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZT — Zerodha Terminal",
  description: "Personal trading dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} font-mono bg-bg-primary text-text-primary antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Create placeholder home page**

Replace `app/page.tsx`:

```tsx
export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-accent text-2xl font-bold tracking-widest">ZT</h1>
    </div>
  );
}
```

- [ ] **Step 9: Create initial sector mapping**

Create `data/sectors.json`:

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

- [ ] **Step 10: Verify it runs**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: black screen with orange "ZT" centered.

- [ ] **Step 11: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold next.js project with bloomberg theme"
```

---

## Task 2: Utility Libraries

**Files:**
- Create: `lib/format.ts`
- Create: `lib/market-hours.ts`
- Create: `lib/types.ts`

- [ ] **Step 1: Create shared TypeScript types**

Create `lib/types.ts`:

```ts
// Kite API response types

export interface KiteHolding {
  tradingsymbol: string;
  exchange: string;
  instrument_token: number;
  isin: string;
  product: string;
  quantity: number;
  average_price: number;
  last_price: number;
  close_price: number;
  pnl: number;
  day_change: number;
  day_change_percentage: number;
  t1_quantity: number;
}

export interface KitePosition {
  tradingsymbol: string;
  exchange: string;
  instrument_token: number;
  product: string;
  quantity: number;
  average_price: number;
  last_price: number;
  close_price: number;
  pnl: number;
  m2m: number;
  day_change: number;
  day_change_percentage: number;
  buy_quantity: number;
  sell_quantity: number;
  multiplier: number;
}

export interface KiteMargins {
  equity: {
    enabled: boolean;
    net: number;
    available: {
      cash: number;
      live_balance: number;
      opening_balance: number;
      intraday_payin: number;
      collateral: number;
      adhoc_margin: number;
    };
    utilised: {
      debits: number;
      exposure: number;
      span: number;
      option_premium: number;
      holding_sales: number;
      turnover: number;
    };
  };
}

export interface KiteOrder {
  order_id: string;
  tradingsymbol: string;
  exchange: string;
  transaction_type: "BUY" | "SELL";
  order_type: string;
  quantity: number;
  price: number;
  average_price: number;
  status: string;
  status_message: string | null;
  order_timestamp: string;
  filled_quantity: number;
  pending_quantity: number;
  product: string;
  variety: string;
}

export interface KiteTrade {
  trade_id: string;
  order_id: string;
  tradingsymbol: string;
  exchange: string;
  transaction_type: "BUY" | "SELL";
  quantity: number;
  average_price: number;
  fill_timestamp: string;
  product: string;
}

export interface KiteLTP {
  instrument_token: number;
  last_price: number;
}

export interface KiteOHLC {
  instrument_token: number;
  last_price: number;
  ohlc: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
}

export interface KiteProfile {
  user_id: string;
  user_name: string;
  user_shortname: string;
  email: string;
  exchanges: string[];
  products: string[];
  order_types: string[];
}

export interface KiteInstrument {
  instrument_token: number;
  exchange_token: number;
  tradingsymbol: string;
  name: string;
  exchange: string;
  segment: string;
  instrument_type: string;
  tick_size: number;
  lot_size: number;
}

// App-level types

export interface SessionData {
  accessToken: string;
  userId: string;
  userName: string;
  userShortname: string;
  expiresAt: number; // timestamp — next 6AM IST
}
```

- [ ] **Step 2: Create number/currency formatting utilities**

Create `lib/format.ts`:

```ts
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const currencyFormatterDecimal = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  signDisplay: "always",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatCurrencyDecimal(value: number): string {
  return currencyFormatterDecimal.format(value);
}

export function formatPercent(value: number): string {
  return percentFormatter.format(value) + "%";
}

export function formatPnl(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return sign + currencyFormatter.format(value);
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function pnlColor(value: number): string {
  if (value > 0) return "text-profit";
  if (value < 0) return "text-loss";
  return "text-text-secondary";
}

export function pnlDimColor(value: number): string {
  if (value > 0) return "text-profit-dim";
  if (value < 0) return "text-loss-dim";
  return "text-text-muted";
}
```

- [ ] **Step 3: Create market hours utility**

Create `lib/market-hours.ts`:

```ts
function getISTDate(): Date {
  // Get current time in IST (UTC+5:30)
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  return new Date(utc + istOffset);
}

export function isMarketOpen(): boolean {
  const ist = getISTDate();
  const day = ist.getDay(); // 0=Sun, 6=Sat
  if (day === 0 || day === 6) return false;

  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  const marketOpen = 9 * 60 + 15; // 9:15 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM

  return timeInMinutes >= marketOpen && timeInMinutes <= marketClose;
}

export function getMarketStatus(): "open" | "closed" | "pre-open" {
  const ist = getISTDate();
  const day = ist.getDay();
  if (day === 0 || day === 6) return "closed";

  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  const preOpen = 9 * 60; // 9:00 AM
  const marketOpen = 9 * 60 + 15; // 9:15 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM

  if (timeInMinutes >= preOpen && timeInMinutes < marketOpen) return "pre-open";
  if (timeInMinutes >= marketOpen && timeInMinutes <= marketClose) return "open";
  return "closed";
}

export function getNextSixAMIST(): number {
  const now = new Date();
  const ist = getISTDate();

  // Find next 6:00 AM IST
  const target = new Date(ist);
  target.setHours(6, 0, 0, 0);

  // If it's already past 6AM today, go to tomorrow
  if (ist >= target) {
    target.setDate(target.getDate() + 1);
  }

  // Convert IST target back to UTC timestamp
  const istOffset = 5.5 * 60 * 60 * 1000;
  return target.getTime() - istOffset + now.getTimezoneOffset() * 60 * 1000;
}

export function getPollingInterval(
  baseInterval: number,
  enabled: boolean = true
): number | false {
  if (!enabled || !isMarketOpen()) return false;
  return baseInterval;
}

export function getWatchlistPollingInterval(instrumentCount: number): number | false {
  if (!isMarketOpen()) return false;
  if (instrumentCount <= 20) return 5000;
  return 10000; // 21-50 instruments
}
```

- [ ] **Step 4: Commit**

```bash
git add lib/
git commit -m "feat: add types, formatting utils, and market hours logic"
```

---

## Task 3: Auth — Kite API Client & Session Management

**Files:**
- Create: `lib/kite.ts`
- Create: `lib/session.ts`
- Create: `app/api/auth/login/route.ts`
- Create: `app/api/auth/callback/route.ts`
- Create: `app/api/auth/logout/route.ts`
- Create: `app/login/page.tsx`

- [ ] **Step 1: Create Kite API client**

Create `lib/kite.ts`:

```ts
const KITE_API_BASE = "https://api.kite.trade";

export class KiteClient {
  private accessToken: string;
  private apiKey: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.apiKey = process.env.KITE_API_KEY!;
  }

  private async request<T>(
    method: string,
    path: string,
    params?: Record<string, string>
  ): Promise<T> {
    const url = new URL(path, KITE_API_BASE);
    if (params) {
      Object.entries(params).forEach(([key, value]) =>
        url.searchParams.append(key, value)
      );
    }

    const res = await fetch(url.toString(), {
      method,
      headers: {
        "X-Kite-Version": "3",
        Authorization: `token ${this.apiKey}:${this.accessToken}`,
      },
    });

    if (res.status === 403) {
      throw new KiteSessionExpiredError();
    }

    if (!res.ok) {
      const body = await res.text();
      throw new KiteAPIError(res.status, body);
    }

    const json = await res.json();
    return json.data as T;
  }

  async getHoldings() {
    return this.request<any[]>("GET", "/portfolio/holdings");
  }

  async getPositions() {
    return this.request<{ net: any[]; day: any[] }>("GET", "/portfolio/positions");
  }

  async getMargins() {
    return this.request<any>("GET", "/user/margins");
  }

  async getOrders() {
    return this.request<any[]>("GET", "/orders");
  }

  async getTrades() {
    return this.request<any[]>("GET", "/trades");
  }

  async getLTP(instruments: string[]) {
    const params: Record<string, string> = {};
    instruments.forEach((inst, i) => {
      params[`i`] = inst; // Kite uses repeated `i` params
    });
    // Kite needs repeated query params, build URL manually
    const url = new URL("/quote/ltp", KITE_API_BASE);
    instruments.forEach((inst) => url.searchParams.append("i", inst));

    const res = await fetch(url.toString(), {
      headers: {
        "X-Kite-Version": "3",
        Authorization: `token ${this.apiKey}:${this.accessToken}`,
      },
    });

    if (res.status === 403) throw new KiteSessionExpiredError();
    if (!res.ok) throw new KiteAPIError(res.status, await res.text());

    const json = await res.json();
    return json.data as Record<string, { instrument_token: number; last_price: number }>;
  }

  async getOHLC(instruments: string[]) {
    const url = new URL("/quote/ohlc", KITE_API_BASE);
    instruments.forEach((inst) => url.searchParams.append("i", inst));

    const res = await fetch(url.toString(), {
      headers: {
        "X-Kite-Version": "3",
        Authorization: `token ${this.apiKey}:${this.accessToken}`,
      },
    });

    if (res.status === 403) throw new KiteSessionExpiredError();
    if (!res.ok) throw new KiteAPIError(res.status, await res.text());

    const json = await res.json();
    return json.data as Record<
      string,
      {
        instrument_token: number;
        last_price: number;
        ohlc: { open: number; high: number; low: number; close: number };
      }
    >;
  }

  async invalidateSession() {
    const apiKey = process.env.KITE_API_KEY!;
    await fetch(`${KITE_API_BASE}/session/token`, {
      method: "DELETE",
      headers: {
        "X-Kite-Version": "3",
        Authorization: `token ${apiKey}:${this.accessToken}`,
      },
    });
  }

  static async createSession(requestToken: string) {
    const apiKey = process.env.KITE_API_KEY!;
    const apiSecret = process.env.KITE_API_SECRET!;

    // Kite requires checksum = SHA256(api_key + request_token + api_secret)
    const crypto = await import("crypto");
    const checksum = crypto
      .createHash("sha256")
      .update(apiKey + requestToken + apiSecret)
      .digest("hex");

    const res = await fetch(`${KITE_API_BASE}/session/token`, {
      method: "POST",
      headers: {
        "X-Kite-Version": "3",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        api_key: apiKey,
        request_token: requestToken,
        checksum,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new KiteAPIError(res.status, body);
    }

    const json = await res.json();
    return json.data as {
      access_token: string;
      user_id: string;
      user_name: string;
      user_shortname: string;
    };
  }
}

export class KiteSessionExpiredError extends Error {
  constructor() {
    super("Kite session expired");
    this.name = "KiteSessionExpiredError";
  }
}

export class KiteAPIError extends Error {
  status: number;
  constructor(status: number, body: string) {
    super(`Kite API error ${status}: ${body}`);
    this.name = "KiteAPIError";
    this.status = status;
  }
}
```

- [ ] **Step 2: Create session management with iron-session**

Create `lib/session.ts`:

```ts
import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData } from "./types";
import { getNextSixAMIST } from "./market-hours";
import { KiteClient, KiteSessionExpiredError } from "./kite";

const SESSION_OPTIONS = {
  password: process.env.COOKIE_SECRET!,
  cookieName: "zt-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
}

export async function getAuthenticatedClient(): Promise<KiteClient> {
  const session = await getSession();

  if (!session.accessToken) {
    throw new KiteSessionExpiredError();
  }

  // Check if session has expired (past 6AM IST)
  if (session.expiresAt && Date.now() > session.expiresAt) {
    session.destroy();
    throw new KiteSessionExpiredError();
  }

  return new KiteClient(session.accessToken);
}

export function apiResponse(data: unknown, status: number = 200) {
  return Response.json(data, { status });
}

export function sessionExpiredResponse() {
  return Response.json({ error: "session_expired" }, { status: 401 });
}

export function errorResponse(message: string, status: number = 500) {
  return Response.json({ error: message }, { status });
}
```

- [ ] **Step 3: Create login API route**

Create `app/api/auth/login/route.ts`:

```ts
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const apiKey = process.env.KITE_API_KEY!;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const redirectUrl = `https://kite.zerodha.com/connect/login?v=3&api_key=${apiKey}&redirect_url=${encodeURIComponent(baseUrl + "/api/auth/callback")}`;

  return Response.redirect(redirectUrl);
}
```

- [ ] **Step 4: Create callback API route**

Create `app/api/auth/callback/route.ts`:

```ts
import { NextRequest } from "next/server";
import { KiteClient } from "@/lib/kite";
import { getSession } from "@/lib/session";
import { getNextSixAMIST } from "@/lib/market-hours";

export async function GET(request: NextRequest) {
  const requestToken = request.nextUrl.searchParams.get("request_token");

  if (!requestToken) {
    return Response.redirect(
      new URL("/login?error=missing_token", request.url)
    );
  }

  try {
    const sessionData = await KiteClient.createSession(requestToken);
    const session = await getSession();

    session.accessToken = sessionData.access_token;
    session.userId = sessionData.user_id;
    session.userName = sessionData.user_name;
    session.userShortname = sessionData.user_shortname;
    session.expiresAt = getNextSixAMIST();

    await session.save();

    return Response.redirect(new URL("/portfolio", request.url));
  } catch (error) {
    console.error("Auth callback error:", error);
    return Response.redirect(
      new URL("/login?error=auth_failed", request.url)
    );
  }
}
```

- [ ] **Step 5: Create logout API route**

Create `app/api/auth/logout/route.ts`:

```ts
import { NextRequest } from "next/server";
import { getSession } from "@/lib/session";
import { KiteClient } from "@/lib/kite";

export async function POST(request: NextRequest) {
  const session = await getSession();

  // Invalidate Kite session if we have a token
  if (session.accessToken) {
    try {
      const client = new KiteClient(session.accessToken);
      await client.invalidateSession();
    } catch {
      // Best effort — if this fails, cookie gets cleared anyway
    }
  }

  session.destroy();

  return Response.json({ ok: true });
}
```

- [ ] **Step 6: Create login page**

Create `app/login/page.tsx`:

```tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary gap-8">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-accent text-4xl font-bold tracking-widest">ZT</h1>
        <p className="text-text-muted text-sm">Zerodha Terminal</p>
      </div>

      {error && (
        <div className="bg-loss/10 border border-loss/20 text-loss text-xs px-4 py-2 rounded">
          {error === "missing_token"
            ? "Login failed — missing token."
            : error === "auth_failed"
              ? "Authentication failed. Try again."
              : "Session expired. Please log in again."}
        </div>
      )}

      <a
        href="/api/auth/login"
        className="bg-accent text-black font-bold text-sm px-8 py-3 rounded hover:brightness-110 transition-all tracking-wide"
      >
        LOGIN WITH KITE
      </a>

      <p className="text-text-dim text-xs max-w-xs text-center">
        Redirects to Zerodha for authentication. Sessions expire daily at 6:00
        AM IST.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-bg-primary">
          <h1 className="text-accent text-4xl font-bold tracking-widest">ZT</h1>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add lib/kite.ts lib/session.ts app/api/auth/ app/login/
git commit -m "feat: add kite api client, session management, and auth flow"
```

---

## Task 4: API Proxy Routes

**Files:**
- Create: `app/api/holdings/route.ts`
- Create: `app/api/positions/route.ts`
- Create: `app/api/margins/route.ts`
- Create: `app/api/orders/route.ts`
- Create: `app/api/trades/route.ts`
- Create: `app/api/ltp/route.ts`
- Create: `app/api/ohlc/route.ts`
- Create: `lib/instruments.ts`
- Create: `app/api/instruments/route.ts`

- [ ] **Step 1: Create simple proxy routes**

Each of these follows the same pattern — get authenticated client, call Kite, return data. If session expired, return 401.

Create `app/api/holdings/route.ts`:

```ts
import { getAuthenticatedClient, sessionExpiredResponse, errorResponse } from "@/lib/session";
import { KiteSessionExpiredError } from "@/lib/kite";

export async function GET() {
  try {
    const client = await getAuthenticatedClient();
    const data = await client.getHoldings();
    return Response.json(data);
  } catch (error) {
    if (error instanceof KiteSessionExpiredError) return sessionExpiredResponse();
    return errorResponse("Failed to fetch holdings");
  }
}
```

Create `app/api/positions/route.ts`:

```ts
import { getAuthenticatedClient, sessionExpiredResponse, errorResponse } from "@/lib/session";
import { KiteSessionExpiredError } from "@/lib/kite";

export async function GET() {
  try {
    const client = await getAuthenticatedClient();
    const data = await client.getPositions();
    return Response.json(data);
  } catch (error) {
    if (error instanceof KiteSessionExpiredError) return sessionExpiredResponse();
    return errorResponse("Failed to fetch positions");
  }
}
```

Create `app/api/margins/route.ts`:

```ts
import { getAuthenticatedClient, sessionExpiredResponse, errorResponse } from "@/lib/session";
import { KiteSessionExpiredError } from "@/lib/kite";

export async function GET() {
  try {
    const client = await getAuthenticatedClient();
    const data = await client.getMargins();
    return Response.json(data);
  } catch (error) {
    if (error instanceof KiteSessionExpiredError) return sessionExpiredResponse();
    return errorResponse("Failed to fetch margins");
  }
}
```

Create `app/api/orders/route.ts`:

```ts
import { getAuthenticatedClient, sessionExpiredResponse, errorResponse } from "@/lib/session";
import { KiteSessionExpiredError } from "@/lib/kite";

export async function GET() {
  try {
    const client = await getAuthenticatedClient();
    const data = await client.getOrders();
    return Response.json(data);
  } catch (error) {
    if (error instanceof KiteSessionExpiredError) return sessionExpiredResponse();
    return errorResponse("Failed to fetch orders");
  }
}
```

Create `app/api/trades/route.ts`:

```ts
import { getAuthenticatedClient, sessionExpiredResponse, errorResponse } from "@/lib/session";
import { KiteSessionExpiredError } from "@/lib/kite";

export async function GET() {
  try {
    const client = await getAuthenticatedClient();
    const data = await client.getTrades();
    return Response.json(data);
  } catch (error) {
    if (error instanceof KiteSessionExpiredError) return sessionExpiredResponse();
    return errorResponse("Failed to fetch trades");
  }
}
```

- [ ] **Step 2: Create batched LTP route with input validation**

Create `app/api/ltp/route.ts`:

```ts
import { NextRequest } from "next/server";
import { getAuthenticatedClient, sessionExpiredResponse, errorResponse } from "@/lib/session";
import { KiteSessionExpiredError } from "@/lib/kite";

const MAX_INSTRUMENTS = 50;

export async function GET(request: NextRequest) {
  const instruments = request.nextUrl.searchParams.getAll("i");

  if (instruments.length === 0) {
    return errorResponse("Missing instruments parameter", 400);
  }

  if (instruments.length > MAX_INSTRUMENTS) {
    return errorResponse(`Maximum ${MAX_INSTRUMENTS} instruments allowed`, 400);
  }

  try {
    const client = await getAuthenticatedClient();
    const data = await client.getLTP(instruments);
    return Response.json(data);
  } catch (error) {
    if (error instanceof KiteSessionExpiredError) return sessionExpiredResponse();
    return errorResponse("Failed to fetch LTP");
  }
}
```

- [ ] **Step 3: Create batched OHLC route with input validation**

Create `app/api/ohlc/route.ts`:

```ts
import { NextRequest } from "next/server";
import { getAuthenticatedClient, sessionExpiredResponse, errorResponse } from "@/lib/session";
import { KiteSessionExpiredError } from "@/lib/kite";

const MAX_INSTRUMENTS = 50;

export async function GET(request: NextRequest) {
  const instruments = request.nextUrl.searchParams.getAll("i");

  if (instruments.length === 0) {
    return errorResponse("Missing instruments parameter", 400);
  }

  if (instruments.length > MAX_INSTRUMENTS) {
    return errorResponse(`Maximum ${MAX_INSTRUMENTS} instruments allowed`, 400);
  }

  try {
    const client = await getAuthenticatedClient();
    const data = await client.getOHLC(instruments);
    return Response.json(data);
  } catch (error) {
    if (error instanceof KiteSessionExpiredError) return sessionExpiredResponse();
    return errorResponse("Failed to fetch OHLC");
  }
}
```

- [ ] **Step 4: Create instruments search with CSV caching**

Create `lib/instruments.ts`:

```ts
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

// Exported for testing
/**
 * Parse a CSV line respecting quoted fields (handles commas inside quotes).
 * Kite's instruments CSV contains instrument names with commas, e.g.
 * "State Bank of India" is fine, but "Tata Motors Ltd., DVR" breaks naive split.
 */
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
  fields.push(current); // last field
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
  // Check cache
  if (!cache || Date.now() - cache.fetchedAt > CACHE_TTL) {
    const data = await fetchInstruments(accessToken);
    cache = { data, fetchedAt: Date.now() };
  }

  const q = query.toUpperCase();
  const results: ParsedInstrument[] = [];

  for (const inst of cache.data) {
    if (results.length >= limit) break;

    // Match on tradingsymbol or name
    if (
      inst.tradingsymbol.includes(q) ||
      inst.name.toUpperCase().includes(q)
    ) {
      // Only include equity and ETF instruments from NSE/BSE
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
```

Create `app/api/instruments/route.ts`:

```ts
import { NextRequest } from "next/server";
import { getSession, sessionExpiredResponse, errorResponse } from "@/lib/session";
import { searchInstruments } from "@/lib/instruments";
import { KiteSessionExpiredError } from "@/lib/kite";

const MAX_QUERY_LENGTH = 100;

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return errorResponse("Missing search query", 400);
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return errorResponse(`Query too long (max ${MAX_QUERY_LENGTH} chars)`, 400);
  }

  try {
    const session = await getSession();
    if (!session.accessToken) return sessionExpiredResponse();

    const results = await searchInstruments(query.trim(), session.accessToken);
    return Response.json(results);
  } catch (error) {
    if (error instanceof KiteSessionExpiredError) return sessionExpiredResponse();
    return errorResponse("Failed to search instruments");
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add app/api/ lib/instruments.ts
git commit -m "feat: add all api proxy routes with input validation"
```

---

## Task 5: TanStack Query Provider & Hooks

**Files:**
- Create: `components/providers/QueryProvider.tsx`
- Create: `hooks/use-holdings.ts`
- Create: `hooks/use-positions.ts`
- Create: `hooks/use-margins.ts`
- Create: `hooks/use-orders.ts`
- Create: `hooks/use-trades.ts`
- Create: `hooks/use-ltp.ts`
- Create: `hooks/use-ohlc.ts`
- Create: `hooks/use-market-status.ts`
- Create: `hooks/use-watchlist.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create QueryProvider with global error handler**

Create `components/providers/QueryProvider.tsx`:

```tsx
"use client";

import { QueryClient, QueryClientProvider, QueryCache } from "@tanstack/react-query";
import { useState, createContext, useContext, useCallback } from "react";

interface AuthContextType {
  isSessionExpired: boolean;
  setSessionExpired: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  isSessionExpired: false,
  setSessionExpired: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [isSessionExpired, setSessionExpired] = useState(false);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            // Check for session expired responses
            if (error instanceof Error && error.message === "session_expired") {
              setSessionExpired(true);
            }
          },
        }),
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              // Don't retry on session expiry
              if (error instanceof Error && error.message === "session_expired") {
                return false;
              }
              return failureCount < 3;
            },
            staleTime: 10_000,
          },
        },
      })
  );

  return (
    <AuthContext.Provider value={{ isSessionExpired, setSessionExpired }}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}
```

- [ ] **Step 2: Create a shared fetch helper for all hooks**

Create `hooks/use-api.ts`:

```ts
export async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url);

  if (res.status === 401) {
    const body = await res.json();
    if (body?.error === "session_expired") {
      throw new Error("session_expired");
    }
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
```

- [ ] **Step 3: Create data hooks**

Create `hooks/use-holdings.ts`:

```ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./use-api";
import { KiteHolding } from "@/lib/types";
import { getPollingInterval } from "@/lib/market-hours";

export function useHoldings() {
  return useQuery<KiteHolding[]>({
    queryKey: ["holdings"],
    queryFn: () => apiFetch<KiteHolding[]>("/api/holdings"),
    refetchInterval: () => getPollingInterval(30_000),
  });
}
```

Create `hooks/use-positions.ts`:

```ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./use-api";
import { KitePosition } from "@/lib/types";
import { getPollingInterval } from "@/lib/market-hours";

export function usePositions() {
  return useQuery<{ net: KitePosition[]; day: KitePosition[] }>({
    queryKey: ["positions"],
    queryFn: () => apiFetch("/api/positions"),
    refetchInterval: () => getPollingInterval(30_000),
  });
}
```

Create `hooks/use-margins.ts`:

```ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./use-api";
import { KiteMargins } from "@/lib/types";
import { getPollingInterval } from "@/lib/market-hours";

export function useMargins() {
  return useQuery<KiteMargins>({
    queryKey: ["margins"],
    queryFn: () => apiFetch<KiteMargins>("/api/margins"),
    refetchInterval: () => getPollingInterval(30_000),
  });
}
```

Create `hooks/use-orders.ts`:

```ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./use-api";
import { KiteOrder } from "@/lib/types";
import { getPollingInterval } from "@/lib/market-hours";

export function useOrders() {
  return useQuery<KiteOrder[]>({
    queryKey: ["orders"],
    queryFn: () => apiFetch<KiteOrder[]>("/api/orders"),
    refetchInterval: () => getPollingInterval(30_000),
  });
}
```

Create `hooks/use-trades.ts`:

```ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./use-api";
import { KiteTrade } from "@/lib/types";
import { getPollingInterval } from "@/lib/market-hours";

export function useTrades() {
  return useQuery<KiteTrade[]>({
    queryKey: ["trades"],
    queryFn: () => apiFetch<KiteTrade[]>("/api/trades"),
    refetchInterval: () => getPollingInterval(30_000),
  });
}
```

Create `hooks/use-ltp.ts`:

```ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./use-api";
import { getWatchlistPollingInterval } from "@/lib/market-hours";

type LTPData = Record<string, { instrument_token: number; last_price: number }>;

export function useLTP(instruments: string[]) {
  const params = instruments.map((i) => `i=${encodeURIComponent(i)}`).join("&");
  // Spread before sort to avoid mutating the caller's array
  const sortedKey = [...instruments].sort();

  return useQuery<LTPData>({
    queryKey: ["ltp", ...sortedKey],
    queryFn: () => apiFetch<LTPData>(`/api/ltp?${params}`),
    enabled: instruments.length > 0,
    refetchInterval: () => getWatchlistPollingInterval(instruments.length),
  });
}
```

Create `hooks/use-ohlc.ts`:

```ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./use-api";

type OHLCData = Record<
  string,
  {
    instrument_token: number;
    last_price: number;
    ohlc: { open: number; high: number; low: number; close: number };
  }
>;

export function useOHLC(instruments: string[]) {
  const params = instruments.map((i) => `i=${encodeURIComponent(i)}`).join("&");
  const sortedKey = [...instruments].sort();

  return useQuery<OHLCData>({
    queryKey: ["ohlc", ...sortedKey],
    queryFn: () => apiFetch<OHLCData>(`/api/ohlc?${params}`),
    enabled: instruments.length > 0,
    staleTime: 60_000, // OHLC doesn't change as fast — 1 min stale time
  });
}
```

Create `hooks/use-market-status.ts`:

```ts
import { useState, useEffect } from "react";
import { getMarketStatus } from "@/lib/market-hours";

export function useMarketStatus() {
  const [status, setStatus] = useState(getMarketStatus);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getMarketStatus());
    }, 60_000); // Re-check every minute

    return () => clearInterval(interval);
  }, []);

  return status;
}
```

Create `hooks/use-watchlist.ts`:

```ts
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
  // Lazy initializer — runs synchronously before first render, no race condition
  const [instruments, setInstruments] = useState<string[]>(loadFromStorage);
  const hasInitialized = useRef(false);

  // Persist to localStorage on change — but skip the first render
  // to avoid overwriting saved data with the initial state
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
      if (prev.length >= 50) return prev; // Cap at 50
      return [...prev, instrument];
    });
  }, []);

  const removeInstrument = useCallback((instrument: string) => {
    setInstruments((prev) => prev.filter((i) => i !== instrument));
  }, []);

  return { instruments, addInstrument, removeInstrument };
}
```

- [ ] **Step 4: Wire QueryProvider into root layout**

Update `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "ZT — Zerodha Terminal",
  description: "Personal trading dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-text-primary antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add components/providers/ hooks/ app/layout.tsx
git commit -m "feat: add tanstack query provider and all data hooks"
```

---

## Task 6: App Shell — Layout, Icon Rail, Top Bar

**Files:**
- Create: `components/layout/IconRail.tsx`
- Create: `components/layout/TopBar.tsx`
- Create: `components/layout/AppShell.tsx`
- Create: `components/shared/SessionExpired.tsx`
- Create: `components/shared/MarketStatus.tsx`
- Create: `app/(dashboard)/layout.tsx`
- Create: `app/(dashboard)/portfolio/page.tsx` (placeholder)
- Create: `app/(dashboard)/watchlist/page.tsx` (placeholder)
- Create: `app/(dashboard)/orders/page.tsx` (placeholder)
- Create: `app/(dashboard)/analytics/page.tsx` (placeholder)
- Modify: `app/page.tsx`

- [ ] **Step 1: Create MarketStatus badge**

Create `components/shared/MarketStatus.tsx`:

```tsx
"use client";

import { useMarketStatus } from "@/hooks/use-market-status";

export default function MarketStatus() {
  const status = useMarketStatus();

  if (status === "open") return null;

  return (
    <span
      className={`text-[10px] font-medium px-2 py-0.5 rounded ${
        status === "pre-open"
          ? "bg-accent/10 text-accent"
          : "bg-text-dim/10 text-text-dim"
      }`}
    >
      {status === "pre-open" ? "PRE-OPEN" : "MARKET CLOSED"}
    </span>
  );
}
```

- [ ] **Step 2: Create SessionExpired overlay**

Create `components/shared/SessionExpired.tsx`:

```tsx
"use client";

export default function SessionExpired() {
  return (
    <div className="fixed inset-0 z-50 bg-bg-primary/95 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-accent text-3xl font-bold tracking-widest">ZT</h1>
        <p className="text-text-secondary text-sm">Session expired</p>
        <a
          href="/api/auth/login"
          className="bg-accent text-black font-bold text-sm px-8 py-3 rounded hover:brightness-110 transition-all tracking-wide"
        >
          LOG IN AGAIN
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create IconRail**

Create `components/layout/IconRail.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "P", href: "/portfolio", title: "Portfolio" },
  { label: "W", href: "/watchlist", title: "Watchlist" },
  { label: "O", href: "/orders", title: "Orders" },
  { label: "A", href: "/analytics", title: "Analytics" },
];

export default function IconRail() {
  const pathname = usePathname();

  return (
    <nav className="w-10 bg-[#0d0d0d] border-r border-border flex flex-col items-center py-3 gap-1 shrink-0">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.title}
            className={`w-7 h-7 rounded flex items-center justify-center text-[11px] font-bold transition-colors ${
              isActive
                ? "bg-accent text-black"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {item.label}
          </Link>
        );
      })}

      <div className="flex-1" />

      {/* AI — disabled in MVP */}
      <div
        title="AI Co-pilot (coming soon)"
        className="w-7 h-7 rounded border border-border flex items-center justify-center text-[8px] font-bold text-accent/40 cursor-not-allowed"
      >
        AI
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Create TopBar with market indices**

Create `components/layout/TopBar.tsx`:

```tsx
"use client";

import { useLTP } from "@/hooks/use-ltp";
import { formatCurrencyDecimal, formatPercent, pnlColor } from "@/lib/format";
import MarketStatus from "@/components/shared/MarketStatus";

const INDICES = ["NSE:NIFTY 50", "NSE:NIFTY BANK"];

function IndexTicker({
  label,
  data,
}: {
  label: string;
  data?: { last_price: number };
}) {
  if (!data) {
    return (
      <span className="text-text-dim text-[10px]">
        {label} <span className="animate-pulse">---</span>
      </span>
    );
  }

  return (
    <span className="text-text-secondary text-[10px]">
      {label}{" "}
      <span className="text-text-primary">
        {formatCurrencyDecimal(data.last_price)}
      </span>
    </span>
  );
}

function CurrentTime() {
  return (
    <span className="text-text-dim text-[10px]" suppressHydrationWarning>
      {new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      })}{" "}
      IST
    </span>
  );
}

export default function TopBar({ userInitials }: { userInitials?: string }) {
  const { data: ltpData } = useLTP(INDICES);

  return (
    <header className="h-9 bg-[#111111] border-b border-border flex items-center px-3 gap-3 shrink-0">
      <span className="text-accent font-bold text-sm tracking-widest">ZT</span>
      <div className="w-px h-4 bg-border" />

      <div className="flex gap-4 flex-1">
        <IndexTicker label="NIFTY" data={ltpData?.["NSE:NIFTY 50"]} />
        <IndexTicker label="BANKNIFTY" data={ltpData?.["NSE:NIFTY BANK"]} />
        <MarketStatus />
      </div>

      <CurrentTime />

      {userInitials && (
        <div className="w-6 h-6 rounded-full bg-[#1a1a1a] border border-border flex items-center justify-center text-text-secondary text-[9px]">
          {userInitials}
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 5: Create AppShell that combines TopBar + IconRail + SessionExpired**

Create `components/layout/AppShell.tsx`:

```tsx
"use client";

import TopBar from "./TopBar";
import IconRail from "./IconRail";
import SessionExpired from "@/components/shared/SessionExpired";
import { useAuth } from "@/components/providers/QueryProvider";

export default function AppShell({
  children,
  userInitials,
}: {
  children: React.ReactNode;
  userInitials?: string;
}) {
  const { isSessionExpired } = useAuth();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar userInitials={userInitials} />
      <div className="flex flex-1 overflow-hidden">
        <IconRail />
        <main className="flex-1 overflow-y-auto p-2">{children}</main>
      </div>
      {isSessionExpired && <SessionExpired />}
    </div>
  );
}
```

- [ ] **Step 6: Create dashboard route group layout**

Create `app/(dashboard)/layout.tsx`:

```tsx
import AppShell from "@/components/layout/AppShell";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.accessToken) {
    redirect("/login");
  }

  const initials = session.userShortname
    ? session.userShortname.slice(0, 2).toUpperCase()
    : "ZT";

  return <AppShell userInitials={initials}>{children}</AppShell>;
}
```

- [ ] **Step 7: Create placeholder pages for all 4 screens**

Create `app/(dashboard)/portfolio/page.tsx`:

```tsx
export default function PortfolioPage() {
  return (
    <div className="text-text-muted text-sm">Portfolio — building...</div>
  );
}
```

Create `app/(dashboard)/watchlist/page.tsx`:

```tsx
export default function WatchlistPage() {
  return (
    <div className="text-text-muted text-sm">Watchlist — building...</div>
  );
}
```

Create `app/(dashboard)/orders/page.tsx`:

```tsx
export default function OrdersPage() {
  return (
    <div className="text-text-muted text-sm">Orders — building...</div>
  );
}
```

Create `app/(dashboard)/analytics/page.tsx`:

```tsx
export default function AnalyticsPage() {
  return (
    <div className="text-text-muted text-sm">Analytics — building...</div>
  );
}
```

- [ ] **Step 8: Update root page to redirect to portfolio**

Update `app/page.tsx`:

```tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/portfolio");
}
```

- [ ] **Step 9: Verify shell renders**

```bash
npm run dev
```

Expected: Login page appears (since no session). After login, black terminal layout with orange ZT logo, icon rail on left, market indices in top bar, "Portfolio — building..." in content area.

- [ ] **Step 10: Commit**

```bash
git add components/ app/
git commit -m "feat: add app shell with icon rail, top bar, and session expiry overlay"
```

---

## Task 7: Shared UI Components

**Files:**
- Create: `components/shared/Skeleton.tsx`
- Create: `components/shared/ErrorBanner.tsx`
- Create: `components/shared/SectionHeader.tsx`
- Create: `components/shared/StatCard.tsx`

- [ ] **Step 1: Create Skeleton component**

Create `components/shared/Skeleton.tsx`:

```tsx
// Deterministic widths to avoid server/client hydration mismatch
const SKELETON_WIDTHS = [64, 48, 72, 56, 60, 44, 68, 52];

export function SkeletonRow({ cols = 6 }: { cols?: number }) {
  return (
    <div className="flex gap-4 px-3 py-2">
      {Array.from({ length: cols }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-border rounded animate-pulse"
          style={{ width: `${SKELETON_WIDTHS[i % SKELETON_WIDTHS.length]}px` }}
        />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} cols={cols} />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-bg-surface border border-border p-3 flex flex-col gap-2">
      <div className="h-2 w-16 bg-border rounded animate-pulse" />
      <div className="h-5 w-24 bg-border rounded animate-pulse" />
    </div>
  );
}

export function SkeletonStrip({ cards = 5 }: { cards?: number }) {
  return (
    <div className="flex gap-px">
      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create ErrorBanner**

Create `components/shared/ErrorBanner.tsx`:

```tsx
"use client";

export default function ErrorBanner({
  message = "Failed to fetch data. Retrying...",
}: {
  message?: string;
}) {
  return (
    <div className="bg-accent/10 border border-accent/20 text-accent text-[11px] px-3 py-2 rounded flex items-center gap-2">
      <span className="font-bold">!</span>
      <span>{message}</span>
    </div>
  );
}
```

- [ ] **Step 3: Create SectionHeader**

Create `components/shared/SectionHeader.tsx`:

```tsx
export default function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="px-3 py-2 border-b border-border flex items-center justify-between">
      <span className="text-accent text-[11px] font-bold tracking-wider">
        {title}
      </span>
      {subtitle && (
        <span className="text-text-dim text-[10px]">{subtitle}</span>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create StatCard**

Create `components/shared/StatCard.tsx`:

```tsx
import { pnlColor } from "@/lib/format";

export default function StatCard({
  label,
  value,
  colorByValue = false,
  subValue,
}: {
  label: string;
  value: string;
  colorByValue?: boolean;
  subValue?: { text: string; value: number };
}) {
  return (
    <div className="flex-1 bg-bg-surface border border-border p-2.5">
      <div className="text-text-muted text-[10px] uppercase tracking-wider">
        {label}
      </div>
      <div
        className={`text-[15px] font-medium mt-0.5 ${
          colorByValue && subValue ? pnlColor(subValue.value) : "text-text-primary"
        }`}
      >
        {value}
        {subValue && (
          <span className={`text-[10px] ml-1.5 ${pnlColor(subValue.value)}`}>
            {subValue.text}
          </span>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add components/shared/
git commit -m "feat: add skeleton, error banner, stat card, section header components"
```

---

## Task 8: Portfolio Screen

**Files:**
- Create: `components/portfolio/SummaryStrip.tsx`
- Create: `components/portfolio/HoldingsTable.tsx`
- Create: `components/portfolio/PositionsTable.tsx`
- Modify: `app/(dashboard)/portfolio/page.tsx`

- [ ] **Step 1: Create SummaryStrip**

Create `components/portfolio/SummaryStrip.tsx`:

```tsx
"use client";

import { KiteHolding, KiteMargins } from "@/lib/types";
import { formatCurrency, formatPnl, formatPercent } from "@/lib/format";
import StatCard from "@/components/shared/StatCard";
import { SkeletonStrip } from "@/components/shared/Skeleton";

interface SummaryStripProps {
  holdings?: KiteHolding[];
  margins?: KiteMargins;
  isLoading: boolean;
}

export default function SummaryStrip({
  holdings,
  margins,
  isLoading,
}: SummaryStripProps) {
  if (isLoading || !holdings) return <SkeletonStrip />;

  const invested = holdings.reduce(
    (sum, h) => sum + h.average_price * h.quantity,
    0
  );
  const current = holdings.reduce(
    (sum, h) => sum + h.last_price * h.quantity,
    0
  );
  const totalPnl = holdings.reduce((sum, h) => sum + h.pnl, 0);
  const totalPnlPct = invested > 0 ? (totalPnl / invested) * 100 : 0;
  const dayPnl = holdings.reduce(
    (sum, h) => sum + h.day_change * h.quantity,
    0
  );
  const dayPnlPct = current > 0 ? (dayPnl / (current - dayPnl)) * 100 : 0;
  const cash = margins?.equity?.net ?? 0;

  return (
    <div className="flex gap-px">
      <StatCard label="Invested" value={formatCurrency(invested)} />
      <StatCard label="Current" value={formatCurrency(current)} />
      <StatCard
        label="Total P&L"
        value={formatPnl(totalPnl)}
        colorByValue
        subValue={{ text: formatPercent(totalPnlPct), value: totalPnl }}
      />
      <StatCard
        label="Day P&L"
        value={formatPnl(dayPnl)}
        colorByValue
        subValue={{ text: formatPercent(dayPnlPct), value: dayPnl }}
      />
      <StatCard label="Available" value={formatCurrency(cash)} />
    </div>
  );
}
```

- [ ] **Step 2: Create HoldingsTable**

Create `components/portfolio/HoldingsTable.tsx`:

```tsx
"use client";

import { KiteHolding } from "@/lib/types";
import { formatCurrency, formatCurrencyDecimal, formatPnl, formatPercent, pnlColor } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";
import { SkeletonTable } from "@/components/shared/Skeleton";

interface HoldingsTableProps {
  holdings?: KiteHolding[];
  isLoading: boolean;
}

export default function HoldingsTable({ holdings, isLoading }: HoldingsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-bg-surface-alt border border-border">
        <SectionHeader title="HOLDINGS" />
        <SkeletonTable rows={5} cols={6} />
      </div>
    );
  }

  if (!holdings || holdings.length === 0) {
    return (
      <div className="bg-bg-surface-alt border border-border">
        <SectionHeader title="HOLDINGS" subtitle="0 instruments" />
        <div className="text-text-dim text-[11px] px-3 py-8 text-center">
          No holdings found
        </div>
      </div>
    );
  }

  // Sort by P&L descending
  const sorted = [...holdings].sort((a, b) => b.pnl - a.pnl);

  return (
    <div className="bg-bg-surface-alt border border-border">
      <SectionHeader
        title="HOLDINGS"
        subtitle={`${holdings.length} instruments`}
      />

      {/* Column headers */}
      <div className="grid grid-cols-[1.5fr_0.5fr_1fr_1fr_1fr_1fr] px-3 py-1.5 text-text-dim text-[10px] uppercase tracking-wider border-b border-[#161616]">
        <span>Symbol</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Avg</span>
        <span className="text-right">LTP</span>
        <span className="text-right">P&L</span>
        <span className="text-right">Chg%</span>
      </div>

      {/* Rows */}
      {sorted.map((h) => {
        const changePct =
          h.average_price > 0
            ? ((h.last_price - h.average_price) / h.average_price) * 100
            : 0;
        const isLoss = h.pnl < 0;

        return (
          <div
            key={h.tradingsymbol + h.exchange}
            className={`grid grid-cols-[1.5fr_0.5fr_1fr_1fr_1fr_1fr] px-3 py-1.5 text-[11px] border-b border-[#111] items-center ${
              isLoss ? "bg-loss-row" : ""
            }`}
          >
            <span className="text-text-primary font-medium">
              {h.tradingsymbol}
            </span>
            <span className="text-right text-text-secondary">{h.quantity}</span>
            <span className="text-right text-text-primary">
              {formatCurrencyDecimal(h.average_price)}
            </span>
            <span className="text-right text-text-primary">
              {formatCurrencyDecimal(h.last_price)}
            </span>
            <span className={`text-right ${pnlColor(h.pnl)}`}>
              {formatPnl(h.pnl)}
            </span>
            <span className={`text-right ${pnlColor(changePct)}`}>
              {formatPercent(changePct)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Create PositionsTable**

Create `components/portfolio/PositionsTable.tsx`:

```tsx
"use client";

import { KitePosition } from "@/lib/types";
import { formatCurrencyDecimal, formatPnl, pnlColor } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";

interface PositionsTableProps {
  positions?: KitePosition[];
}

export default function PositionsTable({ positions }: PositionsTableProps) {
  // Hidden entirely when empty
  if (!positions || positions.length === 0) return null;

  return (
    <div className="bg-bg-surface-alt border border-border">
      <SectionHeader
        title="POSITIONS"
        subtitle={`${positions.length} active`}
      />

      <div className="grid grid-cols-[1.5fr_0.8fr_0.5fr_1fr_1fr_1fr] px-3 py-1.5 text-text-dim text-[10px] uppercase tracking-wider border-b border-[#161616]">
        <span>Symbol</span>
        <span>Product</span>
        <span className="text-right">Qty</span>
        <span className="text-right">LTP</span>
        <span className="text-right">P&L</span>
        <span className="text-right">M2M</span>
      </div>

      {positions.map((p) => (
        <div
          key={p.tradingsymbol + p.exchange + p.product}
          className={`grid grid-cols-[1.5fr_0.8fr_0.5fr_1fr_1fr_1fr] px-3 py-1.5 text-[11px] border-b border-[#111] items-center ${
            p.pnl < 0 ? "bg-loss-row" : ""
          }`}
        >
          <span className="text-text-primary font-medium">
            {p.tradingsymbol}
          </span>
          <span className="text-text-dim text-[10px]">{p.product}</span>
          <span className="text-right text-text-secondary">{p.quantity}</span>
          <span className="text-right text-text-primary">
            {formatCurrencyDecimal(p.last_price)}
          </span>
          <span className={`text-right ${pnlColor(p.pnl)}`}>
            {formatPnl(p.pnl)}
          </span>
          <span className={`text-right ${pnlColor(p.m2m)}`}>
            {formatPnl(p.m2m)}
          </span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Wire up Portfolio page**

Replace `app/(dashboard)/portfolio/page.tsx`:

```tsx
"use client";

import { useHoldings } from "@/hooks/use-holdings";
import { usePositions } from "@/hooks/use-positions";
import { useMargins } from "@/hooks/use-margins";
import SummaryStrip from "@/components/portfolio/SummaryStrip";
import HoldingsTable from "@/components/portfolio/HoldingsTable";
import PositionsTable from "@/components/portfolio/PositionsTable";
import ErrorBanner from "@/components/shared/ErrorBanner";

export default function PortfolioPage() {
  const holdings = useHoldings();
  const positions = usePositions();
  const margins = useMargins();

  const hasError = holdings.isError || positions.isError || margins.isError;

  return (
    <div className="flex flex-col gap-1.5">
      {hasError && <ErrorBanner />}

      <SummaryStrip
        holdings={holdings.data}
        margins={margins.data}
        isLoading={holdings.isLoading || margins.isLoading}
      />

      <HoldingsTable
        holdings={holdings.data}
        isLoading={holdings.isLoading}
      />

      <PositionsTable positions={positions.data?.net} />
    </div>
  );
}
```

- [ ] **Step 5: Verify with real data**

```bash
npm run dev
```

Login via Kite OAuth, then navigate to Portfolio. Expected: Summary strip shows your real invested/current/P&L values. Holdings table shows all 7 stocks sorted by P&L. BEL at top (best performer), TMPV at bottom (worst).

- [ ] **Step 6: Commit**

```bash
git add components/portfolio/ app/\(dashboard\)/portfolio/
git commit -m "feat: add portfolio screen with summary strip, holdings, and positions"
```

---

## Task 9: Watchlist Screen

**Files:**
- Create: `components/watchlist/InstrumentSearch.tsx`
- Create: `components/watchlist/WatchlistTable.tsx`
- Modify: `app/(dashboard)/watchlist/page.tsx`

- [ ] **Step 1: Create InstrumentSearch with typeahead**

Create `components/watchlist/InstrumentSearch.tsx`:

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/hooks/use-api";
import { KiteInstrument } from "@/lib/types";

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

  // Close dropdown on click outside
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
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search instruments..."
        className="w-full bg-bg-surface border border-border text-text-primary text-[11px] px-3 py-2 rounded outline-none focus:border-accent/50 placeholder:text-text-dim"
      />

      {isOpen && debouncedQuery.length >= 2 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-bg-surface border border-border rounded shadow-lg max-h-60 overflow-y-auto z-10"
        >
          {isLoading && (
            <div className="text-text-dim text-[10px] px-3 py-2 animate-pulse">
              Searching...
            </div>
          )}

          {filteredResults?.map((inst) => (
            <button
              key={inst.instrument_token}
              onClick={() => handleSelect(inst)}
              className="w-full text-left px-3 py-2 text-[11px] hover:bg-border/50 flex items-center justify-between"
            >
              <div>
                <span className="text-text-primary font-medium">
                  {inst.tradingsymbol}
                </span>
                <span className="text-text-dim ml-2">{inst.name}</span>
              </div>
              <span className="text-text-dim text-[9px]">{inst.exchange}</span>
            </button>
          ))}

          {filteredResults?.length === 0 && !isLoading && (
            <div className="text-text-dim text-[10px] px-3 py-2">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Simple debounce hook
function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
```

- [ ] **Step 2: Create WatchlistTable**

Create `components/watchlist/WatchlistTable.tsx`:

```tsx
"use client";

import { useLTP } from "@/hooks/use-ltp";
import { useOHLC } from "@/hooks/use-ohlc";
import { formatCurrencyDecimal, formatPnl, formatPercent, pnlColor } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";
import { SkeletonTable } from "@/components/shared/Skeleton";

interface WatchlistTableProps {
  instruments: string[];
  onRemove: (instrument: string) => void;
}

export default function WatchlistTable({
  instruments,
  onRemove,
}: WatchlistTableProps) {
  const { data: ltpData, isLoading: ltpLoading } = useLTP(instruments);
  const { data: ohlcData } = useOHLC(instruments);

  if (instruments.length === 0) {
    return (
      <div className="bg-bg-surface-alt border border-border">
        <SectionHeader title="WATCHLIST" subtitle="0 instruments" />
        <div className="text-text-dim text-[11px] px-3 py-12 text-center">
          Add instruments to your watchlist using the search bar above
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface-alt border border-border">
      <SectionHeader
        title="WATCHLIST"
        subtitle={`${instruments.length} instruments`}
      />

      <div className="grid grid-cols-[1.5fr_0.6fr_1fr_1fr_1fr] px-3 py-1.5 text-text-dim text-[10px] uppercase tracking-wider border-b border-[#161616]">
        <span>Symbol</span>
        <span>Exchange</span>
        <span className="text-right">LTP</span>
        <span className="text-right">Change</span>
        <span className="text-right">Chg%</span>
      </div>

      {ltpLoading ? (
        <SkeletonTable rows={instruments.length} cols={5} />
      ) : (
        instruments.map((inst) => {
          const ltp = ltpData?.[inst];
          const ohlc = ohlcData?.[inst];
          const lastPrice = ltp?.last_price ?? 0;
          const closePrice = ohlc?.ohlc?.close ?? 0;
          const change = closePrice > 0 ? lastPrice - closePrice : 0;
          const changePct =
            closePrice > 0 ? (change / closePrice) * 100 : 0;

          const [exchange, symbol] = inst.split(":");

          return (
            <div
              key={inst}
              className="grid grid-cols-[1.5fr_0.6fr_1fr_1fr_1fr] px-3 py-1.5 text-[11px] border-b border-[#111] items-center group"
            >
              <span className="text-text-primary font-medium flex items-center gap-2">
                {symbol}
                <button
                  onClick={() => onRemove(inst)}
                  className="opacity-0 group-hover:opacity-100 text-text-dim hover:text-loss text-[10px] transition-opacity"
                  title="Remove"
                >
                  x
                </button>
              </span>
              <span className="text-text-dim text-[9px]">{exchange}</span>
              <span className="text-right text-text-primary">
                {lastPrice > 0
                  ? formatCurrencyDecimal(lastPrice)
                  : "---"}
              </span>
              <span className={`text-right ${pnlColor(change)}`}>
                {closePrice > 0 ? formatPnl(change) : "---"}
              </span>
              <span className={`text-right ${pnlColor(changePct)}`}>
                {closePrice > 0 ? formatPercent(changePct) : "---"}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
```

- [ ] **Step 3: Wire up Watchlist page**

Replace `app/(dashboard)/watchlist/page.tsx`:

```tsx
"use client";

import { useWatchlist } from "@/hooks/use-watchlist";
import InstrumentSearch from "@/components/watchlist/InstrumentSearch";
import WatchlistTable from "@/components/watchlist/WatchlistTable";

export default function WatchlistPage() {
  const { instruments, addInstrument, removeInstrument } = useWatchlist();

  return (
    <div className="flex flex-col gap-1.5">
      <InstrumentSearch
        onAdd={addInstrument}
        existingInstruments={instruments}
      />
      <WatchlistTable instruments={instruments} onRemove={removeInstrument} />
    </div>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```

Navigate to Watchlist (W icon). Expected: Empty state with "Add instruments" message. Type "RELI" in search → dropdown shows RELIANCE. Click to add → row appears with LTP. Click "x" → removed. Refresh page → watchlist persisted.

- [ ] **Step 5: Commit**

```bash
git add components/watchlist/ app/\(dashboard\)/watchlist/
git commit -m "feat: add watchlist screen with instrument search and ltp polling"
```

---

## Task 10: Orders Screen

**Files:**
- Create: `components/orders/OrdersTable.tsx`
- Create: `components/orders/TradesTable.tsx`
- Modify: `app/(dashboard)/orders/page.tsx`

- [ ] **Step 1: Create OrdersTable**

Create `components/orders/OrdersTable.tsx`:

```tsx
"use client";

import { KiteOrder } from "@/lib/types";
import { formatCurrencyDecimal, formatTime } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";
import { SkeletonTable } from "@/components/shared/Skeleton";

const STATUS_COLORS: Record<string, string> = {
  COMPLETE: "text-profit",
  REJECTED: "text-loss",
  CANCELLED: "text-text-dim",
  OPEN: "text-accent",
  "TRIGGER PENDING": "text-accent",
};

interface OrdersTableProps {
  orders?: KiteOrder[];
  isLoading: boolean;
}

export default function OrdersTable({ orders, isLoading }: OrdersTableProps) {
  if (isLoading) {
    return (
      <div className="bg-bg-surface-alt border border-border">
        <SectionHeader title="ORDERS" />
        <SkeletonTable rows={3} cols={6} />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-bg-surface-alt border border-border">
        <SectionHeader title="ORDERS" subtitle="0 today" />
        <div className="text-text-dim text-[11px] px-3 py-8 text-center">
          No orders today
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface-alt border border-border">
      <SectionHeader title="ORDERS" subtitle={`${orders.length} today`} />

      <div className="grid grid-cols-[0.8fr_1.2fr_0.6fr_0.5fr_1fr_0.8fr] px-3 py-1.5 text-text-dim text-[10px] uppercase tracking-wider border-b border-[#161616]">
        <span>Time</span>
        <span>Symbol</span>
        <span>Type</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Price</span>
        <span className="text-right">Status</span>
      </div>

      {orders.map((o) => (
        <div
          key={o.order_id}
          className="grid grid-cols-[0.8fr_1.2fr_0.6fr_0.5fr_1fr_0.8fr] px-3 py-1.5 text-[11px] border-b border-[#111] items-center"
        >
          <span className="text-text-secondary">
            {formatTime(o.order_timestamp)}
          </span>
          <span className="text-text-primary font-medium">
            {o.tradingsymbol}
          </span>
          <span
            className={
              o.transaction_type === "BUY" ? "text-profit" : "text-loss"
            }
          >
            {o.transaction_type}
          </span>
          <span className="text-right text-text-secondary">{o.quantity}</span>
          <span className="text-right text-text-primary">
            {formatCurrencyDecimal(o.average_price || o.price)}
          </span>
          <span
            className={`text-right ${STATUS_COLORS[o.status] || "text-text-secondary"}`}
          >
            {o.status}
          </span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create TradesTable**

Create `components/orders/TradesTable.tsx`:

```tsx
"use client";

import { KiteTrade } from "@/lib/types";
import { formatCurrencyDecimal, formatTime } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";
import { SkeletonTable } from "@/components/shared/Skeleton";

interface TradesTableProps {
  trades?: KiteTrade[];
  isLoading: boolean;
}

export default function TradesTable({ trades, isLoading }: TradesTableProps) {
  if (isLoading) {
    return (
      <div className="bg-bg-surface-alt border border-border">
        <SectionHeader title="TRADES" />
        <SkeletonTable rows={3} cols={6} />
      </div>
    );
  }

  if (!trades || trades.length === 0) {
    return (
      <div className="bg-bg-surface-alt border border-border">
        <SectionHeader title="TRADES" subtitle="0 today" />
        <div className="text-text-dim text-[11px] px-3 py-8 text-center">
          No trades today
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface-alt border border-border">
      <SectionHeader title="TRADES" subtitle={`${trades.length} today`} />

      <div className="grid grid-cols-[0.8fr_1.2fr_0.6fr_0.5fr_1fr_1fr] px-3 py-1.5 text-text-dim text-[10px] uppercase tracking-wider border-b border-[#161616]">
        <span>Time</span>
        <span>Symbol</span>
        <span>Type</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Price</span>
        <span className="text-right">Order ID</span>
      </div>

      {trades.map((t) => (
        <div
          key={t.trade_id}
          className="grid grid-cols-[0.8fr_1.2fr_0.6fr_0.5fr_1fr_1fr] px-3 py-1.5 text-[11px] border-b border-[#111] items-center"
        >
          <span className="text-text-secondary">
            {formatTime(t.fill_timestamp)}
          </span>
          <span className="text-text-primary font-medium">
            {t.tradingsymbol}
          </span>
          <span
            className={
              t.transaction_type === "BUY" ? "text-profit" : "text-loss"
            }
          >
            {t.transaction_type}
          </span>
          <span className="text-right text-text-secondary">{t.quantity}</span>
          <span className="text-right text-text-primary">
            {formatCurrencyDecimal(t.average_price)}
          </span>
          <span className="text-right text-text-dim font-mono text-[10px]">
            {t.order_id.slice(-8)}
          </span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Wire up Orders page with tabs**

Replace `app/(dashboard)/orders/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useOrders } from "@/hooks/use-orders";
import { useTrades } from "@/hooks/use-trades";
import OrdersTable from "@/components/orders/OrdersTable";
import TradesTable from "@/components/orders/TradesTable";
import ErrorBanner from "@/components/shared/ErrorBanner";

type Tab = "orders" | "trades";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const orders = useOrders();
  const trades = useTrades();

  const hasError = orders.isError || trades.isError;

  return (
    <div className="flex flex-col gap-1.5">
      {hasError && <ErrorBanner />}

      {/* Tab bar */}
      <div className="flex gap-px">
        {(["orders", "trades"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
              activeTab === tab
                ? "bg-bg-surface text-accent border border-border"
                : "bg-bg-primary text-text-dim border border-transparent hover:text-text-secondary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "orders" && (
        <OrdersTable orders={orders.data} isLoading={orders.isLoading} />
      )}

      {activeTab === "trades" && (
        <TradesTable trades={trades.data} isLoading={trades.isLoading} />
      )}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/orders/ app/\(dashboard\)/orders/
git commit -m "feat: add orders screen with orders and trades tabs"
```

---

## Task 11: Analytics Screen

**Files:**
- Create: `components/analytics/StockConcentration.tsx`
- Create: `components/analytics/SectorAllocation.tsx`
- Create: `components/analytics/DayHeatmap.tsx`
- Create: `components/analytics/TopGainersLosers.tsx`
- Modify: `app/(dashboard)/analytics/page.tsx`

- [ ] **Step 1: Create StockConcentration**

Create `components/analytics/StockConcentration.tsx`:

```tsx
"use client";

import { KiteHolding } from "@/lib/types";
import { formatPercent } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";

const BAR_COLORS = [
  "bg-accent",
  "bg-profit",
  "bg-[#3388ff]",
  "bg-[#ffaa00]",
  "bg-[#aa44ff]",
  "bg-[#ff6688]",
  "bg-text-secondary",
];

interface StockConcentrationProps {
  holdings: KiteHolding[];
}

export default function StockConcentration({
  holdings,
}: StockConcentrationProps) {
  const totalValue = holdings.reduce(
    (sum, h) => sum + h.last_price * h.quantity,
    0
  );

  const stocks = holdings
    .map((h) => ({
      symbol: h.tradingsymbol,
      value: h.last_price * h.quantity,
      pct: totalValue > 0 ? ((h.last_price * h.quantity) / totalValue) * 100 : 0,
    }))
    .sort((a, b) => b.pct - a.pct);

  return (
    <div className="bg-bg-surface-alt border border-border">
      <SectionHeader title="STOCK CONCENTRATION" />
      <div className="p-3 flex flex-col gap-2">
        {stocks.map((s, i) => (
          <div key={s.symbol} className="flex items-center gap-3">
            <span className="text-text-primary text-[11px] font-medium w-24">
              {s.symbol}
            </span>
            <div className="flex-1 bg-[#111] rounded h-4 overflow-hidden">
              <div
                className={`h-full ${BAR_COLORS[i % BAR_COLORS.length]} rounded`}
                style={{ width: `${s.pct}%` }}
              />
            </div>
            <span className="text-text-secondary text-[10px] w-12 text-right">
              {formatPercent(s.pct).replace("+", "")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create SectorAllocation**

Create `components/analytics/SectorAllocation.tsx`:

```tsx
"use client";

import { KiteHolding } from "@/lib/types";
import sectors from "@/data/sectors.json";
import SectionHeader from "@/components/shared/SectionHeader";

const SECTOR_COLORS: Record<string, string> = {
  Defense: "#ff6e00",
  Auto: "#33cc66",
  Banking: "#3388ff",
  Energy: "#ffaa00",
  Gold: "#aa44ff",
  IT: "#ff6688",
  Pharma: "#00cccc",
  Unmapped: "#555555",
};

function getSectorColor(sector: string): string {
  return SECTOR_COLORS[sector] || SECTOR_COLORS["Unmapped"];
}

interface SectorAllocationProps {
  holdings: KiteHolding[];
}

export default function SectorAllocation({
  holdings,
}: SectorAllocationProps) {
  const sectorMap = sectors as Record<string, string>;

  const totalValue = holdings.reduce(
    (sum, h) => sum + h.last_price * h.quantity,
    0
  );

  // Group by sector
  const sectorValues: Record<string, number> = {};
  holdings.forEach((h) => {
    const sector = sectorMap[h.tradingsymbol] || "Unmapped";
    sectorValues[sector] = (sectorValues[sector] || 0) + h.last_price * h.quantity;
  });

  const sectorData = Object.entries(sectorValues)
    .map(([sector, value]) => ({
      sector,
      value,
      pct: totalValue > 0 ? (value / totalValue) * 100 : 0,
    }))
    .sort((a, b) => b.pct - a.pct);

  // Build conic gradient for donut chart
  let gradientParts: string[] = [];
  let cumulative = 0;
  sectorData.forEach((s) => {
    const start = cumulative;
    cumulative += s.pct;
    gradientParts.push(
      `${getSectorColor(s.sector)} ${start}% ${cumulative}%`
    );
  });
  const gradient = `conic-gradient(${gradientParts.join(", ")})`;

  return (
    <div className="bg-bg-surface-alt border border-border">
      <SectionHeader title="SECTOR ALLOCATION" />
      <div className="p-4 flex items-start gap-6">
        {/* Donut chart */}
        <div className="relative shrink-0">
          <div
            className="w-[100px] h-[100px] rounded-full"
            style={{ background: gradient }}
          >
            <div className="absolute inset-[24px] bg-bg-surface-alt rounded-full flex flex-col items-center justify-center">
              <span className="text-text-dim text-[8px]">STOCKS</span>
              <span className="text-text-primary text-lg font-bold">
                {holdings.length}
              </span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-1.5 flex-1">
          {sectorData.map((s) => (
            <div
              key={s.sector}
              className="flex items-center justify-between text-[10px]"
            >
              <div className="flex items-center gap-2 text-text-secondary">
                <span
                  className="w-2 h-2 rounded-sm inline-block"
                  style={{ background: getSectorColor(s.sector) }}
                />
                {s.sector}
              </div>
              <span className="text-text-primary">
                {s.pct.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create DayHeatmap**

Create `components/analytics/DayHeatmap.tsx`:

```tsx
"use client";

import { KiteHolding } from "@/lib/types";
import SectionHeader from "@/components/shared/SectionHeader";

interface DayHeatmapProps {
  holdings: KiteHolding[];
}

export default function DayHeatmap({ holdings }: DayHeatmapProps) {
  const sorted = [...holdings].sort(
    (a, b) => b.day_change_percentage - a.day_change_percentage
  );

  return (
    <div className="bg-bg-surface-alt border border-border">
      <SectionHeader title="TODAY" />
      <div className="p-2 grid grid-cols-4 gap-1">
        {sorted.map((h) => {
          const pct = h.day_change_percentage;
          const isPositive = pct >= 0;
          const intensity = Math.min(Math.abs(pct) / 5, 1); // Normalize to 0-1 (5% = max)

          const bg = isPositive
            ? `rgba(51, 204, 102, ${0.05 + intensity * 0.2})`
            : `rgba(255, 68, 68, ${0.05 + intensity * 0.2})`;
          const borderColor = isPositive
            ? `rgba(51, 204, 102, ${0.08 + intensity * 0.15})`
            : `rgba(255, 68, 68, ${0.08 + intensity * 0.15})`;

          return (
            <div
              key={h.tradingsymbol}
              className="rounded p-2 text-center"
              style={{
                background: bg,
                border: `1px solid ${borderColor}`,
              }}
            >
              <div className="text-text-primary text-[10px] font-medium">
                {h.tradingsymbol}
              </div>
              <div
                className={`text-[11px] font-bold ${
                  isPositive ? "text-profit" : "text-loss"
                }`}
              >
                {pct >= 0 ? "+" : ""}
                {pct.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create TopGainersLosers**

Create `components/analytics/TopGainersLosers.tsx`:

```tsx
"use client";

import { KiteHolding } from "@/lib/types";
import { formatPnl, formatPercent, pnlColor } from "@/lib/format";
import SectionHeader from "@/components/shared/SectionHeader";

interface TopGainersLosersProps {
  holdings: KiteHolding[];
}

export default function TopGainersLosers({
  holdings,
}: TopGainersLosersProps) {
  const withReturn = holdings.map((h) => ({
    ...h,
    returnPct:
      h.average_price > 0
        ? ((h.last_price - h.average_price) / h.average_price) * 100
        : 0,
  }));

  const gainers = [...withReturn]
    .filter((h) => h.returnPct > 0)
    .sort((a, b) => b.returnPct - a.returnPct);

  const losers = [...withReturn]
    .filter((h) => h.returnPct < 0)
    .sort((a, b) => a.returnPct - b.returnPct);

  return (
    <div className="grid grid-cols-2 gap-1.5">
      {/* Gainers */}
      <div className="bg-bg-surface-alt border border-border">
        <SectionHeader title="TOP GAINERS" subtitle={`${gainers.length}`} />
        <div className="flex flex-col">
          {gainers.map((h, i) => (
            <div
              key={h.tradingsymbol}
              className="flex items-center justify-between px-3 py-1.5 text-[11px] border-b border-[#111]"
            >
              <div className="flex items-center gap-2">
                <span className="text-text-dim text-[10px] w-4">
                  {i + 1}
                </span>
                <span className="text-text-primary font-medium">
                  {h.tradingsymbol}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-profit text-[10px]">
                  {formatPercent(h.returnPct)}
                </span>
                <span className="text-profit">
                  {formatPnl(h.pnl)}
                </span>
              </div>
            </div>
          ))}
          {gainers.length === 0 && (
            <div className="text-text-dim text-[10px] px-3 py-4 text-center">
              No gainers
            </div>
          )}
        </div>
      </div>

      {/* Losers */}
      <div className="bg-bg-surface-alt border border-border">
        <SectionHeader title="TOP LOSERS" subtitle={`${losers.length}`} />
        <div className="flex flex-col">
          {losers.map((h, i) => (
            <div
              key={h.tradingsymbol}
              className="flex items-center justify-between px-3 py-1.5 text-[11px] border-b border-[#111]"
            >
              <div className="flex items-center gap-2">
                <span className="text-text-dim text-[10px] w-4">
                  {i + 1}
                </span>
                <span className="text-text-primary font-medium">
                  {h.tradingsymbol}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-loss text-[10px]">
                  {formatPercent(h.returnPct)}
                </span>
                <span className="text-loss">
                  {formatPnl(h.pnl)}
                </span>
              </div>
            </div>
          ))}
          {losers.length === 0 && (
            <div className="text-text-dim text-[10px] px-3 py-4 text-center">
              No losers
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Wire up Analytics page**

Replace `app/(dashboard)/analytics/page.tsx`:

```tsx
"use client";

import { useHoldings } from "@/hooks/use-holdings";
import StockConcentration from "@/components/analytics/StockConcentration";
import SectorAllocation from "@/components/analytics/SectorAllocation";
import DayHeatmap from "@/components/analytics/DayHeatmap";
import TopGainersLosers from "@/components/analytics/TopGainersLosers";
import ErrorBanner from "@/components/shared/ErrorBanner";
import { SkeletonTable } from "@/components/shared/Skeleton";

export default function AnalyticsPage() {
  const { data: holdings, isLoading, isError } = useHoldings();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1.5">
        <SkeletonTable rows={7} cols={3} />
      </div>
    );
  }

  if (!holdings || holdings.length === 0) {
    return (
      <div className="text-text-dim text-[11px] px-3 py-8 text-center">
        No holdings data for analytics
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {isError && <ErrorBanner />}
      <StockConcentration holdings={holdings} />
      <SectorAllocation holdings={holdings} />
      <DayHeatmap holdings={holdings} />
      <TopGainersLosers holdings={holdings} />
    </div>
  );
}
```

- [ ] **Step 6: Verify analytics with real data**

```bash
npm run dev
```

Navigate to Analytics (A icon). Expected: Stock concentration bars showing BEL/HAL as largest positions. Sector donut with Defense as biggest slice. Day heatmap with green tiles (today was a green day for your portfolio). Gainers showing BEL/TMCV/SBIN, losers showing TMPV/ADANIGREEN/HAL.

- [ ] **Step 7: Commit**

```bash
git add components/analytics/ app/\(dashboard\)/analytics/
git commit -m "feat: add analytics screen with concentration, sectors, heatmap, gainers/losers"
```

---

## Task 12: Automated Tests for Fragile Logic

**Files:**
- Create: `__tests__/lib/market-hours.test.ts`
- Create: `__tests__/lib/format.test.ts`
- Create: `__tests__/lib/instruments.test.ts`
- Create: `__tests__/hooks/use-watchlist.test.ts`

- [ ] **Step 1: Install test dependencies**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 2: Test market hours logic**

Create `__tests__/lib/market-hours.test.ts`:

```ts
import { describe, it, expect, vi, afterEach } from "vitest";

// We test the pure logic by mocking Date
describe("market-hours", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns closed on Saturday", async () => {
    // Saturday 15 April 2026 at 12:00 IST = 06:30 UTC
    vi.setSystemTime(new Date("2025-04-19T06:30:00Z")); // a Saturday
    const { getMarketStatus } = await import("@/lib/market-hours");
    expect(getMarketStatus()).toBe("closed");
  });

  it("returns open during market hours on weekday", async () => {
    // Tuesday at 10:00 IST = 04:30 UTC
    vi.setSystemTime(new Date("2025-04-15T04:30:00Z"));
    const { isMarketOpen } = await import("@/lib/market-hours");
    expect(isMarketOpen()).toBe(true);
  });

  it("returns closed before market opens on weekday", async () => {
    // Tuesday at 08:00 IST = 02:30 UTC
    vi.setSystemTime(new Date("2025-04-15T02:30:00Z"));
    const { isMarketOpen } = await import("@/lib/market-hours");
    expect(isMarketOpen()).toBe(false);
  });

  it("returns closed after market closes on weekday", async () => {
    // Tuesday at 16:00 IST = 10:30 UTC
    vi.setSystemTime(new Date("2025-04-15T10:30:00Z"));
    const { isMarketOpen } = await import("@/lib/market-hours");
    expect(isMarketOpen()).toBe(false);
  });

  it("returns pre-open during 9:00-9:15 window", async () => {
    // Tuesday at 09:10 IST = 03:40 UTC
    vi.setSystemTime(new Date("2025-04-15T03:40:00Z"));
    const { getMarketStatus } = await import("@/lib/market-hours");
    expect(getMarketStatus()).toBe("pre-open");
  });

  it("getWatchlistPollingInterval returns 5000 for small lists during market hours", async () => {
    vi.setSystemTime(new Date("2025-04-15T04:30:00Z")); // market open
    const { getWatchlistPollingInterval } = await import("@/lib/market-hours");
    expect(getWatchlistPollingInterval(10)).toBe(5000);
  });

  it("getWatchlistPollingInterval returns 10000 for larger lists", async () => {
    vi.setSystemTime(new Date("2025-04-15T04:30:00Z"));
    const { getWatchlistPollingInterval } = await import("@/lib/market-hours");
    expect(getWatchlistPollingInterval(30)).toBe(10000);
  });

  it("getWatchlistPollingInterval returns false outside market hours", async () => {
    vi.setSystemTime(new Date("2025-04-15T15:00:00Z")); // 20:30 IST
    const { getWatchlistPollingInterval } = await import("@/lib/market-hours");
    expect(getWatchlistPollingInterval(10)).toBe(false);
  });
});
```

- [ ] **Step 3: Test CSV parser**

Create `__tests__/lib/instruments.test.ts`:

```ts
import { describe, it, expect } from "vitest";

// Import the parser directly — we'll need to export it for testing
// In lib/instruments.ts, add: export { parseCSVLine, parseCSV } at the bottom
describe("parseCSVLine", () => {
  // We test the function inline since it's not exported yet.
  // During implementation, export parseCSVLine for testability.
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

  it("parses simple CSV line", () => {
    expect(parseCSVLine("a,b,c")).toEqual(["a", "b", "c"]);
  });

  it("handles quoted fields with commas", () => {
    expect(parseCSVLine('1,"Tata Motors Ltd., DVR",NSE')).toEqual([
      "1",
      "Tata Motors Ltd., DVR",
      "NSE",
    ]);
  });

  it("handles empty fields", () => {
    expect(parseCSVLine("a,,c")).toEqual(["a", "", "c"]);
  });

  it("handles single field", () => {
    expect(parseCSVLine("hello")).toEqual(["hello"]);
  });

  it("handles quoted field without commas", () => {
    expect(parseCSVLine('"hello",world')).toEqual(["hello", "world"]);
  });
});
```

- [ ] **Step 4: Test formatting**

Create `__tests__/lib/format.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { formatPnl, formatPercent, pnlColor, formatCurrency } from "@/lib/format";

describe("formatPnl", () => {
  it("adds + prefix for positive values", () => {
    expect(formatPnl(1962)).toBe("+1,962");
  });

  it("keeps - prefix for negative values", () => {
    expect(formatPnl(-780)).toMatch(/-780/);
  });

  it("handles zero", () => {
    expect(formatPnl(0)).toBe("+0");
  });
});

describe("pnlColor", () => {
  it("returns profit class for positive", () => {
    expect(pnlColor(100)).toBe("text-profit");
  });

  it("returns loss class for negative", () => {
    expect(pnlColor(-50)).toBe("text-loss");
  });

  it("returns secondary class for zero", () => {
    expect(pnlColor(0)).toBe("text-text-secondary");
  });
});

describe("formatPercent", () => {
  it("formats with sign and percent symbol", () => {
    const result = formatPercent(12.34);
    expect(result).toContain("12.34");
    expect(result).toContain("%");
  });
});
```

- [ ] **Step 5: Test watchlist persistence**

Create `__tests__/hooks/use-watchlist.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("useWatchlist", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("starts with empty array when no saved data", async () => {
    const { useWatchlist } = await import("@/hooks/use-watchlist");
    const { result } = renderHook(() => useWatchlist());
    expect(result.current.instruments).toEqual([]);
  });

  it("loads saved instruments from localStorage", async () => {
    localStorageMock.setItem("zt-watchlist", JSON.stringify(["NSE:SBIN", "NSE:INFY"]));
    // Re-import to pick up the new localStorage state
    const mod = await import("@/hooks/use-watchlist");
    const { result } = renderHook(() => mod.useWatchlist());
    expect(result.current.instruments).toEqual(["NSE:SBIN", "NSE:INFY"]);
  });

  it("does NOT wipe saved data on first mount", async () => {
    localStorageMock.setItem("zt-watchlist", JSON.stringify(["NSE:SBIN"]));
    const mod = await import("@/hooks/use-watchlist");
    const { result } = renderHook(() => mod.useWatchlist());

    // After mount, localStorage should still have the saved data
    expect(JSON.parse(localStorageMock.getItem("zt-watchlist")!)).toEqual(["NSE:SBIN"]);
    expect(result.current.instruments).toEqual(["NSE:SBIN"]);
  });

  it("adds instrument and persists", async () => {
    const mod = await import("@/hooks/use-watchlist");
    const { result } = renderHook(() => mod.useWatchlist());

    act(() => {
      result.current.addInstrument("NSE:RELIANCE");
    });

    expect(result.current.instruments).toContain("NSE:RELIANCE");
  });

  it("does not add duplicates", async () => {
    const mod = await import("@/hooks/use-watchlist");
    const { result } = renderHook(() => mod.useWatchlist());

    act(() => {
      result.current.addInstrument("NSE:SBIN");
      result.current.addInstrument("NSE:SBIN");
    });

    expect(result.current.instruments.filter((i: string) => i === "NSE:SBIN")).toHaveLength(1);
  });

  it("caps at 50 instruments", async () => {
    const mod = await import("@/hooks/use-watchlist");
    const { result } = renderHook(() => mod.useWatchlist());

    act(() => {
      for (let i = 0; i < 55; i++) {
        result.current.addInstrument(`NSE:STOCK${i}`);
      }
    });

    expect(result.current.instruments.length).toBe(50);
  });

  it("removes instrument", async () => {
    const mod = await import("@/hooks/use-watchlist");
    const { result } = renderHook(() => mod.useWatchlist());

    act(() => {
      result.current.addInstrument("NSE:SBIN");
      result.current.addInstrument("NSE:INFY");
    });

    act(() => {
      result.current.removeInstrument("NSE:SBIN");
    });

    expect(result.current.instruments).toEqual(["NSE:INFY"]);
  });
});
```

- [ ] **Step 6: Run tests**

```bash
npm test
```

Expected: All tests pass. If any fail, fix before proceeding.

- [ ] **Step 7: Commit**

```bash
git add __tests__/ vitest.config.ts package.json
git commit -m "test: add tests for market hours, csv parser, formatting, and watchlist persistence"
```

---

## Task 13: Final Polish & Verification

**Files:**
- Modify: `components/layout/TopBar.tsx` (add logout button)
- Verify all screens end-to-end with real data

- [ ] **Step 1: Add logout button to TopBar**

In `components/layout/TopBar.tsx`, update the user initials section to include a dropdown with logout:

Add this before the closing `</header>`:

Replace the user initials div at the end of `TopBar.tsx`:

```tsx
      {userInitials && (
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          title="Logout"
          className="w-6 h-6 rounded-full bg-[#1a1a1a] border border-border flex items-center justify-center text-text-secondary text-[9px] hover:border-accent/50 transition-colors"
        >
          {userInitials}
        </button>
      )}
```

- [ ] **Step 2: Full verification pass**

Run through the verification plan from the spec:

```bash
npm run dev
```

1. **Auth flow**: Open `http://localhost:3000` → redirects to `/portfolio` → redirects to `/login` (no session). Click "Login with Kite" → Zerodha OAuth → callback → dashboard loads.

2. **Portfolio screen**: All 7 holdings visible. Summary strip totals: ~18,926 invested, ~18,853 current, P&L ~-73, Day P&L ~+175. Red tint on HAL, ADANIGREEN, TMPV rows.

3. **Watchlist**: Click W → empty state. Search "RELI" → RELIANCE appears. Add it → LTP shows. Refresh page → still there. Click x → removed.

4. **Orders**: Click O → shows "No orders today" (or actual orders if you traded today). Switch to Trades tab.

5. **Analytics**: Click A → scrollable page with all 4 sections. Sector donut groups correctly. GOLDBEES shows under Gold. Concentration bars sum to ~100%.

6. **Session expiry**: Clear cookies in browser → refresh → "Session expired" overlay appears. Click "Log in again" → works.

7. **Market hours**: If outside 9:15-15:30 IST → "MARKET CLOSED" badge visible in top bar.

8. **Logout**: Click user initials in top bar → redirected to login page.

- [ ] **Step 3: Build check**

```bash
npm run build
```

Expected: Build succeeds with no errors. Fix any TypeScript or lint errors.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: add logout, complete mvp verification"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Project scaffold + theme | 10 files |
| 2 | Utility libraries | 3 files |
| 3 | Auth flow + Kite client | 6 files |
| 4 | API proxy routes | 9 files |
| 5 | TanStack Query + hooks | 11 files |
| 6 | App shell (layout, nav) | 10 files |
| 7 | Shared UI components | 4 files |
| 8 | Portfolio screen | 4 files |
| 9 | Watchlist screen | 3 files |
| 10 | Orders screen | 3 files |
| 11 | Analytics screen | 5 files |
| 12 | Automated tests | 5 files |
| 13 | Final polish + verification | 1 file |
| **Total** | | **~74 files, 13 tasks** |
