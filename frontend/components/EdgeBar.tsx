"use client";

import { useMemo } from "react";

import type { Scenario } from "@/lib/api";
import { naiveSchedule } from "@/lib/baseline";
import { approximateCaptureRate } from "@/lib/decisions";

type Props = { scenario: Scenario };

export default function EdgeBar({ scenario }: Props) {
  const { revenue, naiveRev, lift, capture } = useMemo(() => {
    const naive = naiveSchedule(scenario);
    const cap = approximateCaptureRate(scenario);
    const r = scenario.summary.expected_revenue_eur;
    const n = naive.total_revenue_eur;
    const l = n > 0 ? ((r - n) / n) * 100 : 0;
    return { revenue: r, naiveRev: n, lift: l, capture: cap };
  }, [scenario]);

  const liftColor = lift >= 0 ? "#84cc16" : "#ef4444";

  return (
    <section className="rounded-xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black overflow-hidden">
      <div className="grid grid-cols-3 divide-x divide-neutral-800">
        <Column
          label="Revenue today"
          value={`€${revenue.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`}
          sub={`naive plan would earn €${naiveRev.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`}
          color="#84cc16"
        />
        <Column
          label="Lift over naive"
          value={`${lift >= 0 ? "+" : ""}${lift.toFixed(0)}%`}
          sub="what the optimization is worth"
          color={liftColor}
        />
        <Column
          label="Capture rate"
          value={`${(capture * 100).toFixed(0)}%`}
          sub="of perfect-foresight revenue"
          color="#84cc16"
        />
      </div>
      <div className="border-t border-neutral-800 px-5 py-2.5 text-[12px] text-neutral-400">
        <span className="text-neutral-500">Why this matters:</span>{" "}
        admitted demand data + physics + market signals, measured against a
        naive baseline.
      </div>
    </section>
  );
}

function Column({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="px-5 py-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </div>
      <div
        className="mt-1.5 text-3xl md:text-4xl font-mono font-semibold tabular-nums leading-none transition-colors duration-300"
        style={{ color }}
      >
        {value}
      </div>
      <div className="mt-1.5 text-[11px] text-neutral-500 font-mono">{sub}</div>
    </div>
  );
}
