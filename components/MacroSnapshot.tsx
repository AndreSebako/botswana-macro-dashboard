import snapshot from "@/data/processed/botswana/latest_snapshot.json";
import { classifyRegime } from "@/lib/macro-regime";

function formatSignedDelta(value: number | null, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return "n/a";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}`;
}

function getDirectionWord(
  value: number | null,
  positiveWord = "higher",
  negativeWord = "lower"
) {
  if (value === null || value === undefined || Number.isNaN(value)) return "unchanged";
  if (value > 0) return positiveWord;
  if (value < 0) return negativeWord;
  return "unchanged";
}

function getRegimeClasses(regime: string) {
  switch (regime) {
    case "Overheating":
      return "border-amber-400/20 bg-amber-400/10 text-amber-100";
    case "Stabilizing":
      return "border-green-400/20 bg-green-400/10 text-green-100";
    case "Weak / Slowdown":
      return "border-red-400/20 bg-red-400/10 text-red-100";
    case "External Stress":
      return "border-red-400/20 bg-red-400/10 text-red-100";
    case "Tight Policy / Disinflation":
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-100";
    default:
      return "border-white/10 bg-white/5 text-slate-200";
  }
}

export function MacroSnapshot() {
  const inflation = snapshot.inflation;
  const gdp = snapshot.gdp;
  const fx = snapshot.exchange_rate;
  const trade = snapshot.trade_balance;
  const policyRate = snapshot.policy_rate;
  const primeRate = snapshot.prime_lending_rate;
  const realPolicyRate = snapshot.real_policy_rate;
  const realPrimeLendingRate = snapshot.real_prime_lending_rate;

  const regime = classifyRegime(snapshot);

  const inflationDirection = getDirectionWord(inflation.delta, "higher", "lower");
  const gdpDirection = getDirectionWord(gdp.delta, "stronger", "weaker");
  const fxDirection = getDirectionWord(fx.delta, "higher", "lower");
  const tradeDirection = getDirectionWord(trade.delta, "improving", "weakening");

  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="text-sm uppercase tracking-[0.15em] text-slate-400">
        Macro snapshot
      </div>

      <h2 className="mt-3 text-2xl font-semibold text-white">
        Botswana macro conditions
      </h2>

      <div className={`mt-4 inline-block rounded-xl border px-4 py-2 text-sm ${getRegimeClasses(regime)}`}>
        Current regime: <strong>{regime}</strong>
      </div>

      <p className="mt-5 text-slate-300 leading-7">
        Inflation is currently <strong>{inflation.latest_value}%</strong> and trending{" "}
        <strong>{inflationDirection}</strong> versus the previous release
        {" "}({formatSignedDelta(inflation.delta, 2)}). Real GDP growth stands at{" "}
        <strong>{gdp.latest_value}%</strong>, with momentum appearing{" "}
        <strong>{gdpDirection}</strong> ({formatSignedDelta(gdp.delta, 2)}).
      </p>

      <p className="mt-4 text-slate-300 leading-7">
        The exchange rate is <strong>{fx.latest_value}</strong>, moving{" "}
        <strong>{fxDirection}</strong> relative to the previous observation
        {" "}({formatSignedDelta(fx.delta, 4)}), while the trade balance is{" "}
        <strong>{trade.latest_value} bn BWP</strong> and currently looks{" "}
        <strong>{tradeDirection}</strong> ({formatSignedDelta(trade.delta, 2)}).
      </p>

      <p className="mt-4 text-slate-300 leading-7">
        Financial conditions are being shaped by a <strong>{policyRate.latest_value}%</strong>{" "}
        policy rate and a <strong>{primeRate.latest_value}%</strong> average prime lending rate.
        In real terms, the policy rate is <strong>{realPolicyRate.latest_value}%</strong> and the
        real prime lending rate is <strong>{realPrimeLendingRate.latest_value}%</strong>, which helps
        show whether borrowing conditions are genuinely restrictive once inflation is taken into account.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-4 xl:grid-cols-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-slate-400">Inflation</div>
          <div className="mt-2 text-2xl font-semibold text-white">{inflation.latest_value}%</div>
          <div className="mt-2 text-sm text-slate-300">Δ {formatSignedDelta(inflation.delta, 2)}</div>
          <div className="mt-1 text-xs text-slate-500">Latest market date: {inflation.latest_date ?? "—"}</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-slate-400">BWP / USD</div>
          <div className="mt-2 text-2xl font-semibold text-white">{fx.latest_value}</div>
          <div className="mt-2 text-sm text-slate-300">Δ {formatSignedDelta(fx.delta, 4)}</div>
          <div className="mt-1 text-xs text-slate-500">Latest market date: {fx.latest_date ?? "—"}</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-slate-400">GDP growth</div>
          <div className="mt-2 text-2xl font-semibold text-white">{gdp.latest_value}%</div>
          <div className="mt-2 text-sm text-slate-300">Δ {formatSignedDelta(gdp.delta, 2)}</div>
          <div className="mt-1 text-xs text-slate-500">Latest market date: {gdp.latest_date ?? "—"}</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-slate-400">Trade balance</div>
          <div className="mt-2 text-2xl font-semibold text-white">{trade.latest_value} bn</div>
          <div className="mt-2 text-sm text-slate-300">Δ {formatSignedDelta(trade.delta, 2)}</div>
          <div className="mt-1 text-xs text-slate-500">Latest market date: {trade.latest_date ?? "—"}</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-slate-400">Policy rate</div>
          <div className="mt-2 text-2xl font-semibold text-white">{policyRate.latest_value}%</div>
          <div className="mt-2 text-sm text-slate-300">Δ {formatSignedDelta(policyRate.delta, 2)}</div>
          <div className="mt-1 text-xs text-slate-500">Latest market date: {policyRate.latest_date ?? "—"}</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-slate-400">Prime lending</div>
          <div className="mt-2 text-2xl font-semibold text-white">{primeRate.latest_value}%</div>
          <div className="mt-2 text-sm text-slate-300">Δ {formatSignedDelta(primeRate.delta, 2)}</div>
          <div className="mt-1 text-xs text-slate-500">Latest market date: {primeRate.latest_date ?? "—"}</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-slate-400">Real policy</div>
          <div className="mt-2 text-2xl font-semibold text-white">{realPolicyRate.latest_value}%</div>
          <div className="mt-2 text-sm text-slate-300">Δ {formatSignedDelta(realPolicyRate.delta, 2)}</div>
          <div className="mt-1 text-xs text-slate-500">Latest market date: {realPolicyRate.latest_date ?? "—"}</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-slate-400">Real prime</div>
          <div className="mt-2 text-2xl font-semibold text-white">{realPrimeLendingRate.latest_value}%</div>
          <div className="mt-2 text-sm text-slate-300">Δ {formatSignedDelta(realPrimeLendingRate.delta, 2)}</div>
          <div className="mt-1 text-xs text-slate-500">Latest market date: {realPrimeLendingRate.latest_date ?? "—"}</div>
        </div>
      </div>
    </section>
  );
}