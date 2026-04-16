export type AnalysisProject = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  content: string[];
};

export const analysisProjects: AnalysisProject[] = [
  {
    slug: "botswana-inflation-dynamics",
    title: "Botswana inflation dynamics",
    date: "April 2026",
    summary:
      "A focused review of recent CPI behavior, inflation persistence, imported price pressure, and implications for monetary policy.",
    tags: ["Inflation", "Monetary Policy", "CPI"],
    content: [
      "Botswana’s recent inflation path suggests that price pressure remains elevated even as growth conditions stay positive. That combination matters because it raises the probability of a policy tradeoff between inflation control and growth support.",
      "A useful distinction is between domestic inflation persistence and imported inflation pressure. For Botswana, exchange-rate developments, fuel costs, and food prices can all transmit external shocks into local inflation outcomes.",
      "From a policy perspective, the key question is whether inflation is broadening across categories or remaining concentrated in a smaller set of volatile components. If persistence increases, the monetary response becomes more important.",
    ],
  },
  {
    slug: "botswana-external-balance-and-trade-outlook",
    title: "Botswana external balance and trade outlook",
    date: "April 2026",
    summary:
      "An assessment of trade balance developments, export vulnerability, import dependence, and medium-run external stability.",
    tags: ["Trade", "External Sector", "Current Account"],
    content: [
      "Botswana’s trade position is central to macro stability because the economy remains linked to external demand, commodity markets, and imported inputs. A persistent deficit can signal pressure on reserves, exchange-rate conditions, or domestic demand composition.",
      "The most important analytical issue is whether external deterioration is cyclical or structural. A cyclical deterioration may reverse with commodity recovery, while a structural deterioration suggests broader competitiveness or diversification concerns.",
      "A strong trade analysis should separate goods export concentration, import dependence, and the sensitivity of the external sector to global demand shocks.",
    ],
  },
  {
    slug: "botswana-growth-regime-and-macro-risks",
    title: "Botswana growth regime and macro risks",
    date: "April 2026",
    summary:
      "A macro dashboard-based interpretation of GDP growth, inflation, and external conditions to classify Botswana’s current regime and policy risks.",
    tags: ["GDP", "Macro Regime", "Risk"],
    content: [
      "Botswana currently appears to be in a regime where growth remains positive while inflation is still elevated. That creates an overheating-risk interpretation in the dashboard framework.",
      "The regime classification is useful because it converts multiple indicators into a single policy narrative. Instead of reading inflation, GDP, and trade separately, the dashboard summarizes their joint macro meaning.",
      "The next improvement is to track regime transitions over time so that the system can show whether Botswana is moving toward stabilization, overheating, or external stress.",
    ],
  },
];