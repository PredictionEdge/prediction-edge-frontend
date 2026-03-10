import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div>
      <section className="flex flex-col items-center justify-center py-20 text-center">
        <Badge variant="outline" className="mb-6 gap-2 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Scanning markets live
        </Badge>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
          Stop Guessing.
          <br />
          <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Start Arbitraging.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Real-time arbitrage opportunities across Polymarket &amp; Kalshi.
          200+ daily opportunities backed by math, not gut feelings.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="shadow-lg shadow-primary/30">
            <Link href="/signup">Get Started Free →</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </section>

      <Separator />

      <section className="py-16">
        <h2 className="text-center text-3xl font-bold mb-12">
          Trade with an{" "}
          <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Edge</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard icon="⚡" title="Real-Time Scanner" description="Continuous scanning across Polymarket and Kalshi. Spot price gaps before they close." />
          <FeatureCard icon="📊" title="Built-In Calculator" description="Instantly calculate optimal allocation, contracts, and guaranteed profit for any opportunity." />
          <FeatureCard icon="🔒" title="Math, Not Luck" description="Arbitrage is risk-free by definition. Buy both sides below $1, pocket the difference." />
        </div>
      </section>

      <Separator />

      <section className="py-16">
        <h2 className="text-center text-3xl font-bold mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Step number="1" title="We Scan" description="Our engine matches identical markets across Kalshi and Polymarket, comparing prices every second." />
          <Step number="2" title="You Spot" description="Browse live opportunities sorted by spread. Filter by category. Calculate your profit instantly." />
          <Step number="3" title="You Profit" description="Place opposing bets on both platforms. One side always wins — your combined cost is less than $1." />
        </div>
      </section>

      <Separator />

      <section className="py-16">
        <h2 className="text-center text-3xl font-bold mb-4">Simple Pricing</h2>
        <p className="text-center text-muted-foreground mb-12">One plan. Full access. Cancel anytime.</p>
        <div className="max-w-sm mx-auto">
          <Card className="border-primary/30">
            <CardHeader className="text-center">
              <Badge className="mx-auto mb-2 w-fit">Pro</Badge>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold">$39</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">Billed monthly · Cancel anytime</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                {["200+ daily arbitrage opportunities", "Real-time Kalshi ↔ Polymarket scanning", "Built-in arbitrage calculator", "Category filtering & sorting", "Auto-refresh every 30 seconds", "Email support"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <span className="text-green-400">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="w-full">
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">Free preview with 3 opportunities. No credit card required.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to find your edge?</h2>
        <p className="text-muted-foreground mb-8">Join traders using math instead of luck.</p>
        <Button asChild size="lg" className="shadow-lg shadow-primary/30">
          <Link href="/signup">Get Started →</Link>
        </Button>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <Card className="hover:border-muted-foreground/30 transition-colors">
      <CardContent className="pt-6">
        <div className="text-3xl mb-4">{icon}</div>
        <CardTitle className="text-lg mb-2">{title}</CardTitle>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-lg font-bold text-primary mb-4">{number}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
