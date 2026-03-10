import { createClient } from "@/lib/supabase/server";

export interface SessionUser {
  uid: string;
  email: string | undefined;
}

/**
 * Get the current authenticated user from Supabase session.
 * Use in Server Components and API routes.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;

  return {
    uid: user.id,
    email: user.email,
  };
}
