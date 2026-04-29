# Greek Battery Optimization Under Data Scarcity

**Hackathon project — Battery Optimization in the Greek Electricity Market**

A 15-minute charge/discharge/idle scheduling system for a Tesla Megapack 2 XL fleet operating in the Greek Day-Ahead Market, designed under the realistic constraint that no historical battery telemetry exists. Built around curtailment-aware price forecasting, a physics-based battery digital twin, and stochastic MILP optimization across DAM, intraday, and ancillary services.

---

## The Problem (and why it's urgent)

Greece curtailed **~1.85 TWh** of renewable power in 2025 — a 10x jump over 2024 — with another 2x increase expected in 2026. Curtailment happens 9 AM–4 PM when solar floods the system. Standalone batteries entered the Greek DAM in test mode in April 2026. There are 900 MW already permitted and a 4.7 GW pipeline.

The market is brand new. Operators are scheduling assets they have no history for. **This is the data scarcity problem in concrete form.**

## What We're Building

A scheduler that decides every 15 minutes whether the battery should **charge, discharge, or idle**, maximizing economic value subject to all technical constraints — without relying on battery operating data we don't have.

We replace the missing data with three things:
1. **Physics** — a battery digital twin parameterized from the Tesla Megapack 2 XL datasheet
2. **Market fundamentals** — TTF gas, EUA carbon, RES forecasts drive the price model directly
3. **Uncertainty-aware optimization** — stochastic MILP over sampled price scenarios, robust to forecast error

## Battery Configuration (Tesla Megapack 2 XL — Locked)

We model a **100 MW / 200 MWh** site as our reference asset (matches the scale of currently permitted Greek BESS projects). Composed of Megapack 2 XL units in 2-hour configuration:

| Parameter | Value | Source |
|-----------|-------|--------|
| Site power rating | 100 MW | Project assumption |
| Site energy capacity | 200 MWh | Project assumption (2-hr duration) |
| Round-trip efficiency | 92.0% | Tesla MP2 XL datasheet, 2-hr config |
| Charge efficiency (η_c) | √0.92 ≈ 0.959 | Derived |
| Discharge efficiency (η_d) | √0.92 ≈ 0.959 | Derived |
| Min SoC | 5% (10 MWh) | Operational margin |
| Max SoC | 95% (190 MWh) | Operational margin |
| Cycle life | 6,000 cycles | Industry standard for LFP |
| Capex proxy | €300/kWh | For degradation cost calc |
| λ_degradation | €0.05 / kWh-throughput | Capex / (2 × cycle life) |
| Calendar life | 15 years | Tesla warranty |

These are placeholders until the organizers release their numbers — all parameters live in `optim/battery.py` as a single dataclass and are swap-in trivial.

## Architecture

```
                    ┌─────────────────────────────┐
                    │   IPTO RES forecast         │
                    │   IPTO load forecast        │
                    │   Open-Meteo weather        │
                    │   ATC export capacity       │
                    │   TTF gas / EUA carbon      │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  Curtailment Probability    │
                    │  Classifier P(c=1 | x)      │
                    │  LightGBM + isotonic calib  │
                    └──────────────┬──────────────┘
                                   │
            ┌──────────────────────┼──────────────────────┐
            │                                             │
   ┌────────▼─────────┐                          ┌────────▼─────────┐
   │ Normal-regime    │                          │ Curtail-regime   │
   │ price model      │                          │ price model      │
   │ XGBoost regr.    │                          │ Tobit / floored  │
   └────────┬─────────┘                          └────────┬─────────┘
            │                                             │
            └─────────────────────┬───────────────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │  Mixture price forecast    │
                    │  + temporal correlation    │
                    │  → 200 scenario paths      │
                    └─────────────┬──────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │  Stochastic MILP           │
                    │  - DAM arbitrage           │
                    │  - FCR/aFRR reservation    │
                    │  - Degradation cost        │
                    │  - SoC dynamics            │
                    └─────────────┬──────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │  Day-ahead schedule        │
                    │  (96 × 15-min intervals)   │
                    └─────────────┬──────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │  Intraday re-optimizer   │  ← rolls every 15 min
                    │  (synthetic ID prices)   │     during operating day
                    └──────────────────────────┘
```

## Revenue Stack (All Three)

We build a multi-market co-optimizer. Difficulty estimate vs. payoff:

| Revenue stream | Difficulty | Why we do it |
|----------------|-----------|--------------|
| **DAM arbitrage** | Low | Core. Charge cheap, discharge expensive. ~60% of expected revenue. |
| **Intraday re-optimization** | Medium | Adapts to RES forecast errors as the day unfolds. ~20% of revenue. |
| **FCR/aFRR ancillary** | High | Reserves capacity for frequency regulation. ~20% of revenue, structurally hard. |

**Build order:** DAM-only excellent → multi-market interface → intraday re-opt with synthetic ID prices → ancillary co-opt. Ship in that order so we always have something demoable.

**Scope decision:** ancillary services for Greek market are *immature and poorly documented in English*. We stub the FCR/aFRR module with reasonable price assumptions (€10–30/MW/h capacity payment, EU peer-market benchmarks) rather than scraping Greek balancing market rules. Pitch this honestly: "framework supports it, but Greek ancillary data isn't yet rich enough to forecast — here's how we'd extend."

## Data Sources

Per the official problem statement:

| Source | What we pull | Library/method |
|--------|-------------|---------------|
| ENTSO-E Transparency | Greek DAM prices, load actuals, RES gen actuals, neighbor zones | `entsoe-py` |
| IPTO (ADMIE) | RES forecast, load forecast, ATC values | Web scraper (data tables on admie.gr) |
| HEnEx | Aggregated buy/sell curves | Manual download of CSV/XML, then ingest |
| Open-Meteo | Hourly temp, wind, cloud, solar irradiance for Greek sites | REST API, no key |
| ICE/EEX | TTF gas futures, EUA carbon allowances | Daily settlement scrape |

**Time range:** Train on 2024-01-01 → 2025-09-30 (hourly DAM). Validate on 2025-10-01 → present (15-min MTU). The Oct 2025 MTU change is a regime shift — we account for it explicitly.

## The Curtailment-Aware Price Forecaster (the alpha)

**Why this beats every other team:** A single regression on Greek prices systematically underfits the curtailment floor. Two-stage modeling captures it.

### Curtailment classifier

**Target:** `curtailed = (price < €5/MWh) OR (RES_actual < RES_forecast × 0.95)`

**Features** (all known at gate-closure D-1 12:00 CET):
- Supply: RES forecast (PV + wind), cloud cover, wind speed
- Demand: load forecast, temperature, holiday, hour, day-of-week
- **Derived (the alpha):** `residual_demand = load - RES`, `RES_penetration = RES / load`
- Export capacity: ATC to neighbors, neighbor price spread
- Fundamentals: TTF gas, EUA carbon

**Model:** LightGBM binary classifier, `objective='binary'`, **isotonic calibration on held-out fold** (uncalibrated probabilities will wreck the stochastic MILP).

**Validation:** Time-series CV with expanding window. **Never shuffle** — leakage gives fake AUC.

### Regime-conditional price models

- **Normal regime:** XGBoost regressor on the same feature set, trained only on `curtailed=0` rows
- **Curtail regime:** Tobit-style model with mass at €0 (or simple two-stage: P(price=0) classifier + truncated Gaussian for price>0)

### Scenario sampler

For each of 96 MTU intervals:
1. Draw regime from `Bernoulli(P(curtail))`
2. Sample price from the corresponding regime's distribution
3. **Apply temporal correlation** via AR(1) on residuals — independent draws underestimate risk

Output: 200 scenario paths × 96 timesteps.

## The MILP (concrete)

```python
# In optim/milp.py

import cvxpy as cp
import numpy as np

def solve_schedule(price_scenarios, fcr_prices, battery, lambda_deg, soc_init):
    """
    price_scenarios: (96, N) array of DAM price paths in €/MWh
    fcr_prices:      (96,) array of FCR capacity prices in €/MW/h
    battery:         BatterySpecs dataclass
    lambda_deg:      €/MWh-throughput degradation cost
    soc_init:        initial SoC in MWh
    """
    T, N = price_scenarios.shape
    dt = 0.25  # 15 min in hours

    # Decision variables (single schedule, evaluated against N scenarios)
    charge    = cp.Variable(T, nonneg=True)          # MW
    discharge = cp.Variable(T, nonneg=True)          # MW
    soc       = cp.Variable(T + 1, nonneg=True)      # MWh
    fcr_up    = cp.Variable(T, nonneg=True)          # MW reserved upward
    fcr_dn    = cp.Variable(T, nonneg=True)          # MW reserved downward
    is_charging = cp.Variable(T, boolean=True)       # mutex

    constraints = [
        soc[0] == soc_init,
        soc <= battery.energy_max,
        soc >= battery.energy_min,
        charge    <= battery.power_max * is_charging,
        discharge <= battery.power_max * (1 - is_charging),
        # Power must accommodate FCR reservations
        charge + fcr_dn  <= battery.power_max,
        discharge + fcr_up <= battery.power_max,
        # SoC headroom for FCR delivery (must have energy to provide upward,
        # must have headroom to absorb downward, assuming worst-case 15-min activation)
        soc[:-1] - fcr_up * dt >= battery.energy_min,
        soc[:-1] + fcr_dn * dt <= battery.energy_max,
    ]

    # SoC dynamics
    for t in range(T):
        constraints.append(
            soc[t+1] == soc[t]
                       + battery.eta_c * charge[t] * dt
                       - discharge[t] * dt / battery.eta_d
        )

    # Expected DAM revenue across scenarios
    net_dispatch = (discharge - charge) * dt   # MWh per interval
    expected_dam = sum(
        cp.sum(cp.multiply(price_scenarios[:, s], net_dispatch))
        for s in range(N)
    ) / N

    # FCR revenue (capacity payment)
    fcr_revenue = cp.sum(cp.multiply(fcr_prices, (fcr_up + fcr_dn) * dt))

    # Degradation: throughput proxy (rainflow as future work)
    throughput = cp.sum(charge + discharge) * dt
    deg_cost = lambda_deg * throughput

    objective = cp.Maximize(expected_dam + fcr_revenue - deg_cost)

    prob = cp.Problem(objective, constraints)
    prob.solve(solver=cp.HIGHS)

    return {
        'charge': charge.value,
        'discharge': discharge.value,
        'soc': soc.value,
        'fcr_up': fcr_up.value,
        'fcr_dn': fcr_dn.value,
        'expected_revenue': prob.value,
        'cycles_per_day': throughput.value / (2 * battery.energy_capacity),
    }
```

**Solve time target:** <2 seconds for 96-interval, 200-scenario problem. HiGHS handles this comfortably.

## Intraday Re-Optimization

Every 15 minutes during the operating day:
1. Update SoC with realized dispatch
2. Pull updated RES forecast (intraday RES forecasts get more accurate as time approaches)
3. Re-sample price scenarios for the remaining horizon
4. Re-solve MILP from current SoC to end-of-day
5. Compare new optimal to committed DAM position; trade the delta on intraday market

**Synthetic intraday prices** (we don't have clean Greek ID data in time): generate AR(1) deviations from realized DAM price with reasonable volatility (~€10–20/MWh stdev). Document this clearly in pitch — it's the mechanism that matters.

## The Killer Backtest

This is the slide that wins:

```python
def backtest(historical_data, scheduler, oracle, naive):
    results = []
    for day in trading_days_2025:
        forecast      = scheduler.forecast(features_for(day))
        scenarios     = scheduler.sample_scenarios(forecast)
        our_schedule  = scheduler.solve(scenarios)

        realized      = historical_data.prices_for(day)
        our_revenue   = evaluate(our_schedule, realized)
        oracle_rev    = oracle.solve(realized).revenue   # perfect foresight
        naive_rev     = naive.solve(realized).revenue    # cheapest 4hr / most expensive 4hr

        results.append({
            'date': day,
            'capture_pct': our_revenue / oracle_rev,
            'lift_vs_naive': our_revenue / naive_rev,
        })
    return pd.DataFrame(results)
```

**Industry benchmark:** 60–85% of perfect foresight. Hit 70%+ with 15%+ lift over naive and you have a real result. Show the distribution, not just the median.

## Live Demo Flow (4 minutes on stage)

1. **(15s) Hook.** "Greece will curtail 4 TWh of renewables in 2026. The first batteries just came online with weeks of data. Here's how we schedule them anyway."
2. **(45s) Live data.** Pull today's actual Greek DAM prices, IPTO RES forecast, weather. Show on dashboard.
3. **(45s) Curtailment model.** Heatmap of P(curtail) across the day. "We model the regime, then price within it."
4. **(45s) Schedule.** Run the MILP live. 96-interval schedule appears overlaid on price curve. SoC trajectory animates.
5. **(45s) Replay.** Judge picks any 2025 date. System replays — forecast, schedule, realized, P&L. 10 seconds end to end.
6. **(30s) Capture %.** Show the distribution: median 70%+ of perfect foresight, 18% lift over naive.
7. **(15s) Close.** "Physics + market fundamentals + robust optimization = we don't need years of battery data to operate a battery well. Same framework extends to intraday and ancillary, here's the interface."

**Backup:** pre-recorded 4-min video of the same demo, in case live data fails.

## Repo Layout

```
greek-battery-optim/
├── README.md                       # this file
├── pyproject.toml                  # uv-managed
├── .env.example                    # ENTSOE_API_KEY=...
├── data/
│   ├── raw/                        # gitignored
│   ├── processed/                  # parquet
│   └── ingest/
│       ├── entsoe.py               # entsoe-py wrapper
│       ├── ipto.py                 # ADMIE scraper
│       ├── henex.py                # HEnEx scraper
│       ├── weather.py              # Open-Meteo
│       └── fundamentals.py         # TTF + EUA
├── models/
│   ├── curtailment.py              # binary classifier
│   ├── price_normal.py             # XGBoost on non-curtailed
│   ├── price_curtail.py            # Tobit on curtailed
│   ├── scenarios.py                # mixture sampler + AR(1) corr
│   └── train.py                    # entrypoint, time-series CV
├── optim/
│   ├── battery.py                  # BatterySpecs dataclass
│   ├── milp.py                     # CVXPY scheduler (DAM + FCR)
│   ├── intraday.py                 # rolling re-optimizer
│   └── baselines.py                # naive + perfect-foresight oracle
├── backtest/
│   ├── runner.py
│   └── metrics.py                  # capture %, lift, Sharpe
├── api/
│   └── main.py                     # FastAPI: GET /schedule?date=...
├── ui/                             # Next.js + Recharts
│   ├── app/
│   ├── components/
│   │   ├── PriceChart.tsx
│   │   ├── ScheduleChart.tsx
│   │   ├── SocChart.tsx
│   │   ├── CurtailmentHeatmap.tsx
│   │   └── RevenueDial.tsx
│   └── lib/api.ts
└── notebooks/
    ├── 01_data_exploration.ipynb
    ├── 02_curtailment_model.ipynb
    ├── 03_price_models.ipynb
    ├── 04_milp_synthetic.ipynb
    └── 05_full_backtest.ipynb
```

## Build Order (strict — do not skip ahead)

| Phase | Component | Owner | Validation |
|-------|-----------|-------|-----------|
| 1 | Data ingest (ENTSO-E + Open-Meteo) | 1 person | Pull works, parquet written |
| 1 | Battery digital twin | 1 person | Energy balance closes |
| 1 | MILP on synthetic prices | 1 person | Beats naive on synthetic data |
| 2 | Curtailment classifier | 1 person | AUC > 0.85 on held-out |
| 2 | Price models (both regimes) | 1 person | MAE < 15 €/MWh non-curtail |
| 2 | Scenario sampler | 1 person | Sample paths look like real days |
| 3 | Backtest harness | 1 person | Capture % computed for full year |
| 3 | Intraday re-optimizer | 1 person | Re-solve in <2s |
| 3 | Dashboard (read-only) | 1 person | Renders all charts |
| 4 | FCR module + co-opt | 1 person | MILP solves with ancillary |
| 4 | Live data hookup | 1 person | Today's prices pull in dashboard |
| 4 | Demo polish + replay flow | All | Run-through 3x |

**Phases 1–3 must ship.** Phase 4 is stretch — only attempt after Phase 3 backtest is producing real numbers.

## Stack

- **Python 3.12** with `uv` for env management
- `entsoe-py`, `requests`, `httpx` for data
- `polars` or `pandas` + `pyarrow` (parquet)
- `lightgbm`, `xgboost`, `scikit-learn`
- `cvxpy` + `highspy` for the MILP
- `fastapi` + `uvicorn` for the API
- **Next.js 15** + Tailwind + Recharts for UI (own design system, dark theme)
- DuckDB for ad-hoc queries on processed parquet

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| ENTSO-E API key approval slow | Apply day 0; fallback to bulk CSV downloads |
| IPTO scraping fragile | Cache aggressively, rotate user agents, polite delays |
| MILP infeasible due to bad SoC bounds | Add slack variables with high penalty, log infeasibilities |
| Forecast worse than baseline | Have naive baseline always available as fallback for demo |
| Live data fails during pitch | Pre-recorded video; cached "today" snapshot |
| Ancillary co-opt eats time | Stub it; show framework, explain extension path |
| 15-min MTU regime shift confuses model | Train on resampled hourly→15min for early data, native 15min after Oct 2025 |

## Pitch Beats (Memorize)

1. "Greece will curtail **20x** more renewable energy in 2026 than it did in 2024."
2. "Standalone batteries entered the Greek DAM in **April 2026** — 3 weeks of data, not 5 years."
3. "We don't have battery data. We have battery **physics**, market **fundamentals**, and **stochastic** optimization."
4. "Our system captures **70%+** of perfect-foresight revenue with no battery telemetry."
5. "The same framework runs **DAM, intraday, and ancillary** — we co-optimize the full revenue stack."

---

## Kickoff Prompt for Claude Code

> Build a Greek battery optimization system per `README.md`. Start with Phase 1 only — do not jump ahead.
>
> Step 1: Set up the repo with `uv`. Create `pyproject.toml` with the deps in the README. Create `.env.example`.
>
> Step 2: Build `data/ingest/entsoe.py`. Use the `entsoe-py` library. Pull Greek bidding zone (`10YGR-HTSO-----Y`) day-ahead prices, actual load, and RES generation actuals for 2024-01-01 through today. Store as Parquet partitioned by month under `data/processed/entsoe/`. Handle rate limiting and retries. API key in `.env`.
>
> Step 3: Build `data/ingest/weather.py` using Open-Meteo. Pull hourly temperature, cloud cover, wind speed, and shortwave radiation for Athens, Thessaloniki, and Heraklion (the three biggest load centers) for the same range. Store as parquet.
>
> Step 4: Build `optim/battery.py`. Define a `BatterySpecs` dataclass with the Tesla Megapack 2 XL parameters from the README. Include methods for SoC bounds, power bounds, and a simple `step(charge_mw, discharge_mw, dt_hours)` that updates SoC respecting all constraints. Write unit tests that verify energy balance closes (charge in × η_c = SoC change × η_d for a charge-then-discharge cycle).
>
> Step 5: Build `optim/milp.py` with the CVXPY formulation in the README. Test it on a synthetic 96-interval price series (sinusoidal with noise). Verify it produces a sensible schedule — charges during low prices, discharges during high prices, respects power and SoC bounds.
>
> Stop after Step 5. Show me the test results before proceeding to Phase 2.
# data-scarcity-battery
