"use client";

import type { ScenarioInterval } from "@/lib/api";

type Props = {
  interval: ScenarioInterval;
  powerMaxMw: number;
  energyCapacityMwh: number;
};

// Iso projection: top-shears-right, right-shears-down. Cabinet box dimensions
// in model units; tweaked once for proportions, never again.
const W = 260;
const H = 170;
const D = 110;

function p(x: number, y: number, z: number): [number, number] {
  return [x + z * 0.5, H - y + z * 0.45];
}

function poly(points: [number, number][]) {
  return points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

export default function IsometricMegapack({
  interval,
  powerMaxMw,
  energyCapacityMwh,
}: Props) {
  const socFrac = Math.max(0, Math.min(1, interval.soc_frac));
  const isCharging = interval.charge_mw > 0.5;
  const isDischarging = interval.discharge_mw > 0.5;
  const idle = !isCharging && !isDischarging;

  const power = isCharging ? interval.charge_mw : interval.discharge_mw;
  const intensity = Math.min(1, power / powerMaxMw);

  const accent = isCharging ? "#38bdf8" : isDischarging ? "#f59e0b" : "#525252";
  const accentDim = isCharging
    ? "#0c4a6e"
    : isDischarging
      ? "#7c2d12"
      : "#1f1f1f";

  const fillH = H * socFrac;

  const v = {
    bfl: p(0, 0, 0),
    bfr: p(W, 0, 0),
    bbr: p(W, 0, D),
    bbl: p(0, 0, D),
    tfl: p(0, H, 0),
    tfr: p(W, H, 0),
    tbr: p(W, H, D),
    tbl: p(0, H, D),
    ffl: p(0, fillH, 0),
    ffr: p(W, fillH, 0),
    fbr: p(W, fillH, D),
  };

  const pts = Object.values(v);
  const xs = pts.map(([x]) => x);
  const ys = pts.map(([, y]) => y);
  const padX = 28;
  const padTop = 56;
  const padBottom = 32;
  const minX = Math.min(...xs) - padX;
  const minY = Math.min(...ys) - padTop;
  const maxX = Math.max(...xs) + padX;
  const maxY = Math.max(...ys) + padBottom;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
        className="w-full h-auto"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="topFace" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3f3f46" />
            <stop offset="1" stopColor="#27272a" />
          </linearGradient>
          <linearGradient id="rightFace" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1c1c1f" />
            <stop offset="1" stopColor="#0a0a0a" />
          </linearGradient>
          <linearGradient id="frontFace" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#27272a" />
            <stop offset="1" stopColor="#141416" />
          </linearGradient>
          <linearGradient id="frontFill" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={accent} stopOpacity="0.95" />
            <stop offset="1" stopColor={accent} stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="rightFill" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={accentDim} stopOpacity="0.95" />
            <stop offset="1" stopColor={accentDim} stopOpacity="0.4" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Floor glow when active */}
        {!idle && (
          <ellipse
            cx={(v.bfl[0] + v.bbr[0]) / 2 + 10}
            cy={Math.max(v.bfr[1], v.bbr[1]) + 10}
            rx={W * 0.55}
            ry={14}
            fill={accent}
            opacity={0.18 + 0.32 * intensity}
            filter="url(#glow)"
          />
        )}

        {/* Top face */}
        <polygon
          points={poly([v.tfl, v.tfr, v.tbr, v.tbl])}
          fill="url(#topFace)"
          stroke="#52525b"
          strokeWidth={1}
        />

        {/* Right face base */}
        <polygon
          points={poly([v.bfr, v.bbr, v.tbr, v.tfr])}
          fill="url(#rightFace)"
          stroke="#52525b"
          strokeWidth={1}
        />
        {socFrac > 0 && (
          <polygon
            points={poly([v.bfr, v.bbr, v.fbr, v.ffr])}
            fill="url(#rightFill)"
          />
        )}

        {/* Front face base */}
        <polygon
          points={poly([v.bfl, v.bfr, v.tfr, v.tfl])}
          fill="url(#frontFace)"
          stroke="#52525b"
          strokeWidth={1}
        />
        {socFrac > 0 && (
          <polygon
            points={poly([v.bfl, v.bfr, v.ffr, v.ffl])}
            fill="url(#frontFill)"
          />
        )}

        {/* Cabinet panel ribs (front face) */}
        {[0.2, 0.4, 0.6, 0.8].map((f) => {
          const a = p(W * f, 0, 0);
          const b = p(W * f, H, 0);
          return (
            <line
              key={`rib-front-${f}`}
              x1={a[0]}
              y1={a[1]}
              x2={b[0]}
              y2={b[1]}
              stroke="#0a0a0a"
              strokeWidth={1.5}
              opacity={0.7}
            />
          );
        })}
        {/* Cabinet panel ribs (right face) */}
        {[0.33, 0.66].map((f) => {
          const a = p(W, 0, D * f);
          const b = p(W, H, D * f);
          return (
            <line
              key={`rib-side-${f}`}
              x1={a[0]}
              y1={a[1]}
              x2={b[0]}
              y2={b[1]}
              stroke="#000"
              strokeWidth={1.2}
              opacity={0.6}
            />
          );
        })}

        {/* Top-face label */}
        <text
          x={(v.tfl[0] + v.tbr[0]) / 2 + 10}
          y={(v.tfl[1] + v.tbr[1]) / 2 - 3}
          fontSize={10}
          fontWeight={600}
          textAnchor="middle"
          fill="#71717a"
          fontFamily="ui-monospace, monospace"
          letterSpacing={2.5}
        >
          MEGAPACK 2XL
        </text>
        <text
          x={(v.tfl[0] + v.tbr[0]) / 2 + 10}
          y={(v.tfl[1] + v.tbr[1]) / 2 + 10}
          fontSize={9}
          textAnchor="middle"
          fill="#52525b"
          fontFamily="ui-monospace, monospace"
          letterSpacing={1}
        >
          {powerMaxMw.toFixed(0)} MW · {energyCapacityMwh.toFixed(0)} MWh
        </text>

        {/* Power flow arrow */}
        {!idle && (
          <PowerArrow
            x={(v.tfl[0] + v.tfr[0]) / 2}
            yAnchor={Math.min(v.tfl[1], v.tfr[1]) - 28}
            charging={isCharging}
            intensity={intensity}
            color={accent}
            powerMw={power}
          />
        )}
        {idle && (
          <text
            x={(v.tfl[0] + v.tfr[0]) / 2}
            y={Math.min(v.tfl[1], v.tfr[1]) - 18}
            fontSize={11}
            textAnchor="middle"
            fill="#71717a"
            fontFamily="ui-monospace, monospace"
            letterSpacing={2}
          >
            IDLE
          </text>
        )}

        {/* Charge-level callout, attached to front-face left edge */}
        <g>
          <line
            x1={v.bfl[0] - 8}
            y1={v.bfl[1] - fillH}
            x2={v.bfl[0] - 18}
            y2={v.bfl[1] - fillH}
            stroke={accent}
            strokeWidth={1}
          />
          <text
            x={v.bfl[0] - 22}
            y={v.bfl[1] - fillH + 4}
            fontSize={13}
            fill={accent}
            textAnchor="end"
            fontFamily="ui-monospace, monospace"
            fontWeight={600}
          >
            {(socFrac * 100).toFixed(0)}%
          </text>
          <text
            x={v.bfl[0] - 22}
            y={v.bfl[1] - fillH + 17}
            fontSize={9}
            fill="#737373"
            textAnchor="end"
            fontFamily="ui-monospace, monospace"
            letterSpacing={1}
          >
            CHARGE LEVEL
          </text>
        </g>
      </svg>
    </div>
  );
}

function PowerArrow({
  x,
  yAnchor,
  charging,
  intensity,
  color,
  powerMw,
}: {
  x: number;
  yAnchor: number;
  charging: boolean;
  intensity: number;
  color: string;
  powerMw: number;
}) {
  const len = 28 + 24 * intensity;
  const stroke = 3 + 5 * intensity;
  const y1 = charging ? yAnchor - len : yAnchor + len;
  const y2 = yAnchor;
  const tipY = charging ? yAnchor + 4 : yAnchor - 4;
  const tipBase = charging ? yAnchor - 4 : yAnchor + 4;
  return (
    <g>
      <line
        x1={x}
        y1={y1}
        x2={x}
        y2={y2}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        opacity={0.9}
      />
      <polygon
        points={`${x - 7},${tipBase} ${x + 7},${tipBase} ${x},${tipY}`}
        fill={color}
      />
      <text
        x={x + 14}
        y={(y1 + y2) / 2 + 4}
        fontSize={10}
        fontFamily="ui-monospace, monospace"
        fill={color}
        opacity={0.95}
        letterSpacing={1.5}
      >
        {charging ? "BUYING" : "SELLING"} · {powerMw.toFixed(0)} MW
      </text>
    </g>
  );
}
