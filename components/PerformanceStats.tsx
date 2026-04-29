"use client";

import { useMemo } from "react";

import type { Scenario } from "@/lib/api";
import { naiveSchedule } from "@/lib/baseline";
import { approximateCaptureRate } from "@/lib/decisions";

type Props = { scenario: Scenario };

export default function PerformanceStats({ scenario }: Props) {
  const naive = useMemo(() => naiveSchedule(scenario), [scenario]);
  const capture = useMemo(() => approximateCaptureRate(scenario), [scenario]);
  const lift =
    naive.total_revenue_eur > 0
      ? ((scenario.summary.expected_revenue_eur - naive.total_revenue_eur) /
          naive.total_revenue_eur) *
        100
      : 0;

  const throughput =
    scenario.summary.total_charge_mwh + scenario.summary.total_discharge_mwh;
  const wearCost = scenario.summary.total_degradation_cost_eur;
  const netProfit = scenario.summary.expected_revenue_eur - wearCost;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Tile
        label="Revenue today"
        question="How well is it working?"
        value={`€${scenario.summary.expected_revenue_eur.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}`}
        color="#84cc16"
        sub={`net €${netProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })} after wear`}
      />
      <Tile
        label="Capture rate"
        question="vs perfect foresight"
        value={`${(capture * 100).toFixed(0)}%`}
        color="#84cc16"
        sub="industry benchmark 60–85%"
      />
      <Tile
        label="Lift over naive"
        question="What does smarts buy?"
        value={`${lift >= 0 ? "+" : ""}${lift.toFixed(0)}%`}
        color={lift >= 0 ? "#84cc16" : "#ef4444"}
        sub={`naive earned €${naive.total_revenue_eur.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}`}
      />
      <Tile
        label="Battery stress"
        question="How hard worked?"
        value={`${scenario.summary.cycles.toFixed(2)} cycles`}
        color="#22d3ee"
        sub={`${scenario.summary.total_losses_mwh.toFixed(1)} MWh losses · ${(scenario.summary.mean_curtailment_probability * 100).toFixed(0)}% avg surplus odds`}
      />
    </div>
  );
}

function Tile({
  label,
  question,
  value,
  color,
  sub,
}: {
  label: string;
  question: string;
  value: string;
  color: string;
  sub: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950">
      <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-0.5">
        {label}
      </div>
      <div className="text-[11px] text-neutral-600 mb-2">{question}</div>
      <div
        className="text-2xl font-mono font-semibold tabular-nums"
        style={{ color }}
      >
        {value}
      </div>
      <div className="text-[11px] text-neutral-500 mt-1.5 font-mono">{sub}</div>
    </div>
  );
}
