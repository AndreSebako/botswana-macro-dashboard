import Parser from "rss-parser";
import * as cheerio from "cheerio";

type NewsItem = {
  title: string;
  summary: string;
  source: string;
  href: string;
  publishedAt?: string;
  category: "Botswana" | "IMF" | "Regional" | "Global";
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
  ];

  return blockedPatterns.some(
    (pattern) =>
      title.includes(pattern) ||
      summary.includes(pattern) ||
      source.includes(pattern)
  );
}

async function getGoogleNewsItems(): Promise<NewsItem[]> {
  const query = encodeURIComponent(
    '"Botswana" AND ("inflation" OR "GDP" OR "economy" OR "Bank of Botswana" OR "Statistics Botswana" OR "trade balance" OR "policy rate" OR "budget" OR "diamond exports" "Business Insider Africa")'
  );

  const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=en-GB&gl=BW&ceid=BW:en`;

  const feed = await parser.parseURL(rssUrl);

  const mapped = (feed.items ?? []).map((item) => ({
    title: item.title ?? "Untitled",
    summary: cleanText(item.contentSnippet || item.content || item.summary),
    source: "Google News",
    href: item.link ?? "#",
    publishedAt: item.pubDate,
    category: "Botswana" as const,
  }));

  return mapped.filter((item) => !isLowValueHeadline(item)).slice(0, 8);
}

async function getImfNewsItems(): Promise<NewsItem[]> {
  try {
    const res = await fetch("https://www.imf.org/en/news", {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
      },
    });

    if (!res.ok) {
      console.warn(`IMF news fetch skipped: ${res.status}`);
      return [];
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const items: NewsItem[] = [];

    $("a").each((_, el) => {
      if (items.length >= 6) return false;

      const href = $(el).attr("href") || "";
      const text = $(el).text().trim();

      if (!href || !text) return;
      if (!href.includes("/en/News/")) return;
      if (text.length < 20) return;

      const absoluteHref = href.startsWith("http")
        ? href
        : `https://www.imf.org${href}`;

      items.push({
        title: text,
        summary: "Latest IMF news item from the official IMF news page.",
        source: "IMF",
        href: absoluteHref,
        category: "IMF",
      });
    });

    const unique = Array.from(
      new Map(items.map((item) => [item.href, item])).values()
    );

    return unique.slice(0, 6);
  } catch (error) {
    console.warn("IMF news fetch skipped:", error);
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