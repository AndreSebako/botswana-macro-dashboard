export type Regime =
  | "Overheating"
  | "Stabilizing"
  | "Weak / Slowdown"
  | "External Stress"
  | "Tight Policy / Disinflation"
  | "Neutral";

export function classifyRegime(snapshot: any): Regime {
  const inflation = snapshot.inflation?.latest_value;
  const inflationDelta = snapshot.inflation?.delta;
  const gdp = snapshot.gdp?.latest_value;
  const trade = snapshot.trade_balance?.latest_value;
  const policyRate = snapshot.policy_rate?.latest_value;
  const primeRate = snapshot.prime_lending_rate?.latest_value;

  if (inflation == null || gdp == null) return "Neutral";

  // High inflation + solid growth
  if (inflation > 4 && gdp > 2) {
    return "Overheating";
  }

  // Growth weak
  if (gdp < 1) {
    return "Weak / Slowdown";
  }

  // Trade pressure + inflation pressure
  if (trade != null && trade < 0 && inflation > 4) {
    return "External Stress";
  }

  // Tight rates while inflation is no longer accelerating
  if (
    policyRate != null &&
    primeRate != null &&
    policyRate >= 3.5 &&
    primeRate >= 7 &&
    inflationDelta != null &&
    inflationDelta <= 0 &&
    gdp >= 1.5
  ) {
    return "Tight Policy / Disinflation";
  }

  // Growth okay + inflation more contained
  if (inflation <= 4 && gdp > 1.5) {
    return "Stabilizing";
  }

  return "Neutral";
}