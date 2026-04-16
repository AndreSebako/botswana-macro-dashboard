export type IndicatorPoint = {
  date: string;
  value: number;
};

export type IndicatorSeries = {
  slug: string;
  title: string;
  unit: string;
  source: string;
  lastUpdated: string;
  latestValue: number;
  changeLabel: string;
  points: IndicatorPoint[];
};
