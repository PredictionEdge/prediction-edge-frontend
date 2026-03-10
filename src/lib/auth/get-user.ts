import { createClient } from "@/lib/supabase/server";

export interface SessionUser {
  uid: string;
  email: string | undefined;
}

/**
 * Get the current authenticated user from Supabase session.
 * Uses getClaims() which validates JWT signature — safe for server-side use.
 * Never use getSession() in server code as it can be spoofed.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) return null;

  return {
    uid: data.claims.sub!,
    email: data.claims.email as string | undefined,
  };
}
