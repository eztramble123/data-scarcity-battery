"use client";

import { useEffect, useMemo, useState } from "react";

import DecisionPanel from "@/components/DecisionPanel";
import IsometricMegapack from "@/components/IsometricMegapack";
import PerformanceStats from "@/components/PerformanceStats";
import PriceActionChart from "@/components/PriceActionChart";
import ScenarioPicker from "@/components/ScenarioPicker";
import SmartVsNaive from "@/components/SmartVsNaive";
import TimeScrubber from "@/components/TimeScrubber";
import { getScenario, listScenarios, type Scenario } from "@/lib/api";
import { naiveSchedule } from "@/lib/baseline";
import { deriveDecision } from "@/lib/decisions";

const DEFAULT_SCENARIO = "curtailment";

export default function Home() {
  const scenarios = useMemo(() => listScenarios(), []);
  const [scenarioName, setScenarioName] = useState<string>(DEFAULT_SCENARIO);
  const [t, setT] = useState(48); // start at noon
  const [playing, setPlaying] = useState(false);

  const scenario: Scenario = useMemo(
    () => getScenario(scenarioName),
    [scenarioName],
  );
  const interval = scenario.intervals[t];

  const naive = useMemo(() => naiveSchedule(scenario), [scenario]);
  const decision = useMemo(
    () => deriveDecision(scenario, t, naive.intervals),
    [scenario, t, naive],
  );

  // Reset scrub on scenario change.
  useEffect(() => {
    setT((prev) => Math.min(prev, scenario.intervals.length - 1));
  }, [scenario]);

  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header
        scenarios={scenarios}
        selected={scenarioName}
        onSelect={setScenarioName}
      />

      <main className="flex-1 px-4 md:px-8 lg:px-10 pb-10 max-w-[1400px] w-full mx-auto flex flex-col gap-5">
        {/* Hero: centerpiece chart on left, battery on right */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-neutral-500">
                  Day-Ahead Market — {scenario.label}
                </div>
                <h2 className="text-base font-medium text-neutral-200 mt-0.5 max-w-2xl">
                  {scenario.description}
                </h2>
              </div>
            </div>
            <PriceActionChart scenario={scenario} cursorT={t} />
          </div>

          <div className="rounded-xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 p-5 flex flex-col">
            <div className="text-[11px] uppercase tracking-wider text-neutral-500 mb-3">
              The asset
            </div>
            <IsometricMegapack
              interval={interval}
              powerMaxMw={scenario.battery.power_max_mw}
              energyCapacityMwh={scenario.battery.energy_capacity_mwh}
            />
            <div className="mt-2 grid grid-cols-2 gap-2 text-center">
              <BatteryStat
                label="charge level"
                value={`${(interval.soc_frac * 100).toFixed(0)}%`}
                color="#22d3ee"
              />
              <BatteryStat
                label="now"
                value={`${interval.soc_mwh.toFixed(0)} MWh`}
                color="#fafafa"
              />
              <BatteryStat
                label="room to buy"
                value={`${interval.charge_headroom_mwh.toFixed(0)} MWh`}
                color="#38bdf8"
              />
              <BatteryStat
                label="room to sell"
                value={`${interval.discharge_available_mwh.toFixed(0)} MWh`}
                color="#f59e0b"
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <BatteryStat
                label="wear today"
                value={`€${interval.cumulative_degradation_cost_eur.toFixed(0)}`}
                color="#84cc16"
              />
              <BatteryStat
                label="losses today"
                value={`${interval.losses_mwh.toFixed(1)} MWh`}
                color="#ef4444"
              />
            </div>
          </div>
        </section>

        {/* Decision + scrubber row */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
            <TimeScrubber
              t={t}
              setT={setT}
              intervalsCount={scenario.intervals.length}
              hour={interval.hour}
              playing={playing}
              setPlaying={setPlaying}
            />
            <div className="mt-4 grid grid-cols-4 gap-3">
              <KpiTile
                label="Market price"
                value={`€${interval.price_eur_mwh.toFixed(0)}`}
                unit="/MWh"
                color="#a78bfa"
              />
              <KpiTile
                label="Power flow"
                value={
                  Math.abs(interval.net_dispatch_mw) < 0.5
                    ? "0"
                    : interval.net_dispatch_mw > 0
                      ? `+${interval.net_dispatch_mw.toFixed(0)}`
                      : interval.net_dispatch_mw.toFixed(0)
                }
                unit="MW"
                color={
                  interval.net_dispatch_mw > 0.5
                    ? "#f59e0b"
                    : interval.net_dispatch_mw < -0.5
                      ? "#38bdf8"
                      : "#737373"
                }
              />
              <KpiTile
                label="Charge level"
                value={`${(interval.soc_frac * 100).toFixed(0)}`}
                unit="%"
                color="#22d3ee"
              />
              <KpiTile
                label="Surplus odds"
                value={`${(interval.curtailment_probability * 100).toFixed(0)}`}
                unit="%"
                color={interval.regime_label === "renewable_surplus" ? "#a855f7" : "#737373"}
              />
            </div>
          </div>

          <DecisionPanel decision={decision} />
        </section>

        {/* Performance section: race chart + stat tiles */}
        <section className="grid grid-cols-1 gap-5">
          <SmartVsNaive scenario={scenario} cursorT={t} />
          <PerformanceStats scenario={scenario} />
        </section>

        {/* Footnote */}
        <footer className="text-[11px] text-neutral-600 mt-2 max-w-3xl">
          Schedule is the MILP-optimal output across 96 fifteen-minute intervals
          for a Tesla Megapack 2 XL ({scenario.battery.power_max_mw.toFixed(0)} MW
          / {scenario.battery.energy_capacity_mwh.toFixed(0)} MWh, η<sub>RTE</sub>
          ={" "}
          {(scenario.battery.round_trip_efficiency * 100).toFixed(0)}%). Prices
          are synthetic until the ENTSO-E pipeline is connected.
        </footer>
      </main>
    </div>
  );
}

function Header({
  scenarios,
  selected,
  onSelect,
}: {
  scenarios: { name: string; label: string; description: string }[];
  selected: string;
  onSelect: (n: string) => void;
}) {
  return (
    <header className="border-b border-neutral-900 bg-black/40 backdrop-blur-sm sticky top-0 z-10">
      <div className="px-4 md:px-8 lg:px-10 py-4 max-w-[1400px] w-full mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-6"
            style={{
              background: "linear-gradient(to bottom, #38bdf8, #f59e0b)",
            }}
          />
          <div>
            <div className="text-sm font-semibold tracking-tight text-neutral-100">
              Greek Battery · Day-Ahead Scheduler
            </div>
            <div className="text-[11px] text-neutral-500 font-mono">
              Tesla Megapack 2 XL · 100 MW / 200 MWh · 15-min decisions
            </div>
          </div>
        </div>
        <ScenarioPicker
          scenarios={scenarios}
          selected={selected}
          onSelect={onSelect}
        />
      </div>
    </header>
  );
}

function KpiTile({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
}) {
  return (
    <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800/80">
      <div className="text-[10px] uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div className="flex items-baseline gap-1 mt-1">
        <span
          className="text-2xl font-mono font-semibold tabular-nums"
          style={{ color }}
        >
          {value}
        </span>
        <span className="text-[11px] text-neutral-500">{unit}</span>
      </div>
    </div>
  );
}

function BatteryStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="px-2 py-2 rounded bg-neutral-900/60 border border-neutral-800/80">
      <div className="text-[10px] uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div
        className="font-mono text-sm font-semibold tabular-nums mt-0.5"
        style={{ color }}
      >
        {value}
      </div>
    </div>
  );
}
