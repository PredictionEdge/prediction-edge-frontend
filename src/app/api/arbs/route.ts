import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getUserSubscription, isSubscriptionActive } from "@/lib/stripe/subscription";
import { getActiveArbs } from "@/lib/db/arbs";

const FREE_LIMIT = 3;

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const arbs = await getActiveArbs();

    // Check subscription
    const sub = await getUserSubscription(user.uid);
    const isPaid = isSubscriptionActive(sub);

    return NextResponse.json({
      arbs: isPaid ? arbs : arbs.slice(0, FREE_LIMIT),
      total: arbs.length,
      isPaid,
      limited: !isPaid && arbs.length > FREE_LIMIT,
    });
  } catch (error) {
    console.error("Arbs API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch opportunities" },
      { status: 500 }
    );
  }
}
