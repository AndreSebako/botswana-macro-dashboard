from __future__ import annotations

import csv
import json
from dataclasses import dataclass, asdict
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional


BASE_DIR = Path(__file__).resolve().parents[1]
RAW_DIR = BASE_DIR / "data" / "raw" / "botswana"
PROCESSED_DIR = BASE_DIR / "data" / "processed" / "botswana"

SERIES_CONFIG = {
    "inflation": {
        "source": "Statistics Botswana",
        "title": "Inflation Rate",
        "unit": "%",
        "change_rule": "lower_is_better",
    },
        "unemployment_rate": {
        "source": "Statistics Botswana",
        "title": "Unemployment Rate",
        "unit": "%",
        "change_rule": "lower_is_better",
    },
    "exchange_rate": {
        "source": "Twelve Data",
        "title": "BWP / USD",
        "unit": "",
        "change_rule": "neutral",
    },
    "gdp": {
        "source": "Statistics Botswana",
        "title": "Real GDP Growth",
        "unit": "%",
        "change_rule": "higher_is_better",
    },
    "trade_balance": {
        "source": "Statistics Botswana",
        "title": "Trade Balance",
        "unit": "bn BWP",
        "change_rule": "higher_is_better",
    },
    "policy_rate": {
        "source": "Bank of Botswana",
        "title": "Monetary Policy Rate",
        "unit": "%",
        "change_rule": "neutral",
    },
    "prime_lending_rate": {
        "source": "Bank of Botswana",
        "title": "Average Prime Lending Rate",
        "unit": "%",
        "change_rule": "lower_is_better",
    },
    "real_policy_rate": {
        "source": "Derived: Policy Rate - Inflation",
        "title": "Real Policy Rate",
        "unit": "%",
        "change_rule": "neutral",
    },
    "real_prime_lending_rate": {
        "source": "Derived: Prime Lending Rate - Inflation",
        "title": "Real Prime Lending Rate",
        "unit": "%",
        "change_rule": "neutral",
    },
}


@dataclass
class DataPoint:
    date: str
    value: float


def parse_float(value: str) -> float:
    cleaned = str(value).strip().replace(",", "")
    return float(cleaned)


def read_series_csv(filepath: Path) -> List[DataPoint]:
    if not filepath.exists():
        return []

    points: List[DataPoint] = []

    with filepath.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)

        if not reader.fieldnames:
            return []

        date_key = "date" if "date" in reader.fieldnames else reader.fieldnames[0]
        value_key = "value" if "value" in reader.fieldnames else reader.fieldnames[1]

        for row in reader:
            raw_date = (row.get(date_key) or "").strip()
            raw_value = (row.get(value_key) or "").strip()

            if not raw_date or not raw_value:
                continue

            points.append(
                DataPoint(
                    date=raw_date,
                    value=parse_float(raw_value),
                )
            )

    points.sort(key=lambda p: p.date)
    return points


def compute_tone(rule: str, latest: float, previous: Optional[float]) -> str:
    if previous is None:
        return "neutral"

    delta = latest - previous

    if rule == "neutral":
        return "neutral"

    if rule == "higher_is_better":
        if delta > 0:
            return "positive"
        if delta < 0:
            return "negative"
        return "neutral"

    if rule == "lower_is_better":
        if delta < 0:
            return "positive"
        if delta > 0:
            return "negative"
        return "neutral"

    return "neutral"


def build_snapshot(series_name: str, points: List[DataPoint]) -> Dict:
    config = SERIES_CONFIG[series_name]

    latest = points[-1] if points else None
    previous = points[-2] if len(points) >= 2 else None

    latest_value = latest.value if latest else None
    previous_value = previous.value if previous else None

    delta = None
    if latest_value is not None and previous_value is not None:
        delta = latest_value - previous_value

    tone = (
        compute_tone(config["change_rule"], latest_value, previous_value)
        if latest_value is not None
        else "neutral"
    )

    return {
        "slug": series_name,
        "title": config["title"],
        "source": config["source"],
        "unit": config["unit"],
        "latest_date": latest.date if latest else None,
        "latest_value": latest_value,
        "previous_date": previous.date if previous else None,
        "previous_value": previous_value,
        "delta": delta,
        "tone": tone,
    }


def month_key(date_str: str) -> str:
    return date_str[:7]


def build_real_rate_series(
    nominal_points: List[DataPoint],
    inflation_points: List[DataPoint],
) -> List[DataPoint]:
    if not nominal_points or not inflation_points:
        return []

    inflation_by_month = {month_key(p.date): p for p in inflation_points}
    derived: List[DataPoint] = []

    for nominal in nominal_points:
        key = month_key(nominal.date)
        inflation = inflation_by_month.get(key)

        if not inflation:
            continue

        derived.append(
            DataPoint(
                date=nominal.date,
                value=round(nominal.value - inflation.value, 2),
            )
        )

    derived.sort(key=lambda p: p.date)
    return derived


def write_series_json(series_name: str, points: List[DataPoint]) -> None:
    output_points = [asdict(p) for p in points]
    output_file = PROCESSED_DIR / f"{series_name}.json"
    output_file.write_text(
        json.dumps(output_points, indent=2),
        encoding="utf-8",
    )
    print(f"Processed {series_name}: {len(points)} rows -> {output_file}")


def main() -> None:
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    base_series_names = [
        "inflation",
        "unemployment_rate",
        "exchange_rate",
        "gdp",
        "trade_balance",
        "policy_rate",
        "prime_lending_rate",
    ]

    all_points: Dict[str, List[DataPoint]] = {}
    all_snapshots: Dict[str, Dict] = {}

    for series_name in base_series_names:
        raw_file = RAW_DIR / f"{series_name}.csv"
        points = read_series_csv(raw_file)

        all_points[series_name] = points
        write_series_json(series_name, points)
        all_snapshots[series_name] = build_snapshot(series_name, points)

    real_policy_rate_points = build_real_rate_series(
        all_points.get("policy_rate", []),
        all_points.get("inflation", []),
    )
    all_points["real_policy_rate"] = real_policy_rate_points
    write_series_json("real_policy_rate", real_policy_rate_points)
    all_snapshots["real_policy_rate"] = build_snapshot(
        "real_policy_rate",
        real_policy_rate_points,
    )

    real_prime_lending_rate_points = build_real_rate_series(
        all_points.get("prime_lending_rate", []),
        all_points.get("inflation", []),
    )
    all_points["real_prime_lending_rate"] = real_prime_lending_rate_points
    write_series_json("real_prime_lending_rate", real_prime_lending_rate_points)
    all_snapshots["real_prime_lending_rate"] = build_snapshot(
        "real_prime_lending_rate",
        real_prime_lending_rate_points,
    )

    all_snapshots["last_updated"] = datetime.utcnow().isoformat()

    snapshot_file = PROCESSED_DIR / "latest_snapshot.json"
    snapshot_file.write_text(
        json.dumps(all_snapshots, indent=2),
        encoding="utf-8",
    )

    print(f"Wrote snapshot file -> {snapshot_file}")


if __name__ == "__main__":
    main()