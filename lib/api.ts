// Phase 1: data is baked into lib/scenarios-data.ts (no backend dependency).
// The Python FastAPI is the source of truth — re-bake to refresh.

import { SCENARIO_LIST, SCENARIOS } from "./scenarios-data";

export type ScenarioInterval = {
  t: number;
  hour: number;
  price_eur_mwh: number;
  price_p10_eur_mwh: number;
  price_p50_eur_mwh: number;
  price_p90_eur_mwh: number;
  charge_mw: number;
  discharge_mw: number;
  net_dispatch_mw: number;
  soc_mwh: number;
  soc_frac: number;
  grid_energy_in_mwh: number;
  grid_energy_out_mwh: number;
  cell_energy_delta_mwh: number;
  losses_mwh: number;
  throughput_mwh: number;
  cumulative_throughput_mwh: number;
  equivalent_cycles: number;
  degradation_cost_eur: number;
  cumulative_degradation_cost_eur: number;
  energy_headroom_mwh: number;
  discharge_available_mwh: number;
  charge_headroom_mwh: number;
  reserve_up_headroom_mw: number;
  reserve_down_headroom_mw: number;
  effective_power_limit_mw: number;
  curtailment_probability: number;
  regime_label: "renewable_surplus" | "normal";
  load_forecast_mw: number;
  res_forecast_mw: number;
  residual_demand_mw: number;
  solar_index: number;
  wind_index: number;
  export_tightness: number;
  reason_code: string;
  reason_detail: string;
  constraint_flags: {
    near_soc_floor: boolean;
    near_soc_ceiling: boolean;
    power_limited: boolean;
  };
};

export type BatterySpec = {
  power_max_mw: number;
  energy_capacity_mwh: number;
  energy_min_mwh: number;
  energy_max_mwh: number;
  effective_power_max_mw: number;
  round_trip_efficiency: number;
  auxiliary_load_mw: number;
  availability_derate: number;
};

export type ScenarioSummary = {
  expected_revenue_eur: number;
  cycles: number;
  total_charge_mwh: number;
  total_discharge_mwh: number;
  total_losses_mwh: number;
  total_degradation_cost_eur: number;
  mean_curtailment_probability: number;
  min_price_eur_mwh: number;
  max_price_eur_mwh: number;
};

export type Scenario = {
  name: string;
  label: string;
  description: string;
  battery: BatterySpec;
  summary: ScenarioSummary;
  intervals: ScenarioInterval[];
  soc_final_mwh: number;
};

export type ScenarioListItem = {
  name: string;
  label: string;
  description: string;
};

export function listScenarios(): ScenarioListItem[] {
  return SCENARIO_LIST;
}

export function getScenario(name: string): Scenario {
  const s = SCENARIOS[name];
  if (!s) throw new Error(`unknown scenario: ${name}`);
  return s;
}
