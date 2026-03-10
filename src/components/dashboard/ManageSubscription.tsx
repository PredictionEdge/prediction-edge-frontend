"use client";

import { useState } from "react";
import { useSubscription } from "@/lib/stripe/useSubscription";
import { Button } from "@/components/ui/button";

export default function ManageSubscription() {
  const { status, loading } = useSubscription();
  const [portalLoading, setPortalLoading] = useState(false);

  if (loading) return null;
  const isActive = status === "active" || status === "trialing";
  if (!isActive) return null;

  async function handleManage() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { alert("Failed to open billing portal."); }
    finally { setPortalLoading(false); }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleManage} disabled={portalLoading}>
      {portalLoading ? "Loading..." : "Manage Subscription"}
    </Button>
  );
}
