"use client";

import { useState } from "react";
import { ArbWithSpread } from "@/lib/db/types";

interface Props {
  arb: ArbWithSpread;
  onClose: () => void;
}

export default function ArbCalculator({ arb, onClose }: Props) {
  const [stake, setStake] = useState(1000);

  const totalCost = arb.kalshiPrice + arb.polymarketPrice;
  const profitPerDollar = 1 - totalCost;
  const totalProfit = stake * profitPerDollar;
  const roi = (profitPerDollar / totalCost) * 100;

  // Allocation
  const kalshiAllocation = (arb.kalshiPrice / totalCost) * stake;
  const polyAllocation = (arb.polymarketPrice / totalCost) * stake;

  // Contracts (each contract pays $1)
  const contracts = Math.floor(stake / totalCost);
  const actualCost = contracts * totalCost;
  const actualProfit = contracts * profitPerDollar;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-800/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <h3 className="font-semibold text-white">Arbitrage Calculator</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-lg">✕</button>
      </div>

      <div className="p-4">
        {/* Market info */}
        <p className="text-sm text-gray-400 mb-1 truncate">{arb.market}</p>
        <p className="text-xs text-gray-500 mb-4">{arb.direction}</p>

        {/* Stake input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Total Stake
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={stake}
              onChange={(e) => setStake(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-md border border-gray-700 bg-gray-800 pl-7 pr-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              min={0}
              step={100}
            />
          </div>
          <div className="flex gap-2 mt-2">
            {[100, 500, 1000, 5000].map((v) => (
              <button
                key={v}
                onClick={() => setStake(v)}
                className={`rounded px-2.5 py-1 text-xs transition-colors ${
                  stake === v
                    ? "bg-indigo-600 text-white"
                    : "border border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                ${v.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-2 gap-3">
          <ResultCard
            label="Kalshi Allocation"
            value={`$${kalshiAllocation.toFixed(2)}`}
            sublabel={`@ ${(arb.kalshiPrice * 100).toFixed(0)}¢ per share`}
            color="blue"
          />
          <ResultCard
            label="Polymarket Allocation"
            value={`$${polyAllocation.toFixed(2)}`}
            sublabel={`@ ${(arb.polymarketPrice * 100).toFixed(0)}¢ per share`}
            color="purple"
          />
          <ResultCard
            label="Contracts"
            value={contracts.toLocaleString()}
            sublabel={`Total cost: $${actualCost.toFixed(2)}`}
            color="gray"
          />
          <ResultCard
            label="Guaranteed Profit"
            value={`$${actualProfit.toFixed(2)}`}
            sublabel={`${roi.toFixed(1)}% ROI`}
            color="green"
          />
        </div>

        {/* Breakdown */}
        <div className="mt-4 rounded-md bg-gray-800/50 border border-gray-700/50 p-3">
          <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">How it works</p>
          <div className="space-y-1 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Cost per pair (Kalshi + Poly)</span>
              <span className="font-mono">${totalCost.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span>Payout per pair (guaranteed)</span>
              <span className="font-mono">$1.00</span>
            </div>
            <div className="flex justify-between border-t border-gray-700/50 pt-1">
              <span className="text-white">Profit per pair</span>
              <span className="font-mono text-green-400">${profitPerDollar.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white">× {contracts} contracts</span>
              <span className="font-mono text-green-400 font-semibold">${actualProfit.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-600 text-center">
          ⚠️ Excludes platform fees, slippage, and execution risk. Prices may change.
        </p>
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  sublabel,
  color,
}: {
  label: string;
  value: string;
  sublabel: string;
  color: "blue" | "purple" | "green" | "gray";
}) {
  const colorMap = {
    blue: "border-blue-800/40 bg-blue-900/20",
    purple: "border-purple-800/40 bg-purple-900/20",
    green: "border-green-800/40 bg-green-900/20",
    gray: "border-gray-700/50 bg-gray-800/30",
  };
  const valueColorMap = {
    blue: "text-blue-300",
    purple: "text-purple-300",
    green: "text-green-300",
    gray: "text-white",
  };

  return (
    <div className={`rounded-lg border p-3 ${colorMap[color]}`}>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className={`text-lg font-semibold font-mono ${valueColorMap[color]}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>
    </div>
  );
}
