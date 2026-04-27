from __future__ import annotations

import json
import time
from pathlib import Path

import requests

BASE_DIR = Path(__file__).resolve().parents[1]
OUT_DIR = BASE_DIR / "data" / "processed" / "botswana"
OUT_DIR.mkdir(parents=True, exist_ok=True)

URL = "https://api.worldbank.org/v2/country/BWA/indicator/GC.DOD.TOTL.GD.ZS?format=json&per_page=200"


def fetch_with_retry(url: str, retries: int = 3, timeout: int = 60):
    last_error = None

    for attempt in range(1, retries + 1):
        try:
            print(f"Attempt {attempt} of {retries}...")
            response = requests.get(url, timeout=timeout)
            response.raise_for_status()
            return response
        except requests.RequestException as error:
            last_error = error
            print(f"Request failed on attempt {attempt}: {error}")
            if attempt < retries:
                time.sleep(3)

    raise last_error


def main() -> None:
    response = fetch_with_retry(URL, retries=3, timeout=60)
    payload = response.json()

    rows = payload[1] if isinstance(payload, list) and len(payload) > 1 else []

    cleaned = [
        {
            "date": row["date"],
            "value": row["value"],
        }
        for row in rows
        if row.get("value") is not None
    ]

    cleaned.sort(key=lambda x: x["date"])

    latest = cleaned[-1] if cleaned else None

    output = {
        "series": cleaned,
        "latest": latest,
        "source": "World Bank / IMF GFS",
        "indicator": "Central government debt, total (% of GDP)",
    }

    out_file = OUT_DIR / "sovereign_debt.json"
    out_file.write_text(json.dumps(output, indent=2), encoding="utf-8")
    print(f"Wrote {out_file}")


if __name__ == "__main__":
    main()