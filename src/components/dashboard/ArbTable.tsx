"use client";

import { useState, useEffect, useCallback } from "react";
import { ArbWithSpread } from "@/lib/db/types";
import ArbCalculator from "./ArbCalculator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

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

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-destructive">{error}</p>
        <Button variant="link" onClick={fetchArbs} className="mt-2">Try again</Button>
      </div>
    );
  }

  if (!data || data.arbs.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-muted-foreground">No arbitrage opportunities found right now.</p>
        <p className="text-sm text-muted-foreground/60 mt-1">Markets are scanned continuously — check back soon.</p>
      </div>
    );
  }

  const categories = ["all", ...Array.from(new Set(data.arbs.map((a) => a.category).filter(Boolean)))];

  let filtered = categoryFilter === "all" ? data.arbs : data.arbs.filter((a) => a.category === categoryFilter);
  filtered = [...filtered].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    if (sortField === "spread") return mul * (a.spread - b.spread);
    if (sortField === "market") return mul * a.market.localeCompare(b.market);
    if (sortField === "category") return mul * (a.category || "").localeCompare(b.category || "");
    if (sortField === "updatedAt") return mul * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    return 0;
  });

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir(field === "spread" ? "desc" : "asc"); }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-muted-foreground/40 ml-1">↕</span>;
    return <span className="text-primary ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === "all" ? "All Categories" : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {filtered.length} of {data.total} opportunities
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Live · {lastRefresh.toLocaleTimeString()}</span>
          </div>
          <Button variant="outline" size="sm" onClick={fetchArbs}>↻ Refresh</Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer hover:text-foreground" onClick={() => toggleSort("market")}>
                Market <SortIcon field="market" />
              </TableHead>
              <TableHead className="cursor-pointer hover:text-foreground hidden md:table-cell" onClick={() => toggleSort("category")}>
                Category <SortIcon field="category" />
              </TableHead>
              <TableHead>Platforms</TableHead>
              <TableHead className="text-right">Kalshi</TableHead>
              <TableHead className="text-right">Polymarket</TableHead>
              <TableHead className="text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("spread")}>
                Spread <SortIcon field="spread" />
              </TableHead>
              <TableHead className="text-center">Calc</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((arb) => (
              <TableRow key={arb.id} className="group">
                <TableCell>
                  <div className="max-w-[280px]">
                    <p className="font-medium truncate" title={arb.market}>{arb.market}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{arb.direction}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {arb.category && <Badge variant="secondary">{arb.category}</Badge>}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    <a href={arb.kalshiUrl} target="_blank" rel="noopener noreferrer">
                      <Badge variant="outline" className="text-blue-400 border-blue-800/50 hover:bg-blue-900/30 cursor-pointer">Kalshi ↗</Badge>
                    </a>
                    <a href={arb.polymarketUrl} target="_blank" rel="noopener noreferrer">
                      <Badge variant="outline" className="text-purple-400 border-purple-800/50 hover:bg-purple-900/30 cursor-pointer">Poly ↗</Badge>
                    </a>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">{(arb.kalshiPrice * 100).toFixed(0)}¢</TableCell>
                <TableCell className="text-right font-mono">{(arb.polymarketPrice * 100).toFixed(0)}¢</TableCell>
                <TableCell className="text-right">
                  <Badge variant={arb.spread >= 5 ? "default" : arb.spread >= 3 ? "secondary" : "outline"}
                    className={arb.spread >= 5 ? "bg-green-600 hover:bg-green-700" : arb.spread >= 3 ? "bg-emerald-900/50 text-emerald-400" : ""}
                  >
                    {arb.spread.toFixed(1)}%
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant={selectedArb?.id === arb.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedArb(selectedArb?.id === arb.id ? null : arb)}
                  >
                    {selectedArb?.id === arb.id ? "✕" : "📊"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedArb && (
        <div className="mt-4">
          <ArbCalculator arb={selectedArb} onClose={() => setSelectedArb(null)} />
        </div>
      )}

      {data.limited && (
        <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
          <p className="text-sm text-primary">
            Showing {data.arbs.length} of {data.total} opportunities.{" "}
            <button
              onClick={async () => {
                const res = await fetch("/api/stripe/checkout", { method: "POST" });
                const d = await res.json();
                if (d.url) window.location.href = d.url;
              }}
              className="font-semibold underline hover:no-underline"
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
    <div className="rounded-lg border overflow-hidden">
      <div className="p-4 border-b">
        <Skeleton className="h-4 w-32" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 border-b">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}
