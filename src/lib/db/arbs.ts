import { getPool } from "./index";
import { ArbWithSpread } from "./types";

/**
 * Query active arbitrage opportunities by joining market_match → event_match → events.
 * Computes spread from live JSONB market data.
 */
export async function getActiveArbs(): Promise<ArbWithSpread[]> {
  const pool = getPool();

  const result = await pool.query(`
    SELECT
      mm.id,
      mm.kalshi_market_ticker,
      mm.polymarket_market_ticker,
      mm.updated_at,
      em.kalshi_event_ticker,
      em.polymarket_event_ticker,
      ke.meta AS kalshi_meta,
      ke.markets AS kalshi_markets,
      pe.meta AS poly_meta,
      pe.markets AS poly_markets
    FROM market_match mm
    JOIN event_match em ON mm.event_match_id = em.id
    JOIN kalshi_event ke ON em.kalshi_event_ticker = ke.ticker
    JOIN polymarket_event pe ON em.polymarket_event_ticker = pe.ticker
    WHERE mm.is_deleted = false
      AND mm.is_verified = true
      AND mm.is_match = true
      AND em.is_deleted = false
      AND ke.is_deleted = false
      AND pe.is_deleted = false
    ORDER BY mm.updated_at DESC
  `);

  const arbs: ArbWithSpread[] = [];

  for (const row of result.rows) {
    // Find the specific Kalshi market
    const kalshiMarkets: any[] = Array.isArray(row.kalshi_markets)
      ? row.kalshi_markets
      : [];
    const kalshiMarket = kalshiMarkets.find(
      (m: any) =>
        (m.ticker_name || m.ticker) === row.kalshi_market_ticker
    );

    // Find the specific Polymarket market
    const polyMarkets: any[] = Array.isArray(row.poly_markets)
      ? row.poly_markets
      : [];
    const polyMarket = polyMarkets.find(
      (m: any) => m.id === row.polymarket_market_ticker
    );

    if (!kalshiMarket || !polyMarket) continue;

    // Skip closed/finalized markets
    const kalshiStatus = kalshiMarket.status || "active";
    if (["finalized", "closed", "inactive"].includes(kalshiStatus)) continue;
    if (polyMarket.closed) continue;

    // Parse prices
    // Kalshi: yes_ask is in cents (0-100), convert to decimal
    const kalshiYesAsk = kalshiMarket.yes_ask != null
      ? kalshiMarket.yes_ask / 100
      : null;
    const kalshiNoAsk = kalshiMarket.no_ask != null
      ? kalshiMarket.no_ask / 100
      : null;

    // Polymarket: outcomePrices is JSON string like '["0.55","0.45"]'
    let polyYesPrice: number | null = null;
    let polyNoPrice: number | null = null;
    try {
      const prices = typeof polyMarket.outcomePrices === "string"
        ? JSON.parse(polyMarket.outcomePrices)
        : polyMarket.outcomePrices;
      const outcomes = typeof polyMarket.outcomes === "string"
        ? JSON.parse(polyMarket.outcomes)
        : polyMarket.outcomes;

      if (prices && outcomes) {
        const yesIdx = outcomes.findIndex((o: string) => o.toLowerCase() === "yes");
        const noIdx = outcomes.findIndex((o: string) => o.toLowerCase() === "no");
        if (yesIdx >= 0) polyYesPrice = parseFloat(prices[yesIdx]);
        if (noIdx >= 0) polyNoPrice = parseFloat(prices[noIdx]);
      }
    } catch {
      continue;
    }

    // Calculate best arb spread
    // Strategy 1: Buy YES on Kalshi + Buy NO on Polymarket
    // Profit if: kalshi_yes_ask + poly_no_price < 1
    // Strategy 2: Buy NO on Kalshi + Buy YES on Polymarket
    // Profit if: kalshi_no_ask + poly_yes_price < 1

    let bestSpread = 0;
    let direction = "";
    let kalshiPrice = 0;
    let polyPrice = 0;

    if (kalshiYesAsk != null && polyNoPrice != null) {
      const cost = kalshiYesAsk + polyNoPrice;
      const spread = ((1 - cost) / 1) * 100; // spread as percentage
      if (spread > bestSpread) {
        bestSpread = spread;
        direction = "Buy YES on Kalshi, Buy NO on Polymarket";
        kalshiPrice = kalshiYesAsk;
        polyPrice = polyNoPrice;
      }
    }

    if (kalshiNoAsk != null && polyYesPrice != null) {
      const cost = kalshiNoAsk + polyYesPrice;
      const spread = ((1 - cost) / 1) * 100;
      if (spread > bestSpread) {
        bestSpread = spread;
        direction = "Buy NO on Kalshi, Buy YES on Polymarket";
        kalshiPrice = kalshiNoAsk;
        polyPrice = polyYesPrice;
      }
    }

    // Only include opportunities with positive spread
    if (bestSpread <= 0) continue;

    const kalshiMeta = row.kalshi_meta || {};
    const polyMeta = row.poly_meta || {};
    const seriesTicker = kalshiMeta.series_ticker || "";

    arbs.push({
      id: row.id,
      market: kalshiMarket.title || polyMarket.question || "Unknown",
      category: kalshiMeta.category || "",
      kalshiTicker: row.kalshi_market_ticker,
      polymarketId: row.polymarket_market_ticker,
      kalshiPrice: Math.round(kalshiPrice * 100) / 100,
      polymarketPrice: Math.round(polyPrice * 100) / 100,
      spread: Math.round(bestSpread * 100) / 100,
      kalshiUrl: `https://kalshi.com/markets/${seriesTicker}#${row.kalshi_event_ticker}`,
      polymarketUrl: `https://polymarket.com/event/${polyMeta.slug || ""}`,
      direction,
      expiration: kalshiMarket.expected_expiration_date || polyMarket.endDate || null,
      updatedAt: row.updated_at,
    });
  }

  // Sort by spread descending
  arbs.sort((a, b) => b.spread - a.spread);

  return arbs;
}
