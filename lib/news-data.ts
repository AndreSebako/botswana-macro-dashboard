export type NewsItem = {
  title: string;
  summary: string;
  source: string;
  href: string;
  external?: boolean;
};

export const newsItems: NewsItem[] = [
  {
    title: "Inflation release watch",
    summary:
      "Track the next Statistics Botswana CPI publication and update the monthly macro note once the release prints.",
    source: "Statistics Botswana",
    href: "/analysis/botswana-inflation-dynamics",
    external: false,
  },
  {
    title: "Bank of Botswana policy signals",
    summary:
      "Watch central bank communication for changes in inflation commentary, policy stance, and exchange-rate conditions.",
    source: "Bank of Botswana",
    href: "/analysis/botswana-growth-regime-and-macro-risks",
    external: false,
  },
  {
    title: "Trade and external sector monitor",
    summary:
      "Follow monthly trade releases for signs of improving exports, import compression, or widening external pressure.",
    source: "Statistics Botswana",
    href: "/analysis/botswana-external-balance-and-trade-outlook",
    external: false,
  },
];