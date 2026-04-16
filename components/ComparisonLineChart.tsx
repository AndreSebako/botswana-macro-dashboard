"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
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
  showZeroLine?: boolean;
  showPeerAverage?: boolean;
};

const COUNTRY_COLORS: Record<string, string> = {
  BW: "#22c55e",
  ZA: "#38bdf8",
  NA: "#f59e0b",
  ZM: "#ef4444",
  MZ: "#a855f7",
};

function reshapeForChart(countries: CountrySeries[], showPeerAverage: boolean) {
  const years = new Set<string>();

  for (const country of countries) {
    for (const point of country.points) {
      years.add(point.date);
    }
  }

  const sortedYears = Array.from(years).sort((a, b) => Number(a) - Number(b));

  return sortedYears.map((year) => {
    const row: Record<string, string | number | null> = { date: year };

    for (const country of countries) {
      const match = country.points.find((p) => p.date === year);
      row[country.name] = match ? match.value : null;
    }

    if (showPeerAverage) {
      const peerValues = countries
        .filter((country) => country.code !== "BW")
        .map((country) => country.points.find((p) => p.date === year)?.value)
        .filter((value): value is number => value !== undefined && value !== null);

      row["Peer Average"] =
        peerValues.length > 0
          ? peerValues.reduce((sum, value) => sum + value, 0) / peerValues.length
          : null;
    }

    return row;
  });
}

export function ComparisonLineChart({
  title,
  subtitle,
  countries,
  showZeroLine = false,
  showPeerAverage = false,
}: Props) {
  const data = reshapeForChart(countries, showPeerAverage);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <p className="mt-2 text-slate-300">{subtitle}</p>
      </div>

      <div className="h-[300px] lg:h-[280px]">
        <ResponsiveContainer width="100%" aspect={2.4}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis domain={["auto", "auto"]} stroke="#94a3b8" />
            <Tooltip />
            <Legend wrapperStyle={{ color: "#e2e8f0" }} />
            {showZeroLine && (
              <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
            )}

            {showPeerAverage && (
              <Line
                type="monotone"
                dataKey="Peer Average"
                stroke="#f8fafc"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                connectNulls={false}
              />
            )}

            {countries.map((country) => (
              <Line
                key={country.code}
                type="monotone"
                dataKey={country.name}
                stroke={COUNTRY_COLORS[country.code] ?? "#e2e8f0"}
                strokeWidth={country.code === "BW" ? 4 : 2}
                dot={false}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}