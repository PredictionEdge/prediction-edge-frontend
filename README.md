# PredictionEdge

Real-time prediction market arbitrage scanner. See the same market on Kalshi and Polymarket side-by-side, spot the spread, and trade with math.

## Quick Start

```bash
# Install correct Node version (requires asdf or nvm)
asdf install        # or: nvm use

# Install dependencies
npm install

# Copy env template and fill in values
cp .env.local.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```bash
# Supabase (Dashboard → Settings → API → Publishable key)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# Database (your prediction-market-arbitrage Postgres)
DATABASE_URL=postgresql://...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup

### 1. Supabase

1. Create a [Supabase project](https://supabase.com/dashboard)
2. Enable **Email/Password** and **Google** auth providers
3. Set **Site URL** to your Vercel domain (e.g. `https://your-app.vercel.app`)
4. Add **Redirect URL**: `https://your-app.vercel.app/auth/callback`
5. Copy Project URL + Publishable key into env vars

### 2. Stripe

1. Create a [Stripe account](https://dashboard.stripe.com/)
2. Create a Product with a recurring Price (e.g. $39/month)
3. Set up webhook endpoint: `https://your-app.vercel.app/api/stripe/webhook`
   - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
4. Copy keys into env vars

### 3. Database

Set `DATABASE_URL` to your `prediction-market-arbitrage` Postgres connection string. The app auto-creates a `pe_users` table for subscription data on first request.

### 4. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add all env vars in Vercel Dashboard → Settings → Environment Variables.

## Architecture

```
src/
├── app/
│   ├── page.tsx                    # Landing page (split-view demo)
│   ├── layout.tsx                  # Root layout (fonts, metadata)
│   ├── not-found.tsx               # 404 page
│   ├── sitemap.ts                  # Dynamic sitemap
│   ├── robots.ts                   # Robots.txt
│   ├── opengraph-image.tsx         # Dynamic OG image (edge)
│   ├── login/
│   │   ├── page.tsx                # Login page (Suspense wrapper)
│   │   └── LoginForm.tsx           # Email/pw + Google OAuth
│   ├── signup/page.tsx             # Signup + email confirmation
│   ├── auth/callback/route.ts      # OAuth callback (code exchange)
│   ├── dashboard/page.tsx          # Arb desk (protected)
│   └── api/
│       ├── arbs/route.ts           # Arb data (rate limited, paywalled)
│       └── stripe/
│           ├── checkout/route.ts   # Create checkout session
│           ├── webhook/route.ts    # Handle Stripe events (signed)
│           ├── portal/route.ts     # Billing portal
│           └── status/route.ts     # Subscription status
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Sticky nav, user dropdown
│   │   ├── Footer.tsx              # Site footer
│   │   └── SignOutButton.tsx       # Sign out
│   ├── dashboard/
│   │   ├── ArbTable.tsx            # Split-view arb cards + sorting/filtering
│   │   ├── ArbCalculator.tsx       # Stake → allocation → profit calculator
│   │   ├── StatsBar.tsx            # Summary stats (total, avg/max spread)
│   │   ├── ManageSubscription.tsx  # Stripe portal link
│   │   └── SubscriptionGate.tsx    # Paywall with blur + free preview
│   └── ui/                         # shadcn/ui (Radix primitives)
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Server client (cookies)
│   │   └── proxy.ts                # Session refresh + route protection
│   ├── auth/
│   │   ├── AuthContext.tsx          # React auth provider
│   │   └── get-user.ts             # Server-side getClaims()
│   ├── stripe/
│   │   ├── client.ts               # Stripe SDK init
│   │   ├── subscription.ts         # Postgres subscription CRUD (pe_users)
│   │   └── useSubscription.ts      # Client-side status hook
│   ├── db/
│   │   ├── index.ts                # Postgres pool
│   │   ├── arbs.ts                 # Arb query (4-table join + spread calc)
│   │   └── types.ts                # TypeScript types
│   ├── rate-limit.ts               # In-memory sliding window rate limiter
│   └── api-utils.ts                # Rate limit middleware helper
└── proxy.ts                        # Next.js 16 proxy (replaces middleware.ts)
```

## Design System

"The Arb Desk" — a custom design blending ChatGPT, Anthropic, Polymarket, and Kalshi aesthetics.

- **Typography**: Playfair Display (serif headings) · Inter (body) · JetBrains Mono (data)
- **Colors**: Warm cream primary (#f5e6d3) · Kalshi blue (#3b82f6) · Polymarket purple (#8b5cf6) · Spread green (#22c55e)
- **Components**: shadcn/ui with Radix primitives
- **Split-view cards**: Each arb shows Kalshi (progress bars) and Polymarket (outcome pills) in their native visual styles

## Security

- **Supabase Auth**: Cookie-based sessions via `@supabase/ssr`
- **getClaims()**: JWT signature validation on every server-side auth check (not spoofable)
- **Proxy**: Automatic session refresh + route protection
- **Stripe webhooks**: Signature verification on all events
- **Rate limiting**: Per-IP sliding window (30/min arbs, 10/min auth, 5/min checkout)
- **Paywall**: Server-side enforcement — free users get 3 arbs, paid get all

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Runtime | Node.js 24 LTS |
| Styling | Tailwind CSS |
| Components | shadcn/ui (Radix) |
| Auth | Supabase Auth |
| Payments | Stripe (Checkout + Portal) |
| Database | PostgreSQL |
| Deploy | Vercel |

## License

Proprietary — PredictionEdge
