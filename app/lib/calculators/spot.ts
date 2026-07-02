export function calculateSpotPosition({
  portfolioValue,
  riskPercent,
  entryPrice,
  stopPrice,
  targetPrice,
}: {
  portfolioValue: string;
  riskPercent: string;
  entryPrice: string;
  stopPrice: string;
  targetPrice: string;
}) {
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

  const setBlocked = () => {
    permission = "BLOCKED";
    permissionColor = "text-red-400";
    permissionBorder = "border-red-500/40";
    permissionBg = "bg-red-500/10";
  };

  const setWarning = () => {
    if (permission !== "BLOCKED") {
      permission = "WARNING";
      permissionColor = "text-yellow-400";
      permissionBorder = "border-yellow-500/40";
      permissionBg = "bg-yellow-500/10";
    }
  };

  if (risk > 2) {
    setBlocked();
    warnings.push("Risk per trade is above the 2% maximum rule.");
    actions.push("Reduce risk percentage to 2% or below before entering.");
  } else if (risk > 1) {
    setWarning();
    warnings.push("Risk is above conservative level. Position requires caution.");
    actions.push("Consider reducing risk to 1% or less.");
  } else {
    reasons.push("Portfolio risk is within conservative risk limit.");
  }

  if (rewardRisk < 1) {
    setBlocked();
    warnings.push("Reward/Risk is below 1R. The trade does not justify the risk.");
    actions.push("Improve target, tighten stop, or skip this setup.");
  } else if (rewardRisk < 2) {
    setWarning();
    warnings.push("Reward/Risk is below 2R.");
    actions.push("Review whether the potential upside is worth the defined risk.");
  } else {
    reasons.push("Reward/Risk is acceptable based on the defined target.");
  }

  if (positionSize > portfolio) {
    setWarning();
    warnings.push("Calculated position size is larger than portfolio value.");
    actions.push("Use smaller risk, review stop distance, or avoid over-allocation.");
  } else {
    reasons.push("Position size is within available portfolio value.");
  }

  if (target <= entry) {
    setBlocked();
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
}