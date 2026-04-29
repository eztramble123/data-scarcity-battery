"""Synthetic price scenarios for the interactive Megapack demo.

Two scenarios for now (curtailment + normal); placeholders for peak-demand
and FCR-heavy days are stubbed in `SCENARIOS` and will be wired later.
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np

T = 96  # 96 fifteen-minute intervals


@dataclass(frozen=True)
class ScenarioInputs:
    name: str
    label: str
    description: str
    prices_eur_mwh: np.ndarray  # (T,)
    fcr_prices_eur_mw_h: np.ndarray | None  # (T,) or None
    curtailment_probability: np.ndarray  # (T,)
    price_p10_eur_mwh: np.ndarray  # (T,)
    price_p50_eur_mwh: np.ndarray  # (T,)
    price_p90_eur_mwh: np.ndarray  # (T,)
    load_forecast_mw: np.ndarray  # (T,)
    res_forecast_mw: np.ndarray  # (T,)
    residual_demand_mw: np.ndarray  # (T,)
    solar_index: np.ndarray  # (T,)
    wind_index: np.ndarray  # (T,)
    export_tightness: np.ndarray  # (T,)


def _interval_hours() -> np.ndarray:
    """Hour-of-day at the start of each 15-min interval — 0.0, 0.25, ..., 23.75"""
    return np.arange(T) * 0.25


def curtailment_day(seed: int = 0) -> ScenarioInputs:
    """Solar floods 9am–4pm: prices crash to ~€0; evening peak ~€180."""
    rng = np.random.default_rng(seed)
    h = _interval_hours()

    base = 70.0 + 25.0 * np.sin((h - 18) / 24 * 2 * np.pi)
    morning_peak = 60.0 * np.exp(-((h - 8) ** 2) / (2 * 1.0**2))
    evening_peak = 110.0 * np.exp(-((h - 20) ** 2) / (2 * 1.5**2))
    midday_curtail = -90.0 * np.exp(-((h - 12.5) ** 2) / (2 * 2.5**2))
    prices = base + morning_peak + evening_peak + midday_curtail
    prices += rng.normal(0, 4.0, T)
    prices = np.clip(prices, 0.0, None)  # curtailment floor
    # Force a deep zero zone in midday
    prices[(h >= 10) & (h <= 15)] = np.minimum(
        prices[(h >= 10) & (h <= 15)], 5.0 * rng.random(((h >= 10) & (h <= 15)).sum())
    )
    solar_index = np.clip(np.exp(-((h - 12.5) ** 2) / (2 * 2.4**2)), 0.0, 1.0)
    wind_index = np.clip(0.35 + 0.15 * np.sin((h - 4.0) / 24 * 2 * np.pi), 0.0, 1.0)
    load_forecast = (
        5400.0
        + 250.0 * np.sin((h - 7.0) / 24 * 2 * np.pi)
        + 650.0 * np.exp(-((h - 20.0) ** 2) / (2 * 2.0**2))
    )
    res_forecast = 900.0 + 3600.0 * solar_index + 700.0 * np.maximum(wind_index, 0.1)
    residual_demand = load_forecast - res_forecast
    export_tightness = np.clip(0.75 - 0.45 * solar_index + 0.05 * rng.normal(size=T), 0, 1)
    curtailment_probability = np.clip(
        0.08
        + 0.78 * solar_index
        + 0.12 * np.maximum(0.0, -residual_demand / 1000.0)
        - 0.18 * export_tightness,
        0.02,
        0.98,
    )
    price_spread = 14.0 + 24.0 * curtailment_probability
    price_p50 = prices
    price_p10 = np.clip(prices - price_spread, 0.0, None)
    price_p90 = prices + price_spread

    return ScenarioInputs(
        name="curtailment",
        label="Curtailment day",
        description="Solar floods 9am–4pm; prices crash to ~€0 midday, evening peak ~€180.",
        prices_eur_mwh=prices,
        fcr_prices_eur_mw_h=None,
        curtailment_probability=curtailment_probability,
        price_p10_eur_mwh=price_p10,
        price_p50_eur_mwh=price_p50,
        price_p90_eur_mwh=price_p90,
        load_forecast_mw=load_forecast,
        res_forecast_mw=res_forecast,
        residual_demand_mw=residual_demand,
        solar_index=solar_index,
        wind_index=wind_index,
        export_tightness=export_tightness,
    )


def normal_arbitrage_day(seed: int = 1) -> ScenarioInputs:
    """Standard duck curve — overnight + midday dip, morning + evening peaks."""
    rng = np.random.default_rng(seed)
    h = _interval_hours()

    base = 75.0 + 12.0 * np.sin((h - 18) / 24 * 2 * np.pi)
    morning_peak = 35.0 * np.exp(-((h - 8) ** 2) / (2 * 1.5**2))
    evening_peak = 55.0 * np.exp(-((h - 20) ** 2) / (2 * 1.5**2))
    midday_dip = -22.0 * np.exp(-((h - 13) ** 2) / (2 * 2.5**2))
    night_dip = -18.0 * np.exp(-((h - 3) ** 2) / (2 * 2.0**2))
    prices = base + morning_peak + evening_peak + midday_dip + night_dip
    prices += rng.normal(0, 3.0, T)
    prices = np.clip(prices, 5.0, None)
    solar_index = np.clip(np.exp(-((h - 13.0) ** 2) / (2 * 2.8**2)), 0.0, 1.0)
    wind_index = np.clip(0.45 + 0.1 * np.sin((h - 2.0) / 24 * 2 * np.pi), 0.0, 1.0)
    load_forecast = (
        5600.0
        + 300.0 * np.sin((h - 7.0) / 24 * 2 * np.pi)
        + 700.0 * np.exp(-((h - 20.5) ** 2) / (2 * 2.0**2))
    )
    res_forecast = 1100.0 + 2100.0 * solar_index + 850.0 * np.maximum(wind_index, 0.1)
    residual_demand = load_forecast - res_forecast
    export_tightness = np.clip(0.52 - 0.14 * solar_index + 0.05 * rng.normal(size=T), 0, 1)
    curtailment_probability = np.clip(
        0.04
        + 0.22 * solar_index
        + 0.06 * np.maximum(0.0, -residual_demand / 1200.0)
        - 0.08 * export_tightness,
        0.01,
        0.45,
    )
    price_spread = 12.0 + 14.0 * curtailment_probability
    price_p50 = prices
    price_p10 = np.clip(prices - price_spread, 0.0, None)
    price_p90 = prices + price_spread

    return ScenarioInputs(
        name="normal",
        label="Normal arbitrage day",
        description="Typical duck curve — twin peaks, midday + overnight dips. The bread-and-butter day.",
        prices_eur_mwh=prices,
        fcr_prices_eur_mw_h=None,
        curtailment_probability=curtailment_probability,
        price_p10_eur_mwh=price_p10,
        price_p50_eur_mwh=price_p50,
        price_p90_eur_mwh=price_p90,
        load_forecast_mw=load_forecast,
        res_forecast_mw=res_forecast,
        residual_demand_mw=residual_demand,
        solar_index=solar_index,
        wind_index=wind_index,
        export_tightness=export_tightness,
    )


SCENARIOS = {
    "curtailment": curtailment_day,
    "normal": normal_arbitrage_day,
    # Future:
    # "peak_demand": peak_demand_day,
    # "fcr_heavy":   fcr_heavy_day,
}
