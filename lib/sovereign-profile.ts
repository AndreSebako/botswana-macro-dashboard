import fs from "fs";
import path from "path";

type DebtFile = {
  series?: { date: string; value: number }[];
  latest?: { date: string; value: number } | null;
  source?: string;
  indicator?: string;
};

type CreditFile = {
  sp_rating?: string;
  moodys_rating?: string;
  outlook?: string;
  updatedAt?: string;
  source?: string;
};

type ReservesFile = {
  reserves_usd_bn?: number;
  reserves_bwp_mn?: number;
  reserve_cover_months?: number;
  updatedAt?: string;
  source?: string;
};

function readJson<T>(filename: string): T | null {
  const filePath = path.join(
    process.cwd(),
    "data",
    "processed",
    "botswana",
    filename
  );

  if (!fs.existsSync(filePath)) return null;

  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

export function getSovereignProfile() {
  const debt = readJson<DebtFile>("sovereign_debt.json");
  const credit = readJson<CreditFile>("credit_profile.json");
  const reserves = readJson<ReservesFile>("reserves_profile.json");

  return {
    debtToGdpPct: debt?.latest?.value ?? null,
    debtYear: debt?.latest?.date ?? null,
    debtSource: debt?.source ?? null,

    reservesUsdBn: reserves?.reserves_usd_bn ?? null,
    reservesBwpMn: reserves?.reserves_bwp_mn ?? null,
    reserveCoverMonths: reserves?.reserve_cover_months ?? null,
    reservesUpdatedAt: reserves?.updatedAt ?? null,
    reservesSource: reserves?.source ?? null,

    spRating: credit?.sp_rating ?? null,
    moodysRating: credit?.moodys_rating ?? null,
    ratingOutlook: credit?.outlook ?? null,
    ratingUpdatedAt: credit?.updatedAt ?? null,
    ratingSource: credit?.source ?? null,
  };
}

export function getSovereignSignal(
  profile: ReturnType<typeof getSovereignProfile>
) {
  let score = 0;

  if (typeof profile.debtToGdpPct === "number") {
    if (profile.debtToGdpPct > 60) score += 2;
    else if (profile.debtToGdpPct > 40) score += 1;
  }

  if (typeof profile.reserveCoverMonths === "number") {
    if (profile.reserveCoverMonths < 3) score += 2;
    else if (profile.reserveCoverMonths < 5) score += 1;
  }

  if (profile.spRating) {
    if (profile.spRating.includes("BB") && !profile.spRating.includes("BBB")) {
      score += 2;
    } else if (profile.spRating.includes("BBB-")) {
      score += 1;
    }
  }

  if (score >= 4) {
    return {
      label: "High sovereign risk",
      color: "text-red-400",
      bg: "bg-red-400/10 border-red-400/20",
    };
  }

  if (score >= 2) {
    return {
      label: "Moderate sovereign risk",
      color: "text-amber-400",
      bg: "bg-amber-400/10 border-amber-400/20",
    };
  }

  return {
    label: "Stable sovereign profile",
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
  };
}