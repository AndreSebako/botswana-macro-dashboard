export type NewsItem = {
  title: string;
  summary: string;
  source: string;
  href: string;
  external?: boolean;
  category?: string;
  date?: string;
};

export const newsItems: NewsItem[] = [
  {
    title: "Inflation release watch",
    summary:
      "Track the next Statistics Botswana CPI publication and update the inflation note when the release prints.",
    source: "Statistics Botswana",
    href: "/analysis/botswana-inflation-dynamics",
    external: false,
    category: "Inflation",
    date: "Ongoing",
  },
  {
    title: "Bank of Botswana policy signals",
    summary:
      "Monitor policy-rate communication, inflation commentary, and forward-looking guidance from the central bank.",
    source: "Bank of Botswana",
    href: "/analysis/botswana-growth-regime-and-macro-risks",
    external: false,
    category: "Monetary Policy",
    date: "Ongoing",
  },
  {
    title: "Trade and external sector monitor",
    summary:
      "Follow trade balance releases for signs of stronger exports, import compression, or external pressure.",
    source: "Statistics Botswana",
    href: "/analysis/botswana-external-balance-and-trade-outlook",
    external: false,
    category: "External Sector",
    date: "Ongoing",
  },
];