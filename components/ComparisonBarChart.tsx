"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type SeriesPoint = {
  date: string;
  value: number;
};

type CountrySeries = {
  code: string;
  name: string;
  points: SeriesPoint[];
};

type Props = {
  title: string;
  subtitle: string;
  countries: CountrySeries[];
};

export function ComparisonBarChart({ title, subtitle, countries }: Props) {
  const botswana = countries.find((c) => c.code === "BW");
  const latestYear = botswana?.points.at(-1)?.date;

  if (!latestYear) return null;

  const data = countries
    .map((c) => {
      const point = c.points.find((p) => p.date === latestYear);
      return {
        name: c.name,
        code: c.code,
        value: point?.value ?? null,
      };
    })
    .filter((d): d is { name: string; code: string; value: number } => {
      return typeof d.value === "number";
    })
    .sort((a, b) => b.value - a.value);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{subtitle}</p>

      <div className="mt-6 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" stroke="#94a3b8" />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#94a3b8"
              width={120}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(1)}%`, "Rate"]}
              contentStyle={{
                background: "#0f172a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
            <Bar dataKey="value">
              {data.map((entry) => (
                <Cell
                  key={entry.code}
                  fill={entry.code === "BW" ? "#22c55e" : "#3b82f6"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-xs text-slate-500">
        Latest available year: {latestYear}
      </div>
    </div>
  );
}