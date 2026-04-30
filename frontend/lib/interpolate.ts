// Smooth playback: tFloat is a real number 0..T-1. We synthesize a "virtual"
// interval by lerping numeric fields between floor(tFloat) and ceil(tFloat).
// Categorical fields (regime_label, reason_code, reason_detail, action) snap
// to the floor — decisions are step functions, interpolation would lie.

import type { ScenarioInterval } from "./api";

export function interpolateInterval(
  intervals: ScenarioInterval[],
  tFloat: number,
): ScenarioInterval {
  const T = intervals.length;
  const clamped = Math.max(0, Math.min(T - 1, tFloat));
  const i0 = Math.floor(clamped);
  const i1 = Math.min(T - 1, i0 + 1);
  const f = clamped - i0;
  const a = intervals[i0];
  const b = intervals[i1];

  const lerp = (x: number, y: number) => x + (y - x) * f;

  return {
    t: i0,
    hour: lerp(a.hour, b.hour),
    price_eur_mwh: lerp(a.price_eur_mwh, b.price_eur_mwh),
    price_p10_eur_mwh: lerp(a.price_p10_eur_mwh, b.price_p10_eur_mwh),
    price_p50_eur_mwh: lerp(a.price_p50_eur_mwh, b.price_p50_eur_mwh),
    price_p90_eur_mwh: lerp(a.price_p90_eur_mwh, b.price_p90_eur_mwh),
    charge_mw: lerp(a.charge_mw, b.charge_mw),
    discharge_mw: lerp(a.discharge_mw, b.discharge_mw),
    net_dispatch_mw: lerp(a.net_dispatch_mw, b.net_dispatch_mw),
    soc_mwh: lerp(a.soc_mwh, b.soc_mwh),
    soc_frac: lerp(a.soc_frac, b.soc_frac),
    grid_energy_in_mwh: lerp(a.grid_energy_in_mwh, b.grid_energy_in_mwh),
    grid_energy_out_mwh: lerp(a.grid_energy_out_mwh, b.grid_energy_out_mwh),
    cell_energy_delta_mwh: lerp(a.cell_energy_delta_mwh, b.cell_energy_delta_mwh),
    losses_mwh: lerp(a.losses_mwh, b.losses_mwh),
    throughput_mwh: lerp(a.throughput_mwh, b.throughput_mwh),
    cumulative_throughput_mwh: lerp(
      a.cumulative_throughput_mwh,
      b.cumulative_throughput_mwh,
    ),
    equivalent_cycles: lerp(a.equivalent_cycles, b.equivalent_cycles),
    degradation_cost_eur: lerp(a.degradation_cost_eur, b.degradation_cost_eur),
    cumulative_degradation_cost_eur: lerp(
      a.cumulative_degradation_cost_eur,
      b.cumulative_degradation_cost_eur,
    ),
    energy_headroom_mwh: lerp(a.energy_headroom_mwh, b.energy_headroom_mwh),
    discharge_available_mwh: lerp(
      a.discharge_available_mwh,
      b.discharge_available_mwh,
    ),
    charge_headroom_mwh: lerp(a.charge_headroom_mwh, b.charge_headroom_mwh),
    reserve_up_headroom_mw: lerp(a.reserve_up_headroom_mw, b.reserve_up_headroom_mw),
    reserve_down_headroom_mw: lerp(
      a.reserve_down_headroom_mw,
      b.reserve_down_headroom_mw,
    ),
    effective_power_limit_mw: lerp(
      a.effective_power_limit_mw,
      b.effective_power_limit_mw,
    ),
    curtailment_probability: lerp(a.curtailment_probability, b.curtailment_probability),
    regime_label: a.regime_label, // categorical — snap to floor
    load_forecast_mw: lerp(a.load_forecast_mw, b.load_forecast_mw),
    res_forecast_mw: lerp(a.res_forecast_mw, b.res_forecast_mw),
    residual_demand_mw: lerp(a.residual_demand_mw, b.residual_demand_mw),
    solar_index: lerp(a.solar_index, b.solar_index),
    wind_index: lerp(a.wind_index, b.wind_index),
    export_tightness: lerp(a.export_tightness, b.export_tightness),
    reason_code: a.reason_code, // step
    reason_detail: a.reason_detail, // step
    constraint_flags: a.constraint_flags,
  };
}
