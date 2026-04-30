"use client";

import { useEffect, useMemo, useState } from "react";

import type { Scenario } from "@/lib/api";
import { getOperatorNarrative, type AthensSite } from "@/lib/platform-data";

type Props = {
  scenario: Scenario;
  site: AthensSite;
};

const ACCENTS = ["#f59e0b", "#38bdf8", "#a855f7", "#84cc16"];

export default function PlatformFlowView({ scenario, site }: Props) {
  const [pulseStep, setPulseStep] = useState(0);
  const operatorNarrative = getOperatorNarrative(scenario);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPulseStep((current) => (current + 1) % 4);
    }, 1500);
    return () => window.clearInterval(timer);
  }, []);

  const stages = useMemo(
    () => [
      {
        title: "Site batch",
        badge: "REAL",
        detail: `${site.site_name} sends 15-minute demand data.`,
        signal: `${site.annual_mwh.toLocaleString()} MWh annual demand`,
        accent: ACCENTS[0],
        tone: "real" as const,
      },
      {
        title: "Verify",
        badge: "OFF-CHAIN",
        detail: "Schema, site bounds, and meter identity are checked.",
        signal: site.stage === "submitted" ? "pending verification" : "verified batch",
        accent: ACCENTS[1],
        tone: "verified" as const,
      },
      {
        title: "Receipt",
        badge: "ON-CHAIN",
        detail: "Accepted batches are linked to a receipt token.",
        signal: site.token_id ?? "not minted yet",
        accent: ACCENTS[2],
        tone: "chain" as const,
      },
      {
        title: "Battery model",
        badge: "DOWNSTREAM",
        detail: "Admitted demand changes how the battery is scheduled.",
        signal: site.admitted_to_optimizer ? operatorNarrative.headline : "not feeding optimization yet",
        accent: ACCENTS[3],
        tone: "model" as const,
      },
    ],
    [operatorNarrative.headline, site],
  );

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden">
      <div className="border-b border-neutral-800 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 px-5 py-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Tech flow</div>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-100">From selected site to battery output</h2>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 px-4 py-3 text-sm text-neutral-300">
            {site.business_name}
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="hidden grid-cols-[1fr_0.22fr_1fr_0.22fr_1fr_0.22fr_1fr] gap-3 lg:grid">
          {stages.flatMap((stage, index) =>
            index < stages.length - 1
              ? [
                  <StageCard key={stage.title} stage={stage} active={pulseStep === index} />,
                  <FlowConnector key={`${stage.title}-connector`} active={pulseStep >= index} accent={stage.accent} />,
                ]
              : [<StageCard key={stage.title} stage={stage} active={pulseStep === index} />],
          )}
        </div>

        <div className="flex flex-col gap-4 lg:hidden">
          {stages.map((stage, index) => (
            <div key={stage.title} className="flex flex-col gap-3">
              <StageCard stage={stage} active={pulseStep === index} />
              {index < stages.length - 1 && (
                <div className="flex h-10 items-center justify-center">
                  <div
                    className={`flow-pulse-vertical relative h-full w-[2px] rounded-full bg-neutral-800 ${
                      pulseStep >= index ? "opacity-100" : "opacity-50"
                    }`}
                    style={{ ["--pulse-accent" as string]: stage.accent }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StageCard({
  stage,
  active,
}: {
  stage: {
    title: string;
    badge: string;
    detail: string;
    signal: string;
    accent: string;
    tone: "real" | "verified" | "chain" | "model";
  };
  active: boolean;
}) {
  const badgeStyles = {
    real: "border-amber-900/70 bg-amber-950/30 text-amber-300",
    verified: "border-sky-900/70 bg-sky-950/30 text-sky-300",
    chain: "border-violet-900/70 bg-violet-950/30 text-violet-300",
    model: "border-lime-900/70 bg-lime-950/30 text-lime-300",
  } as const;

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-500 ${
        active ? "border-neutral-600 bg-neutral-900" : "border-neutral-800 bg-neutral-950"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-neutral-100">{stage.title}</div>
          <span
            className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${badgeStyles[stage.tone]}`}
          >
            {stage.badge}
          </span>
        </div>
        <span
          className="mt-1 inline-block h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor: stage.accent,
            boxShadow: active ? `0 0 14px ${stage.accent}` : "none",
          }}
        />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-neutral-400">{stage.detail}</p>
      <div className="mt-3 border-t border-neutral-800 pt-3">
        <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-600">signal</div>
        <div className="mt-1 font-mono text-sm text-neutral-100">{stage.signal}</div>
      </div>
    </div>
  );
}

function FlowConnector({ active, accent }: { active: boolean; accent: string }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`flow-pulse-line relative h-[2px] w-full rounded-full bg-neutral-800 ${
          active ? "opacity-100" : "opacity-60"
        }`}
        style={{ ["--pulse-accent" as string]: accent }}
      />
    </div>
  );
}
