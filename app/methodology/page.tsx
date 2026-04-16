export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-white">
        Methodology
      </h1>

      <div className="mt-6 space-y-6 text-slate-300 leading-7">
        <p>
          This platform aggregates macroeconomic data from official Botswana
          sources including Statistics Botswana and the Bank of Botswana.
        </p>

        <p>
          Data is collected via automated Python scripts, cleaned, standardized,
          and converted into time-series format.
        </p>

        <p>
          All indicators are updated according to their official release
          frequency (monthly, quarterly, or daily).
        </p>

        <p>
          Growth rates are presented as:
        </p>

        <ul className="list-disc ml-6">
          <li>Inflation: year-over-year</li>
          <li>GDP: quarterly growth</li>
          <li>Exchange rate: level and change</li>
        </ul>

        <p>
          Each chart and indicator includes a last-updated timestamp to ensure
          transparency and reliability.
        </p>
      </div>
    </main>
  );
}