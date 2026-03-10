import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getUserSubscription, updateUserSubscription } from "@/lib/stripe/subscription";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      console.error("Missing STRIPE_PRICE_ID");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Check if user already has a Stripe customer ID
    const existingSub = await getUserSubscription(user.uid);
    let customerId = existingSub.stripeCustomerId;

    // Create Stripe customer if they don't have one
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { firebaseUid: user.uid },
      });
      customerId = customer.id;

      // Save customer ID immediately
      await updateUserSubscription(user.uid, {
        stripeCustomerId: customerId,
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/dashboard?checkout=canceled`,
      // Prevent duplicate subscriptions
      subscription_data: {
        metadata: { firebaseUid: user.uid },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
