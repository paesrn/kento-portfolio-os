"use client";

import AppShell from "../components/AppShell";
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

    let permission: "PASS" | "WARNING" | "BLOCKED" = "PASS";
    let permissionColor = "text-green-400";
    let permissionBorder = "border-green-500/40";
    let permissionBg = "bg-green-500/10";

    const reasons: string[] = [];
    const warnings: string[] = [];
    const actions: string[] = [];

    if (risk > 2) {
      permission = "BLOCKED";
      permissionColor = "text-red-400";
      permissionBorder = "border-red-500/40";
      permissionBg = "bg-red-500/10";
      warnings.push("Risk per trade is above the 2% maximum rule.");
      actions.push("Reduce risk percentage to 2% or below before entering.");
    } else if (risk > 1) {
      permission = "WARNING";
      permissionColor = "text-yellow-400";
      permissionBorder = "border-yellow-500/40";
      permissionBg = "bg-yellow-500/10";
      warnings.push("Risk is above conservative level. Position requires caution.");
      actions.push("Consider reducing risk to 1% or less.");
    } else {
      reasons.push("Portfolio risk is within conservative risk limit.");
    }

    if (rewardRisk < 1) {
      permission = "BLOCKED";
      permissionColor = "text-red-400";
      permissionBorder = "border-red-500/40";
      permissionBg = "bg-red-500/10";
      warnings.push("Reward/Risk is below 1R. The trade does not justify the risk.");
      actions.push("Improve target, tighten stop, or skip this setup.");
    } else if (rewardRisk < 2) {
      if (permission !== "BLOCKED") {
        permission = "WARNING";
        permissionColor = "text-yellow-400";
        permissionBorder = "border-yellow-500/40";
        permissionBg = "bg-yellow-500/10";
      }
      warnings.push("Reward/Risk is below 2R.");
      actions.push("Review whether the potential upside is worth the defined risk.");
    } else {
      reasons.push("Reward/Risk is acceptable based on the defined target.");
    }

    if (positionSize > portfolio) {
      if (permission !== "BLOCKED") {
        permission = "WARNING";
        permissionColor = "text-yellow-400";
        permissionBorder = "border-yellow-500/40";
        permissionBg = "bg-yellow-500/10";
      }
      warnings.push("Calculated position size is larger than portfolio value.");
      actions.push("Use smaller risk, wider stop logic review, or avoid over-allocation.");
    } else {
      reasons.push("Position size is within available portfolio value.");
    }

    if (target <= entry) {
      permission = "BLOCKED";
      permissionColor = "text-red-400";
      permissionBorder = "border-red-500/40";
      permissionBg = "bg-red-500/10";
      warnings.push("Target price must be higher than entry price for a long spot setup.");
      actions.push("Set a valid target above entry price.");
    }

    if (reasons.length === 0 && warnings.length === 0) {
      reasons.push("Setup is valid based on current inputs.");
    }

    if (actions.length === 0) {
      actions.push("Position can be considered if the setup matches your trading playbook.");
    }

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
      permission,
      permissionColor,
      permissionBorder,
      permissionBg,
      reasons,
      warnings,
      actions,
    };
  }, [portfolioValue, riskPercent, entryPrice, stopPrice, targetPrice]);

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

function DecisionBlock({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-black p-5">
      <h3 className={`font-semibold ${color}`}>{title}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}