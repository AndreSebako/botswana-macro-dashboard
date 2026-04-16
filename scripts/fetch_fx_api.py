from dotenv import load_dotenv
load_dotenv()
import csv
import os
from datetime import date, timedelta
from pathlib import Path
import requests

RAW_OUTPUT = Path("data/raw/botswana/exchange_rate.csv")

API_KEY = os.getenv("TWELVE_DATA_API_KEY")
BASE_URL = "https://api.twelvedata.com/time_series"

def fetch_fx_history(start_date, end_date):
    params = {
        "symbol": "USD/BWP",
        "interval": "1day",
        "start_date": start_date,
        "end_date": end_date,
        "apikey": API_KEY,
        "format": "JSON",
    }

    response = requests.get(BASE_URL, params=params, timeout=30)
    response.raise_for_status()

    data = response.json()

    if "values" not in data:
        raise RuntimeError(f"API error: {data}")

    rows = []

    # reverse to chronological order
    for item in reversed(data["values"]):
        rows.append((item["datetime"], float(item["close"])))

    return rows


def save_rows(rows):
    RAW_OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    with RAW_OUTPUT.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["date", "value"])
        writer.writerows(rows)


def main():
    if not API_KEY:
        raise RuntimeError("Missing TWELVE_DATA_API_KEY in environment")

    end_dt = date.today()
    start_dt = end_dt - timedelta(days=365)

    rows = fetch_fx_history(
        start_dt.isoformat(),
        end_dt.isoformat(),
    )

    if len(rows) == 0:
        print("No rows found. CSV not overwritten.")
        return

    save_rows(rows)
    print(f"Saved {len(rows)} rows to {RAW_OUTPUT}")


if __name__ == "__main__":
    main()