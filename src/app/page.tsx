import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
        Stop Guessing.
        <br />
        <span className="text-indigo-400">Start Arbitraging.</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-gray-400">
        Real-time arbitrage opportunities across Polymarket, Kalshi &amp; Opinion.
        200+ daily opportunities. Backed by math, not gut feelings.
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          href="/dashboard"
          className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          View Live Opportunities
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-gray-700 px-6 py-3 text-sm font-semibold text-gray-300 hover:border-gray-500 hover:text-white"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
