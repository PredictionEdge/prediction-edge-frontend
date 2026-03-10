import { getAdminAuth } from "@/lib/auth/firebase-admin";
import { getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

function getDb() {
  // Ensure admin app is initialized
  getAdminAuth();
  return getFirestore(getApps()[0]);
}

export interface UserSubscription {
  status: "active" | "trialing" | "past_due" | "canceled" | "none";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  currentPeriodEnd?: number;
}

const USERS_COLLECTION = "users";

/**
 * Get subscription status for a user by Firebase UID.
 */
export async function getUserSubscription(uid: string): Promise<UserSubscription> {
  try {
    const doc = await getDb().collection(USERS_COLLECTION).doc(uid).get();
    if (!doc.exists) {
      return { status: "none" };
    }
    const data = doc.data();
    return {
      status: data?.subscriptionStatus || "none",
      stripeCustomerId: data?.stripeCustomerId,
      stripeSubscriptionId: data?.stripeSubscriptionId,
      stripePriceId: data?.stripePriceId,
      currentPeriodEnd: data?.currentPeriodEnd,
    };
  } catch {
    return { status: "none" };
  }
}

/**
 * Update subscription data for a user.
 */
export async function updateUserSubscription(
  uid: string,
  data: Partial<{
    subscriptionStatus: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    currentPeriodEnd: number;
  }>
): Promise<void> {
  await getDb()
    .collection(USERS_COLLECTION)
    .doc(uid)
    .set({ ...data, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}

/**
 * Find a user UID by their Stripe customer ID.
 */
export async function findUserByCustomerId(customerId: string): Promise<string | null> {
  const snapshot = await getDb()
    .collection(USERS_COLLECTION)
    .where("stripeCustomerId", "==", customerId)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  return snapshot.docs[0].id;
}

/**
 * Check if a user has an active paid subscription.
 */
export function isSubscriptionActive(sub: UserSubscription): boolean {
  return sub.status === "active" || sub.status === "trialing";
}
