// Per-interval decision reasoning. The MILP returns *what* it does;
// this file derives *why* in plain language for the dashboard.

import type { Scenario, ScenarioInterval } from "./api";
import type { BaselineInterval } from "./baseline";

export type Action = "buying" | "selling" | "holding";

export type Decision = {
  action: Action;
  // Plain-language headline. e.g. "Buying at €5/MWh"
  headline: string;
  // One-line rationale: why this action makes sense right now.
  rationale: string;
  // Quantitative tag (e.g. margin) — null when not applicable.
  metric: { label: string; value: string; color: string } | null;
  // What the naive plan does at the same instant.
  naive: { headline: string; delta_eur_per_mwh: number } | null;
  // Curtailment / surplus indicator.
  is_surplus: boolean;
};

const POWER_THRESHOLD_MW = 0.5;

function fmtMargin(v: number): string {
  const s = v >= 0 ? "+" : "−";
  return `${s}€${Math.abs(v).toFixed(0)}/MWh`;
}

function fmtPrice(v: number): string {
  return `€${v.toFixed(0)}/MWh`;
}

function fmtTimeDelta(deltaT: number): string {
  const hours = Math.abs(deltaT) * 0.25;
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 1.5) return `1 hour`;
  return `${hours.toFixed(1)} hours`;
}

function findNextDischarge(
  intervals: ScenarioInterval[],
  fromT: number,
): ScenarioInterval | null {
  for (let i = fromT + 1; i < intervals.length; i++) {
    if (intervals[i].discharge_mw > POWER_THRESHOLD_MW) return intervals[i];
  }
  return null;
}

function findPrevCharge(
  intervals: ScenarioInterval[],
  fromT: number,
): ScenarioInterval | null {
  for (let i = fromT - 1; i >= 0; i--) {
    if (intervals[i].charge_mw > POWER_THRESHOLD_MW) return intervals[i];
  }
  return null;
}

export function deriveDecision(
  scenario: Scenario,
  t: number,
  naive: BaselineInterval[],
): Decision {
  const iv = scenario.intervals[t];
  const naiveIv = naive[t];
  const eta = Math.sqrt(scenario.battery.round_trip_efficiency);
  const isSurplus = iv.regime_label === "renewable_surplus";

  // BUYING (charging)
  if (iv.charge_mw > POWER_THRESHOLD_MW) {
    const next = findNextDischarge(scenario.intervals, t);
    // Margin per grid-MWh after losses:
    // Buy 1 MWh from grid → eta MWh into cell → eta * eta_d (=eta) MWh back to grid.
    // Net: sell_price * eta^2 - buy_price.
    const margin = next
      ? next.price_eur_mwh * eta * eta - iv.price_eur_mwh
      : 0;
    const rationale = iv.reason_detail || (next
      ? `Selling ${fmtTimeDelta(next.t - t)} from now at ~${fmtPrice(next.price_eur_mwh)}.`
      : `Storing energy for the evening peak.`);

    let naiveSnippet: Decision["naive"] = null;
    if (naiveIv) {
      const naiveAction =
        naiveIv.charge_mw > POWER_THRESHOLD_MW
          ? "also buying"
          : naiveIv.discharge_mw > POWER_THRESHOLD_MW
            ? `selling at ${fmtPrice(naiveIv.price_eur_mwh)}`
            : "idle";
      const delta = naiveIv.charge_mw > POWER_THRESHOLD_MW
        ? 0
        : iv.price_eur_mwh - naiveIv.price_eur_mwh; // buying lower than naive's idle reference price
      naiveSnippet = {
        headline: `Naive: ${naiveAction}`,
        delta_eur_per_mwh: delta,
      };
    }

    return {
      action: "buying",
      headline: `Buying at ${fmtPrice(iv.price_eur_mwh)}`,
      rationale,
      metric: {
        label: "Round-trip margin",
        value: fmtMargin(margin),
        color: margin >= 0 ? "#84cc16" : "#ef4444",
      },
      naive: naiveSnippet,
      is_surplus: isSurplus,
    };
  }

  // SELLING (discharging)
  if (iv.discharge_mw > POWER_THRESHOLD_MW) {
    const prev = findPrevCharge(scenario.intervals, t);
    const margin = prev
      ? iv.price_eur_mwh - prev.price_eur_mwh / (eta * eta)
      : iv.price_eur_mwh;

    const rationale = iv.reason_detail || (prev
      ? `Bought ${fmtTimeDelta(t - prev.t)} ago at ~${fmtPrice(prev.price_eur_mwh)}.`
      : `Selling stored energy.`);

    let naiveSnippet: Decision["naive"] = null;
    if (naiveIv) {
      const naiveAction =
        naiveIv.discharge_mw > POWER_THRESHOLD_MW
          ? "also selling"
          : naiveIv.charge_mw > POWER_THRESHOLD_MW
            ? `buying at ${fmtPrice(naiveIv.price_eur_mwh)}`
            : "idle";
      naiveSnippet = {
        headline: `Naive: ${naiveAction}`,
        delta_eur_per_mwh: 0,
      };
    }

    return {
      action: "selling",
      headline: `Selling at ${fmtPrice(iv.price_eur_mwh)}`,
      rationale,
      metric: {
        label: "Per-MWh margin",
        value: fmtMargin(margin),
        color: margin >= 0 ? "#84cc16" : "#ef4444",
      },
      naive: naiveSnippet,
      is_surplus: false,
    };
  }

  // HOLDING — derive *why* it's holding
  const battery = scenario.battery;
  const headroom = battery.energy_max_mwh - iv.soc_mwh;
  const available = iv.soc_mwh - battery.energy_min_mwh;
  let rationale: string;
  if (iv.reason_detail) {
    rationale = iv.reason_detail;
  } else if (available < 1) {
    rationale = "Battery is empty — waiting for cheap power to refill.";
  } else if (headroom < 1) {
    rationale = "Battery is full — waiting for the next price peak to release.";
  } else {
    // Mid-SoC hold — usually because spread doesn't beat degradation cost
    const next = findNextDischarge(scenario.intervals, t);
    if (next) {
      const projectedMargin =
        next.price_eur_mwh * eta * eta - iv.price_eur_mwh;
      if (projectedMargin < 5) {
        rationale = "Spread is too narrow — wear cost would exceed the trade.";
      } else {
        rationale = "Holding position before the next peak.";
      }
    } else {
      rationale = "No more peaks today — preserving cycles.";
    }
  }

  let naiveSnippet: Decision["naive"] = null;
  if (naiveIv) {
    if (naiveIv.charge_mw > POWER_THRESHOLD_MW) {
      naiveSnippet = {
        headline: `Naive: buying at ${fmtPrice(naiveIv.price_eur_mwh)}`,
        delta_eur_per_mwh: 0,
      };
    } else if (naiveIv.discharge_mw > POWER_THRESHOLD_MW) {
      naiveSnippet = {
        headline: `Naive: selling at ${fmtPrice(naiveIv.price_eur_mwh)}`,
        delta_eur_per_mwh: 0,
      };
    }
  }

  return {
    action: "holding",
    headline: "Holding",
    rationale,
    metric: null,
    naive: naiveSnippet,
    is_surplus: isSurplus,
  };
}

// "Capture rate" = our revenue / perfect-foresight oracle revenue.
// We don't have the oracle yet, so we approximate it as: sell every interval at
// max-price, buy every interval at min-price, scaled by daily energy throughput.
// This is a rough upper bound, conservative on the denominator side.
export function approximateCaptureRate(scenario: Scenario): number {
  const prices = scenario.intervals.map((iv) => iv.price_eur_mwh);
  const sorted = [...prices].sort((a, b) => a - b);
  const battery = scenario.battery;
  const dt = 0.25;
  const span = battery.energy_max_mwh - battery.energy_min_mwh;
  const fillIntervals = Math.ceil(span / (battery.power_max_mw * dt));
  // Oracle: full charge at the cheapest fillIntervals + full discharge at the priciest
  const cheapMean =
    sorted.slice(0, fillIntervals).reduce((a, b) => a + b, 0) / fillIntervals;
  const dearMean =
    sorted.slice(-fillIntervals).reduce((a, b) => a + b, 0) / fillIntervals;
  const eta = Math.sqrt(battery.round_trip_efficiency);
  // Energy delivered to grid = span * eta (one cycle through the loss)
  const oracleRev = span * eta * dearMean - span * cheapMean;
  if (oracleRev <= 0) return 0;
  return scenario.summary.expected_revenue_eur / oracleRev;
}
