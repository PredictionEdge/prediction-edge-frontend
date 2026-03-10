import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/layout/SignOutButton";
import ManageSubscription from "@/components/dashboard/ManageSubscription";
import SubscriptionGate from "@/components/dashboard/SubscriptionGate";

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Free preview: show 3 sample arbs
  const freePreview = (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-3">Sample Opportunities (3 of 200+)</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-left text-gray-500">
            <th className="pb-2">Market</th>
            <th className="pb-2">Platforms</th>
            <th className="pb-2">Spread</th>
          </tr>
        </thead>
        <tbody className="text-gray-300">
          <tr className="border-b border-gray-800/50">
            <td className="py-2">Will Bitcoin hit $150k by Dec 2025?</td>
            <td className="py-2">Polymarket ↔ Kalshi</td>
            <td className="py-2 text-green-400">4.2%</td>
          </tr>
          <tr className="border-b border-gray-800/50">
            <td className="py-2">Next Fed rate decision</td>
            <td className="py-2">Kalshi ↔ Opinion</td>
            <td className="py-2 text-green-400">3.8%</td>
          </tr>
          <tr>
            <td className="py-2">2026 FIFA World Cup host</td>
            <td className="py-2">Polymarket ↔ Opinion</td>
            <td className="py-2 text-green-400">2.5%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  // Full content (behind paywall)
  const fullDashboard = (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-12 text-center text-gray-500">
      Coming in Phase 4 — full arb table with real-time data from your prediction-market-arbitrage DB
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Arbitrage Dashboard</h1>
          <p className="mt-1 text-sm text-gray-400">
            Signed in as {user.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ManageSubscription />
          <SignOutButton />
        </div>
      </div>

      <div className="mt-8">
        <SubscriptionGate freePreview={freePreview}>
          {fullDashboard}
        </SubscriptionGate>
      </div>
    </div>
  );
}
