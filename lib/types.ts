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
