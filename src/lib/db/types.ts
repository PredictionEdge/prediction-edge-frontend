export interface ArbOpportunity {
  id: string;
  eventMatchId: string;
  kalshiMarketTicker: string;
  polymarketMarketTicker: string;
  kalshiEventTitle: string;
  polymarketEventTitle: string;
  kalshiCategory: string;
  kalshiUrl: string;
  polymarketUrl: string;
  // Market data from JSONB
  kalshiMarkets: KalshiMarketData[];
  polymarketMarkets: PolymarketMarketData[];
  // Computed
  spread: number | null;
  updatedAt: string;
}

export interface KalshiMarketData {
  ticker: string;
  title: string;
  yesAsk: number | null;
  yesBid: number | null;
  noAsk: number | null;
  noBid: number | null;
  status: string;
  expiration: string | null;
}

export interface PolymarketMarketData {
  id: string;
  question: string;
  outcomePrices: [string, string] | null;
  outcomes: [string, string] | null;
  closed: boolean;
  endDate: string | null;
}

export interface ArbWithSpread {
  id: string;
  market: string;
  category: string;
  kalshiTicker: string;
  polymarketId: string;
  kalshiPrice: number;
  polymarketPrice: number;
  spread: number;
  kalshiUrl: string;
  polymarketUrl: string;
  direction: string; // e.g. "Buy YES on Kalshi, Buy NO on Polymarket"
  expiration: string | null;
  updatedAt: string;
}
