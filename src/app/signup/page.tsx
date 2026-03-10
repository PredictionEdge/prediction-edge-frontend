"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SignupPage() {
  const { signUp, signInWithGoogle, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError("");
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      await signUp(email, password);
      // Supabase may require email confirmation
      setConfirmSent(true);
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : "";
      if (m.includes("already registered")) setError("Account already exists.");
      else if (m.includes("weak_password") || m.includes("least 8")) setError("Password too weak.");
      else if (m.includes("valid email")) setError("Please enter a valid email.");
      else setError("Sign up failed.");
    } finally { setLoading(false); }
  }

  if (confirmSent) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <div className="text-4xl mb-4">📧</div>
          <h1 className="font-serif text-2xl font-bold">Check your email</h1>
          <p className="text-sm text-muted-foreground mt-2">
            We sent a confirmation link to <span className="text-foreground">{email}</span>.
            Click it to activate your account.
          </p>
          <Button variant="ghost" className="mt-6 text-muted-foreground" onClick={() => router.push("/login")}>
            Back to sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Start finding arbitrage opportunities</p>
        </div>

        {error && <div className="mb-4 rounded-xl bg-destructive/5 border border-destructive/10 px-4 py-2.5 text-sm text-destructive">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
            <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="rounded-xl h-11 bg-background/50 border-border/50" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs text-muted-foreground">Password</Label>
            <Input id="password" type="password" required autoComplete="new-password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="rounded-xl h-11 bg-background/50 border-border/50" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm" className="text-xs text-muted-foreground">Confirm Password</Label>
            <Input id="confirm" type="password" required autoComplete="new-password" minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="rounded-xl h-11 bg-background/50 border-border/50" />
          </div>
          <Button type="submit" disabled={loading || authLoading} className="w-full rounded-full h-11 bg-[var(--color-warm)] text-[var(--color-background)] hover:bg-[var(--color-warm)]/90 font-medium">
            {loading ? "Creating…" : "Create account"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <Separator className="flex-1" /><span className="text-[10px] text-muted-foreground/40">or</span><Separator className="flex-1" />
        </div>

        <Button variant="outline" className="w-full rounded-full h-11 border-border/50" onClick={() => signInWithGoogle()} disabled={authLoading}>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </Button>

        <p className="mt-8 text-center text-xs text-muted-foreground/60">
          Already have an account? <Link href="/login" className="text-[var(--color-warm)] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
