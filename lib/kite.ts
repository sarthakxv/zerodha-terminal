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

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 403) {
        try {
          const err = JSON.parse(body);
          if (err.error_type === "TokenException") throw new KiteSessionExpiredError();
        } catch (e) {
          if (e instanceof KiteSessionExpiredError) throw e;
        }
      }
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
    const url = new URL("/quote/ltp", KITE_API_BASE);
    instruments.forEach((inst) => url.searchParams.append("i", inst));

    const res = await fetch(url.toString(), {
      headers: {
        "X-Kite-Version": "3",
        Authorization: `token ${this.apiKey}:${this.accessToken}`,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 403) {
        try {
          const err = JSON.parse(body);
          if (err.error_type === "TokenException") throw new KiteSessionExpiredError();
        } catch (e) {
          if (e instanceof KiteSessionExpiredError) throw e;
        }
      }
      throw new KiteAPIError(res.status, body);
    }

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

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 403) {
        try {
          const err = JSON.parse(body);
          if (err.error_type === "TokenException") throw new KiteSessionExpiredError();
        } catch (e) {
          if (e instanceof KiteSessionExpiredError) throw e;
        }
      }
      throw new KiteAPIError(res.status, body);
    }

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
