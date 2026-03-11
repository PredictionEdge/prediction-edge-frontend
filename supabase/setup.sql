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

-- The arb_snapshot table is created by the alembic migration in
-- prediction-market-arbitrage. If running on the same Supabase Postgres,
-- the migration handles it. Otherwise uncomment below:

-- CREATE TABLE IF NOT EXISTS arb_snapshot (
--   id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   market_match_id     UUID NOT NULL,
--   kalshi_event_ticker TEXT NOT NULL,
--   kalshi_market_ticker TEXT NOT NULL,
--   kalshi_yes_ask      NUMERIC(6,4),
--   kalshi_no_ask       NUMERIC(6,4),
--   poly_event_slug     TEXT NOT NULL,
--   poly_market_id      TEXT NOT NULL,
--   poly_yes            NUMERIC(6,4),
--   poly_no             NUMERIC(6,4),
--   spread_pct          NUMERIC(6,4) NOT NULL,
--   spread_direction    TEXT NOT NULL,
--   event_title         TEXT,
--   kalshi_url          TEXT,
--   poly_url            TEXT,
--   snapshot_at         TIMESTAMPTZ NOT NULL DEFAULT now()
-- );
-- CREATE INDEX IF NOT EXISTS idx_arb_snapshot_time ON arb_snapshot (snapshot_at);
-- CREATE INDEX IF NOT EXISTS idx_arb_snapshot_spread ON arb_snapshot (spread_pct) WHERE spread_pct > 0;
-- CREATE INDEX IF NOT EXISTS idx_arb_snapshot_match_time ON arb_snapshot (market_match_id, snapshot_at);
