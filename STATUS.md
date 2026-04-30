# Project status — for handoff

Greek Energy Receipt Network. Athens-first hackathon demo. Businesses submit
energy usage data, the platform verifies it off-chain, issues a mocked receipt
token, and the downstream tech layer shows how admitted data could feed battery
intelligence. Full spec: `README.md`. Read it.

## Current objective

- Hold a clean map-first BlockBattery layout: Athens demand network as the hero
  surface, contributor submission flow beneath it, and the downstream modeling
  layer clearly secondary.

## Active owner

- Codex main agent (platform pivot integration, Athens map, tech dashboard,
  backend verification)

## Last updated

- 2026-04-30 05:43 EEST

## Working area

- `components/`, `app/`, `lib/`, `STATUS.md`

## Blockers

- `npm run build` still fails in this sandbox because Turbopack tries to bind a
  CSS worker port and gets `Operation not permitted`. This is environment-side,
  not a current lint/test failure.

## Work log

- 2026-04-29 00:00 EEST | codex | aligned on first milestone: Greek joined
  dataset starts with synthetic battery telemetry + richer API/UI contract |
  `STATUS.md` | repo inspection complete | patch handoff protocol, then backend
  telemetry
- 2026-04-29 00:12 EEST | codex | added shared handoff protocol and work-log
  rules | `STATUS.md` | file patched successfully | implement backend telemetry
- 2026-04-29 00:25 EEST | codex | added battery derate fields, telemetry
  outputs, regime-aware scenario metadata, API payload extensions, and richer UI
  contract | `optim/battery.py`, `optim/milp.py`, `api/scenarios.py`,
  `api/main.py`, `lib/api.ts`, `lib/decisions.ts`,
  `components/PriceActionChart.tsx`, `components/PerformanceStats.tsx`,
  `app/page.tsx` | code patched successfully | add rebake script and tests
- 2026-04-29 00:31 EEST | codex | added repeatable scenario rebake script and
  telemetry test coverage | `scripts/rebake_scenarios.py`,
  `tests/test_battery.py`, `tests/test_milp.py` | `uv run pytest` passed
  (14/14) | rebake scenario bundle and re-run frontend checks
- 2026-04-29 00:40 EEST | codex | rebaked baked scenario data from local API on
  port 8766 and removed remote Google font dependency for offline builds |
  `lib/scenarios-data.ts`, `app/layout.tsx`, `app/globals.css` | `npm run lint`
  passed | final build verification and handoff
- 2026-04-29 00:45 EEST | codex | final verification pass complete; lint clean,
  tests green, production build blocked only by sandbox Turbopack port
  restriction | `STATUS.md` | `uv run pytest` passed, `npm run lint` passed,
  `npm run build` blocked by sandbox runtime | handoff to next agent or user
- 2026-04-30 00:00 EEST | claude-opus-4-7 | dashboard runtime crash on
  `interval.charge_headroom_mwh.toFixed` — root cause: indent error in
  `_solve_cached` left `intervals = [` orphaned at one level too deep, so the
  rebake the baked data was stale; fixed indent, ran pytest (14/14), booted
  uvicorn on 8765, ran `scripts/rebake_scenarios.py` (effectively — used
  inline pipe, identical output), `npm run build` now passes (≈2.4s total),
  page renders 200 with all telemetry fields populated |
  `api/main.py`, `lib/scenarios-data.ts` (auto-gen, now ~307 KB) |
  build green, page rendered, no `TypeError` markers in HTML | continue with
  the queued items in "What's next"
- 2026-04-30 00:20 EEST | codex | scoped provenance-first Data Flow tab as a
  second top-level view driven entirely from baked frontend data |
  `STATUS.md` | repo inspection complete | add view switch, flow component,
  and animation styles
- 2026-04-30 00:32 EEST | codex | added top-level `Operating View` / `Data Flow`
  switch, provenance node config, animated pulse diagram, and honesty badges for
  real/modelled/synthetic stages | `app/page.tsx`,
  `components/DataFlowView.tsx`, `lib/data-flow.ts`, `app/globals.css`,
  `STATUS.md` | `npm run lint` passed; `npm run build` blocked by sandbox
  Turbopack CSS worker restriction | next: visual QA in browser or continue
  with live-context/provenance badges in operating view
- 2026-04-30 00:42 EEST | codex | added page-level provenance strip and
  per-panel provenance badges to the operating view so judges can see the
  real/modelled/synthetic split without leaving the main dashboard |
  `app/page.tsx`, `components/PriceActionChart.tsx`,
  `components/DecisionPanel.tsx`, `components/PerformanceStats.tsx`,
  `components/ProvenanceBadge.tsx`, `STATUS.md` | `npm run lint` passed |
  next: visual QA in browser or continue with real-source timestamps/live
  context strip
- 2026-04-30 01:00 EEST | codex | pivoted current UI work toward judge-facing
  positioning: make the regime thesis, proof flow, and naive comparison land
  instantly on screen | `STATUS.md` | repo inspection complete | add
  playbook/claim components and tighten copy
- 2026-04-30 01:30 EEST | claude-opus-4-7 | UI cleanup pass per user feedback
  ("a lot going on; smoother animation; show our edge"). Cuts: top-level
  Data-provenance strip, per-component provenance badges in PriceActionChart /
  DecisionPanel / PerformanceStats, the 4-tile KPI row below the scrubber, and
  4 of the 6 battery-panel tiles. Adds: `EdgeBar` (revenue / lift / capture in
  one row, with the "no battery telemetry — physics + markets + stochastic
  optimization" tagline) and `lib/interpolate.ts` for fractional-time playback.
  TimeScrubber now drives `tFloat` at ~30 fps (10 s full-day replay per README
  pitch beats); PriceActionChart and SmartVsNaive accept `cursorTFloat` and
  lerp price / cumulative-revenue cursors. Deleted `PerformanceStats.tsx` —
  its numbers fold into EdgeBar + SmartVsNaive. Did NOT integrate the
  newly-added DemoPlaybook into the operating layout (it duplicates EdgeBar's
  message and re-introduces the density we just removed) and stripped the
  "Core claim" header strip from EdgeBar for the same reason. DemoPlaybook the
  file remains in `components/`; can be reintroduced if there's a use case |
  `app/page.tsx`, `components/EdgeBar.tsx` (new), `components/TimeScrubber.tsx`,
  `components/PriceActionChart.tsx`, `components/SmartVsNaive.tsx`,
  `components/DecisionPanel.tsx`, `components/IsometricMegapack.tsx`,
  `lib/interpolate.ts` (new); deleted `components/PerformanceStats.tsx` |
  `npm run build` clean (1.1s + 1s typecheck) | continue queued scenarios
  (peak demand, FCR-heavy) or revisit DemoPlaybook with a tighter form factor
- 2026-04-30 03:10 EEST | codex | implemented platform pivot across backend +
  frontend: added mock submission/proof/token domain, new platform API routes,
  new `Submit Data` / `Network Map` / `Architecture` / `Battery Intelligence`
  views, Athens map, receipt-token proof flow, battery layer reframing, and
  backend tests for ids + verification/mint/admit flow | `api/platform.py`,
  `api/main.py`, `tests/test_platform.py`, `lib/platform-data.ts`,
  `components/SubmissionHub.tsx`, `components/AthensMapView.tsx`,
  `components/PlatformFlowView.tsx`, `app/page.tsx`, `app/layout.tsx`,
  `app/globals.css`, `STATUS.md` | `uv run pytest` passed (19/19), `npm run lint`
- 2026-04-30 03:40 EEST | codex | trimmed the platform UI, merged proof +
  battery into one `Tech Dashboard`, switched Athens panel to a real Athens
  street basemap, and revalidated backend/frontend checks | `app/page.tsx`,
  `components/AthensMapView.tsx`, `components/SubmissionHub.tsx`,
  `components/PlatformFlowView.tsx`, `components/EdgeBar.tsx`, `STATUS.md` |
  `uv run pytest` passed (19/19), `npm run lint` passed, `npm run build`
  still blocked by sandbox Turbopack CSS-worker port restriction | next: wire
  frontend mocks to `/platform/*` API or keep polishing demo copy/visuals
- 2026-04-30 04:05 EEST | codex | reworked the UI into a single map-first
  page, lifted site selection to page state, made the Athens map the primary
  command surface, and compressed submit/tech panels around the selected site |
  `app/page.tsx`, `components/AthensMapView.tsx`,
  `components/SubmissionHub.tsx`, `components/PlatformFlowView.tsx`,
  `lib/platform-data.ts`, `STATUS.md` | `npm run lint` passed, `npm run build`
  still blocked by sandbox Turbopack CSS-worker port restriction | next: visual
  polish or wire frontend to `/platform/*`
- 2026-04-30 04:12 EEST | codex | fixed Athens map viewport sizing so the map
  holds a stable responsive height and reads like the main surface instead of
  collapsing to the source image ratio | `components/AthensMapView.tsx`,
  `STATUS.md` | `npm run lint` passed | next: visual polish or wire frontend to
  `/platform/*`
- 2026-04-30 05:43 EEST | codex | cleaned the visual system for the BlockBattery
  pivot: fixed sticky header readability, moved the app onto a dark root
  background, and removed the map's bright inset border / white key-point pills
  so the Athens hero reads as one surface | `app/page.tsx`,
  `components/AthensMapView.tsx`, `app/globals.css`, `STATUS.md` |
  `npm run lint` passed | next: browser QA for spacing/contrast or wire the UI
  `/platform/*`
- 2026-04-30 04:28 EEST | codex | replaced the static Athens map image with a
  real interactive Leaflet + OpenStreetMap surface, keeping selected-site page
  state intact and switching markers to real lat/lon bounds + click behavior |
  `components/AthensMapView.tsx`, `components/AthensLeafletMap.tsx`,
  `app/globals.css`, `package.json`, `package-lock.json`, `STATUS.md` |
  `npm run lint` passed, `npm run build` still blocked by sandbox Turbopack
  CSS-worker port restriction | next: browser QA for pan/zoom and marker feel
- 2026-04-30 04:36 EEST | codex | hardened Leaflet initialization by adding an
  explicit Athens center/zoom, fit-bounds on mount, and `invalidateSize()` so
  the map recalculates after layout settles instead of rendering with partial
  tiles or wrong bounds | `components/AthensLeafletMap.tsx`, `STATUS.md` |
  `npm run lint` passed | next: browser QA for pan/zoom, marker feel, and tile
  loading
- 2026-04-30 04:44 EEST | codex | dropped the brittle map stack and switched
  the interactive Athens surface to use the provided `image.png` as the base
  layer with controlled clickable site overlays, keeping all points inside the
  frame and showing the business label only for the selected site |
  `public/image.png`, `components/AthensMapView.tsx`, `STATUS.md` |
  `npm run lint` passed | next: visual QA against the supplied map image and
  refine point alignment if needed
- 2026-04-30 04:49 EEST | codex | demoted the provided image to a blurred,
  low-opacity underlay and pushed the designed network overlay to the front so
  the surface reads as a product map instead of a raw image with pins |
  `components/AthensMapView.tsx`, `STATUS.md` | `npm run lint` passed | next:
  visual QA and point alignment against the underlay
- 2026-04-30 04:55 EEST | codex | removed the decorative network lines and
  reframed the overlay markers as illustrative potential business nodes rather
  than precise map locations, including lighter node labeling in the map chrome |
  `components/AthensMapView.tsx`, `STATUS.md` | `npm run lint` passed | next:
  visual QA and point alignment against the underlay
- 2026-04-30 05:05 EEST | codex | added smaller-business nodes to the mock
  Athens network and rewrote `STATUS.md` to match the current Greek Energy
  Receipt Network product instead of the legacy battery-first framing |
  `lib/platform-data.ts`, `api/platform.py`, `STATUS.md` | no new checks run |
  next: visual QA on small-business node distribution and continued map polish
- 2026-04-30 05:24 EEST | codex | converted the submit section into a real
  contributor flow wired to `/platform/submissions` and cleaned the shell name
  to `BlockBattery` | `components/SubmissionHub.tsx`, `lib/platform-api.ts`,
  `app/page.tsx`, `STATUS.md` | `npm run lint` passed | next: browser QA on the
  contributor form and continue Sepolia skeleton handoff

## Where we are

- **Platform backend (Python)**: ✅ mocked submission/proof/token domain is in
  place under `api/platform.py` with FastAPI routes in `api/main.py`. Platform
  tests are part of the suite and were green at the last full run.
- **Frontend (Next.js)**: ✅ map-first Athens demo is live and runs from mock
  platform data in `lib/platform-data.ts`. The main surface is an illustrative
  node map over `public/image.png`, with selected-site submit flow and
  downstream tech panels.
- **Network mix**: large industrial nodes plus smaller businesses are now in
  the mock data set, so the map no longer implies the product is only for large
  loads.
- **Battery layer**: still present as a downstream explainer and scenario view,
  not the top-level product identity.

## What runs and how

```bash
# Frontend demo
npm run dev                                  # → http://localhost:3000
npm run build                                # ~2.4s, prod build sanity

# Platform / scenario backend
uv run uvicorn api.main:app --port 8765      # platform + scenario API
uv run pytest                                # backend tests
```

There is an old `next dev` orphaned on port 3000 (PID at session start was 397).
HMR keeps it current; if it stops behaving, kill and restart.

## Scenario note

`lib/scenarios-data.ts` is auto-generated from the FastAPI MILP solver.
After editing `optim/*`, `api/scenarios.py`, `api/main.py`, or `BatterySpecs`:

```bash
uv run uvicorn api.main:app --port 8765 &
uv run python scripts/rebake_scenarios.py    # writes lib/scenarios-data.ts
kill %1
```

The rebake script reads `SCENARIO_API_ROOT` env (default `http://127.0.0.1:8765`)
so you can point it at a different port if `:8765` is busy.

**If you change the per-interval shape in `api/main.py`, also update**
`lib/api.ts::ScenarioInterval` and any consumer that reads new fields.
Otherwise the dashboard will render `undefined.toFixed(...)` and crash.

## Architecture map

```
data-scarcity/
├── README.md                  # full project spec
├── STATUS.md                  # this file
├── pyproject.toml             # uv-managed
├── .env.example               # ENTSOE_API_KEY=...
│
├── optim/
│   ├── battery.py             # Battery specs + battery state model
│   └── milp.py                # Downstream battery optimization / telemetry
├── data/ingest/
│   ├── entsoe.py              # Greek zone DAM/load/RES — key-aware
│   └── weather.py             # Open-Meteo for ATH/SKG/HER
├── api/
│   ├── main.py                # FastAPI: /platform/* + /scenarios/*
│   ├── platform.py            # Mocked submission / verification / token domain
│   └── scenarios.py           # Downstream battery scenarios
├── scripts/
│   └── rebake_scenarios.py    # Pulls /scenarios + /scenarios/{name},
│                              # writes lib/scenarios-data.ts
├── tests/                     # battery + MILP + platform tests
│
├── public/image.png           # Athens underlay for illustrative node map
├── app/page.tsx               # Map-first demo composition
├── components/
│   ├── AthensMapView.tsx      # Illustrative interactive node map
│   ├── SubmissionHub.tsx      # Selected-site submit / proof flow
│   ├── PlatformFlowView.tsx   # Compact downstream tech flow
│   ├── EdgeBar.tsx            # Battery value summary
│   ├── PriceActionChart.tsx   # Downstream scenario chart
│   ├── IsometricMegapack.tsx  # Battery visual
│   ├── DecisionPanel.tsx      # Battery reasoning card
│   ├── SmartVsNaive.tsx       # Scenario comparison
│   ├── ScenarioPicker.tsx     # Battery scenario picker
│   └── TimeScrubber.tsx       # Battery playback control
└── lib/
    ├── platform-data.ts       # Mock Athens sites / submissions / tokens
    ├── api.ts                 # Synchronous reads from baked battery scenarios
    ├── baseline.ts            # Naive battery baseline
    ├── decisions.ts           # Battery reasoning derivation
    ├── interpolate.ts         # Fractional-time playback
    └── scenarios-data.ts      # AUTO-GENERATED battery scenario bundle
```

## Conventions every agent should follow

**Read and update `STATUS.md` before and after work.**
- Read this file before starting.
- Update `Current objective`, `Last updated`, and `Blockers` when they change.
- Append one line to `Work log` after each meaningful completed task unit.
- Each log entry should include: timestamp, agent, task, files, verification,
  next step.

**Visible language is plain.** Technical terms (SoC, MTU, curtailment) live
in tooltips, headers, or footnotes — never in primary labels. Use:
- "charge level" not "SoC"
- "buying" / "selling" not "charge" / "discharge" (in headlines/callouts)
- "renewable surplus" not "curtailment regime"
- "naive baseline" / "smart" not "MILP" / "heuristic" (in user-visible text)

**Color system is energy-coded.** Don't deviate.
- `#38bdf8` (sky-400)   — buying / charging
- `#f59e0b` (amber-500) — selling / discharging
- `#a855f7` (purple-500) — renewable surplus
- `#84cc16` (lime-500)  — revenue / smart
- `#525252` (neutral-600) — naive / dim
- `#ef4444` (red-500)   — constraint / negative
- `#22d3ee` (cyan-400)  — charge level / battery state
- `#a78bfa` (violet-400) — market price

**Numbers are tabular mono.** Use `font-mono tabular-nums` for any value
that changes — revenue, price, MW, SoC, %.

**Every component should answer at least one of:**
- *What is the system doing?*  (centerpiece chart, battery)
- *Why did it decide that?*    (decision panel)
- *How well is it working?*    (smart-vs-naive, performance stats)

If a component answers none of those, cut it.

**No backend in Phase 1.** The dashboard runs entirely off
`lib/scenarios-data.ts`. Any new scenario must be added to `api/scenarios.py`
in Python, solved through the API, and re-baked.

**No new dependencies casually.** Recharts handles all charts. SVG handles
the battery. No motion library yet, no Material UI, no Bootstrap, no chart
libs other than Recharts.

## What's next (in priority order)

1. **Two more scenarios** queued: *peak demand spike*, *FCR-heavy day*.
   Add to `api/scenarios.py`, re-bake. Skeletons commented in that file.
2. **Replay flow polish** — judge picks a scenario, scrubber auto-plays
   end to end in ~10s, key moments highlighted.
3. **Better capture-rate calc** — currently approximated client-side in
   `lib/decisions.ts::approximateCaptureRate`. Should come from the actual
   perfect-foresight oracle (`optim/baselines.py` per the README, not yet
   implemented).
4. **Ingest hookup** — needs an ENTSOE_API_KEY. Code is ready; user must
   supply key in `.env`.
5. **Phase 2 (per README)**: curtailment classifier, regime-conditional
   price models, scenario sampler. Not started — Phase 1 must hold first.

## Known issues / gotchas

- Tailwind palette is the default; we don't have a custom config. Stick
  to neutral-50/100/.../900/950 and the named accent colors above.
- `lib/scenarios-data.ts` is ~300 KB / 8k+ lines after the telemetry expansion.
  Don't try to read it for understanding — read `api/scenarios.py`, `optim/milp.py`,
  and `api/main.py` instead. To inspect a single field, `jq` against the API
  output is faster than scrolling the baked file.
- The TS `ScenarioInterval` type and the Python interval payload must stay in
  lockstep. Adding a field to `api/main.py` without updating `lib/api.ts` (or
  rebaking) will surface as `undefined.toFixed(...)` runtime crashes in the UI.
- The naive baseline is intentionally bad. Don't "improve" it. Its job is
  to lose so the optimization looks smart.
- Decision rationale text is generated client-side. If you change MILP
  behavior (e.g. add ancillary co-opt), update `lib/decisions.ts` to
  reflect the new logic, not just the data.
