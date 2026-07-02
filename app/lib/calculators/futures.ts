export type Direction = "long" | "short";
export type Permission = "PASS" | "WARNING" | "BLOCKED";

export function calculateFuturesPosition({
  walletBalance,
  riskPercent,
  entryPrice,
  stopPrice,
  targetPrice,
  leverage,
  direction,
}: {
  walletBalance: string;
  riskPercent: string;
  entryPrice: string;
  stopPrice: string;
  targetPrice: string;
  leverage: string;
  direction: Direction;
}) {
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
}