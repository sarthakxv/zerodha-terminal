# Zerodha Terminal - Future Enhancements

## Index Ticker in TopBar

- **What**: Show NIFTY 50 and NIFTY BANK live prices in the TopBar header
- **Why removed**: The Kite `/quote/ltp` API does not support index symbols in `NSE:NIFTY 50` format, causing 500 errors on every poll
- **How to re-add**:
  1. Use the Kite MCP `search_instruments` to find the correct `instrument_token` for NIFTY 50 and NIFTY BANK indices
  2. Fetch LTP using instrument tokens instead of `exchange:tradingsymbol` format
  3. Re-implement `IndexTicker` component in `components/layout/TopBar.tsx`
  4. Wire up with `useLTP` hook using the correct instrument identifiers
- **Reference**: The removed `IndexTicker` component can be found in git history (commit before this fix)
