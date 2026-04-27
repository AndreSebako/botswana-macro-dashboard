import fs from "fs";
import path from "path";

type Point = {
  date: string;
  value: number;
};

type Tone = "positive" | "negative" | "neutral";

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
  tone: Tone;
};

type SnapshotFile = {
  inflation: SnapshotEntry;
  unemployment_rate: SnapshotEntry;
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

type CardItem = {
  title: string;
  value: string;
  source: string;
  footnote: string;
  changeText: string;
  tone?: Tone;
};

type CardMap = {
  inflation: CardItem;
  unemployment_rate: CardItem;
  exchange_rate: CardItem;
  gdp: CardItem;
  trade_balance: CardItem;
  policy_rate: CardItem;
  prime_lending_rate: CardItem;
  real_policy_rate: CardItem;
  real_prime_lending_rate: CardItem;
};

type DashboardSeriesItem = {
  slug: string;
  title: string;
  source: string;
  updatedAt: string;
  latestValue: string;
  latestLabel: string;
  points: Point[];
  showZeroLine: boolean;
  tone?: Tone;
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
  slug === "unemployment_rate"
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

export function getBotswanaSnapshot(): SnapshotFile | null {
  return readJson<SnapshotFile>("latest_snapshot.json");
}

export function getBotswanaDashboardSeries(): DashboardSeriesItem[] {
  const snapshot = getBotswanaSnapshot();
  if (!snapshot) return [];

  const inflation = readJson<Point[]>("inflation.json") ?? [];
  const unemploymentRate = readJson<Point[]>("unemployment_rate.json") ?? [];
  const exchangeRate = readJson<Point[]>("exchange_rate.json") ?? [];
  const gdp = readJson<Point[]>("gdp.json") ?? [];
  const trade = readJson<Point[]>("trade_balance.json") ?? [];
  const policyRate = readJson<Point[]>("policy_rate.json") ?? [];
  const primeLendingRate = readJson<Point[]>("prime_lending_rate.json") ?? [];
  const realPolicyRate = readJson<Point[]>("real_policy_rate.json") ?? [];
  const realPrimeLendingRate = readJson<Point[]>("real_prime_lending_rate.json") ?? [];

  const fxTone: Tone =
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
      slug: "unemployment_rate",
      title: "Unemployment Rate",
      source: snapshot.unemployment_rate.source,
      updatedAt: formatDateLabel(snapshot.unemployment_rate.latest_date),
      latestValue: formatValue(
        "unemployment_rate",
        snapshot.unemployment_rate.latest_value
      ),
      latestLabel: "latest labour market reading",
      points: unemploymentRate,
      showZeroLine: false,
      tone: snapshot.unemployment_rate.tone,
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
      latestValue: formatValue(
        "real_prime_lending_rate",
        snapshot.real_prime_lending_rate.latest_value
      ),
      latestLabel: "prime lending rate minus inflation",
      points: realPrimeLendingRate,
      showZeroLine: true,
      tone: "neutral",
    },
  ];
}

export function getBotswanaCardData(): CardMap | null {
  const snapshot = getBotswanaSnapshot();
  if (!snapshot) return null;

  const fxTone: Tone =
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
    unemployment_rate: {
      title: "Unemployment rate",
      value: formatValue("unemployment_rate",snapshot.unemployment_rate.latest_value),
      source: snapshot.unemployment_rate.source,
      footnote: formatDateLabel(snapshot.unemployment_rate.latest_date),
      changeText: formatChangeText(snapshot.unemployment_rate),
      tone: snapshot.unemployment_rate.tone,
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
      value: formatValue(
        "real_prime_lending_rate",
        snapshot.real_prime_lending_rate.latest_value
      ),
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
  const realPrimeRate = snapshot.real_prime_lending_rate.latest_value;

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

  if (
    realPolicyRate !== null &&
    realPolicyRate > 0 &&
    realPrimeRate !== null &&
    realPrimeRate > 0 &&
    inflation <= 4 &&
    gdp > 1.5
  ) {
    return {
      label: "Tight Policy / Stabilizing",
      tone: "positive",
      explanation:
        "Both real policy and real lending rates are positive while inflation is comparatively contained, which suggests tighter financial conditions and a stabilizing macro environment.",
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

export function getMacroSignal(
  series: ReturnType<typeof getBotswanaDashboardSeries>
) {
  const inflation = series.find((s) => s.slug === "inflation");
  const policy = series.find((s) => s.slug === "policy_rate");
  const fx = series.find((s) => s.slug === "exchange_rate");
  const gdp = series.find((s) => s.slug === "gdp");

  function latestTwo(data?: { date: string; value: number }[]) {
    if (!data || data.length < 2) return null;
    return [data[data.length - 2], data[data.length - 1]];
  }

  let score = 0;

  const inf = latestTwo(inflation?.points);
  if (inf) {
    const change = inf[1].value - inf[0].value;
    if (inf[1].value > 6) score += 2;
    else if (inf[1].value > 4) score += 1;
    if (change > 0.5) score += 1;
  }

  const pol = latestTwo(policy?.points);
  if (pol && inf) {
    const realRate = pol[1].value - inf[1].value;
    if (realRate < 0) score += 2;
    else if (realRate < 1) score += 1;
  }

  const fxData = latestTwo(fx?.points);
  if (fxData) {
    const change = (fxData[1].value - fxData[0].value) / fxData[0].value;
    if (change > 0.05) score += 2;
    else if (change > 0.02) score += 1;
  }

  const gdpData = latestTwo(gdp?.points);
  if (gdpData) {
    if (gdpData[1].value < 2) score += 2;
    else if (gdpData[1].value < 4) score += 1;
  }

  if (score >= 6) {
    return {
      label: "Macro stress building",
      color: "text-red-400",
      bg: "bg-red-400/10 border-red-400/20",
    };
  }

  if (score >= 3) {
    return {
      label: "Mixed macro signals",
      color: "text-amber-400",
      bg: "bg-amber-400/10 border-amber-400/20",
    };
  }

  return {
    label: "Macro stable",
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
  };
}

export function getMacroCommentary(
  series: ReturnType<typeof getBotswanaDashboardSeries>
) {
  const inflation = series.find((s) => s.slug === "inflation");
  const policy = series.find((s) => s.slug === "policy_rate");
  const fx = series.find((s) => s.slug === "exchange_rate");
  const gdp = series.find((s) => s.slug === "gdp");

  function latest(data?: { date: string; value: number }[]) {
    if (!data || data.length === 0) return null;
    return data[data.length - 1];
  }

  const inf = latest(inflation?.points);
  const pol = latest(policy?.points);
  const fxData = latest(fx?.points);
  const gdpData = latest(gdp?.points);

  const insights: string[] = [];

  if (inf && pol) {
    const realRate = pol.value - inf.value;

    if (realRate < 0) {
      insights.push(
        "Real interest rates remain negative, indicating accommodative financial conditions despite inflation dynamics."
      );
    } else if (realRate < 1) {
      insights.push(
        "Real rates are marginally positive, suggesting only mild monetary tightness."
      );
    } else {
      insights.push(
        "Real rates are positive, indicating restrictive monetary conditions."
      );
    }
  }

  if (inf) {
    if (inf.value > 6) {
      insights.push(
        "Inflation remains elevated, posing upside risks to policy tightening."
      );
    } else if (inf.value < 4) {
      insights.push(
        "Inflation appears contained within a moderate range."
      );
    }
  }

  if (fxData) {
    insights.push(
      "Exchange rate dynamics remain a key transmission channel for external shocks."
    );
  }

  if (gdpData) {
    if (gdpData.value < 2) {
      insights.push(
        "Growth momentum appears weak, suggesting downside macro risks."
      );
    } else if (gdpData.value > 4) {
      insights.push(
        "Growth remains relatively strong, supporting macro stability."
      );
    }
  }

  return insights;
}