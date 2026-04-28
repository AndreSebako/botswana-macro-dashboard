"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type GovernmentBalanceSheetProps = {
  debtToGdpPct?: number | null;
  debtYear?: string | null;
  reservesUsdBn?: number | null;
  reserveCoverMonths?: number | null;
  spRating?: string | null;
  moodysRating?: string | null;
  ratingOutlook?: string | null;
};

const assetData = [
  {
    name: "Sovereign wealth fund",
    value: 3.8,
    display: "$3.8bn",
    note: "Pula Fund / long-term fiscal buffer",
  },
  {
    name: "Foreign reserves",
    value: 3.5,
    display: "$3.5bn",
    note: "External buffer / import cover",
  },
  {
    name: "Central bank assets",
    value: 5.0,
    display: "$5.0bn",
    note: "Bank of Botswana balance sheet anchor",
  },
  {
    name: "Infrastructure allocation",
    value: 1.8,
    display: "$1.8bn",
    note: "Development expenditure / public projects",
  },
];

const COLORS = ["#60A5FA", "#34D399", "#F59E0B", "#A78BFA"];

export function GovernmentBalanceSheet({
  debtToGdpPct,
  debtYear,
  reservesUsdBn,
  reserveCoverMonths,
  spRating,
  moodysRating,
  ratingOutlook,
}: GovernmentBalanceSheetProps) {
  const totalAssets = assetData.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-white">
            Government balance sheet
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Estimated asset structure, debt context, reserve adequacy, and
            sovereign credit profile.
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.14em] text-slate-400">
          Estimated snapshot
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Asset mix</h3>
            <span className="text-sm text-slate-400">
              Total shown: ${totalAssets.toFixed(1)}bn
            </span>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={105}
                  innerRadius={55}
                  paddingAngle={3}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={1}
                >
                  {assetData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(1)}bn USD est.`,
                    name,
                  ]}
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm uppercase tracking-[0.14em] text-slate-500">
              Debt to GDP
            </div>
            <div className="mt-3 text-4xl font-semibold text-white">
              {typeof debtToGdpPct === "number"
                ? `${debtToGdpPct.toFixed(1)}%`
                : "N/A"}
            </div>
            <div className="mt-2 text-sm text-slate-400">
              {debtYear
                ? `Latest reported year: ${debtYear}`
                : "Debt-to-GDP data unavailable."}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm uppercase tracking-[0.14em] text-slate-500">
              Reserve adequacy
            </div>
            <div className="mt-3 text-3xl font-semibold text-white">
              {typeof reservesUsdBn === "number"
                ? `$${reservesUsdBn.toFixed(1)}bn`
                : "N/A"}
            </div>
            <div className="mt-2 text-sm text-slate-400">
              {typeof reserveCoverMonths === "number"
                ? `Approx. ${reserveCoverMonths.toFixed(1)} months of import cover`
                : "Reserve cover not available."}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm uppercase tracking-[0.14em] text-slate-500">
              Credit profile
            </div>
            <div className="mt-3 text-2xl font-semibold text-white">
              {spRating ?? "N/A"}
            </div>
            <div className="mt-2 text-sm text-slate-400">
              Moody’s: {moodysRating ?? "N/A"}
              {ratingOutlook ? ` • Outlook: ${ratingOutlook}` : ""}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5">
            <div className="text-sm uppercase tracking-[0.14em] text-amber-100/80">
              Interpretation
            </div>
            <div className="mt-3 text-sm leading-7 text-amber-100">
              Botswana’s public balance sheet still appears buffer-rich relative
              to many peers, but fiscal strength remains sensitive to diamond
              revenue, reserve drawdowns, and public expenditure execution.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="text-lg font-semibold text-white">
          Estimated breakdown
        </h3>

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {assetData.map((item, index) => {
            const share = (item.value / totalAssets) * 100;

            return (
              <div
                key={item.name}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-base font-medium text-white">
                      {item.name}
                    </div>
                    <div className="mt-1 text-sm text-slate-400">
                      {item.note}
                    </div>
                  </div>

                  <div
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: `${COLORS[index % COLORS.length]}22`,
                      color: COLORS[index % COLORS.length],
                    }}
                  >
                    {share.toFixed(0)}%
                  </div>
                </div>

                <div className="mt-3 text-lg font-semibold text-white">
                  {item.display}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}