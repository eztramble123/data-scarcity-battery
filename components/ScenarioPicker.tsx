"use client";

import type { ScenarioListItem } from "@/lib/api";

type Props = {
  scenarios: ScenarioListItem[];
  selected: string;
  onSelect: (name: string) => void;
};

export default function ScenarioPicker({ scenarios, selected, onSelect }: Props) {
  return (
    <div className="inline-flex rounded-lg border border-neutral-800 bg-neutral-900 p-1">
      {scenarios.map((s) => (
        <button
          key={s.name}
          onClick={() => onSelect(s.name)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selected === s.name
              ? "bg-neutral-100 text-neutral-950"
              : "text-neutral-400 hover:text-neutral-100"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
