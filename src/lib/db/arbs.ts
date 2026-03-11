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
      poly_event_slug,
      poly_market_id,
      kalshi_yes_ask,
      kalshi_no_ask,
      poly_yes,
      poly_no,
      spread_pct,
      spread_direction,
      event_title,
      kalshi_url,
      poly_url,
      snapshot_at
    FROM arb_snapshot
    WHERE spread_pct > 0
      ${timeFilter}
    ORDER BY market_match_id, snapshot_at DESC
  `);

  return result.rows.map((row) => {
    const spreadDir = row.spread_direction as string;
    const isKalshiYes = spreadDir === "kalshi_yes_poly_no";

    return {
      id: row.id,
      market: row.event_title || "Unknown",
      category: "",
      kalshiTicker: row.kalshi_market_ticker,
      polymarketId: row.poly_market_id,
      kalshiPrice: parseFloat(isKalshiYes ? row.kalshi_yes_ask : row.kalshi_no_ask) || 0,
      polymarketPrice: parseFloat(isKalshiYes ? row.poly_no : row.poly_yes) || 0,
      spread: parseFloat(row.spread_pct) * 100,
      kalshiUrl: row.kalshi_url || "",
      polymarketUrl: row.poly_url || "",
      direction: isKalshiYes
        ? "Buy YES on Kalshi, Buy NO on Polymarket"
        : "Buy NO on Kalshi, Buy YES on Polymarket",
      expiration: null,
      updatedAt: row.snapshot_at,
    };
  }).sort((a, b) => b.spread - a.spread);
}
