import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getUserSubscription } from "@/lib/stripe/subscription";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sub = await getUserSubscription(user.uid);
    return NextResponse.json({
      status: sub.status,
      currentPeriodEnd: sub.currentPeriodEnd,
    });
  } catch {
    return NextResponse.json({ status: "none" });
  }
}
