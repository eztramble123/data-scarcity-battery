"use client";

import { useMemo, useState } from "react";

import AthensMapView from "@/components/AthensMapView";
import DecisionPanel from "@/components/DecisionPanel";
import EdgeBar from "@/components/EdgeBar";
import IsometricMegapack from "@/components/IsometricMegapack";
import PlatformFlowView from "@/components/PlatformFlowView";
import PriceActionChart from "@/components/PriceActionChart";
import ScenarioPicker from "@/components/ScenarioPicker";
import SmartVsNaive from "@/components/SmartVsNaive";
import SubmissionHub from "@/components/SubmissionHub";
import TimeScrubber from "@/components/TimeScrubber";
import { getScenario, listScenarios, type Scenario } from "@/lib/api";
import { naiveSchedule } from "@/lib/baseline";
import { deriveDecision } from "@/lib/decisions";
import { interpolateInterval } from "@/lib/interpolate";
import { getPlatformOverview, getSiteById, getSubmissionForSite, getTokenForSite } from "@/lib/platform-data";

const DEFAULT_SCENARIO = "curtailment";
const DEFAULT_SITE = "ath-001";

export default function Home() {
  const scenarios = useMemo(() => listScenarios(), []);
  const [scenarioName, setScenarioName] = useState<string>(DEFAULT_SCENARIO);
  const [selectedSiteId, setSelectedSiteId] = useState<string>(DEFAULT_SITE);
  const [tFloat, setTFloat] = useState(48);
  const [playing, setPlaying] = useState(false);

  const scenario: Scenario = useMemo(() => getScenario(scenarioName), [scenarioName]);
  const interval = useMemo(() => interpolateInterval(scenario.intervals, tFloat), [scenario, tFloat]);
  const tInt = Math.floor(tFloat);
  const naive = useMemo(() => naiveSchedule(scenario), [scenario]);
  const decision = useMemo(() => deriveDecision(scenario, tInt, naive.intervals), [scenario, tInt, naive]);
  const platform = useMemo(() => getPlatformOverview(), []);
  const site = useMemo(() => getSiteById(selectedSiteId), [selectedSiteId]);
  const submission = useMemo(() => getSubmissionForSite(selectedSiteId), [selectedSiteId]);
  const token = useMemo(() => getTokenForSite(selectedSiteId), [selectedSiteId]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />

      <main className="mx-auto flex w-full max-w-[1480px] flex-1 flex-col gap-6 px-4 pb-10 pt-5 md:px-8 lg:px-10">
        <section className="rounded-[28px] border border-neutral-800/80 bg-[linear-gradient(145deg,#060606_0%,#101418_48%,#14181c_100%)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] md:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <div className="text-[11px] uppercase tracking-[0.2em] text-amber-300/90">BlockBattery</div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-100 md:text-[2.8rem] md:leading-[1.02]">
                Athens demand sites first. Battery intelligence second.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-500 md:text-base">
                The map is the network. Pick a site, inspect its proof state, then follow how admitted data changes the downstream battery model.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:w-[760px]">
              <HeroMetric label="businesses" value={String(platform.businesses)} color="#38bdf8" />
              <HeroMetric
                label="verified+"
                value={String(platform.verified + platform.minted + platform.admitted)}
                color="#f59e0b"
              />
              <HeroMetric label="minted" value={String(platform.minted + platform.admitted)} color="#a855f7" />
              <HeroMetric label="admitted" value={String(platform.admitted)} color="#84cc16" />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_0.72fr] xl:items-start">
          <AthensMapView selectedSiteId={selectedSiteId} onSelectSite={setSelectedSiteId} />
          <SiteCommandCard
            site={site}
            submission={submission}
            tokenId={token?.token_id ?? null}
          />
        </section>

        <SubmissionHub key={site.site_id} site={site} />

        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-950 p-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Tech dashboard</div>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-100">
                Downstream battery model for {site.business_name}
              </h2>
              <div className="mt-2 text-sm text-neutral-400">
                Scenario output stays model-generated. Upstream demand context comes from the selected site.
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-neutral-800 bg-black/30 px-4 py-3 text-sm text-neutral-300">
                {site.admitted_to_optimizer ? "site is feeding optimization" : "site is not admitted yet"}
              </div>
              <ScenarioPicker
                scenarios={scenarios}
                selected={scenarioName}
                onSelect={(name) => {
                  setScenarioName(name);
                  setTFloat(48);
                  setPlaying(false);
                }}
              />
            </div>
          </div>

          <PlatformFlowView scenario={scenario} site={site} />
          <EdgeBar scenario={scenario} />

          <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">{scenario.label}</div>
                  <h3 className="mt-1 max-w-2xl text-sm text-neutral-300">{scenario.description}</h3>
                </div>
              </div>
              <PriceActionChart scenario={scenario} cursorTFloat={tFloat} />
            </div>

            <div className="flex flex-col rounded-xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 p-5">
              <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-neutral-500">Battery layer</div>
              <IsometricMegapack
                interval={interval}
                powerMaxMw={scenario.battery.power_max_mw}
                energyCapacityMwh={scenario.battery.energy_capacity_mwh}
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <BatteryStat
                  label="charge level"
                  value={`${(interval.soc_frac * 100).toFixed(0)}%`}
                  sub={`${interval.soc_mwh.toFixed(0)} MWh stored`}
                  color="#22d3ee"
                />
                <BatteryStat
                  label="power flow"
                  value={
                    Math.abs(interval.net_dispatch_mw) < 0.5
                      ? "0 MW"
                      : interval.net_dispatch_mw > 0
                        ? `${interval.net_dispatch_mw.toFixed(0)} MW`
                        : `${Math.abs(interval.net_dispatch_mw).toFixed(0)} MW`
                  }
                  sub={
                    interval.net_dispatch_mw > 0.5
                      ? "selling to grid"
                      : interval.net_dispatch_mw < -0.5
                        ? "buying from grid"
                        : "idle"
                  }
                  color={
                    interval.net_dispatch_mw > 0.5
                      ? "#f59e0b"
                      : interval.net_dispatch_mw < -0.5
                        ? "#38bdf8"
                        : "#737373"
                  }
                />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 px-5 py-4">
              <TimeScrubber
                tFloat={tFloat}
                setTFloat={setTFloat}
                intervalsCount={scenario.intervals.length}
                hour={interval.hour}
                playing={playing}
                setPlaying={setPlaying}
              />
            </div>
            <DecisionPanel decision={decision} />
          </section>

          <SmartVsNaive scenario={scenario} cursorTFloat={tFloat} />
        </section>

        <footer className="mt-2 max-w-4xl text-[11px] text-neutral-600">
          Athens map drives the page state. Submission and tech panels follow the selected site. Battery output remains model-generated downstream of admitted demand data.
        </footer>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-900 bg-[rgba(7,7,7,0.88)] backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-[1480px] items-center justify-between gap-4 px-4 md:px-8 lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-neutral-800 bg-[radial-gradient(circle_at_35%_35%,rgba(245,158,11,0.45),transparent_42%),linear-gradient(145deg,#171717,#090909)] shadow-[0_8px_20px_rgba(0,0,0,0.28)]" />
          <div>
            <div className="text-base font-semibold leading-none tracking-tight text-neutral-100">BlockBattery</div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-neutral-500">data collection layer · modeling layer</div>
          </div>
        </div>
        <div className="shrink-0 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-neutral-400">
          Athens pilot
        </div>
      </div>
    </header>
  );
}

function SiteCommandCard({
  site,
  submission,
  tokenId,
}: {
  site: ReturnType<typeof getSiteById>;
  submission: ReturnType<typeof getSubmissionForSite>;
  tokenId: string | null;
}) {
  return (
    <aside className="rounded-[28px] border border-neutral-800/80 bg-[linear-gradient(180deg,#131313,#0b0b0b)] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Selected site</div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-100">{site.site_name}</h2>
          <div className="mt-1 text-sm text-neutral-400">
            {site.business_name} · {site.district}
          </div>
        </div>
        <StagePill stage={site.stage} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <SiteMetric label="sector" value={site.sector} />
        <SiteMetric label="meter" value={site.meter_id} />
        <SiteMetric label="annual demand" value={`${site.annual_mwh.toLocaleString()} MWh`} />
        <SiteMetric label="optimizer" value={site.admitted_to_optimizer ? "admitted" : "not admitted"} />
      </div>

      <div className="mt-5 rounded-xl border border-neutral-800/80 bg-[#101010] p-4">
        <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">Proof state</div>
        <div className="mt-3 flex flex-col gap-3 text-[12px]">
          <DetailRow label="submission" value={site.latest_submission_id} />
          <DetailRow label="canonical hash" value={submission?.canonical_hash ?? "pending"} />
          <DetailRow label="proof hash" value={site.proof_hash} />
          <DetailRow label="receipt token" value={tokenId ?? "not minted"} />
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-neutral-800/80 bg-[#0d0d0d] p-4 text-sm text-neutral-500">
        {site.admitted_to_optimizer
          ? "This site is already shaping the downstream battery layer."
          : "This site is visible on the network but is not yet shaping the battery layer."}
      </div>
    </aside>
  );
}

function BatteryStat({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-black/30 p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">{label}</div>
      <div className="mt-1 text-2xl font-mono font-semibold tabular-nums" style={{ color }}>
        {value}
      </div>
      <div className="mt-1 text-[11px] text-neutral-500">{sub}</div>
    </div>
  );
}

function HeroMetric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-neutral-800/80 bg-[#121212] p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">{label}</div>
      <div className="mt-1 text-3xl font-mono font-semibold tabular-nums" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function SiteMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-black/30 p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">{label}</div>
      <div className="mt-1 text-sm text-neutral-200">{value}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="text-neutral-500">{label}</div>
      <div className="max-w-[62%] break-all text-right font-mono text-neutral-200">{value}</div>
    </div>
  );
}

function StagePill({ stage }: { stage: "submitted" | "verified" | "minted" | "admitted" }) {
  const colors = {
    submitted: "text-amber-300 bg-amber-950/30 border-amber-900/70",
    verified: "text-sky-300 bg-sky-950/30 border-sky-900/70",
    minted: "text-violet-300 bg-violet-950/30 border-violet-900/70",
    admitted: "text-lime-300 bg-lime-950/30 border-lime-900/70",
  } as const;

  const labels = {
    submitted: "submitted",
    verified: "verified off-chain",
    minted: "minted on-chain",
    admitted: "admitted to model",
  } as const;

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] ${colors[stage]}`}>
      {labels[stage]}
    </span>
  );
}
