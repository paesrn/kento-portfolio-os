"use client";

import AppShell from "../components/AppShell";
import DecisionBlock from "../components/DecisionBlock";
import InputField from "../components/InputField";
import ResultCard from "../components/ResultCard";
import { calculateSpotPosition } from "../lib/calculators/spot";
import { useMemo, useState } from "react";

export default function SpotCalculatorPage() {
  const [portfolioValue, setPortfolioValue] = useState("10000");
  const [riskPercent, setRiskPercent] = useState("1");
  const [entryPrice, setEntryPrice] = useState("1.00");
  const [stopPrice, setStopPrice] = useState("0.90");
  const [targetPrice, setTargetPrice] = useState("1.30");

  const result = useMemo(
  () =>
    calculateSpotPosition({
      portfolioValue,
      riskPercent,
      entryPrice,
      stopPrice,
      targetPrice,
    }),
  [portfolioValue, riskPercent, entryPrice, stopPrice, targetPrice]
);

  return (
    <AppShell
      title="Spot Position Calculator"
      subtitle="Calculate position size, risk amount, target levels, and reward/risk before entering a spot trade."
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-semibold">Trade Input</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Define portfolio value, risk, entry, stop, and target.
            </p>

            <div className="mt-6 space-y-4">
              <InputField
                label="Portfolio Value ($)"
                value={portfolioValue}
                onChange={setPortfolioValue}
              />
              <InputField
                label="Risk (%)"
                value={riskPercent}
                onChange={setRiskPercent}
              />
              <InputField
                label="Entry Price ($)"
                value={entryPrice}
                onChange={setEntryPrice}
              />
              <InputField
                label="Stop Price ($)"
                value={stopPrice}
                onChange={setStopPrice}
              />
              <InputField
                label="Target Price ($)"
                value={targetPrice}
                onChange={setTargetPrice}
              />
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-semibold">Calculation Output</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Risk-first position sizing result.
            </p>

            {result ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <ResultCard
                  label="Risk Amount"
                  value={`$${result.riskDollar.toFixed(2)}`}
                  color="text-red-400"
                />
                <ResultCard
                  label="Loss to Stop"
                  value={`${result.lossPercent.toFixed(2)}%`}
                  color="text-yellow-400"
                />
                <ResultCard
                  label="Position Size"
                  value={`$${result.positionSize.toFixed(2)}`}
                  color="text-green-400"
                />
                <ResultCard
                  label="Coin Amount"
                  value={result.coinAmount.toFixed(4)}
                  color="text-blue-400"
                />
                <ResultCard
                  label="Expected Profit"
                  value={`$${result.expectedProfit.toFixed(2)}`}
                  color="text-green-400"
                />
                <ResultCard
                  label="Reward / Risk"
                  value={`${result.rewardRisk.toFixed(2)}R`}
                  color="text-white"
                />
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-300">
                Invalid setup. Entry price must be higher than stop price, and
                all values must be greater than zero.
              </div>
            )}
          </div>
        </section>

        {result && (
          <section
            className={`rounded-xl border ${result.permissionBorder} ${result.permissionBg} p-6`}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
                  Kento Rule Engine
                </p>
                <h2 className="mt-2 text-2xl font-bold">Trade Permission</h2>
              </div>

              <div className={`text-4xl font-bold ${result.permissionColor}`}>
                {result.permission}
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <DecisionBlock
                title="Passed Conditions"
                items={result.reasons}
                color="text-green-400"
              />
              <DecisionBlock
                title="Warnings"
                items={result.warnings.length > 0 ? result.warnings : ["No major warning detected."]}
                color={result.warnings.length > 0 ? "text-yellow-400" : "text-green-400"}
              />
              <DecisionBlock
                title="System Action"
                items={result.actions}
                color="text-blue-400"
              />
            </div>
          </section>
        )}

        {result && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-semibold">R-Multiple Targets</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Automatic target levels based on your defined stop distance.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <ResultCard
                label="2R Target"
                value={`$${result.target2R.toFixed(4)}`}
                color="text-green-400"
              />
              <ResultCard
                label="3R Target"
                value={`$${result.target3R.toFixed(4)}`}
                color="text-green-400"
              />
              <ResultCard
                label="5R Target"
                value={`$${result.target5R.toFixed(4)}`}
                color="text-green-400"
              />
            </div>
          </section>
        )}

        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-xl font-semibold">System Rule</h2>
          <div className="mt-4 rounded-lg border border-zinc-800 bg-black p-5 text-zinc-300">
            Every position must define entry, stop, target, and risk before
            execution. No emotional entry is allowed.
          </div>
        </section>
      </div>
    </AppShell>
  );
}

