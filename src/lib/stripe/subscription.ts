import { getPool } from "@/lib/db/index";

export interface UserSubscription {
  status: "active" | "trialing" | "past_due" | "canceled" | "none";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  currentPeriodEnd?: number;
}

/**
 * Get subscription status for a user by Supabase UID.
 */
export async function getUserSubscription(uid: string): Promise<UserSubscription> {
  const pool = getPool();
  const result = await pool.query(
    `SELECT subscription_status, stripe_customer_id, stripe_subscription_id,
            stripe_price_id, current_period_end
     FROM pe_users WHERE uid = $1`,
    [uid]
  );

  if (result.rows.length === 0) {
    return { status: "none" };
  }

  const row = result.rows[0];
  return {
    status: row.subscription_status || "none",
    stripeCustomerId: row.stripe_customer_id || undefined,
    stripeSubscriptionId: row.stripe_subscription_id || undefined,
    stripePriceId: row.stripe_price_id || undefined,
    currentPeriodEnd: row.current_period_end
      ? Number(row.current_period_end)
      : undefined,
  };
}

/**
 * Upsert user subscription data.
 */
export async function updateUserSubscription(
  uid: string,
  data: Partial<{
    email: string;
    subscriptionStatus: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    currentPeriodEnd: number;
  }>
): Promise<void> {
  const pool = getPool();

  await pool.query(
    `INSERT INTO pe_users (uid, email, subscription_status, stripe_customer_id,
                           stripe_subscription_id, stripe_price_id, current_period_end, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
     ON CONFLICT (uid) DO UPDATE SET
       email = COALESCE(EXCLUDED.email, pe_users.email),
       subscription_status = COALESCE(EXCLUDED.subscription_status, pe_users.subscription_status),
       stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, pe_users.stripe_customer_id),
       stripe_subscription_id = COALESCE(EXCLUDED.stripe_subscription_id, pe_users.stripe_subscription_id),
       stripe_price_id = COALESCE(EXCLUDED.stripe_price_id, pe_users.stripe_price_id),
       current_period_end = COALESCE(EXCLUDED.current_period_end, pe_users.current_period_end),
       updated_at = NOW()`,
    [
      uid,
      data.email || null,
      data.subscriptionStatus || null,
      data.stripeCustomerId || null,
      data.stripeSubscriptionId || null,
      data.stripePriceId || null,
      data.currentPeriodEnd || null,
    ]
  );
}

/**
 * Find a user UID by their Stripe customer ID.
 */
export async function findUserByCustomerId(customerId: string): Promise<string | null> {
  const pool = getPool();
  const result = await pool.query(
    `SELECT uid FROM pe_users WHERE stripe_customer_id = $1 LIMIT 1`,
    [customerId]
  );
  return result.rows.length > 0 ? result.rows[0].uid : null;
}

/**
 * Check if a user has an active paid subscription.
 */
export function isSubscriptionActive(sub: UserSubscription): boolean {
  return sub.status === "active" || sub.status === "trialing";
}
