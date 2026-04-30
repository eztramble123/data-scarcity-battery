"""Tesla Megapack 2 XL digital twin.

Parameters from the README battery configuration table — placeholders until
organizers release authoritative numbers; swap in by editing this dataclass.
"""

from __future__ import annotations

import math
from dataclasses import dataclass


@dataclass(frozen=True)
class BatterySpecs:
    power_max_mw: float = 100.0
    energy_capacity_mwh: float = 200.0
    round_trip_efficiency: float = 0.92
    soc_min_frac: float = 0.05
    soc_max_frac: float = 0.95
    cycle_life: int = 6_000
    capex_eur_per_kwh: float = 300.0
    calendar_life_years: int = 15
    auxiliary_load_mw: float = 0.5
    availability_derate: float = 0.97

    @property
    def eta_c(self) -> float:
        return math.sqrt(self.round_trip_efficiency)

    @property
    def eta_d(self) -> float:
        return math.sqrt(self.round_trip_efficiency)

    @property
    def energy_min_mwh(self) -> float:
        return self.soc_min_frac * self.energy_capacity_mwh

    @property
    def energy_max_mwh(self) -> float:
        return self.soc_max_frac * self.energy_capacity_mwh

    @property
    def effective_power_max_mw(self) -> float:
        return self.power_max_mw * self.availability_derate

    @property
    def lambda_degradation_eur_per_mwh(self) -> float:
        # capex_eur_per_kwh × 1000 kWh/MWh / (2 × cycle_life)
        return (self.capex_eur_per_kwh * 1000.0) / (2 * self.cycle_life)


class Battery:
    """Stateful wrapper around BatterySpecs for forward simulation."""

    def __init__(self, specs: BatterySpecs, soc_init_mwh: float | None = None):
        self.specs = specs
        if soc_init_mwh is None:
            soc_init_mwh = 0.5 * specs.energy_capacity_mwh
        self._validate_soc(soc_init_mwh)
        self.soc_mwh: float = soc_init_mwh

    def _validate_soc(self, soc: float) -> None:
        # Allow tiny FP drift past bounds when re-validating after a step.
        if soc < self.specs.energy_min_mwh - 1e-6:
            raise ValueError(
                f"SoC {soc:.4f} MWh below min {self.specs.energy_min_mwh:.4f}"
            )
        if soc > self.specs.energy_max_mwh + 1e-6:
            raise ValueError(
                f"SoC {soc:.4f} MWh above max {self.specs.energy_max_mwh:.4f}"
            )

    def step(self, charge_mw: float, discharge_mw: float, dt_hours: float) -> float:
        """Advance the battery one interval and return new SoC in MWh.

        Charge and discharge are mutually exclusive (the MILP enforces this);
        we tolerate a small overlap here but raise if both materially > 0.
        """
        if charge_mw < 0 or discharge_mw < 0:
            raise ValueError("charge / discharge must be non-negative")
        if charge_mw > 1e-6 and discharge_mw > 1e-6:
            raise ValueError("charging and discharging in the same interval")
        if charge_mw > self.specs.power_max_mw + 1e-6:
            raise ValueError(f"charge {charge_mw} MW exceeds power_max")
        if discharge_mw > self.specs.power_max_mw + 1e-6:
            raise ValueError(f"discharge {discharge_mw} MW exceeds power_max")

        delta = (
            self.specs.eta_c * charge_mw * dt_hours
            - discharge_mw * dt_hours / self.specs.eta_d
        )
        new_soc = self.soc_mwh + delta
        self._validate_soc(new_soc)
        self.soc_mwh = new_soc
        return new_soc
