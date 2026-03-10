import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/layout/SignOutButton";
import ManageSubscription from "@/components/dashboard/ManageSubscription";
import StatsBar from "@/components/dashboard/StatsBar";
import ArbTable from "@/components/dashboard/ArbTable";

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Arbitrage Dashboard
            </span>
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {user.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ManageSubscription />
          <SignOutButton />
        </div>
      </div>

      {/* Stats */}
      <StatsBar />

      {/* Table */}
      <ArbTable />
    </div>
  );
}
