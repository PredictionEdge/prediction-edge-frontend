"use client";

import { useState, useEffect } from "react";

interface SubscriptionStatus {
  status: "active" | "trialing" | "past_due" | "canceled" | "none";
  loading: boolean;
}

export function useSubscription(): SubscriptionStatus {
  const [status, setStatus] = useState<SubscriptionStatus>({
    status: "none",
    loading: true,
  });

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/stripe/status");
        if (res.ok) {
          const data = await res.json();
          setStatus({ status: data.status, loading: false });
        } else {
          setStatus({ status: "none", loading: false });
        }
      } catch {
        setStatus({ status: "none", loading: false });
      }
    }
    fetchStatus();
  }, []);

  return status;
}
