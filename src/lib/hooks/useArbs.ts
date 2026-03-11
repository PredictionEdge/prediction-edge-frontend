"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ArbWithSpread } from "@/lib/db/types";

interface ArbsResponse {
  arbs: ArbWithSpread[];
  total: number;
  isPaid: boolean;
  limited: boolean;
}

interface UseArbsReturn {
  data: ArbsResponse | null;
  loading: boolean;
  error: string;
  lastRefresh: Date;
  refetch: () => Promise<void>;
}

// Module-level cache so StatsBar and ArbTable share the same data
let cachedData: ArbsResponse | null = null;
let cacheTime = 0;
let inflightPromise: Promise<ArbsResponse> | null = null;
const CACHE_TTL = 5_000; // 5s dedup window
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

async function fetchArbs(): Promise<ArbsResponse> {
  const now = Date.now();
  if (cachedData && now - cacheTime < CACHE_TTL) return cachedData;
  if (inflightPromise) return inflightPromise;

  inflightPromise = fetch("/api/arbs")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    })
    .then((json: ArbsResponse) => {
      cachedData = json;
      cacheTime = Date.now();
      inflightPromise = null;
      notifyListeners();
      return json;
    })
    .catch((err) => {
      inflightPromise = null;
      throw err;
    });

  return inflightPromise;
}

export function useArbs(autoRefreshMs = 30_000): UseArbsReturn {
  const [data, setData] = useState<ArbsResponse | null>(cachedData);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const refetch = useCallback(async () => {
    try {
      // Bust cache for manual refetch
      cacheTime = 0;
      const result = await fetchArbs();
      setData(result);
      setLastRefresh(new Date());
      setError("");
    } catch {
      setError("Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchArbs()
      .then((result) => {
        setData(result);
        setLastRefresh(new Date());
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load");
        setLoading(false);
      });

    // Listen for updates from other components
    const listener = () => {
      if (cachedData) {
        setData(cachedData);
        setLastRefresh(new Date());
      }
    };
    listeners.add(listener);

    // Auto-refresh
    const interval = setInterval(() => {
      cacheTime = 0; // bust cache
      fetchArbs()
        .then((result) => {
          setData(result);
          setLastRefresh(new Date());
        })
        .catch(() => {});
    }, autoRefreshMs);

    return () => {
      listeners.delete(listener);
      clearInterval(interval);
    };
  }, [autoRefreshMs]);

  return { data, loading, error, lastRefresh, refetch };
}
