"use client";

import AppShell from "../components/AppShell";
import { useMemo, useState } from "react";

type Direction = "long" | "short";
type Permission = "PASS" | "WARNING" | "BLOCKED";

export default function FuturesCalculatorPage() {
  const [walletBalance, setWalletBalance] = useState("10000");
  const [riskPercent, setRiskPercent] = useState("1");
  const [entryPrice, setEntryPrice] = useState("65000");
  const [stopPrice, setStopPrice] = useState("64000");
  const [targetPrice, setTargetPrice] = useState("68000");
  const [leverage, setLeverage] = useState("5");
  const [direction, setDirection] = useState<Direction>("long");

  const result = useMemo(() => {
    const wallet = Number(walletBalance);
    const risk = Number(riskPercent);
    const entry = Number(entryPrice);
    const stop = Number(stopPrice);
    const target = Number(targetPrice);
    const lev = Number(leverage);

    if (
      wallet <= 0 ||
      risk <= 0 ||
      entry <= 0 ||
      stop <= 0 ||
      target <= 0 ||
      lev <= 0
    ) {
      return null;
    }

    const isLong = direction === "long";
    const validLong = isLong && entry > stop && target > entry;
    const validShort = !isLong && entry < stop && target < entry;

    if (!validLong && !validShort) {
      return null;
    }

    const riskAmount = wallet * (risk / 100);
    const riskPerUnit = isLong ? entry - stop : stop - entry;
    const rewardPerUnit = isLong ? target - entry : entry - target;

    const coinAmount = riskAmount / riskPerUnit;
    const positionValue = coinAmount * entry;
    const marginRequired = positionValue / lev;
    const expectedProfit = coinAmount * rewardPerUnit;
    const rewardRisk = expectedProfit / riskAmount;
    const lossToStopPercent = (riskPerUnit / entry) * 100;

    const estimatedLiquidationPrice = isLong
      ? entry * (1 - 1 / lev)
      : entry * (1 + 1 / lev);

    const liquidationDistancePercent =
      (Math.abs(entry - estimatedLiquidationPrice) / entry) * 100;

    const roiAtTarget = (expectedProfit / marginRequired) * 100;

    let permission: Permission = "PASS";
    const reasons: string[] = [];
    const warnings: string[] = [];
    const actions: string[] = [];

    const warn = () => {
      if (permission !== "BLOCKED") permission = "WARNING";
    };

    const block = () => {
      permission = "BLOCKED";
    };

    if (risk > 2) {
      block();
      warnings.push("Risk per trade is above the 2% maximum rule.");
      actions.push("Reduce risk percentage to 2% or below.");
    } else if (risk > 1) {
      warn();
      warnings.push("Risk is above conservative futures level.");
      actions.push("Consider reducing risk to 1% or less.");
    } else {
      reasons.push("Risk is within conservative futures limit.");
    }

    if (rewardRisk < 1) {
      block();
      warnings.push("Reward/Risk is below 1R.");
      actions.push("Improve target, reduce stop distance, or skip this setup.");
    } else if (rewardRisk < 2) {
      warn();
      warnings.push("Reward/Risk is below 2R.");
      actions.push("Review whether upside is worth the defined risk.");
    } else {
      reasons.push("Reward/Risk is acceptable.");
    }

    if (marginRequired > wallet) {
      block();
      warnings.push("Margin required is greater than wallet balance.");
      actions.push("Reduce exposure, reduce risk, or lower position size.");
    } else if (marginRequired > wallet * 0.5) {
      warn();
      warnings.push("Margin required is more than 50% of wallet balance.");
      actions.push("Avoid over-allocating wallet into one position.");
    } else {
      reasons.push("Margin required is within wallet control limit.");
    }

    if (lev > 20) {
      block();
      warnings.push("Leverage exceeds system safety limit.");
      actions.push("Reduce leverage to 20x or below.");
    } else if (lev > 10) {
      warn();
      warnings.push("Leverage is above conservative level.");
      actions.push("Consider reducing leverage to 10x or below.");
    } else {
      reasons.push("Leverage is within conservative range.");
    }

    if (liquidationDistancePercent < 3) {
      block();
      warnings.push("Estimated liquidation is extremely close to entry.");
      actions.push("Reduce leverage or avoid this setup.");
    } else if (liquidationDistancePercent < 5) {
      warn();
      warnings.push("Estimated liquidation distance is below 5% from entry.");
      actions.push("Increase liquidation buffer by reducing leverage.");
    } else {
      reasons.push("Estimated liquidation buffer is acceptable.");
    }

    if (actions.length === 0) {
      actions.push(
        "Position can be considered if this setup matches your trading playbook."
      );
    }

    const permissionStyle = {
      PASS: {
        text: "text-green-400",
        border: "border-green-500/40",
        bg: "bg-green-500/10",
      },
      WARNING: {
        text: "text-yellow-400",
        border: "border-yellow-500/40",
        bg: "bg-yellow-500/10",
      },
      BLOCKED: {
        text: "text-red-400",
        border: "border-red-500/40",
        bg: "bg-red-500/10",
      },
    }[permission];

    return {
      riskAmount,
      lossToStopPercent,
      coinAmount,
      positionValue,
      marginRequired,
      expectedProfit,
      rewardRisk,
      estimatedLiquidationPrice,
      liquidationDistancePercent,
      roiAtTarget,
      permission,
      permissionStyle,
      reasons,
      warnings,
      actions,
    };
  }, [
    walletBalance,
    riskPercent,
    entryPrice,
    stopPrice,
    targetPrice,
    leverage,
    direction,
  ]);

  return (
    <AppShell
      title="Futures Calculator"
      subtitle="Calculate futures position size, margin, estimated liquidation, and risk control before opening a leveraged trade."
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-semibold">Trade Input</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Define wallet, risk, entry, stop, target, leverage, and direction.
            </p>

            <div className="mt-6 space-y-4">
              <InputField label="Wallet Balance ($)" value={walletBalance} onChange={setWalletBalance} />
              <InputField label="Risk (%)" value={riskPercent} onChange={setRiskPercent} />
              <InputField label="Entry Price ($)" value={entryPrice} onChange={setEntryPrice} />
              <InputField label="Stop Price ($)" value={stopPrice} onChange={setStopPrice} />
              <InputField label="Target Price ($)" value={targetPrice} onChange={setTargetPrice} />
              <InputField label="Leverage (x)" value={leverage} onChange={setLeverage} />

              <label className="block">
                <span className="text-sm text-zinc-400">Direction</span>
                <select
                  value={direction}
                  onChange={(event) => setDirection(event.target.value as Direction)}
                  className="mt-2 w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-green-500"
                >
                  <option value="long">Long</option>
                  <option value="short">Short</option>
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-semibold">Calculation Output</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Futures risk and margin calculation.
            </p>

            {result ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <ResultCard label="Risk Amount" value={`$${result.riskAmount.toFixed(2)}`} color="text-red-400" />
                <ResultCard label="Loss to Stop" value={`${result.lossToStopPercent.toFixed(2)}%`} color="text-yellow-400" />
                <ResultCard label="Position Value" value={`$${result.positionValue.toFixed(2)}`} color="text-green-400" />
                <ResultCard label="Margin Required" value={`$${result.marginRequired.toFixed(2)}`} color="text-blue-400" />
                <ResultCard label="Coin Amount" value={result.coinAmount.toFixed(6)} color="text-white" />
                <ResultCard label="Estimated Liquidation" value={`$${result.estimatedLiquidationPrice.toFixed(2)}`} color="text-red-400" />
                <ResultCard label="Liquidation Distance" value={`${result.liquidationDistancePercent.toFixed(2)}%`} color="text-yellow-400" />
                <ResultCard label="Expected Profit" value={`$${result.expectedProfit.toFixed(2)}`} color="text-green-400" />
                <ResultCard label="ROI at Target" value={`${result.roiAtTarget.toFixed(2)}%`} color="text-green-400" />
                <ResultCard label="Reward / Risk" value={`${result.rewardRisk.toFixed(2)}R`} color="text-white" />
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-300">
                Invalid futures setup. For Long, entry must be above stop and target above entry.
                For Short, entry must be below stop and target below entry.
              </div>
            )}
          </div>
        </section>

        {result && (
          <section
            className={`rounded-xl border ${result.permissionStyle.border} ${result.permissionStyle.bg} p-6`}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
                  Kento Futures Rule Engine
                </p>
                <h2 className="mt-2 text-2xl font-bold">Trade Permission</h2>
              </div>

              <div className={`text-4xl font-bold ${result.permissionStyle.text}`}>
                {result.permission}
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <DecisionBlock
                title="Passed Conditions"
                items={result.reasons.length > 0 ? result.reasons : ["No passed condition detected."]}
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

        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-xl font-semibold">Futures Risk Note</h2>
          <div className="mt-4 rounded-lg border border-zinc-800 bg-black p-5 text-sm leading-7 text-zinc-300">
            Futures trading uses leverage. The estimated liquidation price is a simplified planning calculation only.
            Actual liquidation price can differ depending on exchange rules, maintenance margin, fees, funding rate,
            collateral mode, and open position settings.
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