"use client";

import { ReactNode, useState } from "react";
import { useSubscription } from "@/lib/stripe/useSubscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Props { children: ReactNode; freePreview?: ReactNode; }

export default function SubscriptionGate({ children, freePreview }: Props) {
  const { status, loading } = useSubscription();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  if (loading) return <Skeleton className="h-48 w-full rounded-lg" />;

  const isActive = status === "active" || status === "trialing";
  if (isActive) return <>{children}</>;

  async function handleSubscribe() {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Failed to start checkout. Please try again.");
    } catch { alert("Failed to start checkout. Please try again."); }
    finally { setCheckoutLoading(false); }
  }

  return (
    <div>
      {freePreview && <div className="mb-6">{freePreview}</div>}
      <div className="relative">
        <div className="pointer-events-none select-none blur-sm opacity-40">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="max-w-md shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle>Unlock All Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Subscribe to access 200+ daily arbitrage opportunities, real-time data, and the full scanner.
              </p>
              {status === "past_due" && <p className="mt-2 text-sm text-yellow-400">⚠️ Your payment is past due.</p>}
              {status === "canceled" && <p className="mt-2 text-sm text-muted-foreground">Your subscription has been canceled.</p>}
              <Button className="mt-4" onClick={handleSubscribe} disabled={checkoutLoading}>
                {checkoutLoading ? "Loading..." : "Subscribe — $39/mo"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
