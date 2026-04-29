# Project status — for handoff

Tesla Megapack 2 XL scheduler for the Greek Day-Ahead Market. Hackathon
demo. Full spec: `README.md`. Read it.

## Current objective

- Implement Greece-specific synthetic battery telemetry in the current Phase 1
  infra, extend the baked API/UI contract, and make `STATUS.md` the required
  handoff log for all agents.

## Active owner

- Codex main agent

## Last updated

- 2026-04-29 00:00 EEST

## Working area

- `optim/`, `api/`, `lib/`, `components/`, `app/`, `tests/`, `STATUS.md`

## Blockers

- None currently. PDF text extraction is limited in-shell, but the repo already
  contains enough context to implement the first telemetry slice.

## Work log

- 2026-04-29 00:00 EEST | codex | aligned on first milestone: Greek joined
  dataset starts with synthetic battery telemetry + richer API/UI contract |
  `STATUS.md` | repo inspection complete | patch handoff protocol, then backend
  telemetry

## Where we are

- **Phase 1 backend (Python)**: ✅ shipped. Battery digital twin + MILP +
  ENTSO-E/Open-Meteo ingest scaffolds + FastAPI bridge. 13/13 tests green.
- **Phase 1 dashboard (Next.js)**: ✅ shipped, mock-data only — runs with
  zero backend dependency. The MILP output is baked into
  `lib/scenarios-data.ts` and read synchronously.
- **Two scenarios live**: `curtailment` (default) and `normal`.

## What runs and how

```bash
# Dashboard (only thing needed for Phase 1)
npm run dev                                  # → http://localhost:3000

# Backend (only when re-baking scenario data)
uv run uvicorn api.main:app --port 8765
uv run pytest                                # 13 tests, ~1s
```

There is an old `next dev` orphaned on port 3000 (PID at session start was 397).
HMR keeps it current; if it stops behaving, kill and restart.

## Re-baking scenario data

`lib/scenarios-data.ts` is auto-generated from the FastAPI MILP solver.
To regenerate after editing `optim/`, `api/scenarios.py`, or `BatterySpecs`:

```bash
uv run uvicorn api.main:app --port 8765 &
curl -s localhost:8765/scenarios > /tmp/list.json
curl -s localhost:8765/scenarios/curtailment > /tmp/curt.json
curl -s localhost:8765/scenarios/normal > /tmp/norm.json
# then run the small python script that writes scenarios-data.ts
# (was inline in the conversation; trivial to re-derive)
```

## Architecture map

```
data-scarcity/
├── README.md                  # full project spec
├── STATUS.md                  # this file
├── pyproject.toml             # uv-managed
├── .env.example               # ENTSOE_API_KEY=...
│
├── optim/
│   ├── battery.py             # BatterySpecs + Battery digital twin
│   └── milp.py                # CVXPY/HiGHS scheduler (DAM + FCR + degradation)
├── data/ingest/
│   ├── entsoe.py              # Greek zone DAM/load/RES — key-aware
│   └── weather.py             # Open-Meteo for ATH/SKG/HER
├── api/
│   ├── main.py                # FastAPI: /scenarios, /scenarios/{name}
│   └── scenarios.py           # synthetic price scenarios
├── tests/                     # 8 battery + 5 MILP tests
│
├── app/page.tsx               # Dashboard composition
├── components/
│   ├── PriceActionChart.tsx   # Centerpiece — price + action bands + cursor
│   ├── IsometricMegapack.tsx  # 3D-ish cabinet with SoC fill + power arrow
│   ├── DecisionPanel.tsx      # "why is the system doing this" card
│   ├── SmartVsNaive.tsx       # Running-revenue race chart
│   ├── PerformanceStats.tsx   # Capture rate / lift / cycles tiles
│   ├── ScenarioPicker.tsx     # Segmented control
│   └── TimeScrubber.tsx       # Play/pause + drag slider
└── lib/
    ├── api.ts                 # Synchronous reads from baked data
    ├── baseline.ts            # Naive scheduler (cheapest-N / priciest-N)
    ├── decisions.ts           # Per-interval reasoning derivation
    └── scenarios-data.ts      # AUTO-GENERATED — do not hand-edit
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
- `lib/scenarios-data.ts` is ~46 KB. Don't try to read it for understanding —
  read `api/scenarios.py` and `optim/milp.py` instead.
- The naive baseline is intentionally bad. Don't "improve" it. Its job is
  to lose so the optimization looks smart.
- Decision rationale text is generated client-side. If you change MILP
  behavior (e.g. add ancillary co-opt), update `lib/decisions.ts` to
  reflect the new logic, not just the data.
