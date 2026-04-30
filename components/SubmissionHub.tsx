"use client";

import { useState, useTransition } from "react";

import { createPlatformSubmission, type SubmissionCreateResponse } from "@/lib/platform-api";
import {
  SUBMISSIONS,
  getPlatformOverview,
  getStageColor,
  getStageLabel,
  getSubmissionForSite,
  getTokenForSite,
  type AthensSite,
} from "@/lib/platform-data";

type Props = {
  site: AthensSite;
};

type LocalSubmissionRow = {
  submission_id: string;
  business_name: string;
  district: string;
  total_kwh: number;
  submitted_at: string;
  stage: "submitted" | "verified" | "minted";
};

const LIFECYCLE = [
  { key: "submitted", title: "1. Submit", text: "Enter the business and meter batch." },
  { key: "verified", title: "2. Verify", text: "We check site, meter, and interval integrity." },
  { key: "minted", title: "3. Mint", text: "A receipt token can be issued after verification." },
  { key: "admitted", title: "4. Model", text: "Admitted data can feed the downstream layer." },
] as const;

export default function SubmissionHub({ site }: Props) {
  const overview = getPlatformOverview();
  const siteSubmission = getSubmissionForSite(site.site_id);
  const siteToken = getTokenForSite(site.site_id);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SubmissionCreateResponse | null>(null);
  const [localRows, setLocalRows] = useState<LocalSubmissionRow[]>([]);
  const [form, setForm] = useState(() => buildInitialForm(site));

  const generatedKwh = Number(form.daily_kwh) || 0;
  const generatedBatch = buildUsageBatch(form.reading_date, generatedKwh);

  const recent = [
    ...localRows,
    ...(siteSubmission
      ? [
          {
            submission_id: siteSubmission.submission_id,
            business_name: siteSubmission.business_name,
            district: siteSubmission.district,
            total_kwh: siteSubmission.total_kwh,
            submitted_at: siteSubmission.submitted_at,
            stage:
              siteSubmission.onchain_status === "minted"
                ? "minted"
                : siteSubmission.verification_status === "verified"
                  ? "verified"
                  : "submitted",
          } satisfies LocalSubmissionRow,
        ]
      : []),
    ...SUBMISSIONS.filter((submission) => submission.submission_id !== siteSubmission?.submission_id).map(
      (submission) =>
        ({
          submission_id: submission.submission_id,
          business_name: submission.business_name,
          district: submission.district,
          total_kwh: submission.total_kwh,
          submitted_at: submission.submitted_at,
          stage:
            submission.onchain_status === "minted"
              ? "minted"
              : submission.verification_status === "verified"
                ? "verified"
                : "submitted",
        }) satisfies LocalSubmissionRow,
    ),
  ]
    .filter((row, index, rows) => rows.findIndex((entry) => entry.submission_id === row.submission_id) === index)
    .slice(0, 6);

  function updateField<K extends keyof ReturnType<typeof buildInitialForm>>(key: K, value: ReturnType<typeof buildInitialForm>[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const lat = Number(form.lat);
    const lon = Number(form.lon);
    const dailyKwh = Number(form.daily_kwh);

    if (!form.business_name || !form.site_name || !form.sector || !form.meter_id || !form.district) {
      setError("Fill in the business, site, sector, meter, and district fields.");
      return;
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      setError("Latitude and longitude must be valid numbers.");
      return;
    }
    if (!Number.isFinite(dailyKwh) || dailyKwh <= 0) {
      setError("Daily kWh must be a positive number.");
      return;
    }

    const payload = {
      business_name: form.business_name,
      site_name: form.site_name,
      sector: form.sector,
      meter_id: form.meter_id,
      location: {
        country: "GR",
        region: "Attica",
        city: "Athens",
        district: form.district,
        lat,
        lon,
      },
      usage_batch: generatedBatch,
      receipt_hash: form.receipt_hash || undefined,
    };

    startTransition(async () => {
      try {
        const created = await createPlatformSubmission(payload);
        setSuccess(created);
        setLocalRows((rows) => [
          {
            submission_id: created.submission_id,
            business_name: form.business_name,
            district: form.district,
            total_kwh: dailyKwh,
            submitted_at: created.submitted_at,
            stage:
              created.onchain_status === "minted"
                ? "minted"
                : created.verification_status === "verified"
                  ? "verified"
                  : "submitted",
          },
          ...rows,
        ]);
      } catch (submissionError) {
        setError(submissionError instanceof Error ? submissionError.message : "Submission failed.");
      }
    });
  }

  return (
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.08fr_0.92fr]">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Contributor flow</div>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-100">Submit energy data</h2>
            <div className="mt-1 text-sm text-neutral-400">Use the selected node as a starting point, then submit the batch.</div>
          </div>
          <span
            className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]"
            style={{
              color: getStageColor(site.stage),
              background: `${getStageColor(site.stage)}18`,
              border: `1px solid ${getStageColor(site.stage)}40`,
            }}
          >
            {getStageLabel(site.stage)}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {LIFECYCLE.map((step) => (
            <div key={step.key} className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
              <div
                className="inline-flex rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]"
                style={{
                  color: getStageColor(step.key),
                  background: `${getStageColor(step.key)}18`,
                }}
              >
                {step.title}
              </div>
              <div className="mt-2 text-[12px] text-neutral-400">{step.text}</div>
            </div>
          ))}
        </div>

        <form className="mt-5 flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Business name">
              <input
                value={form.business_name}
                onChange={(event) => updateField("business_name", event.target.value)}
                className={inputClassName}
                placeholder="Kolonaki Coffee House"
              />
            </Field>
            <Field label="Site name">
              <input
                value={form.site_name}
                onChange={(event) => updateField("site_name", event.target.value)}
                className={inputClassName}
                placeholder="Main storefront"
              />
            </Field>
            <Field label="Sector">
              <input
                value={form.sector}
                onChange={(event) => updateField("sector", event.target.value)}
                className={inputClassName}
                placeholder="Cafe"
              />
            </Field>
            <Field label="Meter id">
              <input
                value={form.meter_id}
                onChange={(event) => updateField("meter_id", event.target.value)}
                className={inputClassName}
                placeholder="GR-ATH-001"
              />
            </Field>
            <Field label="District">
              <input
                value={form.district}
                onChange={(event) => updateField("district", event.target.value)}
                className={inputClassName}
                placeholder="Kolonaki"
              />
            </Field>
            <Field label="Receipt hash">
              <input
                value={form.receipt_hash}
                onChange={(event) => updateField("receipt_hash", event.target.value)}
                className={inputClassName}
                placeholder="optional hash"
              />
            </Field>
            <Field label="Latitude">
              <input
                value={form.lat}
                onChange={(event) => updateField("lat", event.target.value)}
                className={inputClassName}
                placeholder="37.98"
              />
            </Field>
            <Field label="Longitude">
              <input
                value={form.lon}
                onChange={(event) => updateField("lon", event.target.value)}
                className={inputClassName}
                placeholder="23.73"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-[0.8fr_0.8fr_1.4fr]">
            <Field label="Reading date">
              <input
                type="date"
                value={form.reading_date}
                onChange={(event) => updateField("reading_date", event.target.value)}
                className={inputClassName}
              />
            </Field>
            <Field label="Daily kWh">
              <input
                value={form.daily_kwh}
                onChange={(event) => updateField("daily_kwh", event.target.value)}
                className={inputClassName}
                placeholder="620"
              />
            </Field>
            <div className="rounded-xl border border-neutral-800 bg-black/30 p-4">
              <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">Generated batch</div>
              <div className="mt-2 text-sm text-neutral-200">96 intervals from one daily total</div>
              <div className="mt-3 text-[12px] text-neutral-500">
                First interval · {generatedBatch[0]?.start_at ?? "n/a"} · {generatedBatch[0]?.kwh.toFixed(2) ?? "0.00"} kWh
              </div>
            </div>
          </div>

          {error && <div className="rounded-xl border border-red-900/70 bg-red-950/30 px-4 py-3 text-sm text-red-200">{error}</div>}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition-opacity disabled:opacity-60"
            >
              {isPending ? "Submitting..." : "Submit contribution"}
            </button>
            <div className="text-[12px] text-neutral-500">This posts to the existing `/platform/submissions` API.</div>
          </div>
        </form>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Submission result</div>
              <h3 className="mt-1 text-base font-semibold tracking-tight text-neutral-100">Proof packet</h3>
            </div>
            <div className="text-[11px] font-mono text-neutral-500">{overview.businesses} sites tracked</div>
          </div>

          {success ? (
            <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-1">
              <ProofTile label="Submission id" value={success.submission_id} />
              <ProofTile label="Canonical hash" value={success.canonical_hash} />
              <ProofTile label="Proof hash" value={success.proof_hash} />
              <ProofTile label="Verification" value={success.verification_status} />
              <ProofTile label="On-chain" value={success.onchain_status} />
              <ProofTile label="Receipt token" value={success.token_id ?? "not minted"} />
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-neutral-800 bg-black/30 p-4 text-sm text-neutral-400">
              Submit a contribution to generate the proof packet here.
            </div>
          )}

          <div className="mt-5 rounded-xl border border-neutral-800 bg-black/30 p-4 text-[12px] text-neutral-500">
            Current selected node proof · {siteSubmission?.proof_hash ?? site.proof_hash}
            <br />
            Current selected node token · {siteToken?.token_id ?? "not minted"}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Recent contributions</div>
              <h3 className="mt-1 text-base font-semibold tracking-tight text-neutral-100">Network activity</h3>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                  <th className="pb-3 pr-4 font-medium">Business</th>
                  <th className="pb-3 pr-4 font-medium">District</th>
                  <th className="pb-3 pr-4 font-medium">kWh</th>
                  <th className="pb-3 pr-4 font-medium">Stage</th>
                  <th className="pb-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((submission) => (
                  <tr key={submission.submission_id}>
                    <td className="rounded-l-xl py-3 pr-4 text-sm text-neutral-100">{submission.business_name}</td>
                    <td className="py-3 pr-4 text-sm text-neutral-400">{submission.district}</td>
                    <td className="py-3 pr-4 font-mono tabular-nums text-sm text-neutral-300">
                      {submission.total_kwh.toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className="inline-flex rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]"
                        style={{
                          color: getStageColor(submission.stage),
                          background: `${getStageColor(submission.stage)}18`,
                          border: `1px solid ${getStageColor(submission.stage)}40`,
                        }}
                      >
                        {getStageLabel(submission.stage)}
                      </span>
                    </td>
                    <td className="rounded-r-xl py-3 font-mono text-[12px] text-neutral-500">
                      {submission.submitted_at.slice(11, 16)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function buildInitialForm(site: AthensSite) {
  return {
    business_name: site.business_name,
    site_name: site.site_name,
    sector: site.sector,
    meter_id: site.meter_id,
    district: site.district,
    lat: site.lat.toFixed(4),
    lon: site.lon.toFixed(4),
    receipt_hash: "",
    reading_date: "2026-04-29",
    daily_kwh: String(Math.max(40, Math.round(site.annual_mwh * 1000 / 365))),
  };
}

function buildUsageBatch(readingDate: string, dailyKwh: number) {
  const perInterval = dailyKwh / 96;
  return Array.from({ length: 96 }, (_, index) => {
    const start = new Date(`${readingDate}T00:00:00+03:00`);
    start.setMinutes(start.getMinutes() + index * 15);
    const end = new Date(start.getTime() + 15 * 60 * 1000);
    return {
      start_at: isoWithAthensOffset(start),
      end_at: isoWithAthensOffset(end),
      kwh: Number(perInterval.toFixed(3)),
    };
  });
}

function isoWithAthensOffset(value: Date) {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  const hours = `${value.getHours()}`.padStart(2, "0");
  const minutes = `${value.getMinutes()}`.padStart(2, "0");
  const seconds = `${value.getSeconds()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+03:00`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">{label}</span>
      {children}
    </label>
  );
}

function ProofTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">{label}</div>
      <div className="mt-2 break-all font-mono text-[12px] text-neutral-200">{value}</div>
    </div>
  );
}

const inputClassName =
  "rounded-xl border border-neutral-800 bg-black/30 px-3 py-2.5 text-sm text-neutral-100 outline-none transition-colors focus:border-neutral-600";
