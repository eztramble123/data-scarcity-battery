"use client";

import type { Scenario } from "@/lib/api";

type Props = {
  scenario: Scenario;
};

const STEPS = [
  {
    label: "1. Problem",
    title: "Greece has surplus power and no battery history",
    text: "The market needs battery scheduling now, but historical Greek battery telemetry does not exist.",
    accent: "#ef4444",
  },
  {
    label: "2. Edge",
    title: "We model surplus as a regime",
    text: "Most teams fit one price curve. We classify renewable-surplus conditions first, then optimize inside that regime.",
    accent: "#a855f7",
  },
  {
    label: "3. Decision",
    title: "The battery buys low and sells into peaks",
    text: "Physics, market inputs, and uncertainty combine into a schedule that respects wear, limits, and timing.",
    accent: "#38bdf8",
  },
  {
    label: "4. Proof",
    title: "Always compare against the dumb alternative",
    text: "The system has to beat a simple charge-cheapest / sell-priciest baseline, not just look sophisticated.",
    accent: "#84cc16",
  },
] as const;

export default function DemoPlaybook({ scenario }: Props) {
  return (
    <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
            4-minute story
          </div>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-neutral-100">
            The project wins if judges remember one thing:
          </h2>
          <p className="mt-1 text-sm text-neutral-300 max-w-3xl">
            In Greece, renewable surplus is a regime, not noise. That is why this
            scheduler should beat naive arbitrage even without battery telemetry.
          </p>
        </div>
        <div className="rounded-lg border border-violet-900/50 bg-violet-950/20 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-neutral-500">
            Open with
          </div>
          <div className="mt-1 text-sm text-violet-200">
            {scenario.label === "Curtailment day"
              ? "Curtailment day is the best proof scenario."
              : "Switch back to Curtailment day for the strongest opening."}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 xl:grid-cols-4 gap-3">
        {STEPS.map((step) => (
          <article
            key={step.label}
            className="rounded-lg border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 p-4"
          >
            <div className="text-[10px] uppercase tracking-[0.18em]" style={{ color: step.accent }}>
              {step.label}
            </div>
            <div className="mt-2 text-sm font-semibold text-neutral-100">
              {step.title}
            </div>
            <div className="mt-2 text-[13px] leading-relaxed text-neutral-400">
              {step.text}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
