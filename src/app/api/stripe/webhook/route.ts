import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { updateUserSubscription, findUserByCustomerId } from "@/lib/stripe/subscription";

// Disable body parsing — we need the raw body for signature verification
export const runtime = "nodejs";

/**
 * Verify webhook signature and parse the event.
 * This prevents forged webhook calls.
 */
async function constructEvent(request: NextRequest): Promise<Stripe.Event> {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET");
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    throw new Error("Missing stripe-signature header");
  }

  return stripe.webhooks.constructEvent(body, signature, webhookSecret);
}

/**
 * Extract Firebase UID from subscription metadata or customer lookup.
 */
async function resolveUid(subscription: Stripe.Subscription): Promise<string | null> {
  // First try subscription metadata
  const uid = subscription.metadata?.firebaseUid;
  if (uid) return uid;

  // Fall back to customer lookup
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  return findUserByCustomerId(customerId);
}

export async function POST(request: NextRequest) {
  let event: Stripe.Event;

  try {
    event = await constructEvent(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const uid = await resolveUid(subscription);
        if (!uid) {
          console.error("No Firebase UID found for subscription:", subscription.id);
          break;
        }

        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        await updateUserSubscription(uid, {
          subscriptionStatus: subscription.status,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0]?.price?.id,
          currentPeriodEnd: subscription.items.data[0]?.current_period_end,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const uid = await resolveUid(subscription);
        if (!uid) {
          console.error("No Firebase UID found for deleted subscription:", subscription.id);
          break;
        }

        await updateUserSubscription(uid, {
          subscriptionStatus: "canceled",
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id;

        if (customerId) {
          const uid = await findUserByCustomerId(customerId);
          if (uid) {
            await updateUserSubscription(uid, {
              subscriptionStatus: "past_due",
            });
          }
        }
        break;
      }

      default:
        // Unhandled event type — log but don't error
        console.log(`Unhandled webhook event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Return 200 anyway to prevent Stripe retries for processing errors
    // (we've already verified the signature, so we know it's legit)
    return NextResponse.json({ received: true, error: "Processing error" });
  }
}
