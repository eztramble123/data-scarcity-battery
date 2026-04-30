import type { Scenario, ScenarioInterval } from "./api";

export type ProvenanceKind = "real" | "modelled" | "synthetic";
export type ProvenanceStatus = "wired" | "planned" | "stubbed";
export type FlowNodeGroup =
  | "sources"
  | "features"
  | "models"
  | "optimizer"
  | "outputs";

export type FlowNode = {
  id: string;
  label: string;
  group: FlowNodeGroup;
  provenance: ProvenanceKind;
  status: ProvenanceStatus;
  description: string;
  uses: string;
  accent: string;
};

export const FLOW_NODES: FlowNode[] = [
  {
    id: "entsoe",
    label: "ENTSO-E",
    group: "sources",
    provenance: "real",
    status: "wired",
    description: "Greek market price, load, and generation source.",
    uses: "Anchors historical DAM context and replay-ready market inputs.",
    accent: "#a78bfa",
  },
  {
    id: "open-meteo",
    label: "Open-Meteo",
    group: "sources",
    provenance: "real",
    status: "wired",
    description: "Weather API for solar, wind, and cloud conditions.",
    uses: "Explains when renewable surplus is likely to appear.",
    accent: "#38bdf8",
  },
  {
    id: "ipto",
    label: "IPTO",
    group: "sources",
    provenance: "real",
    status: "planned",
    description: "Greek operator forecasts for load, RES, and transfer limits.",
    uses: "Will localize the model around Greek curtailment mechanics.",
    accent: "#22d3ee",
  },
  {
    id: "henex",
    label: "HEnEx",
    group: "sources",
    provenance: "real",
    status: "planned",
    description: "Official Greek market results and aggregated market curves.",
    uses: "Will provide richer Greek price formation evidence.",
    accent: "#f59e0b",
  },
  {
    id: "fundamentals",
    label: "Fuel + Carbon",
    group: "sources",
    provenance: "real",
    status: "planned",
    description: "TTF gas and EUA carbon references.",
    uses: "Will explain thermal price pressure outside surplus windows.",
    accent: "#84cc16",
  },
  {
    id: "features",
    label: "Greek features",
    group: "features",
    provenance: "modelled",
    status: "wired",
    description: "Residual demand, RES pressure, export tightness, and weather signals.",
    uses: "Turns raw source feeds into variables the forecaster can reason with.",
    accent: "#22d3ee",
  },
  {
    id: "regime",
    label: "Surplus odds",
    group: "models",
    provenance: "modelled",
    status: "wired",
    description: "Probability that Greece is entering a renewable-surplus regime.",
    uses: "Separates curtailment-like hours from normal price behavior.",
    accent: "#a855f7",
  },
  {
    id: "price-band",
    label: "Price band",
    group: "models",
    provenance: "synthetic",
    status: "wired",
    description: "p10 / p50 / p90 market price envelope for the day.",
    uses: "Shows what the optimizer knows before committing the battery schedule.",
    accent: "#a78bfa",
  },
  {
    id: "optimizer",
    label: "Scheduler",
    group: "optimizer",
    provenance: "modelled",
    status: "wired",
    description: "Battery-constrained optimization over price and regime inputs.",
    uses: "Chooses whether to buy, sell, or hold every 15 minutes.",
    accent: "#84cc16",
  },
  {
    id: "battery",
    label: "Digital twin",
    group: "optimizer",
    provenance: "modelled",
    status: "wired",
    description: "Megapack power, energy, losses, wear, and safety limits.",
    uses: "Creates synthetic battery telemetry where Greek operations history does not exist.",
    accent: "#22d3ee",
  },
  {
    id: "outputs",
    label: "Battery outcome",
    group: "outputs",
    provenance: "synthetic",
    status: "wired",
    description: "Action, charge level, losses, wear, and expected revenue.",
    uses: "Produces the judge-facing answer to what the system did and why.",
    accent: "#f59e0b",
  },
];

export function formatFlowFacts(interval: ScenarioInterval, scenario: Scenario) {
  return {
    entsoe: `€${interval.price_eur_mwh.toFixed(0)}/MWh now`,
    "open-meteo": `${Math.round(interval.solar_index * 100)}% solar pressure`,
    ipto: `${interval.load_forecast_mw.toFixed(0)} MW load forecast`,
    henex: `${scenario.label.toLowerCase()} market curve`,
    fundamentals: `${scenario.summary.min_price_eur_mwh.toFixed(0)}–${scenario.summary.max_price_eur_mwh.toFixed(0)} €/MWh day range`,
    features: `${interval.residual_demand_mw.toFixed(0)} MW residual demand`,
    regime: `${(interval.curtailment_probability * 100).toFixed(0)}% renewable-surplus odds`,
    "price-band": `€${interval.price_p10_eur_mwh.toFixed(0)}–€${interval.price_p90_eur_mwh.toFixed(0)} band`,
    optimizer: interval.reason_detail,
    battery: `${interval.losses_mwh.toFixed(1)} MWh losses · €${interval.cumulative_degradation_cost_eur.toFixed(0)} wear`,
    outputs: `${Math.abs(interval.net_dispatch_mw).toFixed(0)} MW ${interval.net_dispatch_mw > 0.5 ? "selling" : interval.net_dispatch_mw < -0.5 ? "buying" : "holding"}`,
  } as const;
}
