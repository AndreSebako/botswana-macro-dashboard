import { LineChartCard } from "@/components/LineChartCard";
import { StatCard } from "@/components/StatCard";
import {
  getBotswanaCardData,
  getBotswanaDashboardSeries,
  getBotswanaMacroRegime,
  getBotswanaSnapshot,
} from "@/lib/botswana-processed";

function getRegimeClasses(tone: "positive" | "negative" | "neutral" | "warning") {
  switch (tone) {
    case "positive":
      return "border-green-400/20 bg-green-400/10 text-green-100";
    case "negative":
      return "border-red-400/20 bg-red-400/10 text-red-100";
    case "warning":
      return "border-amber-400/20 bg-amber-400/10 text-amber-100";
    default:
      return "border-white/10 bg-white/5 text-slate-200";
  }
}

export default function DashboardPage() {
  const cards = getBotswanaCardData();
  const series = getBotswanaDashboardSeries();
  const regime = getBotswanaMacroRegime();
  const snapshot = getBotswanaSnapshot();

  if (!cards || !snapshot) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-100">
          No processed Botswana data found yet. Add CSV files to <code>data/raw/botswana</code> and run{" "}
          <code>python scripts/process_botswana_csv.py</code>.
        </div>
      </main>
    );
  }

  const isFresh =
    Date.now() - new Date(snapshot.last_updated).getTime() < 24 * 60 * 60 * 1000;

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="max-w-3xl">
        <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Dashboard</div>
        <h1 className="mt-3 text-4xl font-semibold text-white">Botswana macro dashboard</h1>
        <p className="mt-4 text-lg leading-8 text-slate-300">
          This dashboard now reads from processed Botswana CSV pipelines instead of placeholder-only
          series.
        </p>
      </div>

      {regime ? (
        <div className={`mt-8 rounded-2xl border p-5 ${getRegimeClasses(regime.tone)}`}>
          <div className="text-sm uppercase tracking-[0.15em] opacity-80">Macro regime</div>
          <div className="mt-2 text-2xl font-semibold">{regime.label}</div>
          <div className="mt-2 max-w-3xl text-sm opacity-90">{regime.explanation}</div>
        </div>
      ) : null}

      <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
  <StatCard {...cards.inflation} />
  <StatCard {...cards.exchange_rate} />
  <StatCard {...cards.gdp} />
  <StatCard {...cards.trade_balance} />
  <StatCard {...cards.policy_rate} />
  <StatCard {...cards.prime_lending_rate} />
</section>

      <div className="mt-12 max-w-3xl rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
        Botswana dashboard is now driven by CSV → Python → processed JSON.
      </div>

      <div className="mt-2 flex items-center gap-3 text-sm text-slate-400">
        <span>Pipeline updated: {new Date(snapshot.last_updated).toLocaleString()}</span>
        <span className={isFresh ? "text-green-400" : "text-red-400"}>
          ● {isFresh ? "Live" : "Stale"}
        </span>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {series.map((item) => (
          <LineChartCard key={item.slug} series={item} />
        ))}
      </div>
    </main>
  );
}