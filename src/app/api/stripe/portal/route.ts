import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getUserSubscription } from "@/lib/stripe/subscription";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sub = await getUserSubscription(user.uid);
    if (!sub.stripeCustomerId) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${appUrl}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Portal error:", error);
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 });
  }
}
