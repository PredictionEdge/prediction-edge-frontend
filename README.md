# PredictionEdge

Real-time prediction market arbitrage scanner across Polymarket & Kalshi.

## Quick Start

```bash
# Install dependencies
npm install

# Copy env template and fill in values
cp .env.local.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Setup

### 1. Firebase

1. Create a [Firebase project](https://console.firebase.google.com/)
2. Enable **Email/Password** and **Google** sign-in methods
3. Generate a service account key (Project Settings → Service Accounts)
4. Fill in the `NEXT_PUBLIC_FIREBASE_*` and `FIREBASE_ADMIN_*` env vars

### 2. Stripe

1. Create a [Stripe account](https://dashboard.stripe.com/)
2. Create a Product with a recurring Price (e.g. $39/month)
3. Set up a webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
4. Fill in the `STRIPE_*` env vars

### 3. Database

Set `DATABASE_URL` to your `prediction-market-arbitrage` Postgres connection string.

### 4. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add all env vars in the Vercel dashboard under Settings → Environment Variables.

## Architecture

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout + metadata
│   ├── not-found.tsx               # 404 page
│   ├── sitemap.ts                  # Dynamic sitemap
│   ├── robots.ts                   # Robots.txt
│   ├── opengraph-image.tsx         # Dynamic OG image
│   ├── login/                      # Firebase Auth login
│   ├── signup/                     # Firebase Auth signup
│   ├── dashboard/                  # Arb dashboard (protected)
│   └── api/
│       ├── arbs/                   # Arb data endpoint (rate limited)
│       ├── auth/session/           # Session cookie management
│       └── stripe/
│           ├── checkout/           # Create checkout session
│           ├── webhook/            # Handle Stripe events
│           ├── portal/             # Billing portal
│           └── status/             # Subscription status
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Sticky nav with auth state
│   │   ├── Footer.tsx              # Site footer
│   │   └── SignOutButton.tsx       # Sign out + redirect
│   └── dashboard/
│       ├── ArbTable.tsx            # Main arb table with sorting/filtering
│       ├── ArbCalculator.tsx       # Interactive profit calculator
│       ├── StatsBar.tsx            # Summary statistics
│       ├── ManageSubscription.tsx  # Stripe portal link
│       └── SubscriptionGate.tsx    # Paywall wrapper
└── lib/
    ├── auth/
    │   ├── firebase.ts             # Client SDK (lazy init)
    │   ├── firebase-admin.ts       # Admin SDK (server-side)
    │   ├── AuthContext.tsx          # React auth provider
    │   ├── session.ts              # Session cookie management
    │   └── get-user.ts             # Server component helper
    ├── stripe/
    │   ├── client.ts               # Stripe SDK init
    │   ├── subscription.ts         # Firestore subscription CRUD
    │   └── useSubscription.ts      # Client-side status hook
    ├── db/
    │   ├── index.ts                # Postgres pool
    │   ├── arbs.ts                 # Arb query logic
    │   └── types.ts                # TypeScript types
    ├── rate-limit.ts               # In-memory rate limiter
    └── api-utils.ts                # API route helpers
```

## Security

- **Session cookies**: httpOnly, secure, sameSite=lax — no tokens in localStorage
- **Server-side verification**: Firebase Admin SDK with revocation checking
- **Defense in depth**: Middleware + server component auth checks
- **Webhook verification**: Stripe signature validation on all events
- **Rate limiting**: Per-IP sliding window on all API routes
- **Input validation**: Strict type checking on all API inputs

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Auth**: Firebase Authentication
- **Payments**: Stripe (Checkout + Customer Portal)
- **Database**: PostgreSQL (prediction-market-arbitrage)
- **Deploy**: Vercel

## License

Proprietary — PredictionEdge
