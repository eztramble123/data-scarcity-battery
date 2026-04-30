"""Stochastic MILP scheduler — DAM arbitrage + FCR co-opt + degradation.

Per the README §"The MILP (concrete)". Decision is a single 96-interval
schedule evaluated against N price scenarios. Solved with HiGHS; target
solve time < 2s.
"""

from __future__ import annotations

from dataclasses import dataclass

import cvxpy as cp
import numpy as np

from optim.battery import BatterySpecs


@dataclass
class TelemetryResult:
    grid_energy_in_mwh: np.ndarray  # (T,)
    grid_energy_out_mwh: np.ndarray  # (T,)
    cell_energy_delta_mwh: np.ndarray  # (T,)
    losses_mwh: np.ndarray  # (T,)
    throughput_mwh: np.ndarray  # (T,)
    cumulative_throughput_mwh: np.ndarray  # (T,)
    equivalent_cycles: np.ndarray  # (T,)
    degradation_cost_eur: np.ndarray  # (T,)
    cumulative_degradation_cost_eur: np.ndarray  # (T,)
    energy_headroom_mwh: np.ndarray  # (T,)
    discharge_available_mwh: np.ndarray  # (T,)
    charge_headroom_mwh: np.ndarray  # (T,)
    reserve_up_headroom_mw: np.ndarray  # (T,)
    reserve_down_headroom_mw: np.ndarray  # (T,)
    effective_power_limit_mw: np.ndarray  # (T,)


@dataclass
class ScheduleResult:
    charge_mw: np.ndarray  # (T,)
    discharge_mw: np.ndarray  # (T,)
    soc_mwh: np.ndarray  # (T+1,)
    fcr_up_mw: np.ndarray  # (T,)
    fcr_dn_mw: np.ndarray  # (T,)
    expected_revenue_eur: float
    cycles: float
    telemetry: TelemetryResult


def solve_schedule(
    price_scenarios: np.ndarray,
    fcr_prices: np.ndarray | None,
    battery: BatterySpecs,
    soc_init_mwh: float | None = None,
    dt_hours: float = 0.25,
) -> ScheduleResult:
    """
    price_scenarios : (T, N) DAM price paths in €/MWh
    fcr_prices      : (T,) FCR capacity prices in €/MW/h, or None to disable
    battery         : BatterySpecs
    soc_init_mwh    : starting SoC; defaults to 50%
    """
    if price_scenarios.ndim == 1:
        price_scenarios = price_scenarios[:, None]
    T, N = price_scenarios.shape

    if fcr_prices is None:
        fcr_prices = np.zeros(T)
    fcr_prices = np.asarray(fcr_prices, dtype=float)
    assert fcr_prices.shape == (T,)

    if soc_init_mwh is None:
        soc_init_mwh = 0.5 * battery.energy_capacity_mwh

    charge = cp.Variable(T, nonneg=True)
    discharge = cp.Variable(T, nonneg=True)
    soc = cp.Variable(T + 1, nonneg=True)
    fcr_up = cp.Variable(T, nonneg=True)
    fcr_dn = cp.Variable(T, nonneg=True)
    is_charging = cp.Variable(T, boolean=True)

    constraints = [
        soc[0] == soc_init_mwh,
        soc <= battery.energy_max_mwh,
        soc >= battery.energy_min_mwh,
        charge <= battery.effective_power_max_mw * is_charging,
        discharge <= battery.effective_power_max_mw * (1 - is_charging),
        # Power must accommodate FCR reservations
        charge + fcr_dn <= battery.effective_power_max_mw,
        discharge + fcr_up <= battery.effective_power_max_mw,
        # SoC headroom for FCR delivery (worst-case dt activation)
        soc[:-1] - fcr_up * dt_hours >= battery.energy_min_mwh,
        soc[:-1] + fcr_dn * dt_hours <= battery.energy_max_mwh,
    ]

    # SoC dynamics
    for t in range(T):
        constraints.append(
            soc[t + 1]
            == soc[t]
            + battery.eta_c * charge[t] * dt_hours
            - discharge[t] * dt_hours / battery.eta_d
        )

    # Expected DAM revenue: dispatch (MWh per interval) × price (€/MWh), averaged
    net_dispatch = (discharge - charge) * dt_hours  # (T,) MWh
    expected_dam = sum(
        cp.sum(cp.multiply(price_scenarios[:, s], net_dispatch)) for s in range(N)
    ) / N

    fcr_revenue = cp.sum(cp.multiply(fcr_prices, (fcr_up + fcr_dn) * dt_hours))

    throughput_mwh = cp.sum(charge + discharge) * dt_hours
    deg_cost = battery.lambda_degradation_eur_per_mwh * throughput_mwh

    objective = cp.Maximize(expected_dam + fcr_revenue - deg_cost)

    prob = cp.Problem(objective, constraints)
    prob.solve(solver=cp.HIGHS)

    if prob.status not in ("optimal", "optimal_inaccurate"):
        raise RuntimeError(f"MILP not optimal: {prob.status}")

    charge_v = np.asarray(charge.value)
    discharge_v = np.asarray(discharge.value)
    soc_v = np.asarray(soc.value)
    fcr_up_v = np.asarray(fcr_up.value)
    fcr_dn_v = np.asarray(fcr_dn.value)

    grid_energy_in_mwh = charge_v * dt_hours
    grid_energy_out_mwh = discharge_v * dt_hours
    charge_losses_mwh = grid_energy_in_mwh * (1.0 - battery.eta_c)
    discharge_losses_mwh = grid_energy_out_mwh * ((1.0 / battery.eta_d) - 1.0)
    auxiliary_losses_mwh = (
        ((charge_v + discharge_v + fcr_up_v + fcr_dn_v) > 1e-6).astype(float)
        * battery.auxiliary_load_mw
        * dt_hours
    )
    losses_mwh = charge_losses_mwh + discharge_losses_mwh + auxiliary_losses_mwh
    cell_energy_delta_mwh = np.diff(soc_v)
    throughput_mwh_v = (charge_v + discharge_v) * dt_hours
    cumulative_throughput_mwh = np.cumsum(throughput_mwh_v)
    equivalent_cycles_v = cumulative_throughput_mwh / (2 * battery.energy_capacity_mwh)
    degradation_cost_eur_v = (
        throughput_mwh_v * battery.lambda_degradation_eur_per_mwh
    )
    cumulative_degradation_cost_eur = np.cumsum(degradation_cost_eur_v)
    energy_headroom_mwh = battery.energy_max_mwh - soc_v[:-1]
    discharge_available_mwh = soc_v[:-1] - battery.energy_min_mwh
    charge_headroom_mwh = energy_headroom_mwh / max(battery.eta_c, 1e-9)
    reserve_up_headroom_mw = battery.effective_power_max_mw - discharge_v - fcr_up_v
    reserve_down_headroom_mw = battery.effective_power_max_mw - charge_v - fcr_dn_v
    effective_power_limit_mw = np.full_like(charge_v, battery.effective_power_max_mw)

    telemetry = TelemetryResult(
        grid_energy_in_mwh=grid_energy_in_mwh,
        grid_energy_out_mwh=grid_energy_out_mwh,
        cell_energy_delta_mwh=cell_energy_delta_mwh,
        losses_mwh=losses_mwh,
        throughput_mwh=throughput_mwh_v,
        cumulative_throughput_mwh=cumulative_throughput_mwh,
        equivalent_cycles=equivalent_cycles_v,
        degradation_cost_eur=degradation_cost_eur_v,
        cumulative_degradation_cost_eur=cumulative_degradation_cost_eur,
        energy_headroom_mwh=energy_headroom_mwh,
        discharge_available_mwh=discharge_available_mwh,
        charge_headroom_mwh=charge_headroom_mwh,
        reserve_up_headroom_mw=reserve_up_headroom_mw,
        reserve_down_headroom_mw=reserve_down_headroom_mw,
        effective_power_limit_mw=effective_power_limit_mw,
    )

    return ScheduleResult(
        charge_mw=charge_v,
        discharge_mw=discharge_v,
        soc_mwh=soc_v,
        fcr_up_mw=fcr_up_v,
        fcr_dn_mw=fcr_dn_v,
        expected_revenue_eur=float(prob.value),
        cycles=float(throughput_mwh.value) / (2 * battery.energy_capacity_mwh),
        telemetry=telemetry,
    )
