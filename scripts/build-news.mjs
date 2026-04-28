import fs from "fs";
import * as cheerio from "cheerio";

const OUTPUT = "public/data/news.json";

const HTML_SOURCES = [
  {
    name: "Statistics Botswana Press",
    url: "https://www.statsbots.org.bw/press-releases",
    category: "Botswana",
  },
  {
    name: "Statistics Botswana Latest News",
    url: "https://www.statsbots.org.bw/latest-news",
    category: "Botswana",
  },
];

function cleanText(value = "") {
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function normalizeUrl(base, href) {
  if (!href) return base;
  try {
    return new URL(href, base).toString();
  } catch {
    return base;
  }
}

function scoreSignal(text) {
  const t = text.toLowerCase();

  if (t.includes("inflation") || t.includes("consumer price") || t.includes("cpi")) return "Inflation";
  if (t.includes("gdp") || t.includes("growth") || t.includes("national accounts")) return "Growth";
  if (t.includes("trade") || t.includes("exports") || t.includes("imports")) return "Trade";
  if (t.includes("tourism")) return "Tourism";
  if (t.includes("employment") || t.includes("labour") || t.includes("labor")) return "Labor";
  if (t.includes("mining") || t.includes("diamond")) return "Mining";
  if (t.includes("population") || t.includes("census")) return "Demographics";

  return "Macro";
}

function isBadLink(title, href) {
  const lower = title.toLowerCase();

  return (
    title.length < 10 ||
    lower.includes("skip") ||
    lower === "publications" ||
    lower === "latest news" ||
    lower === "press releases" ||
    lower === "social & economic statistics" ||
    lower === "statistics by sector" ||
    lower === "tourism statistics" ||
    lower === "home" ||
    lower === "contact" ||
    lower.includes("read more") ||
    lower.includes("view all") ||
    lower.includes("click here") ||
    lower.includes("main content") ||
    href.includes("/statistics-by-sector") ||
    href.includes("/publications") ||
    href.includes("/about") ||
    lower.includes("conference") ||
    lower.includes("event") ||
    lower.includes("partnership") ||
    href.includes("/contact")
  );
}

function isMacroRelevant(title) {
  const lower = title.toLowerCase();

  return (
    // CORE MACRO DATA (high signal)
    lower.includes("inflation") ||
    lower.includes("consumer price") ||
    lower.includes("cpi") ||
    lower.includes("gdp") ||
    lower.includes("national accounts") ||
    lower.includes("growth") ||
    lower.includes("trade statistics") ||
    lower.includes("exports") ||
    lower.includes("imports") ||
    lower.includes("balance of payments") ||
    lower.includes("employment statistics") ||
    lower.includes("labour force") ||
    lower.includes("index") ||
    lower.includes("survey results") ||

    // STRUCTURED DATA RELEASES ONLY
    lower.includes("report") ||
    lower.includes("bulletin") ||
    lower.includes("statistical release") ||
    lower.includes("quarterly") ||
    lower.includes("annual") ||

    // HARD INCLUDE (specific Botswana releases)
    lower.includes("population census") ||
    lower.includes("tourism statistics")
  );
}

async function fetchHtml() {
  const items = [];

  for (const source of HTML_SOURCES) {
    try {
      const res = await fetch(source.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 Botswana Macro Dashboard",
        },
      });

      if (!res.ok) {
        throw new Error(`Status ${res.status}`);
      }

      const html = await res.text();
      const $ = cheerio.load(html);

      $("article a, .views-row a, .news-item a, .node a, a").each((_, el) => {
        const title = cleanText($(el).text());
        const href = normalizeUrl(source.url, $(el).attr("href"));

        if (!href.includes("statsbots.org.bw") && !href.includes("app.powerbi.com")) {
          return;
        }

        if (isBadLink(title, href)) return;
        if (!isMacroRelevant(title)) return;

        items.push({
          title,
          summary: title,
          source: source.name,
          href,
          publishedAt: null,
          category: source.category,
          signal: scoreSignal(title),
        });
      });
    } catch (error) {
      console.warn(`HTML failed: ${source.name}`, error.message);
    }
  }

  return items;
}

function dedupe(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key = item.title.toLowerCase().replace(/\s+/g, " ").trim();

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

async function main() {
  console.log("Starting news build...");

  const htmlItems = await fetchHtml();
  const items = dedupe(htmlItems).slice(0, 40);

  fs.mkdirSync("public/data", { recursive: true });

  fs.writeFileSync(
    OUTPUT,
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        count: items.length,
        items,
      },
      null,
      2
    )
  );

  console.log(`Saved ${items.length} news items to ${OUTPUT}`);
}

main();