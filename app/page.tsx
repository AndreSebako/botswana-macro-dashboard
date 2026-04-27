import { MacroSnapshot } from "@/components/MacroSnapshot";
import { LiveEconomicNews } from "@/components/LiveEconomicNews";
import { AuthHeader } from "@/components/AuthHeader";
import snapshot from "@/data/processed/botswana/latest_snapshot.json";
import { classifyRegime } from "@/lib/macro-regime";

function getRegimeClasses(regime: string) {
  switch (regime) {
    case "Overheating":
      return {
        box: "border-amber-400/20 bg-amber-400/10 text-amber-100",
        accent: "text-amber-300",
      };
    case "Stabilizing":
      return {
        box: "border-green-400/20 bg-green-400/10 text-green-100",
        accent: "text-green-300",
      };
    case "Weak / Slowdown":
      return {
        box: "border-red-400/20 bg-red-400/10 text-red-100",
        accent: "text-red-300",
      };
    case "External Stress":
      return {
        box: "border-red-400/20 bg-red-400/10 text-red-100",
        accent: "text-red-300",
      };
    default:
      return {
        box: "border-white/10 bg-white/5 text-slate-200",
        accent: "text-slate-300",
      };
  }
}

export default function HomePage() {
  const regime = classifyRegime(snapshot);
  const regimeStyles = getRegimeClasses(regime);

  const botswanaNow = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Gaborone",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date());

  const cards = {
    inflation: {
      title: "Inflation rate",
      value:
        snapshot.inflation?.latest_value != null
          ? `${snapshot.inflation.latest_value}%`
          : "—",
      source: snapshot.inflation?.source,
      note: snapshot.inflation?.latest_date ?? "—",
    },
    exchange_rate: {
      title: "BWP / USD",
      value:
        snapshot.exchange_rate?.latest_value != null
          ? `${snapshot.exchange_rate.latest_value}`
          : "—",
      source: snapshot.exchange_rate?.source,
      note: snapshot.exchange_rate?.latest_date ?? "—",
    },
    gdp: {
      title: "Real GDP growth",
      value:
        snapshot.gdp?.latest_value != null
          ? `${snapshot.gdp.latest_value}%`
          : "—",
      source: snapshot.gdp?.source,
      note: snapshot.gdp?.latest_date ?? "—",
    },
    trade_balance: {
      title: "Trade balance",
      value:
        snapshot.trade_balance?.latest_value != null
          ? `${snapshot.trade_balance.latest_value} bn`
          : "—",
      source: snapshot.trade_balance?.source,
      note: snapshot.trade_balance?.latest_date ?? "—",
    },
    policy_rate: {
      title: "Policy rate",
      value:
        snapshot.policy_rate?.latest_value != null
          ? `${snapshot.policy_rate.latest_value}%`
          : "—",
      source: snapshot.policy_rate?.source,
      note: snapshot.policy_rate?.latest_date ?? "—",
    },
    prime_lending_rate: {
      title: "Prime lending rate",
      value:
        snapshot.prime_lending_rate?.latest_value != null
          ? `${snapshot.prime_lending_rate.latest_value}%`
          : "—",
      source: snapshot.prime_lending_rate?.source,
      note: snapshot.prime_lending_rate?.latest_date ?? "—",
    },
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <section className="grid gap-10 lg:grid-cols-[1.6fr_0.9fr] lg:items-start">
        <div>
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.2em] text-slate-300">
            Botswana macroeconomics and data analysis
          </div>

          <p className="mt-8 max-w-4xl text-xl leading-10 text-slate-300">
            Botswana Macro Lab combines official local releases with benchmark
            data to deliver clean dashboards, live macro monitoring, and concise
            Botswana-focused economic analysis.
          </p>

          <div
            className={`mt-8 inline-flex rounded-2xl border px-4 py-3 text-sm ${regimeStyles.box}`}
          >
            Current regime: <strong className="ml-1">{regime}</strong>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400"></span>
              </span>
              <span className="text-green-300 font-medium">Live</span>
            </span>

            <span className="text-slate-400">Botswana local time:</span>
            <span className="text-white">{botswanaNow}</span>
          </div>

          <AuthHeader />
        </div>

        <aside
          className={`rounded-3xl border bg-white/5 p-7 ${regimeStyles.box
            .replace("text-green-100", "")
            .replace("text-amber-100", "")
            .replace("text-red-100", "")
            .replace("text-slate-200", "")}`}
        >
          <div
            className={`text-sm uppercase tracking-[0.2em] ${regimeStyles.accent}`}
          >
            Live macro snapshot
          </div>

          <div className="mt-8 space-y-8">
            {Object.values(cards).map((card) => (
              <div key={card.title}>
                <div className="text-3xl font-semibold text-white">
                  {card.value}
                </div>
                <div className="mt-1 text-base text-slate-400">
                  {card.title}
                </div>
                <div className="mt-2 text-sm uppercase tracking-[0.12em] text-slate-500">
                  {card.source}
                </div>
                <div className="mt-2 text-sm text-slate-300">{card.note}</div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <MacroSnapshot />

      <section className="mt-12">
        <LiveEconomicNews />
      </section>
    </main>
  );
}