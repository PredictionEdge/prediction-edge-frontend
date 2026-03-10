import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-800/50 bg-indigo-900/20 px-4 py-1.5 text-sm text-indigo-300 mb-6">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Scanning markets live
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
          Stop Guessing.
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Start Arbitraging.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-400 leading-relaxed">
          Real-time arbitrage opportunities across Polymarket &amp; Kalshi.
          200+ daily opportunities backed by math, not gut feelings.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/signup"
            className="group relative rounded-lg bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/50"
          >
            Get Started Free →
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-gray-700 px-8 py-3.5 text-sm font-semibold text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-gray-800/50">
        <h2 className="text-center text-3xl font-bold mb-12">
          Trade with an{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Edge
          </span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon="⚡"
            title="Real-Time Scanner"
            description="Continuous scanning across Polymarket and Kalshi. Spot price gaps before they close."
          />
          <FeatureCard
            icon="📊"
            title="Built-In Calculator"
            description="Instantly calculate optimal allocation, contracts, and guaranteed profit for any opportunity."
          />
          <FeatureCard
            icon="🔒"
            title="Math, Not Luck"
            description="Arbitrage is risk-free by definition. Buy both sides below $1, pocket the difference."
          />
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 border-t border-gray-800/50">
        <h2 className="text-center text-3xl font-bold mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Step number="1" title="We Scan" description="Our engine matches identical markets across Kalshi and Polymarket, comparing prices every second." />
          <Step number="2" title="You Spot" description="Browse live opportunities sorted by spread. Filter by category. Calculate your profit instantly." />
          <Step number="3" title="You Profit" description="Place opposing bets on both platforms. One side always wins — your combined cost is less than $1." />
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 border-t border-gray-800/50">
        <h2 className="text-center text-3xl font-bold mb-4">Simple Pricing</h2>
        <p className="text-center text-gray-400 mb-12">One plan. Full access. Cancel anytime.</p>
        <div className="max-w-sm mx-auto">
          <div className="rounded-xl border border-indigo-800/50 bg-gradient-to-b from-gray-900 to-gray-950 p-8">
            <div className="text-center">
              <p className="text-sm font-medium text-indigo-400 uppercase tracking-wider">Pro</p>
              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold text-white">$39</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Billed monthly · Cancel anytime</p>
            </div>
            <ul className="mt-8 space-y-3">
              {[
                "200+ daily arbitrage opportunities",
                "Real-time Kalshi ↔ Polymarket scanning",
                "Built-in arbitrage calculator",
                "Category filtering & sorting",
                "Auto-refresh every 30 seconds",
                "Email support",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="text-green-400">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-8 block rounded-lg bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Start Free Trial
            </Link>
            <p className="mt-3 text-center text-xs text-gray-500">
              Free preview with 3 opportunities. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-gray-800/50 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to find your edge?</h2>
        <p className="text-gray-400 mb-8">Join traders using math instead of luck.</p>
        <Link
          href="/signup"
          className="rounded-lg bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/50"
        >
          Get Started →
        </Link>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 hover:border-gray-700 transition-colors">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-indigo-800/50 bg-indigo-900/30 text-lg font-bold text-indigo-400 mb-4">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
