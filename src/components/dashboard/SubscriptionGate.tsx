"use client";

import { ReactNode, useState } from "react";
import { useSubscription } from "@/lib/stripe/useSubscription";

interface SubscriptionGateProps {
  children: ReactNode;
  freePreview?: ReactNode;
}

/**
 * Wraps content behind a subscription paywall.
 * Shows freePreview (if provided) for non-subscribers, full content for subscribers.
 */
export default function SubscriptionGate({ children, freePreview }: SubscriptionGateProps) {
  const { status, loading } = useSubscription();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  if (loading) {
    return (
      <div className="animate-pulse rounded-lg border border-gray-800 bg-gray-900 p-8 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  const isActive = status === "active" || status === "trialing";

  if (isActive) {
    return <>{children}</>;
  }

  async function handleSubscribe() {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to start checkout. Please try again.");
      }
    } catch {
      alert("Failed to start checkout. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div>
      {freePreview && <div className="mb-6">{freePreview}</div>}

      <div className="relative">
        {/* Blurred content hint */}
        <div className="pointer-events-none select-none blur-sm opacity-40">
          {children}
        </div>

        {/* Upgrade overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-lg border border-gray-700 bg-gray-900/95 p-8 text-center shadow-2xl max-w-md">
            <h3 className="text-lg font-bold">Unlock All Opportunities</h3>
            <p className="mt-2 text-sm text-gray-400">
              Subscribe to access 200+ daily arbitrage opportunities, real-time data, and the full scanner.
            </p>
            {status === "past_due" && (
              <p className="mt-2 text-sm text-yellow-400">
                ⚠️ Your payment is past due. Please update your payment method.
              </p>
            )}
            {status === "canceled" && (
              <p className="mt-2 text-sm text-gray-400">
                Your subscription has been canceled. Resubscribe to regain access.
              </p>
            )}
            <button
              onClick={handleSubscribe}
              disabled={checkoutLoading}
              className="mt-4 rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkoutLoading ? "Loading..." : "Subscribe — $39/mo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
