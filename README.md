# PredictionEdge

Prediction market arbitrage SaaS — real-time arbitrage opportunities across Polymarket, Kalshi & Opinion.

## POC Plan

### Architecture

```
[Next.js 14 App (App Router)]
  ├── Firebase Auth (Google + email/password)
  ├── Stripe Checkout (single subscription tier)
  └── API Routes → prediction-market-arbitrage Postgres DB
```

**Deploy target:** Vercel  
**Tech stack:** Next.js 14 · Tailwind CSS · Firebase Auth · Stripe · Postgres · Vercel

---

### Phase 1 — Scaffold (1 day)

- [ ] Init Next.js 14 with App Router and Tailwind
- [ ] Project structure: `app/`, `lib/`, `components/`, `api/`
- [ ] Environment config (`.env.local` template)
- [ ] Deploy to Vercel (empty shell)

### Phase 2 — Authentication (1 day)

- [ ] Firebase project setup
- [ ] Firebase Auth provider: email/password + Google sign-in
- [ ] Auth context provider (`lib/auth/`)
- [ ] Login & signup pages (`app/login/`, `app/signup/`)
- [ ] Protected route middleware
- [ ] User profile stored in Firestore (uid, email, subscription status)

### Phase 3 — Stripe Subscription (1 day)

- [ ] Stripe product + price setup (single tier, e.g. $39/mo)
- [ ] Checkout session API route (`app/api/stripe/checkout/`)
- [ ] Stripe webhook handler (`app/api/stripe/webhook/`)
- [ ] Sync subscription status to Firestore on webhook events
- [ ] Paywall gate: free users see top 3 arbs, paid users see all
- [ ] Customer portal link for subscription management

### Phase 4 — Arbitrage Dashboard (2 days)

- [ ] API route to query `prediction-market-arbitrage` DB for active arbs
- [ ] Dashboard page (`app/dashboard/`)
- [ ] Arb table: Market | Platforms | Spread % | Best Prices | Last Updated
- [ ] Auto-refresh every 30 seconds
- [ ] Sort by spread (descending by default)
- [ ] Filter by platform pair and market category
- [ ] Arb calculator component (stake input → allocation + guaranteed profit)
- [ ] Empty/loading/error states

### Phase 5 — Polish & Launch (1 day)

- [ ] Landing page with hero, features, pricing CTA
- [ ] Responsive design (mobile-first)
- [ ] Rate limiting on API routes (`next-rate-limit` or similar)
- [ ] SEO: meta tags, OG image, sitemap
- [ ] Analytics (Vercel Analytics or Plausible)
- [ ] README with setup instructions

---

### Timeline

| Phase | Days | Cumulative |
|-------|------|------------|
| Scaffold | 1 | 1 |
| Auth | 1 | 2 |
| Stripe | 1 | 3 |
| Dashboard | 2 | 5 |
| Polish | 1 | 6 |

**Total: ~6 days**

---

### Competitive Advantages

- **Data pipeline already exists** — `prediction-market-arbitrage` repo computes arbs continuously
- **Undercut on price** — start at $29–39/mo vs ArbBets' $59/mo entry
- **API access from day 1** — ArbBets gates this at $299/mo
- **Real-time orderbook depth** — deeper data than competitors if available
- **Lean stack** — no API gateway overhead for POC, Firebase + Vercel free tiers

---

### Future Phases (Post-POC)

- Multiple subscription tiers (Basic / Pro / API)
- Public REST API with per-key rate limiting
- Telegram/Discord alerts for high-spread arbs
- Historical arb performance tracking
- Mobile app (React Native or PWA)
- Cloudflare API Shield when API customers scale

## Setup

```bash
# Coming soon — scaffold in Phase 1
npm create next-app@latest . --typescript --tailwind --app
```

## License

Proprietary — PredictionEdge
