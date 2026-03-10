import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripe) return stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY env var");
  }

  stripe = new Stripe(key, {
    apiVersion: "2026-02-25.clover",
    typescript: true,
  });

  return stripe;
}
