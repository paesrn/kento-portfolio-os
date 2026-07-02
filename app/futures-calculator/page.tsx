"use client";

import AppShell from "../components/AppShell";
import { useMemo, useState } from "react";

type Direction = "long" | "short";

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

    const validLongSetup = isLong && entry > stop && target > entry;
    const validShortSetup = !isLong && entry < stop && target < entry;

    if (!validLongSetup && !validShortSetup) {
      return null;
    }

    const riskAmount = wallet * (risk / 100);

    const riskPerUnit = isLong ? entry - stop : stop - entry;
    const rewardPerUnit = isLong ? target - entry : entry - target;

    const lossToStopPercent = (riskPerUnit / entry) * 100;

    const coinAmount = riskAmount / riskPerUnit;
    const positionValue = coinAmount * entry;
    const marginRequired = positionValue / lev;

    const expectedProfit = coinAmount * rewardPerUnit;
    const rewardRisk = expectedProfit / riskAmount;

    const estimatedLiquidationPrice = isLong
      ? entry * (1 - 1 / lev)
      : entry * (1 + 1 / lev);

    const roiAtTarget = (expectedProfit / marginRequired) * 100;

    return {
      riskAmount,
      lossToStopPercent,
      coinAmount,
      positionValue,
      marginRequired,
      expectedProfit,
      rewardRisk,
      estimatedLiquidationPrice,
      roiAtTarget,
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
      subtitle="Calculate futures position size, margin required, estimated liquidation price, and reward/risk before opening a leveraged trade."
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-semibold">Trade Input</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Define wallet balance, risk, entry, stop, target, leverage, and
              trade direction.
            </p>

            <div className="mt-6 space-y-4">
              <InputField
                label="Wallet Balance ($)"
                value={walletBalance}
                onChange={setWalletBalance}
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

              <InputField
                label="Leverage (x)"
                value={leverage}
                onChange={setLeverage}
              />

              <label className="block">
                <span className="text-sm text-zinc-400">Direction</span>
                <select
                  value={direction}
                  onChange={(event) =>
                    setDirection(event.target.value as Direction)
                  }
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
                <ResultCard
                  label="Risk Amount"
                  value={`$${result.riskAmount.toFixed(2)}`}
                  color="text-red-400"
                />

                <ResultCard
                  label="Loss to Stop"
                  value={`${result.lossToStopPercent.toFixed(2)}%`}
                  color="text-yellow-400"
                />

                <ResultCard
                  label="Position Value"
                  value={`$${result.positionValue.toFixed(2)}`}
                  color="text-green-400"
                />

                <ResultCard
                  label="Margin Required"
                  value={`$${result.marginRequired.toFixed(2)}`}
                  color="text-blue-400"
                />

                <ResultCard
                  label="Coin Amount"
                  value={result.coinAmount.toFixed(6)}
                  color="text-white"
                />

                <ResultCard
                  label="Estimated Liquidation"
                  value={`$${result.estimatedLiquidationPrice.toFixed(2)}`}
                  color="text-red-400"
                />

                <ResultCard
                  label="Expected Profit"
                  value={`$${result.expectedProfit.toFixed(2)}`}
                  color="text-green-400"
                />

                <ResultCard
                  label="ROI at Target"
                  value={`${result.roiAtTarget.toFixed(2)}%`}
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
                Invalid futures setup. For Long, entry must be above stop and
                target must be above entry. For Short, entry must be below stop
                and target must be below entry. All values must be greater than
                zero.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-xl font-semibold">Futures Risk Note</h2>

          <div className="mt-4 rounded-lg border border-zinc-800 bg-black p-5 text-sm leading-7 text-zinc-300">
            Futures trading uses leverage. The estimated liquidation price shown
            here is a simplified calculation for planning only. Actual
            liquidation price can differ depending on exchange rules,
            maintenance margin, fees, funding rate, collateral mode, and open
            position settings.
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
