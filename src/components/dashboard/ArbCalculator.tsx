"use client";

import { useState } from "react";
import { ArbWithSpread } from "@/lib/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Props {
  arb: ArbWithSpread;
  onClose: () => void;
}

export default function ArbCalculator({ arb, onClose }: Props) {
  const [stake, setStake] = useState(1000);

  const totalCost = arb.kalshiPrice + arb.polymarketPrice;
  const profitPerDollar = 1 - totalCost;
  const roi = (profitPerDollar / totalCost) * 100;
  const kalshiAllocation = (arb.kalshiPrice / totalCost) * stake;
  const polyAllocation = (arb.polymarketPrice / totalCost) * stake;
  const contracts = Math.floor(stake / totalCost);
  const actualCost = contracts * totalCost;
  const actualProfit = contracts * profitPerDollar;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <CardTitle className="text-base">Arbitrage Calculator</CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground truncate">{arb.market}</p>
        <p className="text-xs text-muted-foreground/60 mb-4">{arb.direction}</p>

        {/* Stake input */}
        <div className="mb-4">
          <Label>Total Stake</Label>
          <div className="relative mt-1.5">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input
              type="number"
              value={stake}
              onChange={(e) => setStake(Math.max(0, Number(e.target.value)))}
              className="pl-7 font-mono"
              min={0}
              step={100}
            />
          </div>
          <div className="flex gap-2 mt-2">
            {[100, 500, 1000, 5000].map((v) => (
              <Button key={v} variant={stake === v ? "default" : "outline"} size="sm"
                onClick={() => setStake(v)} className="text-xs">
                ${v.toLocaleString()}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-3">
          <ResultCard label="Kalshi Allocation" value={`$${kalshiAllocation.toFixed(2)}`}
            sub={`@ ${(arb.kalshiPrice * 100).toFixed(0)}¢/share`} accent="text-blue-400" />
          <ResultCard label="Polymarket Allocation" value={`$${polyAllocation.toFixed(2)}`}
            sub={`@ ${(arb.polymarketPrice * 100).toFixed(0)}¢/share`} accent="text-purple-400" />
          <ResultCard label="Contracts" value={contracts.toLocaleString()}
            sub={`Cost: $${actualCost.toFixed(2)}`} accent="text-foreground" />
          <ResultCard label="Guaranteed Profit" value={`$${actualProfit.toFixed(2)}`}
            sub={`${roi.toFixed(1)}% ROI`} accent="text-green-400" />
        </div>

        <Separator className="my-4" />

        {/* Breakdown */}
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <p className="font-medium uppercase tracking-wider text-muted-foreground/60 mb-2">How it works</p>
          <div className="flex justify-between">
            <span>Cost per pair (Kalshi + Poly)</span>
            <span className="font-mono">${totalCost.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span>Payout per pair (guaranteed)</span>
            <span className="font-mono">$1.00</span>
          </div>
          <Separator />
          <div className="flex justify-between text-foreground">
            <span>Profit per pair</span>
            <span className="font-mono text-green-400">${profitPerDollar.toFixed(4)}</span>
          </div>
          <div className="flex justify-between text-foreground">
            <span>× {contracts} contracts</span>
            <span className="font-mono text-green-400 font-semibold">${actualProfit.toFixed(2)}</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground/50 text-center">
          ⚠️ Excludes platform fees, slippage, and execution risk. Prices may change.
        </p>
      </CardContent>
    </Card>
  );
}

function ResultCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-lg font-semibold font-mono ${accent}`}>{value}</p>
      <p className="text-xs text-muted-foreground/60 mt-0.5">{sub}</p>
    </div>
  );
}
