"use client";

/* eslint-disable @next/next/no-img-element */

import { ATHENS_SITES, type AthensSite, getPlatformOverview, getStageColor, getStageLabel } from "@/lib/platform-data";

const ATHENS_FRAME = { latMin: 37.87, latMax: 38.1, lonMin: 23.62, lonMax: 23.85 };
const KEY_POINTS = [
  { label: "Syntagma", lat: 37.9755, lon: 23.7348 },
  { label: "Piraeus", lat: 37.942, lon: 23.6465 },
  { label: "Marousi", lat: 38.0469, lon: 23.802 },
  { label: "Kifisia", lat: 38.0738, lon: 23.8082 },
  { label: "Elliniko", lat: 37.8888, lon: 23.7349 },
] as const;

type Props = {
  selectedSiteId: string;
  onSelectSite: (siteId: string) => void;
};

export default function AthensMapView({ selectedSiteId, onSelectSite }: Props) {
  const overview = getPlatformOverview();
  const selectedSite = ATHENS_SITES.find((site) => site.site_id === selectedSiteId) ?? ATHENS_SITES[0];

  return (
    <section className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-4 md:p-5">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <MiniCount label="businesses" value={overview.businesses} color="#38bdf8" />
        <MiniCount label="verified+" value={overview.verified + overview.minted + overview.admitted} color="#f59e0b" />
        <MiniCount label="minted" value={overview.minted + overview.admitted} color="#a855f7" />
        <MiniCount label="admitted" value={overview.admitted} color="#84cc16" />
      </div>

      <div className="mt-4 rounded-[24px] border border-neutral-900 bg-[#0a0a0a] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
        <div className="overflow-hidden rounded-[20px] border border-neutral-900">
          <div className="relative h-[420px] bg-neutral-950 md:h-[520px] xl:h-[640px]">
            <img
              src="/image.png"
              alt="Athens reference underlay"
              className="absolute inset-0 h-full w-full scale-[1.03] object-cover opacity-24 grayscale contrast-125 saturate-0 blur-[1.5px]"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.16),transparent_24%),radial-gradient(circle_at_82%_74%,rgba(168,85,247,0.14),transparent_22%),linear-gradient(180deg,rgba(4,8,15,0.24),rgba(4,8,15,0.72))]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.1] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:72px_72px]" />
            <div className="pointer-events-none absolute inset-[14px] rounded-[18px] border border-neutral-900/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]" />

            {KEY_POINTS.map((point) => {
              const projected = project(point);
              return (
                <div
                  key={point.label}
                  className="pointer-events-none absolute"
                  style={{ left: `${projected.left}%`, top: `${projected.top}%` }}
                >
                  <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-800 bg-black/72 px-2 py-1 text-[10px] font-semibold text-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-sm">
                    {point.label}
                  </div>
                </div>
              );
            })}

            {ATHENS_SITES.map((site) => {
              const point = project(site);
              const selected = site.site_id === selectedSiteId;
              const color = getStageColor(site.stage);

              return (
                <button
                  key={site.site_id}
                  type="button"
                  onClick={() => onSelectSite(site.site_id)}
                  className="absolute z-10 transition-transform hover:scale-105"
                  style={{ left: `${point.left}%`, top: `${point.top}%` }}
                  aria-label={site.site_name}
                >
                  <span className="relative block -translate-x-1/2 -translate-y-1/2">
                    {selected && (
                      <span
                        className="map-marker-pulse absolute rounded-full"
                        style={{
                          inset: "-18px",
                          background: `${color}28`,
                        }}
                      />
                    )}
                    <span
                      className="absolute rounded-full"
                      style={{
                        inset: selected ? "-7px" : "-5px",
                        background: `${color}20`,
                      }}
                    />
                    <span
                      className="block rounded-full border-[3px]"
                      style={{
                        width: selected ? 22 : 18,
                        height: selected ? 22 : 18,
                        background: color,
                        borderColor: "#0a0a0a",
                        boxShadow: `0 0 0 ${selected ? 6 : 4}px ${color}22`,
                      }}
                    />
                    {selected && (
                      <span className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-neutral-800 bg-[#090909]/88 px-2 py-1 text-[11px] text-neutral-100 shadow-lg backdrop-blur-sm">
                        {site.sector} node
                      </span>
                    )}
                  </span>
                </button>
              );
            })}

            <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-neutral-800 bg-[#080808]/86 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-neutral-300 backdrop-blur-sm">
              potential business nodes
            </div>
            <div className="pointer-events-none absolute right-4 top-4 rounded-2xl border border-neutral-800 bg-[#080808]/86 px-4 py-3 text-right backdrop-blur-sm">
              <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">selected node</div>
              <div className="mt-1 text-sm font-semibold text-neutral-100">{selectedSite.sector}</div>
              <div className="mt-1 text-[12px] text-neutral-400">{selectedSite.district}</div>
            </div>
            <div className="pointer-events-none absolute bottom-4 left-4 rounded-2xl border border-neutral-800 bg-[#080808]/86 px-4 py-3 backdrop-blur-sm">
              <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">stage</div>
              <div className="mt-1 inline-flex items-center gap-2 text-sm text-neutral-100">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: getStageColor(selectedSite.stage) }} />
                {getStageLabel(selectedSite.stage)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-900 bg-[#080808] px-3 py-3">
            <div className="flex flex-wrap gap-2">
              {(["submitted", "verified", "minted", "admitted"] as const).map((stage) => (
                <div
                  key={stage}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-black/32 px-3 py-1.5 text-[11px] text-neutral-300"
                >
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: getStageColor(stage) }} />
                  {getStageLabel(stage)}
                </div>
              ))}
            </div>
            <div className="text-[11px] text-neutral-500">illustrative node map</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function project(site: Pick<AthensSite, "lat" | "lon"> | { lat: number; lon: number }) {
  const xRatio = (site.lon - ATHENS_FRAME.lonMin) / (ATHENS_FRAME.lonMax - ATHENS_FRAME.lonMin);
  const yRatio = 1 - (site.lat - ATHENS_FRAME.latMin) / (ATHENS_FRAME.latMax - ATHENS_FRAME.latMin);
  return {
    left: 8 + xRatio * 84,
    top: 10 + yRatio * 80,
  };
}

function MiniCount({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-black/30 p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">{label}</div>
      <div className="mt-1 text-2xl font-mono font-semibold tabular-nums" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
