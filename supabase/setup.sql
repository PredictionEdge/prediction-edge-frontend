-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- Creates the pe_users table for Stripe subscription tracking.

CREATE TABLE IF NOT EXISTS pe_users (
  uid                    TEXT PRIMARY KEY,
  email                  TEXT,
  stripe_customer_id     TEXT UNIQUE,
  stripe_subscription_id TEXT,
  stripe_price_id        TEXT,
  subscription_status    TEXT NOT NULL DEFAULT 'none',
  current_period_end     BIGINT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pe_users_stripe_customer
  ON pe_users (stripe_customer_id);

-- The arb_snapshot table stores live arbitrage spread data pushed by the
-- prediction-market-arbitrage backend via Supabase REST API (upsert).
-- Uncomment below if running on a separate Supabase instance:

-- CREATE TABLE IF NOT EXISTS arb_snapshot (
--   id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   market_match_id         UUID NOT NULL,
--   kalshi_market_ticker    TEXT NOT NULL,
--   polymarket_market_ticker TEXT NOT NULL,
--   kalshi_event_ticker     TEXT NOT NULL,
--   polymarket_event_ticker TEXT NOT NULL,
--   direction               TEXT NOT NULL,
--   kalshi_ask              NUMERIC(8,4),
--   kalshi_bid              NUMERIC(8,4),
--   poly_ask                NUMERIC(8,4),
--   poly_bid                NUMERIC(8,4),
--   kalshi_yes_bid          NUMERIC(8,4),
--   kalshi_no_bid           NUMERIC(8,4),
--   raw_spread_pct          NUMERIC(8,4) NOT NULL,
--   net_spread_pct          NUMERIC(8,4) NOT NULL,
--   kalshi_fee              NUMERIC(8,4),
--   poly_fee                NUMERIC(8,4),
--   poly_fee_rate_bps       INTEGER DEFAULT 0,
--   kalshi_title            TEXT,
--   poly_slug               TEXT,
--   snapshot_at             TIMESTAMPTZ NOT NULL DEFAULT now()
-- );
-- CREATE INDEX IF NOT EXISTS idx_arb_snapshot_time ON arb_snapshot (snapshot_at);
-- CREATE INDEX IF NOT EXISTS idx_arb_snapshot_spread ON arb_snapshot (net_spread_pct) WHERE net_spread_pct > 0;
-- CREATE INDEX IF NOT EXISTS idx_arb_snapshot_match_time ON arb_snapshot (market_match_id, snapshot_at);
