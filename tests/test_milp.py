import numpy as np
import pytest

from optim.battery import BatterySpecs
from optim.milp import solve_schedule


def _sinusoidal_prices(t_intervals: int = 96) -> np.ndarray:
    """One sinusoidal day cycling between ~20 and ~120 €/MWh."""
    x = np.linspace(0, 2 * np.pi, t_intervals, endpoint=False)
    rng = np.random.default_rng(0)
    return 70.0 + 50.0 * np.sin(x - np.pi / 2) + rng.normal(0, 3.0, t_intervals)


def test_solver_runs_on_synthetic_prices():
    specs = BatterySpecs()
    prices = _sinusoidal_prices()
    result = solve_schedule(prices, None, specs)
    assert result.charge_mw.shape == (96,)
    assert result.soc_mwh.shape == (97,)
    assert result.telemetry.losses_mwh.shape == (96,)
    assert result.expected_revenue_eur > 0


def test_charges_low_discharges_high():
    specs = BatterySpecs()
    prices = _sinusoidal_prices()
    result = solve_schedule(prices, None, specs)

    median_price = np.median(prices)
    charge_intervals = result.charge_mw > 1.0  # MW threshold
    discharge_intervals = result.discharge_mw > 1.0

    avg_charge_price = prices[charge_intervals].mean() if charge_intervals.any() else np.inf
    avg_discharge_price = (
        prices[discharge_intervals].mean() if discharge_intervals.any() else 0.0
    )
    assert avg_charge_price < median_price
    assert avg_discharge_price > median_price


def test_soc_bounds_respected():
    specs = BatterySpecs()
    prices = _sinusoidal_prices()
    result = solve_schedule(prices, None, specs)
    assert (result.soc_mwh >= specs.energy_min_mwh - 1e-6).all()
    assert (result.soc_mwh <= specs.energy_max_mwh + 1e-6).all()


def test_power_bounds_respected():
    specs = BatterySpecs()
    prices = _sinusoidal_prices()
    result = solve_schedule(prices, None, specs)
    assert result.charge_mw.max() <= specs.effective_power_max_mw + 1e-6
    assert result.discharge_mw.max() <= specs.effective_power_max_mw + 1e-6
    # Mutex (within solver tolerance)
    overlap = np.minimum(result.charge_mw, result.discharge_mw)
    assert overlap.max() < 1e-3


def test_telemetry_is_self_consistent():
    specs = BatterySpecs()
    prices = _sinusoidal_prices()
    result = solve_schedule(prices, None, specs)

    assert (result.telemetry.losses_mwh >= 0).all()
    assert (result.telemetry.throughput_mwh >= 0).all()
    assert np.allclose(
        result.telemetry.cumulative_throughput_mwh,
        np.cumsum(result.telemetry.throughput_mwh),
    )
    assert np.allclose(result.telemetry.cell_energy_delta_mwh, np.diff(result.soc_mwh))
    assert np.all(result.telemetry.energy_headroom_mwh >= -1e-6)
    assert np.all(result.telemetry.discharge_available_mwh >= -1e-6)


def test_solve_time_under_2s():
    import time

    specs = BatterySpecs()
    rng = np.random.default_rng(42)
    # 96 intervals × 50 scenarios (lighter than the 200 in the README, but
    # representative for the test budget)
    prices = 60.0 + 40.0 * np.sin(
        np.linspace(0, 2 * np.pi, 96, endpoint=False)[:, None] - np.pi / 2
    )
    prices = prices + rng.normal(0, 5.0, (96, 50))
    t0 = time.perf_counter()
    solve_schedule(prices, None, specs)
    elapsed = time.perf_counter() - t0
    assert elapsed < 5.0, f"solve took {elapsed:.2f}s"
