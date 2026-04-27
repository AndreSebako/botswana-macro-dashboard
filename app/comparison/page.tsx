"use client";

import { useEffect, useState } from "react";
import { ComparisonLineChart } from "@/components/ComparisonLineChart";
import { ComparisonBarChart } from "@/components/ComparisonBarChart";

type SeriesPoint = {
  date: string;
  value: number;
};

type CountrySeries = {
  code: string;
  name: string;
  points: SeriesPoint[];
};

type IndicatorBlock = {
  indicator: string;
  label: string;
  countries: CountrySeries[];
};

type ComparisonApiResponse = {
  inflation: IndicatorBlock;
  gdpGrowth: IndicatorBlock;
  tradeBalance: IndicatorBlock;
  unemployment: IndicatorBlock;
  error?: string;
};

export default function ComparisonPage() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([
    "BW",
    "ZA",
    "NA",
    "ZM",
    "MZ",
  ]);

  const [data, setData] = useState<ComparisonApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setFetchError(null);

        const response = await fetch("/api/comparison/inflation");

        if (!response.ok) {
          throw new Error("Failed to load comparison data.");
        }

        const json = (await response.json()) as ComparisonApiResponse;
        setData(json);
      } catch (error) {
        console.error(error);
        setFetchError("Failed to load comparison data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function toggleCountry(code: string) {
    if (code === "BW") return;

    setSelectedCountries((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code]
    );
  }

  function computeLatestGap(countries: CountrySeries[]) {
    const botswana = countries.find((c) => c.code === "BW");
    if (!botswana) return null;

    const latestPoint = botswana.points.at(-1);
    if (!latestPoint) return null;

    const year = latestPoint.date;

    const peerValues = countries
      .filter((c) => c.code !== "BW")
      .map((c) => c.points.find((p) => p.date === year)?.value)
      .filter((v): v is number => v !== undefined && v !== null);

    if (peerValues.length === 0) return null;

    const peerAvg =
      peerValues.reduce((sum, v) => sum + v, 0) / peerValues.length;

    return {
      gap: latestPoint.value - peerAvg,
      year,
    };
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="text-white">Loading comparison data...</div>
      </main>
    );
  }

  if (fetchError || !data) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-red-100">
          {fetchError ?? "Failed to load comparison data."}
        </div>
      </main>
    );
  }

  const filteredInflation = data.inflation.countries.filter((country) =>
    selectedCountries.includes(country.code)
  );

  const filteredGDP = data.gdpGrowth.countries.filter((country) =>
    selectedCountries.includes(country.code)
  );

  const filteredTrade = data.tradeBalance.countries.filter((country) =>
    selectedCountries.includes(country.code)
  );

  const filteredUnemployment = data.unemployment.countries.filter((country) =>
    selectedCountries.includes(country.code)
  );

  const inflationGap = computeLatestGap(filteredInflation);
  const gdpGap = computeLatestGap(filteredGDP);
  const tradeGap = computeLatestGap(filteredTrade);
  const unemploymentGap = computeLatestGap(filteredUnemployment);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="max-w-4xl">
        <div className="text-sm uppercase tracking-[0.2em] text-slate-400">
          Regional comparison
        </div>
        <h1 className="mt-3 text-4xl font-semibold text-white">
          Botswana vs southern African peers
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-300">
          This page compares Botswana with selected regional peers across the same macro indicators.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-300">
        <div>
          <strong>Peer group:</strong> Botswana, South Africa, Namibia, Zambia, Mozambique
        </div>
        <div className="mt-2">
          <strong>Indicators:</strong> {data.inflation.label}, {data.gdpGrowth.label},{" "}
          {data.tradeBalance.label}, and {data.unemployment.label}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-300">
        <div className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
          Key insights
        </div>
        <div className="space-y-2">
          <p>
            Botswana shows lower inflation volatility than Zambia and Mozambique across much of the
            sample, although post-2021 price pressure still rose materially.
          </p>
          <p>
            GDP growth is more cyclical in Botswana, which is consistent with external-demand and
            commodity-linked exposure.
          </p>
          <p>
            External balance differences help show which economies are running stronger trade
            surpluses or deficits relative to GDP.
          </p>
          <p>
            Unemployment comparisons add a labour-market lens, helping distinguish whether growth
            improvements are broad-based or still leaving slack in the economy.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
          Select countries
        </div>

        <div className="flex flex-wrap gap-3">
          {data.inflation.countries.map((country) => {
            const active = selectedCountries.includes(country.code);
            const isBotswana = country.code === "BW";

            return (
              <button
                key={country.code}
                onClick={() => toggleCountry(country.code)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  active
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                } ${isBotswana ? "cursor-not-allowed opacity-70" : ""}`}
              >
                {country.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          {inflationGap && (
            <div className="mb-2 text-sm text-slate-300">
              Botswana vs peer average ({inflationGap.year}):{" "}
              <span className={inflationGap.gap >= 0 ? "text-green-400" : "text-red-400"}>
                {inflationGap.gap >= 0 ? "+" : ""}
                {inflationGap.gap.toFixed(1)} pp
              </span>
            </div>
          )}

          <ComparisonLineChart
            title="Inflation comparison"
            subtitle="Annual CPI inflation across Botswana and selected southern African peers."
            countries={filteredInflation}
            showPeerAverage
          />
        </div>

        <div>
          {gdpGap && (
            <div className="mb-2 text-sm text-slate-300">
              Botswana vs peer average ({gdpGap.year}):{" "}
              <span className={gdpGap.gap >= 0 ? "text-green-400" : "text-red-400"}>
                {gdpGap.gap >= 0 ? "+" : ""}
                {gdpGap.gap.toFixed(1)} pp
              </span>
            </div>
          )}

          <ComparisonLineChart
            title="GDP growth comparison"
            subtitle="Annual real GDP growth across Botswana and selected southern African peers."
            countries={filteredGDP}
            showZeroLine
            showPeerAverage
          />
        </div>

        {/* Trade balance */}
<div>
  {tradeGap && (
    <div className="mb-2 text-sm text-slate-300">
      Botswana vs peer average ({tradeGap.year}):{" "}
      <span className={tradeGap.gap >= 0 ? "text-green-400" : "text-red-400"}>
        {tradeGap.gap >= 0 ? "+" : ""}
        {tradeGap.gap.toFixed(1)} pp
      </span>
    </div>
  )}

  <ComparisonLineChart
    title="Trade balance comparison"
    subtitle="External balance on goods and services as a share of GDP."
    countries={filteredTrade}
    showZeroLine
    showPeerAverage
  />
</div>

{/* Unemployment */}
<div>
  {unemploymentGap && (
    <div className="mb-2 text-sm text-slate-300">
      Botswana vs peer average ({unemploymentGap.year}):{" "}
      <span
        className={
          unemploymentGap.gap <= 0 ? "text-green-400" : "text-red-400"
        }
      >
        {unemploymentGap.gap >= 0 ? "+" : ""}
        {unemploymentGap.gap.toFixed(1)} pp
      </span>
    </div>
  )}

  <ComparisonBarChart
  title="Unemployment rate comparison"
  subtitle="Latest unemployment rates across Botswana and selected southern African peers."
  countries={filteredUnemployment}
/>
</div>
      </div>
    </main>
  );
}