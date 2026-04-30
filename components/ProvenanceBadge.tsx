"use client";

type ProvenanceTone = "real" | "modelled" | "synthetic" | "wired" | "planned";

const TONE_STYLES: Record<ProvenanceTone, string> = {
  real: "border-sky-900/70 text-sky-300 bg-sky-950/40",
  modelled: "border-lime-900/70 text-lime-300 bg-lime-950/40",
  synthetic: "border-violet-900/70 text-violet-300 bg-violet-950/40",
  wired: "border-neutral-700 text-neutral-300 bg-neutral-900/80",
  planned: "border-amber-900/70 text-amber-300 bg-amber-950/30",
};

export default function ProvenanceBadge({
  tone,
  label,
}: {
  tone: ProvenanceTone;
  label: string;
}) {
  return (
    <span
      className={`px-2 py-0.5 rounded border text-[10px] uppercase tracking-wider ${TONE_STYLES[tone]}`}
    >
      {label}
    </span>
  );
}
