import fs from "fs";
import path from "path";

export type InflationHistoryPoint = {
  date: string;
  value: number;
};

export function getInflationHistory(): InflationHistoryPoint[] {
  const filePath = path.join(process.cwd(), "data", "inflation-history.json");

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as InflationHistoryPoint[];
}