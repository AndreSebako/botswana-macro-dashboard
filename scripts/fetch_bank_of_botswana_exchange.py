from __future__ import annotations

import csv
import re
from pathlib import Path
from typing import List, Tuple

import requests

RAW_OUTPUT = Path("data/raw/botswana/exchange_rate.csv")

HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
}

# Explicit paginated URL pattern based on the BoB page structure.
URL_TEMPLATE = (
    "https://www.bankofbotswana.bw/content/exchange-rates"
    "?field_exchange_date_value%5Bmax%5D="
    "&field_exchange_date_value%5Bmin%5D="
    "&order=field_exchange_date"
    "&page={page}"
    "&sort=desc"
)

# Example visible row format from BoB search results:
# 31 Oct 2022  0.5448  0.0751  0.0644  0.0747  1.3604  0.0581  11.0300
ROW_PATTERN = re.compile(
    r"(\d{2}\s+[A-Za-z]{3}\s+\d{4})\s+"   # date
    r"([0-9.]+)\s+"                       # CHN
    r"([0-9.]+)\s+"                       # EUR
    r"([0-9.]+)\s+"                       # GBP
    r"([0-9.]+)\s+"                       # USD
    r"([0-9.]+)\s+"                       # ZAR
    r"([0-9.]+)\s+"                       # SDR
    r"([0-9.]+)"                          # YEN
)

MONTHS = {
    "Jan": "01",
    "Feb": "02",
    "Mar": "03",
    "Apr": "04",
    "May": "05",
    "Jun": "06",
    "Jul": "07",
    "Aug": "08",
    "Sep": "09",
    "Oct": "10",
    "Nov": "11",
    "Dec": "12",
}


def to_iso_date(raw: str) -> str:
    day, mon, year = raw.split()
    return f"{year}-{MONTHS[mon]}-{day}"


def fetch_page(page_num: int) -> str:
    url = URL_TEMPLATE.format(page=page_num)
    response = requests.get(url, headers=HEADERS, timeout=30)
    response.raise_for_status()
    return response.text


def parse_rows(html: str) -> List[Tuple[str, float]]:
    # We parse directly from raw HTML text because the relevant rows are present
    # in page text output and follow a stable numeric pattern.
    rows: List[Tuple[str, float]] = []

    for match in ROW_PATTERN.finditer(html):
        raw_date = match.group(1)
        usd_per_bwp = float(match.group(5))  # USD column from BoB table

        if usd_per_bwp <= 0:
            continue

        # Dashboard uses BWP per USD, so invert the BoB USD quote.
        bwp_per_usd = round(1 / usd_per_bwp, 4)
        rows.append((to_iso_date(raw_date), bwp_per_usd))

    return rows


def save_rows(rows: List[Tuple[str, float]]) -> None:
    RAW_OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    with RAW_OUTPUT.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["date", "value"])
        writer.writerows(rows)


def main() -> None:
    all_rows: List[Tuple[str, float]] = []

    # Page count can change. Start with a reasonable range.
    # We stop after several empty pages in a row.
    consecutive_empty = 0
    max_pages = 80

    for page_num in range(max_pages):
        try:
            html = fetch_page(page_num)
            rows = parse_rows(html)
            print(f"Page {page_num}: {len(rows)} rows")

            if rows:
                all_rows.extend(rows)
                consecutive_empty = 0
            else:
                consecutive_empty += 1

            if consecutive_empty >= 5:
                break

        except Exception as exc:
            print(f"Page {page_num}: failed -> {exc}")
            consecutive_empty += 1
            if consecutive_empty >= 5:
                break

    # Deduplicate by date
    dedup = {}
    for dt, value in all_rows:
        dedup[dt] = value

    cleaned = sorted(dedup.items(), key=lambda x: x[0])

    # SAFETY GUARD: do not overwrite the CSV with an empty file.
    if len(cleaned) == 0:
        print("No rows found. Existing CSV was NOT overwritten.")
        return

    save_rows(cleaned)
    print(f"Saved {len(cleaned)} rows to {RAW_OUTPUT}")


if __name__ == "__main__":
    main()