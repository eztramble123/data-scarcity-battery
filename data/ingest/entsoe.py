"""ENTSO-E ingest for Greek bidding zone (10YGR-HTSO-----Y).

Pulls DAM prices, actual load, and RES generation actuals; writes parquet
partitioned by month under data/processed/entsoe/. Requires ENTSOE_API_KEY
in the environment (or .env).
"""

from __future__ import annotations

import os
import time
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv

GREEK_ZONE = "10YGR-HTSO-----Y"
PROCESSED_ROOT = Path("data/processed/entsoe")


def _client():
    from entsoe import EntsoePandasClient  # imported here so module loads w/o key

    load_dotenv()
    key = os.environ.get("ENTSOE_API_KEY")
    if not key:
        raise RuntimeError(
            "ENTSOE_API_KEY not set. Copy .env.example to .env and add your key."
        )
    return EntsoePandasClient(api_key=key)


def _retry(fn, tries: int = 5, base_delay: float = 1.0):
    last: Exception | None = None
    for i in range(tries):
        try:
            return fn()
        except Exception as e:  # entsoe-py raises broad classes
            last = e
            time.sleep(base_delay * (2**i))
    raise RuntimeError(f"ENTSO-E call failed after {tries} retries: {last}")


def _write_partitioned(df: pd.DataFrame, kind: str) -> list[Path]:
    out_paths: list[Path] = []
    if df.empty:
        return out_paths
    df = df.copy()
    df["__month"] = df.index.to_period("M").astype(str)
    for month, chunk in df.groupby("__month"):
        target = PROCESSED_ROOT / kind / f"{month}.parquet"
        target.parent.mkdir(parents=True, exist_ok=True)
        chunk.drop(columns="__month").to_parquet(target)
        out_paths.append(target)
    return out_paths


def pull_day_ahead_prices(start: datetime, end: datetime) -> pd.DataFrame:
    client = _client()
    start_ts = pd.Timestamp(start, tz="Europe/Athens")
    end_ts = pd.Timestamp(end, tz="Europe/Athens")
    series = _retry(
        lambda: client.query_day_ahead_prices(GREEK_ZONE, start=start_ts, end=end_ts)
    )
    df = series.to_frame(name="price_eur_mwh")
    _write_partitioned(df, "day_ahead_prices")
    return df


def pull_load_actual(start: datetime, end: datetime) -> pd.DataFrame:
    client = _client()
    start_ts = pd.Timestamp(start, tz="Europe/Athens")
    end_ts = pd.Timestamp(end, tz="Europe/Athens")
    series = _retry(lambda: client.query_load(GREEK_ZONE, start=start_ts, end=end_ts))
    df = series.to_frame(name="load_mw") if hasattr(series, "to_frame") else series
    df.columns = ["load_mw"]
    _write_partitioned(df, "load_actual")
    return df


def pull_generation_per_type(start: datetime, end: datetime) -> pd.DataFrame:
    client = _client()
    start_ts = pd.Timestamp(start, tz="Europe/Athens")
    end_ts = pd.Timestamp(end, tz="Europe/Athens")
    df = _retry(
        lambda: client.query_generation(GREEK_ZONE, start=start_ts, end=end_ts)
    )
    _write_partitioned(df, "generation_per_type")
    return df


def pull_all(
    start: datetime = datetime(2024, 1, 1),
    end: datetime | None = None,
) -> dict[str, pd.DataFrame]:
    if end is None:
        end = datetime.now(timezone.utc).replace(tzinfo=None)
    return {
        "day_ahead_prices": pull_day_ahead_prices(start, end),
        "load_actual": pull_load_actual(start, end),
        "generation_per_type": pull_generation_per_type(start, end),
    }


if __name__ == "__main__":
    pull_all()
