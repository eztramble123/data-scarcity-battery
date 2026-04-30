"use client";

import type { Decision } from "@/lib/decisions";

type Props = { decision: Decision };

const ACTION_COLOR: Record<Decision["action"], string> = {
  buying: "#38bdf8",
  selling: "#f59e0b",
  holding: "#a3a3a3",
};

const ACTION_LABEL: Record<Decision["action"], string> = {
  buying: "BUYING",
  selling: "SELLING",
  holding: "HOLDING",
};

export default function DecisionPanel({ decision }: Props) {
  const color = ACTION_COLOR[decision.action];

  return (
    <div className="flex flex-col gap-4 p-5 rounded-xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 h-full">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{
              background: color,
              boxShadow: `0 0 12px ${color}`,
            }}
          />
          <span
            className="text-[11px] font-mono uppercase tracking-[0.18em]"
            style={{ color }}
          >
            {ACTION_LABEL[decision.action]}
          </span>
        </div>
        {decision.is_surplus && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 px-2 py-0.5 border border-purple-900/60 rounded">
            renewable surplus
          </span>
        )}
      </div>

      <div>
        <div className="text-2xl font-semibold leading-tight tracking-tight" style={{ color }}>
          {decision.headline}
        </div>
        <div className="text-sm text-neutral-300 mt-2 leading-relaxed">
          {decision.rationale}
        </div>
      </div>

      {decision.metric && (
        <div className="flex items-baseline gap-2 pt-3 border-t border-neutral-800/80">
          <div className="text-[11px] uppercase tracking-wider text-neutral-500 flex-1">
            {decision.metric.label}
          </div>
          <div
            className="font-mono text-lg font-semibold"
            style={{ color: decision.metric.color }}
          >
            {decision.metric.value}
          </div>
        </div>
      )}

      {decision.naive && (
        <div className="mt-auto pt-3 border-t border-neutral-800/80">
          <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
            What a naive scheduler would do
          </div>
          <div className="text-sm font-mono text-neutral-400">
            {decision.naive.headline}
          </div>
        </div>
      )}
    </div>
  );
}
