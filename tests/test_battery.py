import math

import pytest

from optim.battery import Battery, BatterySpecs


def test_specs_derived_values():
    s = BatterySpecs()
    assert s.eta_c == pytest.approx(math.sqrt(0.92))
    assert s.eta_d == pytest.approx(math.sqrt(0.92))
    assert s.energy_min_mwh == pytest.approx(10.0)
    assert s.energy_max_mwh == pytest.approx(190.0)
    assert s.effective_power_max_mw == pytest.approx(97.0)
    # capex 300 €/kWh * 1000 / (2 * 6000) = 25 €/MWh-throughput
    assert s.lambda_degradation_eur_per_mwh == pytest.approx(25.0)


def test_charge_stores_eta_c_of_grid_energy():
    specs = BatterySpecs()
    battery = Battery(specs, soc_init_mwh=100.0)
    dt = 0.25
    charge_mw = 80.0
    n = 4
    grid_energy_in = charge_mw * dt * n  # 80 MWh
    for _ in range(n):
        battery.step(charge_mw=charge_mw, discharge_mw=0.0, dt_hours=dt)
    cell_energy_gained = battery.soc_mwh - 100.0
    assert cell_energy_gained == pytest.approx(specs.eta_c * grid_energy_in)


def test_discharge_delivers_eta_d_of_cell_energy():
    specs = BatterySpecs()
    soc0 = 150.0
    battery = Battery(specs, soc_init_mwh=soc0)
    dt = 0.25
    discharge_mw = 80.0
    n = 4
    grid_energy_out = discharge_mw * dt * n  # 80 MWh delivered to grid
    for _ in range(n):
        battery.step(charge_mw=0.0, discharge_mw=discharge_mw, dt_hours=dt)
    cell_energy_drawn = soc0 - battery.soc_mwh
    # Grid receives eta_d * cell_drawn, so cell_drawn = grid_out / eta_d.
    assert cell_energy_drawn == pytest.approx(grid_energy_out / specs.eta_d)


def test_full_round_trip_returns_rte():
    """Charge, then discharge same cell-energy delta — grid out / grid in = RTE."""
    specs = BatterySpecs()
    battery = Battery(specs, soc_init_mwh=100.0)
    dt = 0.25

    # Charge phase
    charge_mw = 80.0
    n_charge = 4
    grid_in = charge_mw * dt * n_charge
    for _ in range(n_charge):
        battery.step(charge_mw=charge_mw, discharge_mw=0.0, dt_hours=dt)
    cell_gained = battery.soc_mwh - 100.0  # = eta_c * grid_in

    # Discharge exactly the same cell energy back out.
    # discharge_mw * dt / eta_d per interval drains the cell;
    # pick discharge_mw so cell drains in n_discharge intervals.
    n_discharge = 4
    discharge_mw = cell_gained * specs.eta_d / (dt * n_discharge)
    for _ in range(n_discharge):
        battery.step(charge_mw=0.0, discharge_mw=discharge_mw, dt_hours=dt)

    grid_out = discharge_mw * dt * n_discharge
    assert battery.soc_mwh == pytest.approx(100.0)
    assert grid_out / grid_in == pytest.approx(specs.round_trip_efficiency)


def test_soc_lower_bound_enforced():
    specs = BatterySpecs()
    battery = Battery(specs, soc_init_mwh=specs.energy_min_mwh + 5.0)
    with pytest.raises(ValueError):
        # Discharging 80 MW for 1h would drop SoC by ~83 MWh, far below floor.
        battery.step(charge_mw=0.0, discharge_mw=80.0, dt_hours=1.0)


def test_soc_upper_bound_enforced():
    specs = BatterySpecs()
    battery = Battery(specs, soc_init_mwh=specs.energy_max_mwh - 5.0)
    with pytest.raises(ValueError):
        battery.step(charge_mw=80.0, discharge_mw=0.0, dt_hours=1.0)


def test_simultaneous_charge_discharge_rejected():
    battery = Battery(BatterySpecs())
    with pytest.raises(ValueError):
        battery.step(charge_mw=10.0, discharge_mw=10.0, dt_hours=0.25)


def test_power_limit_enforced():
    battery = Battery(BatterySpecs())
    with pytest.raises(ValueError):
        battery.step(charge_mw=200.0, discharge_mw=0.0, dt_hours=0.25)
