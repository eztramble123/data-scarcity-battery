// AUTO-GENERATED — baked from the FastAPI MILP solver.
// Regenerate by running the API and curl-dumping /scenarios + /scenarios/{name}.
// Not editable by hand.

import type { Scenario, ScenarioListItem } from "./api";

export const SCENARIO_LIST: ScenarioListItem[] = [
  {
    "name": "curtailment",
    "label": "Curtailment day",
    "description": "Solar floods 9am\u20134pm; prices crash to ~\u20ac0 midday, evening peak ~\u20ac180."
  },
  {
    "name": "normal",
    "label": "Normal arbitrage day",
    "description": "Typical duck curve \u2014 twin peaks, midday + overnight dips. The bread-and-butter day."
  }
];

export const SCENARIOS: Record<string, Scenario> = {
  curtailment: {
  "name": "curtailment",
  "label": "Curtailment day",
  "description": "Solar floods 9am\u20134pm; prices crash to ~\u20ac0 midday, evening peak ~\u20ac180.",
  "battery": {
    "power_max_mw": 100.0,
    "energy_capacity_mwh": 200.0,
    "energy_min_mwh": 10.0,
    "energy_max_mwh": 190.0,
    "round_trip_efficiency": 0.92
  },
  "summary": {
    "expected_revenue_eur": 29555.143073052936,
    "cycles": 1.1165946872756354,
    "total_charge_mwh": 187.66297265136726,
    "total_discharge_mwh": 258.9749022588869,
    "min_price_eur_mwh": 0.0,
    "max_price_eur_mwh": 196.20669968567074
  },
  "intervals": [
    {
      "t": 0,
      "hour": 0.0,
      "price_eur_mwh": 95.50258548558885,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 1,
      "hour": 0.25,
      "price_eur_mwh": 94.41750340668835,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 2,
      "hour": 0.5,
      "price_eur_mwh": 97.34691848076746,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 3,
      "hour": 0.75,
      "price_eur_mwh": 94.93779546837351,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 4,
      "hour": 1.0,
      "price_eur_mwh": 92.00318042476964,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 5,
      "hour": 1.25,
      "price_eur_mwh": 95.11602758791288,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 6,
      "hour": 1.5,
      "price_eur_mwh": 98.3073615981125,
      "charge_mw": 0.0,
      "discharge_mw": 100.0,
      "net_dispatch_mw": 100.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 7,
      "hour": 1.75,
      "price_eur_mwh": 96.20144918122203,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 8,
      "hour": 2.0,
      "price_eur_mwh": 88.8223977127609,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 9,
      "hour": 2.25,
      "price_eur_mwh": 85.70492127130555,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 10,
      "hour": 2.5,
      "price_eur_mwh": 87.31056021809127,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 11,
      "hour": 2.75,
      "price_eur_mwh": 88.91654520768078,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 12,
      "hour": 3.0,
      "price_eur_mwh": 78.31190781259943,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 13,
      "hour": 3.25,
      "price_eur_mwh": 85.51340618678203,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 14,
      "hour": 3.5,
      "price_eur_mwh": 80.09975289291012,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 15,
      "hour": 3.75,
      "price_eur_mwh": 80.77048897905465,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 16,
      "hour": 4.0,
      "price_eur_mwh": 80.06510743950359,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 17,
      "hour": 4.25,
      "price_eur_mwh": 79.45644060772753,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 18,
      "hour": 4.5,
      "price_eur_mwh": 80.8070153611642,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 19,
      "hour": 4.75,
      "price_eur_mwh": 81.77422117291684,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 20,
      "hour": 5.0,
      "price_eur_mwh": 75.62306757963961,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 21,
      "hour": 5.25,
      "price_eur_mwh": 80.36789203940259,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 22,
      "hour": 5.5,
      "price_eur_mwh": 71.45289360196597,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 23,
      "hour": 5.75,
      "price_eur_mwh": 75.46376214736668,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 24,
      "hour": 6.0,
      "price_eur_mwh": 78.66972679469006,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 25,
      "hour": 6.25,
      "price_eur_mwh": 77.76255694397649,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 26,
      "hour": 6.5,
      "price_eur_mwh": 78.18986758351242,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 27,
      "hour": 6.75,
      "price_eur_mwh": 82.51536031429264,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 28,
      "hour": 7.0,
      "price_eur_mwh": 90.08751458118086,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 29,
      "hour": 7.25,
      "price_eur_mwh": 98.21262270323795,
      "charge_mw": 0.0,
      "discharge_mw": 45.29986967851581,
      "net_dispatch_mw": 45.29986967851581,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 30,
      "hour": 7.5,
      "price_eur_mwh": 97.16408012049848,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 62.12860351426869,
      "soc_frac": 0.31064301757134344
    },
    {
      "t": 31,
      "hour": 7.75,
      "price_eur_mwh": 101.45737342167516,
      "charge_mw": 0.0,
      "discharge_mw": 100.0,
      "net_dispatch_mw": 100.0,
      "soc_mwh": 62.12860351426869,
      "soc_frac": 0.31064301757134344
    },
    {
      "t": 32,
      "hour": 8.0,
      "price_eur_mwh": 99.05221704281816,
      "charge_mw": 0.0,
      "discharge_mw": 100.0,
      "net_dispatch_mw": 100.0,
      "soc_mwh": 36.064301757134345,
      "soc_frac": 0.1803215087856717
    },
    {
      "t": 33,
      "hour": 8.25,
      "price_eur_mwh": 95.21097369181132,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 34,
      "hour": 8.5,
      "price_eur_mwh": 83.56605787911457,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 35,
      "hour": 8.75,
      "price_eur_mwh": 71.00949951581406,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 36,
      "hour": 9.0,
      "price_eur_mwh": 52.32085671902603,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 37,
      "hour": 9.25,
      "price_eur_mwh": 39.49538974635833,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 38,
      "hour": 9.5,
      "price_eur_mwh": 28.973513380586677,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 39,
      "hour": 9.75,
      "price_eur_mwh": 19.0161958935155,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 40,
      "hour": 10.0,
      "price_eur_mwh": 0.0,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 41,
      "hour": 10.25,
      "price_eur_mwh": 0.0,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 42,
      "hour": 10.5,
      "price_eur_mwh": 0.0,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 43,
      "hour": 10.75,
      "price_eur_mwh": 0.0,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 44,
      "hour": 11.0,
      "price_eur_mwh": 0.0,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 45,
      "hour": 11.25,
      "price_eur_mwh": 0.0,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 46,
      "hour": 11.5,
      "price_eur_mwh": 0.0,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 47,
      "hour": 11.75,
      "price_eur_mwh": 0.0,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 48,
      "hour": 12.0,
      "price_eur_mwh": 0.0,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 49,
      "hour": 12.25,
      "price_eur_mwh": 0.0,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 50,
      "hour": 12.5,
      "price_eur_mwh": 0.0,
      "charge_mw": 100.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": -100.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 51,
      "hour": 12.75,
      "price_eur_mwh": 0.0,
      "charge_mw": 100.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": -100.0,
      "soc_mwh": 33.9791576165636,
      "soc_frac": 0.169895788082818
    },
    {
      "t": 52,
      "hour": 13.0,
      "price_eur_mwh": 0.0,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 57.958315233127195,
      "soc_frac": 0.289791576165636
    },
    {
      "t": 53,
      "hour": 13.25,
      "price_eur_mwh": 0.0,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 57.958315233127195,
      "soc_frac": 0.289791576165636
    },
    {
      "t": 54,
      "hour": 13.5,
      "price_eur_mwh": 0.0,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 57.958315233127195,
      "soc_frac": 0.289791576165636
    },
    {
      "t": 55,
      "hour": 13.75,
      "price_eur_mwh": 0.0,
      "charge_mw": 50.651890605469035,
      "discharge_mw": 0.0,
      "net_dispatch_mw": -50.651890605469035,
      "soc_mwh": 57.958315233127195,
      "soc_frac": 0.289791576165636
    },
    {
      "t": 56,
      "hour": 14.0,
      "price_eur_mwh": 0.0,
      "charge_mw": 100.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": -100.0,
      "soc_mwh": 70.10421191718198,
      "soc_frac": 0.3505210595859099
    },
    {
      "t": 57,
      "hour": 14.25,
      "price_eur_mwh": 0.0,
      "charge_mw": 100.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": -100.0,
      "soc_mwh": 94.08336953374558,
      "soc_frac": 0.47041684766872793
    },
    {
      "t": 58,
      "hour": 14.5,
      "price_eur_mwh": 0.0,
      "charge_mw": 100.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": -100.0,
      "soc_mwh": 118.06252715030918,
      "soc_frac": 0.5903126357515459
    },
    {
      "t": 59,
      "hour": 14.75,
      "price_eur_mwh": 0.0,
      "charge_mw": 100.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": -100.0,
      "soc_mwh": 142.04168476687278,
      "soc_frac": 0.7102084238343639
    },
    {
      "t": 60,
      "hour": 15.0,
      "price_eur_mwh": 0.0,
      "charge_mw": 100.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": -100.0,
      "soc_mwh": 166.0208423834364,
      "soc_frac": 0.830104211917182
    },
    {
      "t": 61,
      "hour": 15.25,
      "price_eur_mwh": 0.42139983516593027,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 62,
      "hour": 15.5,
      "price_eur_mwh": 19.152722366148332,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 63,
      "hour": 15.75,
      "price_eur_mwh": 17.4538704979562,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 64,
      "hour": 16.0,
      "price_eur_mwh": 28.18008470751615,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 65,
      "hour": 16.25,
      "price_eur_mwh": 33.52283319895271,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 66,
      "hour": 16.5,
      "price_eur_mwh": 48.97358681311215,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 67,
      "hour": 16.75,
      "price_eur_mwh": 56.54809935729984,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 68,
      "hour": 17.0,
      "price_eur_mwh": 63.138932602238725,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 69,
      "hour": 17.25,
      "price_eur_mwh": 61.995752341813336,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 70,
      "hour": 17.5,
      "price_eur_mwh": 82.1935285657457,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 71,
      "hour": 17.75,
      "price_eur_mwh": 96.88889066436737,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 72,
      "hour": 18.0,
      "price_eur_mwh": 111.23525268781454,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 73,
      "hour": 18.25,
      "price_eur_mwh": 118.4698860466469,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 74,
      "hour": 18.5,
      "price_eur_mwh": 142.21744417213222,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 75,
      "hour": 18.75,
      "price_eur_mwh": 143.3725207085922,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 76,
      "hour": 19.0,
      "price_eur_mwh": 158.84120743503706,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 77,
      "hour": 19.25,
      "price_eur_mwh": 176.499918982488,
      "charge_mw": 0.0,
      "discharge_mw": 90.59973935703174,
      "net_dispatch_mw": 90.59973935703174,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 78,
      "hour": 19.5,
      "price_eur_mwh": 182.03314731717938,
      "charge_mw": 0.0,
      "discharge_mw": 100.0,
      "net_dispatch_mw": 100.0,
      "soc_mwh": 166.38581054280604,
      "soc_frac": 0.8319290527140302
    },
    {
      "t": 79,
      "hour": 19.75,
      "price_eur_mwh": 196.20669968567074,
      "charge_mw": 0.0,
      "discharge_mw": 100.0,
      "net_dispatch_mw": 100.0,
      "soc_mwh": 140.3215087856717,
      "soc_frac": 0.7016075439283586
    },
    {
      "t": 80,
      "hour": 20.0,
      "price_eur_mwh": 192.25426708160805,
      "charge_mw": 0.0,
      "discharge_mw": 100.0,
      "net_dispatch_mw": 100.0,
      "soc_mwh": 114.25720702853738,
      "soc_frac": 0.5712860351426869
    },
    {
      "t": 81,
      "hour": 20.25,
      "price_eur_mwh": 189.10227921525828,
      "charge_mw": 0.0,
      "discharge_mw": 100.0,
      "net_dispatch_mw": 100.0,
      "soc_mwh": 88.19290527140303,
      "soc_frac": 0.44096452635701516
    },
    {
      "t": 82,
      "hour": 20.5,
      "price_eur_mwh": 187.22648122348048,
      "charge_mw": 0.0,
      "discharge_mw": 100.0,
      "net_dispatch_mw": 100.0,
      "soc_mwh": 62.12860351426869,
      "soc_frac": 0.31064301757134344
    },
    {
      "t": 83,
      "hour": 20.75,
      "price_eur_mwh": 178.80511459064343,
      "charge_mw": 0.0,
      "discharge_mw": 100.0,
      "net_dispatch_mw": 100.0,
      "soc_mwh": 36.064301757134345,
      "soc_frac": 0.1803215087856717
    },
    {
      "t": 84,
      "hour": 21.0,
      "price_eur_mwh": 170.37007879822482,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 85,
      "hour": 21.25,
      "price_eur_mwh": 168.8520775137597,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 86,
      "hour": 21.5,
      "price_eur_mwh": 158.73882636418256,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 87,
      "hour": 21.75,
      "price_eur_mwh": 151.56606445531907,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 88,
      "hour": 22.0,
      "price_eur_mwh": 133.7887016676626,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 89,
      "hour": 22.25,
      "price_eur_mwh": 134.84520376957508,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 90,
      "hour": 22.5,
      "price_eur_mwh": 119.34598881053887,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 91,
      "hour": 22.75,
      "price_eur_mwh": 120.44050023806822,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 92,
      "hour": 23.0,
      "price_eur_mwh": 107.29058607210284,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 93,
      "hour": 23.25,
      "price_eur_mwh": 102.0887943650559,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 94,
      "hour": 23.5,
      "price_eur_mwh": 103.00977423305854,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 95,
      "hour": 23.75,
      "price_eur_mwh": 103.90174224225244,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    }
  ],
  "soc_final_mwh": 10.0
},
  normal: {
  "name": "normal",
  "label": "Normal arbitrage day",
  "description": "Typical duck curve \u2014 twin peaks, midday + overnight dips. The bread-and-butter day.",
  "battery": {
    "power_max_mw": 100.0,
    "energy_capacity_mwh": 200.0,
    "energy_min_mwh": 10.0,
    "energy_max_mwh": 190.0,
    "round_trip_efficiency": 0.92
  },
  "summary": {
    "expected_revenue_eur": 12659.007683243302,
    "cycles": 0.9270731181297452,
    "total_charge_mwh": 148.17931241264014,
    "total_discharge_mwh": 222.64993483925792,
    "min_price_eur_mwh": 39.118527576050035,
    "max_price_eur_mwh": 137.88946738176705
  },
  "intervals": [
    {
      "t": 0,
      "hour": 0.0,
      "price_eur_mwh": 82.1930019041391,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 1,
      "hour": 0.25,
      "price_eur_mwh": 82.44512163893877,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 2,
      "hour": 0.5,
      "price_eur_mwh": 79.64769749963806,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 3,
      "hour": 0.75,
      "price_eur_mwh": 73.30038531620312,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 4,
      "hour": 1.0,
      "price_eur_mwh": 78.39006044798502,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 5,
      "hour": 1.25,
      "price_eur_mwh": 75.42840276577004,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 6,
      "hour": 1.5,
      "price_eur_mwh": 70.89095031478212,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 7,
      "hour": 1.75,
      "price_eur_mwh": 72.70449463494238,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 8,
      "hour": 2.0,
      "price_eur_mwh": 70.61144350634231,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 9,
      "hour": 2.25,
      "price_eur_mwh": 69.10261621374363,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 10,
      "hour": 2.5,
      "price_eur_mwh": 67.1981932227619,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 11,
      "hour": 2.75,
      "price_eur_mwh": 67.87393354257524,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 12,
      "hour": 3.0,
      "price_eur_mwh": 63.403846140301255,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 13,
      "hour": 3.25,
      "price_eur_mwh": 64.78511742416016,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 14,
      "hour": 3.5,
      "price_eur_mwh": 63.78529621511362,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 15,
      "hour": 3.75,
      "price_eur_mwh": 67.29431718415327,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 16,
      "hour": 4.0,
      "price_eur_mwh": 66.20027076843638,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 17,
      "hour": 4.25,
      "price_eur_mwh": 66.11336577877604,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 18,
      "hour": 4.5,
      "price_eur_mwh": 65.89190972810577,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 19,
      "hour": 4.75,
      "price_eur_mwh": 69.06297642932597,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 20,
      "hour": 5.0,
      "price_eur_mwh": 71.81796561754918,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 21,
      "hour": 5.25,
      "price_eur_mwh": 73.29386211676253,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 22,
      "hour": 5.5,
      "price_eur_mwh": 80.69043462131023,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 23,
      "hour": 5.75,
      "price_eur_mwh": 82.84554326547926,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 24,
      "hour": 6.0,
      "price_eur_mwh": 74.97519423402721,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 25,
      "hour": 6.25,
      "price_eur_mwh": 80.8882652431584,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 26,
      "hour": 6.5,
      "price_eur_mwh": 89.4961255000369,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 27,
      "hour": 6.75,
      "price_eur_mwh": 92.05483285629495,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 28,
      "hour": 7.0,
      "price_eur_mwh": 96.88990967274388,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 29,
      "hour": 7.25,
      "price_eur_mwh": 99.23754399441655,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 30,
      "hour": 7.5,
      "price_eur_mwh": 106.48154974747429,
      "charge_mw": 0.0,
      "discharge_mw": 100.0,
      "net_dispatch_mw": 100.0,
      "soc_mwh": 100.0,
      "soc_frac": 0.5
    },
    {
      "t": 31,
      "hour": 7.75,
      "price_eur_mwh": 97.37563922091796,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 32,
      "hour": 8.0,
      "price_eur_mwh": 99.09894394219289,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 33,
      "hour": 8.25,
      "price_eur_mwh": 104.78617678706519,
      "charge_mw": 0.0,
      "discharge_mw": 100.0,
      "net_dispatch_mw": 100.0,
      "soc_mwh": 73.93569824286566,
      "soc_frac": 0.3696784912143283
    },
    {
      "t": 34,
      "hour": 8.5,
      "price_eur_mwh": 97.97948661650261,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 47.87139648573131,
      "soc_frac": 0.23935698242865655
    },
    {
      "t": 35,
      "hour": 8.75,
      "price_eur_mwh": 94.48933947523706,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 47.87139648573131,
      "soc_frac": 0.23935698242865655
    },
    {
      "t": 36,
      "hour": 9.0,
      "price_eur_mwh": 86.6817260652442,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 47.87139648573131,
      "soc_frac": 0.23935698242865655
    },
    {
      "t": 37,
      "hour": 9.25,
      "price_eur_mwh": 78.48767004721176,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 47.87139648573131,
      "soc_frac": 0.23935698242865655
    },
    {
      "t": 38,
      "hour": 9.5,
      "price_eur_mwh": 78.86233381948591,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 47.87139648573131,
      "soc_frac": 0.23935698242865655
    },
    {
      "t": 39,
      "hour": 9.75,
      "price_eur_mwh": 73.56038126508693,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 47.87139648573131,
      "soc_frac": 0.23935698242865655
    },
    {
      "t": 40,
      "hour": 10.0,
      "price_eur_mwh": 64.56664470064288,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 47.87139648573131,
      "soc_frac": 0.23935698242865655
    },
    {
      "t": 41,
      "hour": 10.25,
      "price_eur_mwh": 61.51182165499847,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 47.87139648573131,
      "soc_frac": 0.23935698242865655
    },
    {
      "t": 42,
      "hour": 10.5,
      "price_eur_mwh": 59.0650585979227,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 47.87139648573131,
      "soc_frac": 0.23935698242865655
    },
    {
      "t": 43,
      "hour": 10.75,
      "price_eur_mwh": 52.6386822271112,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 47.87139648573131,
      "soc_frac": 0.23935698242865655
    },
    {
      "t": 44,
      "hour": 11.0,
      "price_eur_mwh": 51.8694987889814,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 47.87139648573131,
      "soc_frac": 0.23935698242865655
    },
    {
      "t": 45,
      "hour": 11.25,
      "price_eur_mwh": 49.641099761566366,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 47.87139648573131,
      "soc_frac": 0.23935698242865655
    },
    {
      "t": 46,
      "hour": 11.5,
      "price_eur_mwh": 47.13182704826114,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 47.87139648573131,
      "soc_frac": 0.23935698242865655
    },
    {
      "t": 47,
      "hour": 11.75,
      "price_eur_mwh": 43.62843776144421,
      "charge_mw": 92.71724965056055,
      "discharge_mw": 0.0,
      "net_dispatch_mw": -92.71724965056055,
      "soc_mwh": 47.87139648573131,
      "soc_frac": 0.23935698242865655
    },
    {
      "t": 48,
      "hour": 12.0,
      "price_eur_mwh": 45.471792567945755,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 70.10421191718198,
      "soc_frac": 0.3505210595859099
    },
    {
      "t": 49,
      "hour": 12.25,
      "price_eur_mwh": 45.299134786954546,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 70.10421191718198,
      "soc_frac": 0.3505210595859099
    },
    {
      "t": 50,
      "hour": 12.5,
      "price_eur_mwh": 42.889628681335104,
      "charge_mw": 100.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": -100.0,
      "soc_mwh": 70.10421191718198,
      "soc_frac": 0.3505210595859099
    },
    {
      "t": 51,
      "hour": 12.75,
      "price_eur_mwh": 39.118527576050035,
      "charge_mw": 100.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": -100.0,
      "soc_mwh": 94.08336953374558,
      "soc_frac": 0.47041684766872793
    },
    {
      "t": 52,
      "hour": 13.0,
      "price_eur_mwh": 43.7401136068132,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 118.06252715030918,
      "soc_frac": 0.5903126357515459
    },
    {
      "t": 53,
      "hour": 13.25,
      "price_eur_mwh": 40.3209740031215,
      "charge_mw": 100.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": -100.0,
      "soc_mwh": 118.06252715030918,
      "soc_frac": 0.5903126357515459
    },
    {
      "t": 54,
      "hour": 13.5,
      "price_eur_mwh": 45.03327378352071,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 142.04168476687278,
      "soc_frac": 0.7102084238343639
    },
    {
      "t": 55,
      "hour": 13.75,
      "price_eur_mwh": 40.022106073026656,
      "charge_mw": 100.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": -100.0,
      "soc_mwh": 142.04168476687278,
      "soc_frac": 0.7102084238343639
    },
    {
      "t": 56,
      "hour": 14.0,
      "price_eur_mwh": 47.072723920737005,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 166.0208423834364,
      "soc_frac": 0.830104211917182
    },
    {
      "t": 57,
      "hour": 14.25,
      "price_eur_mwh": 45.588625881107404,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 166.0208423834364,
      "soc_frac": 0.830104211917182
    },
    {
      "t": 58,
      "hour": 14.5,
      "price_eur_mwh": 43.42670739551422,
      "charge_mw": 100.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": -100.0,
      "soc_mwh": 166.0208423834364,
      "soc_frac": 0.830104211917182
    },
    {
      "t": 59,
      "hour": 14.75,
      "price_eur_mwh": 47.938437774102184,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 60,
      "hour": 15.0,
      "price_eur_mwh": 50.9150252364052,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 61,
      "hour": 15.25,
      "price_eur_mwh": 53.59850587277912,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 62,
      "hour": 15.5,
      "price_eur_mwh": 52.01574914657198,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 63,
      "hour": 15.75,
      "price_eur_mwh": 53.990922291377196,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 64,
      "hour": 16.0,
      "price_eur_mwh": 60.46132980279243,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 65,
      "hour": 16.25,
      "price_eur_mwh": 61.25856577860521,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 66,
      "hour": 16.5,
      "price_eur_mwh": 66.47254426956917,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 67,
      "hour": 16.75,
      "price_eur_mwh": 71.53882659571475,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 68,
      "hour": 17.0,
      "price_eur_mwh": 68.27442986039745,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 69,
      "hour": 17.25,
      "price_eur_mwh": 78.48054249772652,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 70,
      "hour": 17.5,
      "price_eur_mwh": 86.4682267670508,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 71,
      "hour": 17.75,
      "price_eur_mwh": 87.56002959953142,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 72,
      "hour": 18.0,
      "price_eur_mwh": 92.20135600478385,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 73,
      "hour": 18.25,
      "price_eur_mwh": 103.46451639378114,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 74,
      "hour": 18.5,
      "price_eur_mwh": 108.72956455615318,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 75,
      "hour": 18.75,
      "price_eur_mwh": 117.3322705766741,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 76,
      "hour": 19.0,
      "price_eur_mwh": 119.8757737892232,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 77,
      "hour": 19.25,
      "price_eur_mwh": 121.98253586493036,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 78,
      "hour": 19.5,
      "price_eur_mwh": 130.54089567996425,
      "charge_mw": 0.0,
      "discharge_mw": 100.0,
      "net_dispatch_mw": 100.0,
      "soc_mwh": 190.0,
      "soc_frac": 0.95
    },
    {
      "t": 79,
      "hour": 19.75,
      "price_eur_mwh": 132.63670022772519,
      "charge_mw": 0.0,
      "discharge_mw": 100.0,
      "net_dispatch_mw": 100.0,
      "soc_mwh": 163.93569824286567,
      "soc_frac": 0.8196784912143283
    },
    {
      "t": 80,
      "hour": 20.0,
      "price_eur_mwh": 137.88946738176705,
      "charge_mw": 0.0,
      "discharge_mw": 100.0,
      "net_dispatch_mw": 100.0,
      "soc_mwh": 137.87139648573134,
      "soc_frac": 0.6893569824286567
    },
    {
      "t": 81,
      "hour": 20.25,
      "price_eur_mwh": 136.1608754687627,
      "charge_mw": 0.0,
      "discharge_mw": 100.0,
      "net_dispatch_mw": 100.0,
      "soc_mwh": 111.807094728597,
      "soc_frac": 0.559035473642985
    },
    {
      "t": 82,
      "hour": 20.5,
      "price_eur_mwh": 129.19596231683016,
      "charge_mw": 0.0,
      "discharge_mw": 100.0,
      "net_dispatch_mw": 100.0,
      "soc_mwh": 85.74279297146265,
      "soc_frac": 0.4287139648573132
    },
    {
      "t": 83,
      "hour": 20.75,
      "price_eur_mwh": 127.68383876072774,
      "charge_mw": 0.0,
      "discharge_mw": 90.59973935703174,
      "net_dispatch_mw": 90.59973935703174,
      "soc_mwh": 59.678491214328304,
      "soc_frac": 0.2983924560716415
    },
    {
      "t": 84,
      "hour": 21.0,
      "price_eur_mwh": 130.04573314073465,
      "charge_mw": 0.0,
      "discharge_mw": 100.0,
      "net_dispatch_mw": 100.0,
      "soc_mwh": 36.064301757134345,
      "soc_frac": 0.1803215087856717
    },
    {
      "t": 85,
      "hour": 21.25,
      "price_eur_mwh": 124.83203554400774,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 86,
      "hour": 21.5,
      "price_eur_mwh": 115.89074453098299,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 87,
      "hour": 21.75,
      "price_eur_mwh": 112.77482306897421,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 88,
      "hour": 22.0,
      "price_eur_mwh": 109.30645764969199,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 89,
      "hour": 22.25,
      "price_eur_mwh": 105.00014675343664,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 90,
      "hour": 22.5,
      "price_eur_mwh": 102.4135528080144,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 91,
      "hour": 22.75,
      "price_eur_mwh": 97.36653891970643,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 92,
      "hour": 23.0,
      "price_eur_mwh": 93.74268529876316,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 93,
      "hour": 23.25,
      "price_eur_mwh": 91.247851228803,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 94,
      "hour": 23.5,
      "price_eur_mwh": 93.67638534806956,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    },
    {
      "t": 95,
      "hour": 23.75,
      "price_eur_mwh": 82.63615054781314,
      "charge_mw": 0.0,
      "discharge_mw": 0.0,
      "net_dispatch_mw": 0.0,
      "soc_mwh": 10.0,
      "soc_frac": 0.05
    }
  ],
  "soc_final_mwh": 10.0
},
};
