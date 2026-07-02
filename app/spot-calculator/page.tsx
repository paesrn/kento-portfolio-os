"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function SpotCalculatorPage() {
  const [portfolioValue, setPortfolioValue] = useState("10000");
  const [riskPercent, setRiskPercent] = useState("1");
  const [entryPrice, setEntryPrice] = useState("1.00");
  const [stopPrice, setStopPrice] = useState("0.90");
  const [targetPrice, setTargetPrice] = useState("1.30");

  const result = useMemo(() => {
    const portfolio = Number(portfolioValue);
    const risk = Number(riskPercent);
    const entry = Number(entryPrice);
    const stop = Number(stopPrice);
    const target = Number(targetPrice);

    if (
      portfolio <= 0 ||
      risk <= 0 ||
      entry <= 0 ||
      stop <= 0 ||
      target <= 0 ||
      entry <= stop
    ) {
      return null;
    }

    const riskDollar = portfolio * (risk / 100);
    const riskPerUnit = entry - stop;
    const lossPercent = (riskPerUnit / entry) * 100;
    const coinAmount = riskDollar / riskPerUnit;
    const positionSize = coinAmount * entry;
    const expectedProfit = coinAmount * (target - entry);
    const rewardRisk = expectedProfit / riskDollar;

    const target2R = entry + riskPerUnit * 2;
    const target3R = entry + riskPerUnit * 3;
    const target5R = entry + riskPerUnit * 5;

    return {
      riskDollar,
      lossPercent,
      coinAmount,
      positionSize,
      expectedProfit,
      rewardRisk,
      target2R,
      target3R,
      target5R,
    };
  }, [portfolioValue, riskPercent, entryPrice, stopPrice, targetPrice]);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
       <header className="border-b border-zinc-800 pb-6">
  <Link
    href="/"
    className="inline-flex items-center rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-300 transition hover:border-green-500 hover:text-green-400"
  >
    ← Back to Home Control Room
  </Link>

  <p className="mt-5 text-xs uppercase tracking-[0.35em] text-green-400">
    Kento Portfolio OS
  </p>
  <h1 className="mt-3 text-3xl font-bold">Spot Position Calculator</h1>
  <p className="mt-2 text-zinc-400">
    Calculate position size before entering a spot trade.
  </p>
</header>

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
    </main>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm text-zinc-400">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-green-500"
      />
    </label>
  );
}

function ResultCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-black p-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}