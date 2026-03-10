"use client";

import { useState } from "react";
import { useSubscription } from "@/lib/stripe/useSubscription";

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
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Failed to open billing portal.");
    } finally {
      setPortalLoading(false);
    }
  }

  return (
    <button
      onClick={handleManage}
      disabled={portalLoading}
      className="rounded-md border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:border-gray-500 hover:text-white disabled:opacity-50"
    >
      {portalLoading ? "Loading..." : "Manage Subscription"}
    </button>
  );
}
