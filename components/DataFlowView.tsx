"use client";

import { useEffect, useMemo, useState } from "react";

import type { Scenario } from "@/lib/api";
import { FLOW_NODES, formatFlowFacts, type FlowNodeGroup, type ProvenanceKind, type ProvenanceStatus } from "@/lib/data-flow";

type Props = {
  scenario: Scenario;
  cursorT: number;
};

const GROUP_TITLES: Record<FlowNodeGroup, string> = {
  sources: "Real sources",
  features: "Feature layer",
  models: "Model layer",
  optimizer: "Optimization layer",
  outputs: "Outputs",
};

const GROUP_ORDER: FlowNodeGroup[] = [
  "sources",
  "features",
  "models",
  "optimizer",
  "outputs",
];

const PULSE_ACCENTS = ["#38bdf8", "#a855f7", "#84cc16", "#f59e0b"];

export default function DataFlowView({ scenario, cursorT }: Props) {
  const [pulseStep, setPulseStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPulseStep((prev) => (prev + 1) % GROUP_ORDER.length);
    }, 1400);
    return () => window.clearInterval(timer);
  }, []);

  const interval = scenario.intervals[cursorT];
  const facts = useMemo(() => formatFlowFacts(interval, scenario), [interval, scenario]);

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-800 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="text-[11px] uppercase tracking-wider text-neutral-500">
          Data flow
        </div>
        <div className="mt-1 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-100">
              How the regime thesis becomes a battery decision
            </h2>
            <p className="text-sm text-neutral-400 max-w-3xl mt-1">
              Real Greek market and weather inputs feed a model that treats
              renewable surplus as a regime, not noise. The battery behavior is
              synthetic because Greek battery operations history does not yet exist.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 md:w-[360px]">
            <MiniBadge label="Real wired" value="ENTSO-E + Open-Meteo" color="#38bdf8" />
            <MiniBadge
              label="Edge"
              value="Regime first"
              color="#a855f7"
            />
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="hidden lg:grid lg:grid-cols-[1.4fr_0.35fr_1fr_0.35fr_1fr_0.35fr_1fr_0.35fr_1fr] gap-3 items-stretch">
          {GROUP_ORDER.map((group) => (
            <FlowColumn
              key={group}
              group={group}
              pulseStep={pulseStep}
              facts={facts}
            />
          )).flatMap((item, idx, arr) =>
            idx < arr.length - 1
              ? [
                  item,
                  <FlowConnector
                    key={`connector-${GROUP_ORDER[idx]}`}
                    active={pulseStep >= idx}
                    accent={PULSE_ACCENTS[idx % PULSE_ACCENTS.length]}
                  />,
                ]
              : [item],
          )}
        </div>

        <div className="lg:hidden flex flex-col gap-4">
          {GROUP_ORDER.map((group, idx) => (
            <div key={group} className="flex flex-col gap-3">
              <FlowColumn group={group} pulseStep={pulseStep} facts={facts} compact />
              {idx < GROUP_ORDER.length - 1 && (
                <div className="h-10 flex items-center justify-center">
                  <div
                    className={`flow-pulse-vertical relative h-full w-[2px] rounded-full bg-neutral-800 ${
                      pulseStep >= idx ? "opacity-100" : "opacity-50"
                    }`}
                    style={{ ["--pulse-accent" as string]: PULSE_ACCENTS[idx % PULSE_ACCENTS.length] }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <LegendBadge kind="real" />
          <LegendBadge kind="modelled" />
          <LegendBadge kind="synthetic" />
        </div>
      </div>
    </section>
  );
}

function FlowColumn({
  group,
  pulseStep,
  facts,
  compact = false,
}: {
  group: FlowNodeGroup;
  pulseStep: number;
  facts: ReturnType<typeof formatFlowFacts>;
  compact?: boolean;
}) {
  const groupIndex = GROUP_ORDER.indexOf(group);
  const active = pulseStep === groupIndex;
  const nodes = FLOW_NODES.filter((node) => node.group === group);

  return (
    <div className="flex flex-col gap-3 min-w-0">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
          {GROUP_TITLES[group]}
        </div>
        <span
          className={`text-[10px] font-mono transition-colors ${
            active ? "text-neutral-100" : "text-neutral-600"
          }`}
        >
          stage {groupIndex + 1}
        </span>
      </div>
      {nodes.map((node) => (
        <FlowCard
          key={node.id}
          node={node}
          fact={facts[node.id as keyof typeof facts]}
          active={active}
          compact={compact}
        />
      ))}
    </div>
  );
}

function FlowCard({
  node,
  fact,
  active,
  compact,
}: {
  node: (typeof FLOW_NODES)[number];
  fact: string;
  active: boolean;
  compact: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-500 ${
        active
          ? "border-neutral-600 bg-neutral-900 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
          : "border-neutral-800 bg-neutral-950"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-neutral-100">{node.label}</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <Pill tone={node.provenance}>{labelForKind(node.provenance)}</Pill>
            <Pill tone={node.status}>{labelForStatus(node.status)}</Pill>
          </div>
        </div>
        <span
          className="inline-block w-2.5 h-2.5 rounded-full shrink-0 mt-1"
          style={{
            background: node.accent,
            boxShadow: active ? `0 0 14px ${node.accent}` : "none",
          }}
        />
      </div>
      <div className="mt-3 text-sm text-neutral-300 leading-relaxed">
        {node.description}
      </div>
      {!compact && (
        <div className="mt-2 text-xs text-neutral-500 leading-relaxed">
          {node.uses}
        </div>
      )}
      <div className="mt-3 pt-3 border-t border-neutral-800">
        <div className="text-[10px] uppercase tracking-wider text-neutral-500">
          Current signal
        </div>
        <div className="mt-1 font-mono text-sm text-neutral-100 tabular-nums">
          {fact}
        </div>
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

function Pill({
  children,
  tone,
}: {
  children: string;
  tone: ProvenanceKind | ProvenanceStatus;
}) {
  const styles: Record<string, string> = {
    real: "border-sky-900/70 text-sky-300 bg-sky-950/40",
    modelled: "border-lime-900/70 text-lime-300 bg-lime-950/40",
    synthetic: "border-violet-900/70 text-violet-300 bg-violet-950/40",
    wired: "border-neutral-700 text-neutral-300 bg-neutral-900/80",
    planned: "border-amber-900/70 text-amber-300 bg-amber-950/30",
    stubbed: "border-red-900/70 text-red-300 bg-red-950/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded border text-[10px] uppercase tracking-wider ${styles[tone]}`}>
      {children}
    </span>
  );
}

function LegendBadge({ kind }: { kind: ProvenanceKind }) {
  const copy: Record<ProvenanceKind, { label: string; text: string; color: string }> = {
    real: {
      label: "Real",
      text: "Source comes from an external market or weather feed.",
      color: "#38bdf8",
    },
    modelled: {
      label: "Modelled",
      text: "System transforms real inputs into probabilities, features, or constraints.",
      color: "#84cc16",
    },
    synthetic: {
      label: "Synthetic",
      text: "Output is simulated because Greek battery operations history is missing.",
      color: "#a855f7",
    },
  };
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3">
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-2.5 h-2.5 rounded-full"
          style={{ background: copy[kind].color }}
        />
        <span className="text-sm font-semibold text-neutral-100">{copy[kind].label}</span>
      </div>
      <div className="mt-1 text-xs text-neutral-500 leading-relaxed">{copy[kind].text}</div>
    </div>
  );
}

function MiniBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-neutral-500">{label}</div>
      <div className="mt-1 font-mono text-sm tabular-nums" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function labelForKind(kind: ProvenanceKind) {
  return kind.toUpperCase();
}

function labelForStatus(status: ProvenanceStatus) {
  return status.toUpperCase();
}
