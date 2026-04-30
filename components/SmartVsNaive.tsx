"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import type { Scenario } from "@/lib/api";
import { naiveSchedule, smartCumulative } from "@/lib/baseline";

type Props = {
  scenario: Scenario;
  cursorTFloat: number;
};

const SMART_COLOR = "#84cc16"; // lime-500
const NAIVE_COLOR = "#525252"; // neutral-600

function lerp(a: number, b: number, f: number) {
  return a + (b - a) * f;
}

export default function SmartVsNaive({ scenario, cursorTFloat }: Props) {
  const { data, smartFinal, naiveFinal, smartCum, naiveCum } = useMemo(() => {
    const naive = naiveSchedule(scenario);
    const sCum = smartCumulative(scenario);
    const nCum = naive.intervals.map((iv) => iv.cumulative_revenue_eur);
    return {
      data: scenario.intervals.map((iv, i) => ({
        hour: iv.hour,
        smart: sCum[i],
        naive: nCum[i],
      })),
      smartFinal: sCum[sCum.length - 1],
      naiveFinal: naive.total_revenue_eur,
      smartCum: sCum,
      naiveCum: nCum,
    };
  }, [scenario]);

  const T = scenario.intervals.length;
  const clamped = Math.max(0, Math.min(T - 1, cursorTFloat));
  const i0 = Math.floor(clamped);
  const i1 = Math.min(T - 1, i0 + 1);
  const f = clamped - i0;
  const cursorHour = lerp(
    scenario.intervals[i0].hour,
    scenario.intervals[i1].hour,
    f,
  );
  const smartAtCursor = lerp(smartCum[i0], smartCum[i1], f);
  const naiveAtCursor = lerp(naiveCum[i0], naiveCum[i1], f);

  const lift =
    naiveFinal > 0 ? ((smartFinal - naiveFinal) / naiveFinal) * 100 : 0;
  const liftAtCursor =
    naiveAtCursor > 0 ? ((smartAtCursor - naiveAtCursor) / naiveAtCursor) * 100 : 0;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-neutral-500">
            Smart vs naive — running revenue
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            What the optimizer earned vs charging during the cheapest 8 intervals
            and selling during the priciest 8 with no foresight.
          </div>
        </div>
        <div className="text-right">
          <div
            className="text-3xl font-mono font-semibold tabular-nums"
            style={{ color: lift >= 0 ? SMART_COLOR : "#ef4444" }}
          >
            {lift >= 0 ? "+" : ""}
            {lift.toFixed(0)}%
          </div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-500 mt-0.5">
            full-day lift
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <RevenueRow
          label="Smart (MILP)"
          color={SMART_COLOR}
          atCursor={smartAtCursor}
          atEnd={smartFinal}
        />
        <RevenueRow
          label="Naive baseline"
          color={NAIVE_COLOR}
          atCursor={naiveAtCursor}
          atEnd={naiveFinal}
        />
      </div>

      <ResponsiveContainer width="100%" height={120}>
        <LineChart
          data={data}
          margin={{ top: 6, right: 8, bottom: 0, left: 0 }}
        >
          <CartesianGrid stroke="#1a1a1a" vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="hour"
            stroke="#404040"
            tick={{ fontSize: 10, fill: "#737373" }}
            ticks={[0, 6, 12, 18, 24]}
            tickFormatter={(h: number) => `${String(h).padStart(2, "0")}:00`}
            type="number"
            domain={[0, 24]}
            tickLine={{ stroke: "#262626" }}
            axisLine={{ stroke: "#262626" }}
          />
          <YAxis
            stroke="#404040"
            tick={{ fontSize: 10, fill: "#737373" }}
            tickFormatter={(v: number) =>
              v >= 1000 ? `€${(v / 1000).toFixed(0)}k` : `€${v.toFixed(0)}`
            }
            tickLine={{ stroke: "#262626" }}
            axisLine={{ stroke: "#262626" }}
            width={48}
          />
          <Line
            type="monotone"
            dataKey="naive"
            stroke={NAIVE_COLOR}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="smart"
            stroke={SMART_COLOR}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <ReferenceLine
            x={cursorHour}
            stroke="#fafafa"
            strokeWidth={1}
            strokeDasharray="2 2"
            ifOverflow="extendDomain"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="text-[11px] text-neutral-500 mt-2 font-mono tabular-nums">
        running lift{" "}
        <span
          className="transition-colors duration-300"
          style={{ color: liftAtCursor >= 0 ? SMART_COLOR : "#ef4444" }}
        >
          {liftAtCursor >= 0 ? "+" : ""}
          {liftAtCursor.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

function RevenueRow({
  label,
  color,
  atCursor,
  atEnd,
}: {
  label: string;
  color: string;
  atCursor: number;
  atEnd: number;
}) {
  const frac = atEnd > 0 ? Math.max(0, Math.min(1, atCursor / atEnd)) : 0;
  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-md bg-neutral-900/60 border border-neutral-800/80">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2"
            style={{ background: color }}
          />
          <span className="text-[11px] uppercase tracking-wider text-neutral-400">
            {label}
          </span>
        </div>
        <span
          className="font-mono font-semibold tabular-nums"
          style={{ color }}
        >
          €{atCursor.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
      </div>
      <div className="h-1 rounded bg-neutral-900 overflow-hidden">
        <div
          className="h-full transition-all"
          style={{
            width: `${frac * 100}%`,
            background: color,
            opacity: 0.85,
          }}
        />
      </div>
      <div className="text-[10px] text-neutral-500 font-mono">
        end of day · €{atEnd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </div>
    </div>
  );
}
