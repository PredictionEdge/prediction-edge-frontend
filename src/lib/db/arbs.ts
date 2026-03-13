import { getPool } from "./index";
import { ArbWithSpread } from "./types";

/**
 * Query active arbitrage opportunities from the arb_snapshot table.
 * 
 * Set SHOW_ALL_ARBS=true to disable the 5-minute freshness filter (for testing).
 */
export async function getActiveArbs(): Promise<ArbWithSpread[]> {
  const pool = getPool();
  const showAll = process.env.SHOW_ALL_ARBS === "true";

  const timeFilter = showAll
    ? ""
    : "AND snapshot_at > now() - interval '5 minutes'";

  const result = await pool.query(`
    SELECT DISTINCT ON (market_match_id)
      id,
      market_match_id,
      kalshi_event_ticker,
      kalshi_market_ticker,
      polymarket_market_ticker,
      polymarket_event_ticker,
      direction,
      kalshi_ask,
      kalshi_bid,
      poly_ask,
      poly_bid,
      raw_spread_pct,
      net_spread_pct,
      kalshi_fee,
      poly_fee,
      kalshi_title,
      poly_slug,
      snapshot_at
    FROM arb_snapshot
    WHERE net_spread_pct > 0
      ${timeFilter}
    ORDER BY market_match_id, snapshot_at DESC
  `);

  return result.rows.map((row) => {
    const dir = row.direction as string;
    const isKalshiYes = dir === "kalshi_yes_poly_no";

    const kalshiUrl = `https://kalshi.com/markets/${row.kalshi_event_ticker}`;
    const polymarketUrl = row.poly_slug
      ? `https://polymarket.com/event/${row.poly_slug}`
      : "";

    return {
      id: row.id,
      market: row.kalshi_title || "Unknown",
      category: "",
      kalshiTicker: row.kalshi_market_ticker,
      polymarketId: row.polymarket_market_ticker,
      kalshiPrice: parseFloat(row.kalshi_ask) || 0,
      polymarketPrice: parseFloat(row.poly_ask) || 0,
      spread: parseFloat(row.net_spread_pct) * 100,
      kalshiUrl,
      polymarketUrl,
      direction: isKalshiYes
        ? "Buy YES on Kalshi, Buy NO on Polymarket"
        : "Buy NO on Kalshi, Buy YES on Polymarket",
      expiration: null,
      updatedAt: row.snapshot_at,
    };
  }).sort((a, b) => b.spread - a.spread);
}
