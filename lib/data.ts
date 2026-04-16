import { indicators } from "@/data/indicators";

export function getIndicators() {
  return indicators;
}

export function getIndicatorBySlug(slug: string) {
  return indicators.find((item) => item.slug === slug);
}
