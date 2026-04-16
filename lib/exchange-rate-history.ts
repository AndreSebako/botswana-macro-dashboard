import fs from "fs";
import path from "path";

export type ExchangeRateHistoryPoint = {
  date: string;
  value: number;
};

export function getExchangeRateHistory(): ExchangeRateHistoryPoint[] {
  const filePath = path.join(process.cwd(), "data", "exchange-rate-history.json");

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as ExchangeRateHistoryPoint[];
}