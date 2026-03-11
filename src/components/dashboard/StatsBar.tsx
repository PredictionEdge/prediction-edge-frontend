"use client";

import { useArbs } from "@/lib/hooks/useArbs";

export default function StatsBar() {
  const { data } = useArbs();

  if (!data?.arbs?.length) return null;

  const spreads = data.arbs.map((a) => a.spread);
  const avg = spreads.reduce((a, b) => a + b, 0) / spreads.length;
  const max = Math.max(...spreads);

  return (
    <div className="flex items-center gap-6 mb-6 text-xs text-muted-foreground/40">
      <span>
        <span className="text-foreground font-mono">{data.total}</span> opportunities
      </span>
      <span>
        <span className="text-foreground font-mono">{avg.toFixed(1)}%</span> avg spread
      </span>
      <span>
        <span className="text-[var(--color-spread-green)] font-mono">{max.toFixed(1)}%</span> best
      </span>
    </div>
  );
}
