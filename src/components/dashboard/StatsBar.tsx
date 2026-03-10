"use client";

import { useState, useEffect } from "react";

interface Stats {
  total: number;
  avgSpread: number;
  maxSpread: number;
  categories: number;
}

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
      } catch {
        // silent
      }
    }
    fetchStats();
  }, []);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <StatCard label="Active Opportunities" value={stats.total.toString()} icon="🎯" />
      <StatCard label="Avg Spread" value={`${stats.avgSpread.toFixed(1)}%`} icon="📊" />
      <StatCard label="Best Spread" value={`${stats.maxSpread.toFixed(1)}%`} icon="🔥" />
      <StatCard label="Categories" value={stats.categories.toString()} icon="📁" />
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-4">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-bold font-mono text-white">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
