export type LiveSnapshot = {
  inflationRate: number;
  inflationPeriod: string;
  bwpPerUsd: number;
  usdPerBwp: number;
  exchangeRateDate: string;
  gdpNominalBnPula: number;
  gdpPeriod: string;
  tradeBalanceBnPula: number;
  tradePeriod: string;
};

const STATS_BOTSWANA_URL = "https://www.statsbots.org.bw/latest-release";
const BANK_OF_BOTSWANA_RATES_URL = "https://www.bankofbotswana.bw/content/exchange-rates";

const FALLBACK_VALUES: LiveSnapshot = {
  inflationRate: 4.0,
  inflationPeriod: "February 2026",
  bwpPerUsd: 13.16,
  usdPerBwp: 0.076,
  exchangeRateDate: "13 Apr 2026",
  gdpNominalBnPula: 67.5,
  gdpPeriod: "Q3 2025",
  tradeBalanceBnPula: -1.76,
  tradePeriod: "December 2025",
};

function parseNumber(raw: string): number {
  const trimmed = raw.trim();
  const negativeFromParens = trimmed.includes("(") || trimmed.includes(")");
  const cleaned = trimmed.replace(/[,()\sP]/g, "");
  const value = Number(cleaned);

  if (Number.isNaN(value)) {
    throw new Error(`Could not parse numeric value from: ${raw}`);
  }

  if (negativeFromParens && value > 0) {
    return -value;
  }

  return value;
}

async function fetchTextSafe(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 60 * 60 * 6 },
      cache: "force-cache",
      headers: {
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      console.warn(`Fetch failed for ${url}: ${response.status}`);
      return null;
    }

    return await response.text();
  } catch (error) {
    console.warn(`Fetch threw for ${url}`, error);
    return null;
  }
}

function parseStatsBotswanaSnapshot(text: string) {
  const inflationMatch = text.match(/([A-Za-z]+\s+\d{4})\s+Inflation Rate=\s*([0-9.]+)\s*%/i);

  const gdpMatch = text.match(
    /Gross Domestic Product\s+Q([1-4])\s+(\d{4})\s+in Million Pula\s*=\s*P([\d,\s.]+)\(Nominal\)/i
  );

  const tradeMatch = text.match(
  /Trade Statistics\s+([A-Za-z]+\s+\d{4}):[\s\S]*?Trade Balance in Million Pula\s*=\s*([()\-\d,\s.]+)/i
);

  return {
    inflationRate: inflationMatch ? parseNumber(inflationMatch[2]) : FALLBACK_VALUES.inflationRate,
    inflationPeriod: inflationMatch ? inflationMatch[1].trim() : FALLBACK_VALUES.inflationPeriod,
    gdpNominalBnPula: gdpMatch
      ? Number((parseNumber(gdpMatch[3]) / 1000).toFixed(1))
      : FALLBACK_VALUES.gdpNominalBnPula,
    gdpPeriod: gdpMatch ? `Q${gdpMatch[1].trim()} ${gdpMatch[2].trim()}` : FALLBACK_VALUES.gdpPeriod,
    tradeBalanceBnPula: tradeMatch
      ? Number((parseNumber(tradeMatch[2]) / 1000).toFixed(2))
      : FALLBACK_VALUES.tradeBalanceBnPula,
    tradePeriod: tradeMatch ? tradeMatch[1].trim() : FALLBACK_VALUES.tradePeriod,
  };
}

function parseBankOfBotswanaExchangeRate(text: string) {
  const exchangeMatch = text.match(
    /(\d{2}\s+[A-Za-z]{3}\s+\d{4})\s+[0-9.]+\s+[0-9.]+\s+[0-9.]+\s+([0-9.]+)\s+[0-9.]+\s+[0-9.]+\s+[0-9.]+/
  );

  if (!exchangeMatch) {
    return {
      usdPerBwp: FALLBACK_VALUES.usdPerBwp,
      bwpPerUsd: FALLBACK_VALUES.bwpPerUsd,
      exchangeRateDate: FALLBACK_VALUES.exchangeRateDate,
    };
  }

  const exchangeRateDate = exchangeMatch[1].trim();
  const usdPerBwp = parseNumber(exchangeMatch[2]);
  const bwpPerUsd = Number((1 / usdPerBwp).toFixed(2));

  return {
    usdPerBwp,
    bwpPerUsd,
    exchangeRateDate,
  };
}

export async function getLiveSnapshot(): Promise<LiveSnapshot> {
  const [statsText, bankText] = await Promise.all([
    fetchTextSafe(STATS_BOTSWANA_URL),
    fetchTextSafe(BANK_OF_BOTSWANA_RATES_URL),
  ]);

  const stats = statsText
    ? parseStatsBotswanaSnapshot(statsText)
    : {
        inflationRate: FALLBACK_VALUES.inflationRate,
        inflationPeriod: FALLBACK_VALUES.inflationPeriod,
        gdpNominalBnPula: FALLBACK_VALUES.gdpNominalBnPula,
        gdpPeriod: FALLBACK_VALUES.gdpPeriod,
        tradeBalanceBnPula: FALLBACK_VALUES.tradeBalanceBnPula,
        tradePeriod: FALLBACK_VALUES.tradePeriod,
      };

  const fx = bankText
    ? parseBankOfBotswanaExchangeRate(bankText)
    : {
        usdPerBwp: FALLBACK_VALUES.usdPerBwp,
        bwpPerUsd: FALLBACK_VALUES.bwpPerUsd,
        exchangeRateDate: FALLBACK_VALUES.exchangeRateDate,
      };

  return {
    inflationRate: stats.inflationRate,
    inflationPeriod: stats.inflationPeriod,
    gdpNominalBnPula: stats.gdpNominalBnPula,
    gdpPeriod: stats.gdpPeriod,
    tradeBalanceBnPula: stats.tradeBalanceBnPula,
    tradePeriod: stats.tradePeriod,
    usdPerBwp: fx.usdPerBwp,
    bwpPerUsd: fx.bwpPerUsd,
    exchangeRateDate: fx.exchangeRateDate,
  };
}