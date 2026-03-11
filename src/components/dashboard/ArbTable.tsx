"use client";

import { useState } from "react";
import { ArbWithSpread } from "@/lib/db/types";
import { useArbs } from "@/lib/hooks/useArbs";
import ArbCalculator from "./ArbCalculator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type SortField = "spread" | "market" | "category";
type SortDir = "asc" | "desc";

export default function ArbTable() {
  const { data, loading, error, lastRefresh, refetch } = useArbs();
  const [sortField, setSortField] = useState<SortField>("spread");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedArb, setSelectedArb] = useState<ArbWithSpread | null>(null);

  if (loading) return <LoadingSkeleton />;
  if (error) return (
    <div className="rounded-2xl border border-border/40 p-8 text-center">
      <p className="text-sm text-muted-foreground">{error}</p>
      <Button variant="ghost" size="sm" onClick={refetch} className="mt-2 text-xs">Retry</Button>
    </div>
  );
  if (!data?.arbs.length) return (
    <div className="rounded-2xl border border-border/40 p-16 text-center">
      <p className="text-sm text-muted-foreground">No opportunities right now</p>
      <p className="text-xs text-muted-foreground/40 mt-1">Check back soon</p>
    </div>
  );

  const categories = ["all", ...Array.from(new Set(data.arbs.map(a => a.category).filter(Boolean)))];
  let filtered = categoryFilter === "all" ? data.arbs : data.arbs.filter(a => a.category === categoryFilter);
  filtered = [...filtered].sort((a, b) => {
    const m = sortDir === "asc" ? 1 : -1;
    if (sortField === "spread") return m * (a.spread - b.spread);
    if (sortField === "market") return m * a.market.localeCompare(b.market);
    return m * (a.category || "").localeCompare(b.category || "");
  });

  function toggleSort(f: SortField) {
    if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(f); setSortDir(f === "spread" ? "desc" : "asc"); }
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-1 overflow-x-auto">
          {categories.map(c => (
            <button key={c} onClick={() => setCategoryFilter(c)}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                categoryFilter === c ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}>
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-spread-green)] opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-spread-green)]" />
            </span>
            <span className="text-xs text-muted-foreground/40">{lastRefresh.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-0.5">
            {(["spread", "market"] as SortField[]).map(f => (
              <button key={f} onClick={() => toggleSort(f)}
                className={`px-2 py-1 text-xs rounded-md capitalize transition-colors ${
                  sortField === f ? "text-foreground bg-secondary" : "text-muted-foreground/40 hover:text-muted-foreground"
                }`}>
                {f}{sortField === f && (sortDir === "desc" ? " ↓" : " ↑")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-border/40 overflow-hidden divide-y divide-border/30">
        {filtered.map(arb => (
          <div key={arb.id}
            className={`transition-colors ${selectedArb?.id === arb.id ? "bg-secondary/50" : "hover:bg-secondary/30"}`}>
            <div className="px-5 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                {arb.category && <p className="text-xs text-muted-foreground/40 mb-0.5">{arb.category}</p>}
                <p className="text-sm truncate">{arb.market}</p>
                <p className="text-xs text-muted-foreground/40 mt-0.5 hidden sm:block">{arb.direction}</p>
              </div>
              <div className="flex items-center gap-5 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-[var(--color-kalshi)]/50 mb-0.5">Kalshi</p>
                  <a href={arb.kalshiUrl} target="_blank" rel="noopener noreferrer"
                    className="text-sm font-mono text-[var(--color-kalshi)] hover:underline">
                    {(arb.kalshiPrice * 100).toFixed(0)}¢
                  </a>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-[var(--color-poly)]/50 mb-0.5">Poly</p>
                  <a href={arb.polymarketUrl} target="_blank" rel="noopener noreferrer"
                    className="text-sm font-mono text-[var(--color-poly)] hover:underline">
                    {(arb.polymarketPrice * 100).toFixed(0)}¢
                  </a>
                </div>
                <div className="w-14 text-right">
                  <span className="text-sm font-mono text-[var(--color-spread-green)]">
                    +{arb.spread.toFixed(1)}%
                  </span>
                </div>
                <button
                  onClick={() => setSelectedArb(selectedArb?.id === arb.id ? null : arb)}
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                    selectedArb?.id === arb.id
                      ? "bg-foreground text-background"
                      : "text-muted-foreground/30 hover:text-muted-foreground"
                  }`}>
                  {selectedArb?.id === arb.id ? "×" : "→"}
                </button>
              </div>
            </div>
            {selectedArb?.id === arb.id && (
              <div className="px-5 pb-4">
                <ArbCalculator arb={arb} onClose={() => setSelectedArb(null)} />
              </div>
            )}
          </div>
        ))}
      </div>

      {data.limited && (
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            {data.arbs.length} of {data.total} shown ·{" "}
            <button onClick={async () => {
              const res = await fetch("/api/stripe/checkout", { method: "POST" });
              const d = await res.json();
              if (d.url) window.location.href = d.url;
            }} className="text-foreground hover:underline">Unlock all</button>
          </p>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="rounded-2xl border border-border/40 overflow-hidden divide-y divide-border/30">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="px-5 py-4 flex items-center gap-4">
          <div className="flex-1"><Skeleton className="h-4 w-3/4" /></div>
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-14" />
        </div>
      ))}
    </div>
  );
}
