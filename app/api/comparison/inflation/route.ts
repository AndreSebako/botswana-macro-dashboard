import { NextResponse } from "next/server";

type WorldBankRecord = {
  country?: { id?: string; value?: string };
  date?: string;
  value?: number | null;
};

type SeriesPoint = {
  date: string;
  value: number;
};

type CountrySeries = {
  code: string;
  name: string;
  points: SeriesPoint[];
};

const COUNTRY_CODES = ["BW", "ZA", "NA", "ZM", "MZ"];

const COUNTRY_NAMES: Record<string, string> = {
  BW: "Botswana",
  ZA: "South Africa",
  NA: "Namibia",
  ZM: "Zambia",
  MZ: "Mozambique",
};

const INDICATORS = {
  inflation: {
    code: "FP.CPI.TOTL.ZG",
    label: "Inflation, consumer prices (annual %)",
  },
  gdpGrowth: {
    code: "NY.GDP.MKTP.KD.ZG",
    label: "GDP growth (annual %)",
  },
  tradeBalance: {
    code: "NE.RSB.GNFS.ZS",
    label: "External balance on goods and services (% of GDP)",
  },
};

async function fetchCountryIndicator(
  countryCode: string,
  indicatorCode: string
): Promise<CountrySeries> {
  const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicatorCode}?format=json&per_page=200`;

  const response = await fetch(url, {
    next: { revalidate: 60 * 60 * 24 },
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`World Bank API failed for ${countryCode}: ${response.status}`);
  }

  const json = (await response.json()) as [unknown, WorldBankRecord[]];
  const records = Array.isArray(json?.[1]) ? json[1] : [];

  const points = records
    .filter((row) => row.date && row.value !== null && row.value !== undefined)
    .map((row) => ({
      date: row.date as string,
      value: Number(row.value),
    }))
    .filter((row) => !Number.isNaN(row.value))
    .sort((a, b) => Number(a.date) - Number(b.date))
    .slice(-15);

  return {
    code: countryCode,
    name: COUNTRY_NAMES[countryCode] ?? countryCode,
    points,
  };
}

export async function GET() {
  try {
    const [inflationCountries, gdpCountries, tradeCountries] = await Promise.all([
      Promise.all(
        COUNTRY_CODES.map((code) =>
          fetchCountryIndicator(code, INDICATORS.inflation.code)
        )
      ),
      Promise.all(
        COUNTRY_CODES.map((code) =>
          fetchCountryIndicator(code, INDICATORS.gdpGrowth.code)
        )
      ),
      Promise.all(
        COUNTRY_CODES.map((code) =>
          fetchCountryIndicator(code, INDICATORS.tradeBalance.code)
        )
      ),
    ]);

    return NextResponse.json({
      inflation: {
        indicator: INDICATORS.inflation.code,
        label: INDICATORS.inflation.label,
        countries: inflationCountries,
      },
      gdpGrowth: {
        indicator: INDICATORS.gdpGrowth.code,
        label: INDICATORS.gdpGrowth.label,
        countries: gdpCountries,
      },
      tradeBalance: {
        indicator: INDICATORS.tradeBalance.code,
        label: INDICATORS.tradeBalance.label,
        countries: tradeCountries,
      },
    });
  } catch (error) {
    console.error("Comparison API failed", error);

    return NextResponse.json(
      {
        inflation: {
          indicator: INDICATORS.inflation.code,
          label: INDICATORS.inflation.label,
          countries: [],
        },
        gdpGrowth: {
          indicator: INDICATORS.gdpGrowth.code,
          label: INDICATORS.gdpGrowth.label,
          countries: [],
        },
        tradeBalance: {
          indicator: INDICATORS.tradeBalance.code,
          label: INDICATORS.tradeBalance.label,
          countries: [],
        },
        error: "Failed to load comparison data.",
      },
      { status: 500 }
    );
  }
}