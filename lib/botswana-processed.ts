import fs from "fs";
import path from "path";

type Point = {
  date: string;
  value: number;
};

type SnapshotEntry = {
  slug: string;
  title: string;
  source: string;
  unit: string;
  latest_date: string | null;
  latest_value: number | null;
  previous_date: string | null;
  previous_value: number | null;
  delta: number | null;
  tone: "positive" | "negative" | "neutral";
};

type SnapshotFile = {
  inflation: SnapshotEntry;
  exchange_rate: SnapshotEntry;
  gdp: SnapshotEntry;
  trade_balance: SnapshotEntry;
  policy_rate: SnapshotEntry;
  prime_lending_rate: SnapshotEntry;
  real_policy_rate: SnapshotEntry;
  real_prime_lending_rate: SnapshotEntry;
  last_updated: string;
};

type RegimeTone = "positive" | "negative" | "neutral" | "warning";

type RegimeSummary = {
  label: string;
  tone: RegimeTone;
  explanation: string;
};

function readJson<T>(filename: string): T | null {
  const filePath = path.join(process.cwd(), "data", "processed", "botswana", filename);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

function formatValue(slug: string, value: number | null): string {
  if (value === null) return "—";

  if (
    slug === "inflation" ||
    slug === "gdp" ||
    slug === "policy_rate" ||
    slug === "prime_lending_rate" ||
    slug === "real_policy_rate" ||
    slug === "real_prime_lending_rate"
  ) {
    return `${value}%`;
  }

  if (slug === "exchange_rate") return `${value}`;
  if (slug === "trade_balance") return `${value} bn`;
  return `${value}`;
}

function formatDateLabel(date: string | null): string {
  return date ?? "—";
}

function formatChangeText(entry: SnapshotEntry): string {
  if (entry.delta === null) return "";
  const sign = entry.delta > 0 ? "+" : "";
  return `vs previous: ${sign}${entry.delta.toFixed(2)}`;
}

export function getBotswanaSnapshot() {
  return readJson<SnapshotFile>("latest_snapshot.json");
}

export function getBotswanaDashboardSeries() {
  const snapshot = getBotswanaSnapshot();
  if (!snapshot) return [];

  const inflation = readJson<Point[]>("inflation.json") ?? [];
  const exchangeRate = readJson<Point[]>("exchange_rate.json") ?? [];
  const gdp = readJson<Point[]>("gdp.json") ?? [];
  const trade = readJson<Point[]>("trade_balance.json") ?? [];
  const policyRate = readJson<Point[]>("policy_rate.json") ?? [];
  const primeLendingRate = readJson<Point[]>("prime_lending_rate.json") ?? [];
  const realPolicyRate = readJson<Point[]>("real_policy_rate.json") ?? [];
  const realPrimeLendingRate = readJson<Point[]>("real_prime_lending_rate.json") ?? [];

  const fxTone =
    snapshot.exchange_rate.delta === null
      ? "neutral"
      : snapshot.exchange_rate.delta < 0
      ? "positive"
      : snapshot.exchange_rate.delta > 0
      ? "negative"
      : "neutral";

  return [
    {
      slug: "inflation",
      title: "Inflation Rate",
      source: snapshot.inflation.source,
      updatedAt: formatDateLabel(snapshot.inflation.latest_date),
      latestValue: formatValue("inflation", snapshot.inflation.latest_value),
      latestLabel: "consumer price inflation",
      points: inflation,
      showZeroLine: false,
      tone: snapshot.inflation.tone,
    },
    {
      slug: "exchange_rate",
      title: "BWP / USD",
      source: snapshot.exchange_rate.source,
      updatedAt: formatDateLabel(snapshot.exchange_rate.latest_date),
      latestValue: formatValue("exchange_rate", snapshot.exchange_rate.latest_value),
      latestLabel: "daily midpoint reference",
      points: exchangeRate,
      showZeroLine: false,
      tone: fxTone,
    },
    {
      slug: "gdp",
      title: "Real GDP Growth",
      source: snapshot.gdp.source,
      updatedAt: formatDateLabel(snapshot.gdp.latest_date),
      latestValue: formatValue("gdp", snapshot.gdp.latest_value),
      latestLabel: "latest quarterly release",
      points: gdp,
      showZeroLine: true,
      tone: snapshot.gdp.tone,
    },
    {
      slug: "trade_balance",
      title: "Trade Balance",
      source: snapshot.trade_balance.source,
      updatedAt: formatDateLabel(snapshot.trade_balance.latest_date),
      latestValue: formatValue("trade_balance", snapshot.trade_balance.latest_value),
      latestLabel: "monthly goods trade balance",
      points: trade,
      showZeroLine: true,
      tone: snapshot.trade_balance.tone,
    },
    {
      slug: "policy_rate",
      title: "Policy Rate",
      source: snapshot.policy_rate.source,
      updatedAt: formatDateLabel(snapshot.policy_rate.latest_date),
      latestValue: formatValue("policy_rate", snapshot.policy_rate.latest_value),
      latestLabel: "monetary policy rate",
      points: policyRate,
      showZeroLine: false,
      tone: "neutral",
    },
    {
      slug: "prime_lending_rate",
      title: "Prime Lending Rate",
      source: snapshot.prime_lending_rate.source,
      updatedAt: formatDateLabel(snapshot.prime_lending_rate.latest_date),
      latestValue: formatValue("prime_lending_rate", snapshot.prime_lending_rate.latest_value),
      latestLabel: "average commercial bank rate",
      points: primeLendingRate,
      showZeroLine: false,
      tone: snapshot.prime_lending_rate.tone,
    },
    {
      slug: "real_policy_rate",
      title: "Real Policy Rate",
      source: snapshot.real_policy_rate.source,
      updatedAt: formatDateLabel(snapshot.real_policy_rate.latest_date),
      latestValue: formatValue("real_policy_rate", snapshot.real_policy_rate.latest_value),
      latestLabel: "policy rate minus inflation",
      points: realPolicyRate,
      showZeroLine: true,
      tone: "neutral",
    },
    {
      slug: "real_prime_lending_rate",
      title: "Real Prime Lending Rate",
      source: snapshot.real_prime_lending_rate.source,
      updatedAt: formatDateLabel(snapshot.real_prime_lending_rate.latest_date),
      latestValue: formatValue("real_prime_lending_rate", snapshot.real_prime_lending_rate.latest_value),
      latestLabel: "prime lending rate minus inflation",
      points: realPrimeLendingRate,
      showZeroLine: true,
      tone: "neutral",
    },
  ];
}

export function getBotswanaCardData() {
  const snapshot = getBotswanaSnapshot();
  if (!snapshot) return null;

  const fxTone =
    snapshot.exchange_rate.delta === null
      ? "neutral"
      : snapshot.exchange_rate.delta < 0
      ? "positive"
      : snapshot.exchange_rate.delta > 0
      ? "negative"
      : "neutral";

  return {
    inflation: {
      title: "Inflation rate",
      value: formatValue("inflation", snapshot.inflation.latest_value),
      source: snapshot.inflation.source,
      footnote: formatDateLabel(snapshot.inflation.latest_date),
      changeText: formatChangeText(snapshot.inflation),
      tone: snapshot.inflation.tone,
    },
    exchange_rate: {
      title: "BWP / USD",
      value: formatValue("exchange_rate", snapshot.exchange_rate.latest_value),
      source: snapshot.exchange_rate.source,
      footnote: formatDateLabel(snapshot.exchange_rate.latest_date),
      changeText: formatChangeText(snapshot.exchange_rate),
      tone: fxTone,
    },
    gdp: {
      title: "Real GDP growth",
      value: formatValue("gdp", snapshot.gdp.latest_value),
      source: snapshot.gdp.source,
      footnote: formatDateLabel(snapshot.gdp.latest_date),
      changeText: formatChangeText(snapshot.gdp),
      tone: snapshot.gdp.tone,
    },
    trade_balance: {
      title: "Trade balance",
      value: formatValue("trade_balance", snapshot.trade_balance.latest_value),
      source: snapshot.trade_balance.source,
      footnote: formatDateLabel(snapshot.trade_balance.latest_date),
      changeText: formatChangeText(snapshot.trade_balance),
      tone: snapshot.trade_balance.tone,
    },
    policy_rate: {
      title: "Policy rate",
      value: formatValue("policy_rate", snapshot.policy_rate.latest_value),
      source: snapshot.policy_rate.source,
      footnote: formatDateLabel(snapshot.policy_rate.latest_date),
      changeText: formatChangeText(snapshot.policy_rate),
      tone: "neutral",
    },
    prime_lending_rate: {
      title: "Prime lending rate",
      value: formatValue("prime_lending_rate", snapshot.prime_lending_rate.latest_value),
      source: snapshot.prime_lending_rate.source,
      footnote: formatDateLabel(snapshot.prime_lending_rate.latest_date),
      changeText: formatChangeText(snapshot.prime_lending_rate),
      tone: snapshot.prime_lending_rate.tone,
    },
    real_policy_rate: {
      title: "Real policy rate",
      value: formatValue("real_policy_rate", snapshot.real_policy_rate.latest_value),
      source: snapshot.real_policy_rate.source,
      footnote: formatDateLabel(snapshot.real_policy_rate.latest_date),
      changeText: formatChangeText(snapshot.real_policy_rate),
      tone: "neutral",
    },
    real_prime_lending_rate: {
      title: "Real prime lending rate",
      value: formatValue("real_prime_lending_rate", snapshot.real_prime_lending_rate.latest_value),
      source: snapshot.real_prime_lending_rate.source,
      footnote: formatDateLabel(snapshot.real_prime_lending_rate.latest_date),
      changeText: formatChangeText(snapshot.real_prime_lending_rate),
      tone: "neutral",
    },
  };
}

export function getBotswanaMacroRegime(): RegimeSummary | null {
  const snapshot = getBotswanaSnapshot();
  if (!snapshot) return null;

  const inflation = snapshot.inflation.latest_value;
  const inflationDelta = snapshot.inflation.delta;
  const gdp = snapshot.gdp.latest_value;
  const trade = snapshot.trade_balance.latest_value;
  const realPolicyRate = snapshot.real_policy_rate.latest_value;

  if (inflation === null || gdp === null) return null;

  if (gdp < 0) {
    return {
      label: "Contraction",
      tone: "negative",
      explanation:
        "Real GDP growth is below zero, which points to a contractionary macro phase.",
    };
  }

  if (gdp < 2 && inflation >= 4) {
    return {
      label: "Stagflation risk",
      tone: "negative",
      explanation:
        "Growth is weak while inflation remains elevated, which is consistent with stagflation risk.",
    };
  }

  if (gdp >= 2 && inflation >= 4 && (inflationDelta ?? 0) > 0) {
    return {
      label: "Overheating risk",
      tone: "warning",
      explanation:
        "Growth is holding up while inflation is elevated and still rising, which suggests overheating pressure.",
    };
  }

  if (realPolicyRate !== null && realPolicyRate > 0 && inflation <= 4 && gdp > 1.5) {
    return {
      label: "Tight Policy / Stabilizing",
      tone: "positive",
      explanation:
        "Real policy settings are positive while inflation is comparatively contained, which suggests a stabilizing macro environment.",
    };
  }

  if ((inflationDelta ?? 0) < 0) {
    return {
      label: "Disinflation / Stabilizing",
      tone: "neutral",
      explanation:
        "Inflation is easing relative to the previous period, which suggests a stabilizing macro environment.",
    };
  }

  return {
    label: "Mixed regime",
    tone: "neutral",
    explanation:
      trade !== null && trade < 0
        ? "Signals are mixed: growth is positive, but inflation and the external balance still point to macro pressure."
        : "Signals are mixed across growth and inflation, so the regime is not clearly one-sided.",
  };
}