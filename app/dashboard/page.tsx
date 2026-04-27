import { GovernmentBalanceSheet } from "@/components/GovernmentBalanceSheet";
import { LineChartCard } from "@/components/LineChartCard";
import { StatCard } from "@/components/StatCard";
import {
  getBotswanaCardData,
  getBotswanaDashboardSeries,
  getMacroSignal,
} from "@/lib/botswana-processed";
import {
  getSovereignProfile,
  getSovereignSignal,
} from "@/lib/sovereign-profile";
import { getMacroCommentary } from "@/lib/botswana-processed";

export default function DashboardPage() {
  const cards = getBotswanaCardData();
  const series = getBotswanaDashboardSeries();
  const macroSignal = getMacroSignal(series);
  const sovereign = getSovereignProfile();
  const sovereignSignal = getSovereignSignal(sovereign);
  const commentary = getMacroCommentary(series);

  if (!cards) {
  return null; // or fallback UI
}

  const summary = {
    lastUpdated: cards.inflation?.footnote ?? null,
    regimeLabel: macroSignal.label,
    regimeText:
      "Composite reading of inflation, interest rates, exchange-rate pressure, growth, and external balance. Use the signal blocks below for the quantified interpretation.",
  };

  const inflationSeries = series.find((item) => item.slug === "inflation");
  const unemploymentSeries = series.find((item) => item.slug === "unemployment_rate");
  const exchangeRateSeries = series.find((item) => item.slug === "exchange_rate");
  const gdpSeries = series.find((item) => item.slug === "gdp");
  const tradeBalanceSeries = series.find((item) => item.slug === "trade_balance");
  const policyRateSeries = series.find((item) => item.slug === "policy_rate");
  const primeLendingRateSeries = series.find(
    (item) => item.slug === "prime_lending_rate"
  );
  const realPolicyRateSeries = series.find(
    (item) => item.slug === "real_policy_rate"
  );
  const realPrimeLendingRateSeries = series.find(
    (item) => item.slug === "real_prime_lending_rate"
  );

  const lastUpdatedText =
    typeof summary.lastUpdated === "string" ? summary.lastUpdated : null;

  return (
    <main className="min-h-screen bg-[#06152d] px-6 py-10 text-white md:px-10 xl:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <div className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Dashboard
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Botswana macro dashboard
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-9 text-slate-300">
            This dashboard tracks Botswana’s macro regime, headline releases,
            financial conditions, external balance, and sovereign profile.
          </p>
        </div>

        <section className="mt-8 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
          <div className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Macro regime
          </div>
          <div className="mt-3 text-3xl font-semibold text-amber-50">
            {summary.regimeLabel}
          </div>
          <p className="mt-3 max-w-5xl text-lg leading-8 text-amber-100/90">
            {summary.regimeText}
          </p>
        </section>

        <section className="mt-6">
          <div className={`rounded-3xl border p-6 ${macroSignal.bg}`}>
            <div className="text-sm uppercase tracking-[0.2em] text-slate-400">
              Macro signal
            </div>

            <div className={`mt-3 text-3xl font-semibold ${macroSignal.color}`}>
              {macroSignal.label}
            </div>

            <p className="mt-3 max-w-3xl text-sm text-slate-300">
              Composite signal based on inflation dynamics, real interest rates,
              exchange-rate pressure, and growth momentum.
            </p>
          </div>
        </section>

        <section className="mt-6">
          <div className={`rounded-3xl border p-6 ${sovereignSignal.bg}`}>
            <div className="text-sm uppercase tracking-[0.2em] text-slate-400">
              Sovereign signal
            </div>

            <div
              className={`mt-3 text-3xl font-semibold ${sovereignSignal.color}`}
            >
              {sovereignSignal.label}
            </div>

            <p className="mt-3 max-w-3xl text-sm text-slate-300">
              Composite signal derived from debt burden, reserve adequacy, and
              credit rating.
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <StatCard {...cards.inflation} />
          <StatCard {...cards.unemployment_rate} />
          <StatCard {...cards.exchange_rate} />
          <StatCard {...cards.gdp} />
          <StatCard {...cards.trade_balance} />
          <StatCard {...cards.policy_rate} />
          <StatCard {...cards.prime_lending_rate} />
        </section>

        <div className="mt-8 max-w-3xl rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
          Botswana dashboard is now driven by CSV → Python → processed JSON.
        </div>

        <div className="mt-3 flex items-center gap-3 text-sm text-slate-400">
          <span>Pipeline updated: {lastUpdatedText ?? "N/A"}</span>
        </div>

        <section className="mt-10">
          <GovernmentBalanceSheet
            debtToGdpPct={sovereign.debtToGdpPct}
            debtYear={sovereign.debtYear}
            reservesUsdBn={sovereign.reservesUsdBn}
            reserveCoverMonths={sovereign.reserveCoverMonths}
            spRating={sovereign.spRating}
            moodysRating={sovereign.moodysRating}
            ratingOutlook={sovereign.ratingOutlook}
          />
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-2">
  {inflationSeries ? <LineChartCard series={inflationSeries} /> : null}
  {unemploymentSeries ? <LineChartCard series={unemploymentSeries} /> : null}
  {exchangeRateSeries ? <LineChartCard series={exchangeRateSeries} /> : null}
  {gdpSeries ? <LineChartCard series={gdpSeries} /> : null}
  {tradeBalanceSeries ? <LineChartCard series={tradeBalanceSeries} /> : null}
  {policyRateSeries ? <LineChartCard series={policyRateSeries} /> : null}
  {primeLendingRateSeries ? (
    <LineChartCard series={primeLendingRateSeries} />
  ) : null}
  {realPolicyRateSeries ? <LineChartCard series={realPolicyRateSeries} /> : null}
  {realPrimeLendingRateSeries ? (
    <LineChartCard series={realPrimeLendingRateSeries} />
  ) : null}
</section>
      </div>
    </main>
  );
}