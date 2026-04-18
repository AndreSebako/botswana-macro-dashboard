import Parser from "rss-parser";

type NewsItem = {
  title: string;
  summary: string;
  source: string;
  href: string;
  publishedAt?: string;
  category: "Botswana" | "IMF" | "Regional" | "Global";
  signal?: string;
};

const parser = new Parser();

function cleanText(input?: string) {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function isLowValueHeadline(item: NewsItem) {
  const title = item.title.toLowerCase();
  const summary = item.summary.toLowerCase();
  const source = item.source.toLowerCase();

  const blockedPatterns = [
    "statista",
    "stock price",
    "share price",
    "abridged report",
    "world athletics",
    "open day",
    "civil society organisation",
    "student",
    "graduates",
    "sports",
    "relay",
    "athletics",
    "dialogue",
    "conference",
  ];

  return blockedPatterns.some(
    (pattern) =>
      title.includes(pattern) ||
      summary.includes(pattern) ||
      source.includes(pattern)
  );
}

function isMacroRelevant(item: NewsItem) {
  const text = `${item.title} ${item.summary}`.toLowerCase();

  const keywords = [
    "inflation",
    "gdp",
    "growth",
    "interest rate",
    "central bank",
    "bank of botswana",
    "statistics botswana",
    "fiscal",
    "budget",
    "exports",
    "imports",
    "trade",
    "diamond",
    "mining",
    "policy",
    "currency",
  ];

  return keywords.some((k) => text.includes(k));
}

function classifySignal(item: NewsItem): string {
  const text = `${item.title} ${item.summary}`.toLowerCase();

  if (text.includes("inflation") || text.includes("rate hike")) return "Hawkish";
  if (text.includes("growth") || text.includes("expansion")) return "Growth";
  if (text.includes("risk") || text.includes("downturn")) return "Risk";
  if (text.includes("trade") || text.includes("exports") || text.includes("imports")) {
    return "External";
  }
  if (text.includes("budget") || text.includes("fiscal")) return "Fiscal";

  return "Neutral";
}

async function getGoogleNewsItems(): Promise<NewsItem[]> {
  const query = encodeURIComponent(
    '"Botswana" AND ("inflation" OR "GDP" OR "economy" OR "Bank of Botswana" OR "Statistics Botswana" OR "trade balance" OR "policy rate" OR "budget" OR "diamond exports")'
  );

  const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=en-GB&gl=BW&ceid=BW:en`;

  const feed = await parser.parseURL(rssUrl);

  const mapped: NewsItem[] = (feed.items ?? []).map((item) => {
    const mappedItem: NewsItem = {
      title: item.title ?? "Untitled",
      summary: cleanText(item.contentSnippet || item.content || item.summary),
      source: "Google News",
      href: item.link ?? "#",
      publishedAt: item.pubDate,
      category: "Botswana",
    };

    return {
      ...mappedItem,
      signal: classifySignal(mappedItem),
    };
  });

  return mapped
    .filter((item) => !isLowValueHeadline(item))
    .filter((item) => isMacroRelevant(item))
    .slice(0, 8);
}

async function getImfNewsItems(): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL("https://www.imf.org/en/News/RSS");

    const mapped: NewsItem[] = (feed.items ?? []).map((item) => {
      const mappedItem: NewsItem = {
        title: item.title ?? "Untitled",
        summary: cleanText(item.contentSnippet || item.content || item.summary),
        source: "IMF",
        href: item.link ?? "#",
        publishedAt: item.pubDate,
        category: "IMF",
      };

      return {
        ...mappedItem,
        signal: classifySignal(mappedItem),
      };
    });

    return mapped.slice(0, 6);
  } catch (error) {
    console.warn("IMF RSS failed:", error);
    return [];
  }
}

export async function GET() {
  try {
    const botswana = await getGoogleNewsItems();
    const imf = await getImfNewsItems();

    return Response.json({
      updatedAt: new Date().toISOString(),
      botswana,
      imf,
      imfAvailable: imf.length > 0,
    });
  } catch (error) {
    console.error("News API error:", error);

    return Response.json(
      {
        updatedAt: new Date().toISOString(),
        botswana: [],
        imf: [],
        imfAvailable: false,
        error: "Failed to load news feed.",
      },
      { status: 500 }
    );
  }
}