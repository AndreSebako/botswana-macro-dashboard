import { IndicatorSeries } from "@/lib/types";

export const indicators: IndicatorSeries[] = [
  {
    slug: "inflation",
    title: "Inflation Rate",
    unit: "%",
    source: "Statistics Botswana",
    lastUpdated: "2026-03-17",
    latestValue: 4.0,
    changeLabel: "from 3.7% previous month",
    points: [
      { date: "2025-09", value: 3.1 },
      { date: "2025-10", value: 3.3 },
      { date: "2025-11", value: 3.4 },
      { date: "2025-12", value: 3.5 },
      { date: "2026-01", value: 3.7 },
      { date: "2026-02", value: 4.0 }
    ]
  },
  {
    slug: "exchange-rate",
    title: "BWP / USD",
    unit: "BWP",
    source: "Bank of Botswana",
    lastUpdated: "2026-04-10",
    latestValue: 13.74,
    changeLabel: "daily midpoint reference",
    points: [
      { date: "2025-11", value: 13.55 },
      { date: "2025-12", value: 13.62 },
      { date: "2026-01", value: 13.68 },
      { date: "2026-02", value: 13.71 },
      { date: "2026-03", value: 13.72 },
      { date: "2026-04", value: 13.74 }
    ]
  },
  {
    slug: "gdp-growth",
    title: "Real GDP Growth",
    unit: "%",
    source: "Statistics Botswana",
    lastUpdated: "2026-03-28",
    latestValue: 2.6,
    changeLabel: "latest quarterly release",
    points: [
      { date: "2024-Q3", value: 1.8 },
      { date: "2024-Q4", value: 2.1 },
      { date: "2025-Q1", value: 2.2 },
      { date: "2025-Q2", value: 2.4 },
      { date: "2025-Q3", value: 2.5 },
      { date: "2025-Q4", value: 2.6 }
    ]
  },
  {
    slug: "trade-balance",
    title: "Trade Balance",
    unit: "BWP bn",
    source: "Statistics Botswana",
    lastUpdated: "2026-03-25",
    latestValue: -1.2,
    changeLabel: "monthly goods trade balance",
    points: [
      { date: "2025-09", value: -0.4 },
      { date: "2025-10", value: -0.9 },
      { date: "2025-11", value: -0.7 },
      { date: "2025-12", value: -0.6 },
      { date: "2026-01", value: -1.0 },
      { date: "2026-02", value: -1.2 }
    ]
  }
];
