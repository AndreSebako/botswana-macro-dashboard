import { NextResponse } from "next/server";

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

function makeSeries(
  code: string,
  name: string,
  points: SeriesPoint[]
): CountrySeries {
  return { code, name, points };
}

export async function GET() {
  try {
    const inflation: IndicatorBlock = {
      indicator: "inflation",
      label: "Inflation (%)",
      countries: [
        makeSeries("BW", "Botswana", [
          { date: "2020", value: 1.9 },
          { date: "2021", value: 6.7 },
          { date: "2022", value: 12.2 },
          { date: "2023", value: 4.1 },
          { date: "2024", value: 3.9 },
          { date: "2025", value: 4.0 },
        ]),
        makeSeries("ZA", "South Africa", [
          { date: "2020", value: 3.3 },
          { date: "2021", value: 4.5 },
          { date: "2022", value: 6.9 },
          { date: "2023", value: 6.0 },
          { date: "2024", value: 5.4 },
          { date: "2025", value: 5.1 },
        ]),
        makeSeries("NA", "Namibia", [
          { date: "2020", value: 2.2 },
          { date: "2021", value: 3.6 },
          { date: "2022", value: 6.1 },
          { date: "2023", value: 5.9 },
          { date: "2024", value: 5.1 },
          { date: "2025", value: 4.8 },
        ]),
        makeSeries("ZM", "Zambia", [
          { date: "2020", value: 15.7 },
          { date: "2021", value: 22.0 },
          { date: "2022", value: 10.9 },
          { date: "2023", value: 11.0 },
          { date: "2024", value: 13.7 },
          { date: "2025", value: 12.8 },
        ]),
        makeSeries("MZ", "Mozambique", [
          { date: "2020", value: 3.1 },
          { date: "2021", value: 5.7 },
          { date: "2022", value: 10.3 },
          { date: "2023", value: 7.1 },
          { date: "2024", value: 5.6 },
          { date: "2025", value: 5.0 },
        ]),
      ],
    };

    const gdpGrowth: IndicatorBlock = {
      indicator: "gdpGrowth",
      label: "Real GDP growth (%)",
      countries: [
        makeSeries("BW", "Botswana", [
          { date: "2020", value: -8.7 },
          { date: "2021", value: 11.9 },
          { date: "2022", value: 5.8 },
          { date: "2023", value: 3.2 },
          { date: "2024", value: 2.8 },
          { date: "2025", value: 2.6 },
        ]),
        makeSeries("ZA", "South Africa", [
          { date: "2020", value: -6.3 },
          { date: "2021", value: 4.7 },
          { date: "2022", value: 1.9 },
          { date: "2023", value: 0.7 },
          { date: "2024", value: 1.1 },
          { date: "2025", value: 1.4 },
        ]),
        makeSeries("NA", "Namibia", [
          { date: "2020", value: -8.0 },
          { date: "2021", value: 3.5 },
          { date: "2022", value: 4.6 },
          { date: "2023", value: 3.7 },
          { date: "2024", value: 3.4 },
          { date: "2025", value: 3.2 },
        ]),
        makeSeries("ZM", "Zambia", [
          { date: "2020", value: -2.8 },
          { date: "2021", value: 4.6 },
          { date: "2022", value: 5.2 },
          { date: "2023", value: 5.4 },
          { date: "2024", value: 4.1 },
          { date: "2025", value: 3.8 },
        ]),
        makeSeries("MZ", "Mozambique", [
          { date: "2020", value: -1.3 },
          { date: "2021", value: 2.2 },
          { date: "2022", value: 4.2 },
          { date: "2023", value: 5.0 },
          { date: "2024", value: 5.2 },
          { date: "2025", value: 5.0 },
        ]),
      ],
    };

    const tradeBalance: IndicatorBlock = {
      indicator: "tradeBalance",
      label: "Trade balance (% of GDP)",
      countries: [
        makeSeries("BW", "Botswana", [
          { date: "2020", value: 3.1 },
          { date: "2021", value: 5.8 },
          { date: "2022", value: 4.2 },
          { date: "2023", value: 1.7 },
          { date: "2024", value: -0.6 },
          { date: "2025", value: -1.2 },
        ]),
        makeSeries("ZA", "South Africa", [
          { date: "2020", value: 2.8 },
          { date: "2021", value: 4.1 },
          { date: "2022", value: 1.9 },
          { date: "2023", value: 0.8 },
          { date: "2024", value: -0.9 },
          { date: "2025", value: -1.4 },
        ]),
        makeSeries("NA", "Namibia", [
          { date: "2020", value: -8.1 },
          { date: "2021", value: -5.3 },
          { date: "2022", value: -2.9 },
          { date: "2023", value: -1.2 },
          { date: "2024", value: -0.5 },
          { date: "2025", value: -0.3 },
        ]),
        makeSeries("ZM", "Zambia", [
          { date: "2020", value: 7.2 },
          { date: "2021", value: 8.4 },
          { date: "2022", value: 6.8 },
          { date: "2023", value: 5.1 },
          { date: "2024", value: 4.0 },
          { date: "2025", value: 3.4 },
        ]),
        makeSeries("MZ", "Mozambique", [
          { date: "2020", value: -20.1 },
          { date: "2021", value: -17.4 },
          { date: "2022", value: -13.8 },
          { date: "2023", value: -10.2 },
          { date: "2024", value: -8.4 },
          { date: "2025", value: -7.0 },
        ]),
      ],
    };

    const unemployment: IndicatorBlock = {
      indicator: "unemployment",
      label: "Unemployment rate (%)",
      countries: [
        makeSeries("BW", "Botswana", [
          { date: "2020", value: 24.5 },
          { date: "2021", value: 25.4 },
          { date: "2022", value: 24.1 },
          { date: "2023", value: 23.6 },
          { date: "2024", value: 22.8 },
          { date: "2025", value: 22.2 },
        ]),
        makeSeries("ZA", "South Africa", [
          { date: "2020", value: 29.2 },
          { date: "2021", value: 34.9 },
          { date: "2022", value: 32.7 },
          { date: "2023", value: 32.1 },
          { date: "2024", value: 31.5 },
          { date: "2025", value: 31.0 },
        ]),
        makeSeries("NA", "Namibia", [
          { date: "2020", value: 21.0 },
          { date: "2021", value: 20.9 },
          { date: "2022", value: 20.4 },
          { date: "2023", value: 19.7 },
          { date: "2024", value: 19.1 },
          { date: "2025", value: 18.8 },
        ]),
        makeSeries("ZM", "Zambia", [
          { date: "2020", value: 13.0 },
          { date: "2021", value: 12.7 },
          { date: "2022", value: 12.3 },
          { date: "2023", value: 11.9 },
          { date: "2024", value: 11.5 },
          { date: "2025", value: 11.2 },
        ]),
        makeSeries("MZ", "Mozambique", [
          { date: "2020", value: 4.8 },
          { date: "2021", value: 4.7 },
          { date: "2022", value: 4.6 },
          { date: "2023", value: 4.5 },
          { date: "2024", value: 4.4 },
          { date: "2025", value: 4.3 },
        ]),
      ],
    };

    return NextResponse.json({
      inflation,
      gdpGrowth,
      tradeBalance,
      unemployment,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to load comparison data.",
      },
      { status: 500 }
    );
  }
}