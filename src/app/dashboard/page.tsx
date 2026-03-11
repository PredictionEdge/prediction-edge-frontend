import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/layout/SignOutButton";
import ManageSubscription from "@/components/dashboard/ManageSubscription";
import StatsBar from "@/components/dashboard/StatsBar";
import ArbTable from "@/components/dashboard/ArbTable";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-lg font-medium">Dashboard</h1>
          <p className="text-xs text-muted-foreground/40 mt-0.5">{user.email}</p>
        </div>
        <div className="flex items-center gap-1">
          <ManageSubscription />
          <SignOutButton />
        </div>
      </div>
      <ErrorBoundary>
        <StatsBar />
        <ArbTable />
      </ErrorBoundary>
    </div>
  );
}
