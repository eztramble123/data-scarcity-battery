// Naive scheduler — the "dumb alternative" the optimizer beats.
// Strategy: charge during the cheapest N intervals, discharge during the most
// expensive N intervals, sized so the round trip uses the full energy span.
// No SoC look-ahead, no degradation accounting, no scenario sampling.

import type { Scenario } from "./api";

const DT = 0.25;

export type BaselineInterval = {
  t: number;
  hour: number;
  price_eur_mwh: number;
  charge_mw: number;
  discharge_mw: number;
  net_dispatch_mw: number;
  soc_mwh: number;
  revenue_eur: number;
  cumulative_revenue_eur: number;
};

export type BaselineResult = {
  intervals: BaselineInterval[];
  total_revenue_eur: number;
};

export function naiveSchedule(
  scenario: Scenario,
): BaselineResult {
  const battery = scenario.battery;
  const eta = Math.sqrt(battery.round_trip_efficiency);
  const prices = scenario.intervals.map((iv) => iv.price_eur_mwh);
  const T = prices.length;

  const span = battery.energy_max_mwh - battery.energy_min_mwh;
  const intervalsToFill = Math.ceil(span / (battery.power_max_mw * DT));

  const idx = [...prices.keys()].sort((a, b) => prices[a] - prices[b]);
  const chargeSet = new Set(idx.slice(0, intervalsToFill));
  const dischargeSet = new Set(idx.slice(-intervalsToFill));

  let soc = battery.energy_capacity_mwh * 0.5;
  let cum = 0;
  const out: BaselineInterval[] = [];

  for (let t = 0; t < T; t++) {
    let charge = 0;
    let discharge = 0;
    if (chargeSet.has(t)) {
      const headroom = (battery.energy_max_mwh - soc) / DT / eta;
      charge = Math.max(0, Math.min(battery.power_max_mw, headroom));
      soc += eta * charge * DT;
    } else if (dischargeSet.has(t)) {
      const available = ((soc - battery.energy_min_mwh) * eta) / DT;
      discharge = Math.max(0, Math.min(battery.power_max_mw, available));
      soc -= (discharge * DT) / eta;
    }
    const revenue = (discharge - charge) * DT * prices[t];
    cum += revenue;
    out.push({
      t,
      hour: t * DT,
      price_eur_mwh: prices[t],
      charge_mw: charge,
      discharge_mw: discharge,
      net_dispatch_mw: discharge - charge,
      soc_mwh: soc,
      revenue_eur: revenue,
      cumulative_revenue_eur: cum,
    });
  }

  return { intervals: out, total_revenue_eur: cum };
}

export function smartCumulative(scenario: Scenario): number[] {
  let cum = 0;
  return scenario.intervals.map((iv) => {
    cum += (iv.discharge_mw - iv.charge_mw) * DT * iv.price_eur_mwh;
    return cum;
  });
}
