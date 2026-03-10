"use client";

import { useState, useEffect, useCallback } from "react";
import { ArbWithSpread } from "@/lib/db/types";
import ArbCalculator from "./ArbCalculator";

type SortField = "spread" | "market" | "category" | "updatedAt";
type SortDir = "asc" | "desc";

interface ArbsResponse {
  arbs: ArbWithSpread[];
  total: number;
  isPaid: boolean;
  limited: boolean;
}

export default function ArbTable() {
  const [data, setData] = useState<ArbsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState<SortField>("spread");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedArb, setSelectedArb] = useState<ArbWithSpread | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchArbs = useCallback(async () => {
    try {
      const res = await fetch("/api/arbs");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
      setLastRefresh(new Date());
      setError("");
    } catch {
      setError("Failed to load opportunities");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArbs();
    const interval = setInterval(fetchArbs, 30000);
    return () => clearInterval(interval);
  }, [fetchArbs]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-800/50 bg-red-900/20 p-6 text-center">
        <p className="text-red-400">{error}</p>
        <button onClick={fetchArbs} className="mt-3 text-sm text-indigo-400 hover:text-indigo-300">
          Try again
        </button>
      </div>
    );
  }

  if (!data || data.arbs.length === 0) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-12 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-gray-400">No arbitrage opportunities found right now.</p>
        <p className="text-sm text-gray-500 mt-1">Markets are scanned continuously — check back soon.</p>
      </div>
    );
  }

  // Categories for filter
  const categories = ["all", ...Array.from(new Set(data.arbs.map((a) => a.category).filter(Boolean)))];

  // Filter & sort
  let filtered = categoryFilter === "all"
    ? data.arbs
    : data.arbs.filter((a) => a.category === categoryFilter);

  filtered = [...filtered].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    if (sortField === "spread") return mul * (a.spread - b.spread);
    if (sortField === "market") return mul * a.market.localeCompare(b.market);
    if (sortField === "category") return mul * (a.category || "").localeCompare(b.category || "");
    if (sortField === "updatedAt") return mul * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    return 0;
  });

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "spread" ? "desc" : "asc");
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <span className="text-gray-600 ml-1">↕</span>;
    return <span className="text-indigo-400 ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  return (
    <div>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-300 focus:border-indigo-500 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            {filtered.length} of {data.total} opportunities
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-500">
              Live · {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
          <button
            onClick={fetchArbs}
            className="rounded-md border border-gray-700 px-2.5 py-1 text-xs text-gray-400 hover:border-gray-500 hover:text-white transition-colors"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/80">
              <th
                onClick={() => toggleSort("market")}
                className="cursor-pointer px-4 py-3 text-left font-medium text-gray-400 hover:text-white transition-colors"
              >
                Market <SortIcon field="market" />
              </th>
              <th
                onClick={() => toggleSort("category")}
                className="cursor-pointer px-4 py-3 text-left font-medium text-gray-400 hover:text-white transition-colors hidden md:table-cell"
              >
                Category <SortIcon field="category" />
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">
                Platforms
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">
                Kalshi
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">
                Polymarket
              </th>
              <th
                onClick={() => toggleSort("spread")}
                className="cursor-pointer px-4 py-3 text-right font-medium text-gray-400 hover:text-white transition-colors"
              >
                Spread <SortIcon field="spread" />
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                Calc
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((arb, i) => (
              <tr
                key={arb.id}
                className={`border-b border-gray-800/50 transition-colors hover:bg-gray-800/30 ${
                  i % 2 === 0 ? "bg-gray-900/30" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <div className="max-w-[280px]">
                    <p className="font-medium text-white truncate" title={arb.market}>
                      {arb.market}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{arb.direction}</p>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {arb.category && (
                    <span className="inline-block rounded-full bg-gray-800 px-2.5 py-0.5 text-xs text-gray-400">
                      {arb.category}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <a
                      href={arb.kalshiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded bg-blue-900/30 border border-blue-800/50 px-2 py-0.5 text-xs text-blue-300 hover:bg-blue-900/50 transition-colors"
                    >
                      Kalshi ↗
                    </a>
                    <a
                      href={arb.polymarketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded bg-purple-900/30 border border-purple-800/50 px-2 py-0.5 text-xs text-purple-300 hover:bg-purple-900/50 transition-colors"
                    >
                      Poly ↗
                    </a>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-300">
                  {(arb.kalshiPrice * 100).toFixed(0)}¢
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-300">
                  {(arb.polymarketPrice * 100).toFixed(0)}¢
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`inline-block rounded-md px-2.5 py-1 font-mono font-semibold text-sm ${
                      arb.spread >= 5
                        ? "bg-green-900/40 text-green-300 border border-green-800/50"
                        : arb.spread >= 3
                        ? "bg-emerald-900/30 text-emerald-400 border border-emerald-800/40"
                        : "bg-gray-800 text-gray-300 border border-gray-700"
                    }`}
                  >
                    {arb.spread.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => setSelectedArb(selectedArb?.id === arb.id ? null : arb)}
                    className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                      selectedArb?.id === arb.id
                        ? "bg-indigo-600 text-white"
                        : "border border-gray-700 text-gray-400 hover:border-indigo-500 hover:text-indigo-400"
                    }`}
                  >
                    {selectedArb?.id === arb.id ? "✕" : "📊"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Arb Calculator */}
      {selectedArb && (
        <div className="mt-4">
          <ArbCalculator arb={selectedArb} onClose={() => setSelectedArb(null)} />
        </div>
      )}

      {/* Paywall indicator */}
      {data.limited && (
        <div className="mt-4 rounded-lg border border-indigo-800/50 bg-indigo-900/20 p-4 text-center">
          <p className="text-sm text-indigo-300">
            Showing {data.arbs.length} of {data.total} opportunities.{" "}
            <button
              onClick={async () => {
                const res = await fetch("/api/stripe/checkout", { method: "POST" });
                const d = await res.json();
                if (d.url) window.location.href = d.url;
              }}
              className="font-semibold text-indigo-400 hover:text-indigo-300 underline"
            >
              Subscribe to unlock all →
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="rounded-lg border border-gray-800 overflow-hidden">
      <div className="bg-gray-900/80 px-4 py-3 border-b border-gray-800">
        <div className="h-4 w-32 bg-gray-800 rounded animate-pulse" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-gray-800/50">
          <div className="h-4 flex-1 bg-gray-800/60 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-800/60 rounded animate-pulse" />
          <div className="h-4 w-12 bg-gray-800/60 rounded animate-pulse" />
          <div className="h-4 w-12 bg-gray-800/60 rounded animate-pulse" />
          <div className="h-6 w-16 bg-gray-800/60 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
