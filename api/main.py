"""FastAPI exposing the MILP scheduler under preset scenarios.

GET /scenarios               → list of available scenarios
GET /scenarios/{name}        → solve the MILP for scenario, return traces
"""

from __future__ import annotations

from functools import lru_cache

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from api.scenarios import SCENARIOS, T
from optim.battery import BatterySpecs
from optim.milp import solve_schedule

app = FastAPI(title="Greek Battery Optimization", version="0.1.0")

# Dev: dashboard runs on :3000–3010 range; allow all in dev.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def _battery() -> BatterySpecs:
    return BatterySpecs()


def _reason_code(
    price_eur_mwh: float,
    charge_mw: float,
    discharge_mw: float,
    soc_mwh: float,
    battery: BatterySpecs,
    curtailment_probability: float,
) -> tuple[str, str]:
    headroom = battery.energy_max_mwh - soc_mwh
    available = soc_mwh - battery.energy_min_mwh
    if charge_mw > 0.5:
        if curtailment_probability >= 0.55:
            return (
                "capture_midday_curtailment",
                "Buying into a likely renewable-surplus window to sell later into the Greek evening peak.",
            )
        return (
            "charge_for_evening_peak",
            "Buying now because forecast spreads still beat battery losses and wear.",
        )
    if discharge_mw > 0.5:
        if price_eur_mwh >= 140.0:
            return (
                "sell_into_peak",
                "Selling into a high-price peak while the battery still has energy above its safety floor.",
            )
        return (
            "release_stored_energy",
            "Selling stored energy because the current market price is strong enough to realize value now.",
        )
    if available < 5.0:
        return (
            "hold_soc_floor",
            "Holding because the battery is close to its minimum working range.",
        )
    if headroom < 5.0:
        return (
            "hold_near_full",
            "Holding because the battery is nearly full and waiting for the next strong selling window.",
        )
    if curtailment_probability >= 0.55:
        return (
            "reserve_headroom",
            "Holding some room because a renewable-surplus window is still likely later in the day.",
        )
    return (
        "avoid_wear",
        "Holding because the available spread is too thin to justify extra wear right now.",
    )


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/scenarios")
def list_scenarios():
    out = []
    for name, fn in SCENARIOS.items():
        s = fn()
        out.append({"name": s.name, "label": s.label, "description": s.description})
    return {"scenarios": out}


@lru_cache(maxsize=8)
def _solve_cached(name: str) -> dict:
    if name not in SCENARIOS:
        raise KeyError(name)
    s = SCENARIOS[name]()
    battery = _battery()
    result = solve_schedule(
        s.prices_eur_mwh,
        s.fcr_prices_eur_mw_h,
        battery,
    )
    intervals = [
        {
            "t": i,
            "hour": i * 0.25,
            "price_eur_mwh": float(s.prices_eur_mwh[i]),
            "price_p10_eur_mwh": float(s.price_p10_eur_mwh[i]),
            "price_p50_eur_mwh": float(s.price_p50_eur_mwh[i]),
            "price_p90_eur_mwh": float(s.price_p90_eur_mwh[i]),
            "charge_mw": float(result.charge_mw[i]),
            "discharge_mw": float(result.discharge_mw[i]),
            "net_dispatch_mw": float(result.discharge_mw[i] - result.charge_mw[i]),
            "soc_mwh": float(result.soc_mwh[i]),
            "soc_frac": float(result.soc_mwh[i] / battery.energy_capacity_mwh),
            "grid_energy_in_mwh": float(result.telemetry.grid_energy_in_mwh[i]),
            "grid_energy_out_mwh": float(result.telemetry.grid_energy_out_mwh[i]),
            "cell_energy_delta_mwh": float(result.telemetry.cell_energy_delta_mwh[i]),
            "losses_mwh": float(result.telemetry.losses_mwh[i]),
            "throughput_mwh": float(result.telemetry.throughput_mwh[i]),
            "cumulative_throughput_mwh": float(
                result.telemetry.cumulative_throughput_mwh[i]
            ),
            "equivalent_cycles": float(result.telemetry.equivalent_cycles[i]),
            "degradation_cost_eur": float(result.telemetry.degradation_cost_eur[i]),
            "cumulative_degradation_cost_eur": float(
                result.telemetry.cumulative_degradation_cost_eur[i]
            ),
            "energy_headroom_mwh": float(result.telemetry.energy_headroom_mwh[i]),
            "discharge_available_mwh": float(
                result.telemetry.discharge_available_mwh[i]
            ),
            "charge_headroom_mwh": float(result.telemetry.charge_headroom_mwh[i]),
            "reserve_up_headroom_mw": float(result.telemetry.reserve_up_headroom_mw[i]),
            "reserve_down_headroom_mw": float(
                result.telemetry.reserve_down_headroom_mw[i]
            ),
            "effective_power_limit_mw": float(
                result.telemetry.effective_power_limit_mw[i]
            ),
            "curtailment_probability": float(s.curtailment_probability[i]),
            "regime_label": (
                "renewable_surplus"
                if float(s.curtailment_probability[i]) >= 0.55
                else "normal"
            ),
            "load_forecast_mw": float(s.load_forecast_mw[i]),
            "res_forecast_mw": float(s.res_forecast_mw[i]),
            "residual_demand_mw": float(s.residual_demand_mw[i]),
            "solar_index": float(s.solar_index[i]),
            "wind_index": float(s.wind_index[i]),
            "export_tightness": float(s.export_tightness[i]),
            "reason_code": _reason_code(
                float(s.prices_eur_mwh[i]),
                float(result.charge_mw[i]),
                float(result.discharge_mw[i]),
                float(result.soc_mwh[i]),
                battery,
                float(s.curtailment_probability[i]),
            )[0],
            "reason_detail": _reason_code(
                float(s.prices_eur_mwh[i]),
                float(result.charge_mw[i]),
                float(result.discharge_mw[i]),
                float(result.soc_mwh[i]),
                battery,
                float(s.curtailment_probability[i]),
            )[1],
            "constraint_flags": {
                "near_soc_floor": bool(
                    result.telemetry.discharge_available_mwh[i] <= 5.0
                ),
                "near_soc_ceiling": bool(result.telemetry.energy_headroom_mwh[i] <= 5.0),
                "power_limited": bool(
                    max(result.charge_mw[i], result.discharge_mw[i])
                    >= result.telemetry.effective_power_limit_mw[i] - 1e-6
                ),
            },
        }
        for i in range(T)
    ]

    return {
        "name": s.name,
        "label": s.label,
        "description": s.description,
        "battery": {
            "power_max_mw": battery.power_max_mw,
            "energy_capacity_mwh": battery.energy_capacity_mwh,
            "energy_min_mwh": battery.energy_min_mwh,
            "energy_max_mwh": battery.energy_max_mwh,
            "effective_power_max_mw": battery.effective_power_max_mw,
            "round_trip_efficiency": battery.round_trip_efficiency,
            "auxiliary_load_mw": battery.auxiliary_load_mw,
            "availability_derate": battery.availability_derate,
        },
        "summary": {
            "expected_revenue_eur": float(result.expected_revenue_eur),
            "cycles": float(result.cycles),
            "total_charge_mwh": float(np.sum(result.charge_mw) * 0.25),
            "total_discharge_mwh": float(np.sum(result.discharge_mw) * 0.25),
            "total_losses_mwh": float(np.sum(result.telemetry.losses_mwh)),
            "total_degradation_cost_eur": float(
                np.sum(result.telemetry.degradation_cost_eur)
            ),
            "mean_curtailment_probability": float(
                np.mean(s.curtailment_probability)
            ),
            "min_price_eur_mwh": float(np.min(s.prices_eur_mwh)),
            "max_price_eur_mwh": float(np.max(s.prices_eur_mwh)),
        },
        "intervals": intervals,
        # Final SoC as a 97th point for trace continuity
        "soc_final_mwh": float(result.soc_mwh[-1]),
    }


@app.get("/scenarios/{name}")
def get_scenario(name: str):
    try:
        return _solve_cached(name)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"unknown scenario: {name}")
