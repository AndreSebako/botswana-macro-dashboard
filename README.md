# Botswana Macro Lab Starter

A starter scaffold for a Botswana-focused macroeconomics and data analysis website.

## What is included

- Next.js App Router structure
- Tailwind CSS setup
- Starter homepage and dashboard
- Recharts-based indicator cards
- Sample API route at `/api/indicators`
- Python ingestion script placeholder for future live data pipelines

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Suggested build order

1. Replace sample series in `data/indicators.ts`
2. Extend `scripts/fetch_botswana_data.py`
3. Decide whether to store data in files or a database
4. Add more pages: methodology, sector pages, downloads, analysis notes

## Suggested sources

- Statistics Botswana
- Bank of Botswana
- Botswana Ministry of Finance
- World Bank
- IMF
- African Development Bank

## Folder overview

```text
app/
  api/indicators/route.ts
  dashboard/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  LineChartCard.tsx
  Navbar.tsx
  StatCard.tsx
data/
  indicators.ts
lib/
  data.ts
  types.ts
scripts/
  fetch_botswana_data.py
```
