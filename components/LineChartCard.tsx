"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type Point = {
  date: string;
  value: number;
};

type ChartSeries = {
  slug: string;
  title: string;
  source: string;
  updatedAt: string;
  latestValue: string;
  latestLabel?: string;
  points: Point[];
  showZeroLine?: boolean;
  tone?: "positive" | "negative" | "neutral";
};

type Props = {
  series: ChartSeries;
};

export function LineChartCard({ series }: Props) {
  const getLineColor = () => {
    switch (series.tone) {
      case "positive":
        return "#4ade80";
      case "negative":
        return "#f87171";
      default:
        return "#60a5fa";
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-white">{series.title}</h3>
          <div className="mt-1 text-sm text-slate-400">
            Source: {series.source} · Updated {series.updatedAt}
          </div>
        </div>

        <div className="text-right">
          <div className="text-5xl font-semibold text-white">{series.latestValue}</div>
          {series.latestLabel ? (
            <div className="mt-2 text-sm text-slate-300">{series.latestLabel}</div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 h-[280px]">
        <ResponsiveContainer width="100%" aspect={2.4}>
          <LineChart data={series.points}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis domain={["auto", "auto"]} stroke="#94a3b8" />
            <Tooltip />
            {series.showZeroLine ? (
              <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
            ) : null}
            <Line
              type="monotone"
              dataKey="value"
              stroke={getLineColor()}
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}