import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold text-gray-400 hover:text-white">
              PredictionEdge
            </Link>
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-300">
              Sign In
            </Link>
            <Link href="/signup" className="text-sm text-gray-500 hover:text-gray-300">
              Sign Up
            </Link>
          </div>
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} PredictionEdge. For informational purposes only. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
