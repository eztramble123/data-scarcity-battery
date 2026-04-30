"""Open-Meteo ingest — hourly weather for Athens, Thessaloniki, Heraklion.

No API key. Variables: temperature_2m, cloud_cover, wind_speed_10m,
shortwave_radiation. Stored as parquet, one file per city.
"""

from __future__ import annotations

from datetime import date, datetime
from pathlib import Path

import httpx
import pandas as pd

PROCESSED_ROOT = Path("data/processed/weather")

CITIES: dict[str, tuple[float, float]] = {
    "athens": (37.9838, 23.7275),
    "thessaloniki": (40.6401, 22.9444),
    "heraklion": (35.3387, 25.1442),
}

VARS = ["temperature_2m", "cloud_cover", "wind_speed_10m", "shortwave_radiation"]


def pull_city(
    city: str,
    start: date = date(2024, 1, 1),
    end: date | None = None,
    timeout: float = 30.0,
) -> pd.DataFrame:
    if city not in CITIES:
        raise ValueError(f"unknown city: {city}")
    if end is None:
        end = datetime.utcnow().date()

    lat, lon = CITIES[city]
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
        "hourly": ",".join(VARS),
        "timezone": "Europe/Athens",
    }
    url = "https://archive-api.open-meteo.com/v1/archive"
    with httpx.Client(timeout=timeout) as client:
        r = client.get(url, params=params)
        r.raise_for_status()
        payload = r.json()

    hourly = payload["hourly"]
    df = pd.DataFrame(hourly)
    df["time"] = pd.to_datetime(df["time"])
    df = df.set_index("time")
    df.attrs["city"] = city

    PROCESSED_ROOT.mkdir(parents=True, exist_ok=True)
    df.to_parquet(PROCESSED_ROOT / f"{city}.parquet")
    return df


def pull_all(
    start: date = date(2024, 1, 1), end: date | None = None
) -> dict[str, pd.DataFrame]:
    return {city: pull_city(city, start=start, end=end) for city in CITIES}


if __name__ == "__main__":
    pull_all()
