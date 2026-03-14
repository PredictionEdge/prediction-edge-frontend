"use client";

import { useState } from "react";
import { ArbWithSpread } from "@/lib/db/types";
import { Input } from "@/components/ui/input";

interface Props { arb: ArbWithSpread; onClose: () => void; }

export default function ArbCalculator({ arb }: Props) {
  const [stake, setStake] = useState(1000);

  const totalCost = arb.kalshiPrice + arb.polymarketPrice;
  const netProfitPerContract = arb.spread / 100; // net_spread_pct already includes fees
  const roi = totalCost > 0 ? (netProfitPerContract / totalCost) * 100 : 0;
  const kalshiAlloc = totalCost > 0 ? (arb.kalshiPrice / totalCost) * stake : 0;
  const polyAlloc = totalCost > 0 ? (arb.polymarketPrice / totalCost) * stake : 0;
  const contracts = totalCost > 0 ? Math.floor(stake / totalCost) : 0;
  const actualProfit = contracts * netProfitPerContract;

  return (
    <div className="rounded-xl bg-secondary/50 p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-[160px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-xs">$</span>
          <Input type="number" value={stake} onChange={(e) => setStake(Math.max(0, Number(e.target.value)))}
            className="pl-6 h-8 text-xs font-mono bg-background/50 border-border/40 rounded-lg" min={0} step={100} />
        </div>
        <div className="flex gap-1">
          {[100, 500, 1000, 5000].map(v => (
            <button key={v} onClick={() => setStake(v)}
              className={`rounded-md px-2 py-1 text-xs transition-colors ${
                stake === v ? "bg-foreground text-background" : "text-muted-foreground/40 hover:text-muted-foreground"
              }`}>${v >= 1000 ? `${v/1000}k` : v}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 text-center">
        <Stat label="Kalshi" value={`$${kalshiAlloc.toFixed(0)}`} color="var(--color-kalshi)" />
        <Stat label="Polymarket" value={`$${polyAlloc.toFixed(0)}`} color="var(--color-poly)" />
        <Stat label="Contracts" value={contracts.toLocaleString()} color="var(--color-foreground)" />
        <Stat label="Profit" value={`$${actualProfit.toFixed(2)}`} sub={`${roi.toFixed(1)}%`} color="var(--color-spread-green)" />
      </div>

      <p className="mt-3 text-xs text-muted-foreground/30 text-center">
        Fees included · excludes slippage
      </p>
    </div>
  );
}

function Stat({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground/40 mb-1">{label}</p>
      <p className="text-sm font-mono font-medium" style={{ color }}>{value}</p>
      {sub && <p className="text-xs font-mono text-muted-foreground/40 mt-0.5">{sub}</p>}
    </div>
  );
}
