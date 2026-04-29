"use client";

import { useMemo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import type { Scenario } from "@/lib/api";

type Props = {
  scenario: Scenario;
  cursorT: number;
};

type Band = { x1: number; x2: number; color: string; opacity: number };

const COLORS = {
  charge: "#38bdf8", // sky-400
  discharge: "#f59e0b", // amber-500
  surplus: "#a855f7", // purple-500
  price: "#fafafa",
  cursor: "#ffffff",
  grid: "#1f1f1f",
} as const;

const ACTION_THRESHOLD = 0.5;
const DT = 0.25;

function buildBands(scenario: Scenario): Band[] {
  // Merge contiguous same-action intervals into single bands.
  const out: Band[] = [];
  let runStart: number | null = null;
  let runColor: string | null = null;
  let runOpacity = 0;
  const flush = (endHour: number) => {
    if (runStart !== null && runColor) {
      out.push({
        x1: runStart,
        x2: endHour,
        color: runColor,
        opacity: runOpacity,
      });
    }
    runStart = null;
    runColor = null;
  };

  scenario.intervals.forEach((iv) => {
    let color: string | null = null;
    let opacity = 0;
    if (iv.charge_mw > ACTION_THRESHOLD) {
      color = COLORS.charge;
      opacity = 0.18;
    } else if (iv.discharge_mw > ACTION_THRESHOLD) {
      color = COLORS.discharge;
      opacity = 0.18;
    }
    if (color !== runColor) {
      flush(iv.hour);
      if (color) {
        runStart = iv.hour;
        runColor = color;
        runOpacity = opacity;
      }
    }
  });
  if (runStart !== null) flush(24);
  return out;
}

function buildSurplusBands(scenario: Scenario): Band[] {
  const out: Band[] = [];
  let runStart: number | null = null;
  scenario.intervals.forEach((iv) => {
    if (iv.regime_label === "renewable_surplus") {
      if (runStart === null) runStart = iv.hour;
    } else {
      if (runStart !== null) {
        out.push({
          x1: runStart,
          x2: iv.hour,
          color: COLORS.surplus,
          opacity: 0.16,
        });
        runStart = null;
      }
    }
  });
  if (runStart !== null)
    out.push({ x1: runStart, x2: 24, color: COLORS.surplus, opacity: 0.16 });
  return out;
}

export default function PriceActionChart({ scenario, cursorT }: Props) {
  const data = useMemo(
    () =>
      scenario.intervals.map((iv) => ({
        hour: iv.hour,
        price: iv.price_eur_mwh,
        low: iv.price_p10_eur_mwh,
        high: iv.price_p90_eur_mwh,
      })),
    [scenario],
  );
  const actionBands = useMemo(() => buildBands(scenario), [scenario]);
  const surplusBands = useMemo(() => buildSurplusBands(scenario), [scenario]);

  const cursorHour = scenario.intervals[cursorT]?.hour ?? 0;
  const cursorPrice = scenario.intervals[cursorT]?.price_eur_mwh ?? 0;

  // Right-side annotation: avoid colliding with the chart edge.
  const annotateLeft = cursorHour > 16;

  return (
    <div className="relative w-full">
      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart
          data={data}
          margin={{ top: 16, right: 18, bottom: 16, left: 8 }}
        >
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e4e4e7" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#e4e4e7" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          {/* Surplus bands first (most opaque, vertical full-height) */}
          {surplusBands.map((b, i) => (
            <ReferenceArea
              key={`surplus-${i}`}
              x1={b.x1}
              x2={b.x2}
              fill={b.color}
              fillOpacity={b.opacity}
              ifOverflow="extendDomain"
              strokeOpacity={0}
            />
          ))}

          {/* Action bands behind the price line */}
          {actionBands.map((b, i) => (
            <ReferenceArea
              key={`action-${i}`}
              x1={b.x1}
              x2={b.x2}
              fill={b.color}
              fillOpacity={b.opacity}
              ifOverflow="extendDomain"
              strokeOpacity={0}
            />
          ))}

          <CartesianGrid stroke={COLORS.grid} vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="hour"
            stroke="#404040"
            tick={{ fontSize: 11, fill: "#737373" }}
            ticks={[0, 3, 6, 9, 12, 15, 18, 21, 24]}
            tickFormatter={(h: number) => `${String(h).padStart(2, "0")}:00`}
            tickLine={{ stroke: "#262626" }}
            axisLine={{ stroke: "#262626" }}
            type="number"
            domain={[0, 24]}
          />
          <YAxis
            stroke="#404040"
            tick={{ fontSize: 11, fill: "#737373" }}
            tickFormatter={(v: number) => `€${v.toFixed(0)}`}
            tickLine={{ stroke: "#262626" }}
            axisLine={{ stroke: "#262626" }}
            width={56}
          />

          <Area
            type="monotone"
            dataKey="high"
            stroke="none"
            fill="#a78bfa"
            fillOpacity={0.08}
            dot={false}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="low"
            stroke="none"
            fill="#0a0a0a"
            fillOpacity={1}
            dot={false}
            isAnimationActive={false}
          />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#a78bfa"
            strokeWidth={1}
            strokeOpacity={0.75}
            dot={false}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={COLORS.price}
            strokeWidth={1.75}
            fill="url(#priceGrad)"
            dot={false}
            isAnimationActive={false}
          />

          <ReferenceLine
            x={cursorHour}
            stroke={COLORS.cursor}
            strokeWidth={1.5}
            ifOverflow="extendDomain"
            label={{
              value: "now",
              fill: "#fafafa",
              fontSize: 10,
              position: "top",
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend strip below the chart */}
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 px-2 text-[11px] text-neutral-400 font-mono">
        <Swatch color={COLORS.charge} label="buying" />
        <Swatch color={COLORS.discharge} label="selling" />
        <Swatch color={COLORS.surplus} label="renewable surplus regime" />
        <Swatch color={COLORS.price} label="market price" line />
        <Swatch color="#a78bfa" label="forecast band" />
      </div>

      {/* Floating callout at cursor */}
      <div
        className="absolute top-3 px-3 py-2 rounded-md bg-neutral-950/90 border border-neutral-800 text-xs font-mono shadow-lg backdrop-blur-sm"
        style={{
          left: annotateLeft ? undefined : `min(calc(${(cursorHour / 24) * 100}% + 18px), calc(100% - 220px))`,
          right: annotateLeft ? "1.5rem" : undefined,
          minWidth: 180,
          pointerEvents: "none",
        }}
      >
        <div className="text-[10px] uppercase tracking-wider text-neutral-500">
          {String(Math.floor(cursorHour)).padStart(2, "0")}:
          {String(Math.round((cursorHour % 1) * 60)).padStart(2, "0")} · price
        </div>
        <div className="text-base text-neutral-100 mt-0.5">
          €{cursorPrice.toFixed(1)}
          <span className="text-neutral-500 text-[10px] ml-1">/MWh</span>
        </div>
        <div className="text-[10px] text-neutral-500 mt-1">
          forecast band · €
          {scenario.intervals[cursorT]?.price_p10_eur_mwh.toFixed(0)} to €
          {scenario.intervals[cursorT]?.price_p90_eur_mwh.toFixed(0)}
        </div>
      </div>
    </div>
  );
}

function Swatch({
  color,
  label,
  line,
}: {
  color: string;
  label: string;
  line?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-block"
        style={{
          width: 14,
          height: line ? 2 : 10,
          background: color,
          opacity: line ? 1 : 0.65,
        }}
      />
      <span>{label}</span>
    </div>
  );
}
