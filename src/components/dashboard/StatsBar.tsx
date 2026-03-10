"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Stats { total: number; avgSpread: number; maxSpread: number; categories: number; }

export default function StatsBar() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/arbs");
        if (!res.ok) return;
        const data = await res.json();
        if (!data.arbs || data.arbs.length === 0) return;
        const spreads = data.arbs.map((a: { spread: number }) => a.spread);
        const cats = new Set(data.arbs.map((a: { category: string }) => a.category).filter(Boolean));
        setStats({
          total: data.total,
          avgSpread: spreads.reduce((a: number, b: number) => a + b, 0) / spreads.length,
          maxSpread: Math.max(...spreads),
          categories: cats.size,
        });
      } catch { /* silent */ }
    }
    fetchStats();
  }, []);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <StatCard icon="🎯" value={stats.total.toString()} label="Active Opportunities" />
      <StatCard icon="📊" value={`${stats.avgSpread.toFixed(1)}%`} label="Avg Spread" />
      <StatCard icon="🔥" value={`${stats.maxSpread.toFixed(1)}%`} label="Best Spread" />
      <StatCard icon="📁" value={stats.categories.toString()} label="Categories" />
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <span className="text-2xl">{icon}</span>
        <p className="mt-2 text-2xl font-bold font-mono">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </CardContent>
    </Card>
  );
}
