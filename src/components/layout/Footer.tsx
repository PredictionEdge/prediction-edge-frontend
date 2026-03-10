import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="mt-auto">
      <Separator />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              PredictionEdge
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground/60 hover:text-muted-foreground transition-colors">Sign In</Link>
            <Link href="/signup" className="text-sm text-muted-foreground/60 hover:text-muted-foreground transition-colors">Sign Up</Link>
          </div>
          <p className="text-xs text-muted-foreground/40">
            © {new Date().getFullYear()} PredictionEdge. For informational purposes only. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
