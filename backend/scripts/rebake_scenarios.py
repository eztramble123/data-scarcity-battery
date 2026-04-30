"""Rebuild frontend/lib/scenarios-data.ts from the local FastAPI scenario endpoints."""

from __future__ import annotations

import json
import os
from pathlib import Path

import httpx


API_ROOT = os.environ.get("SCENARIO_API_ROOT", "http://127.0.0.1:8765")
OUT_PATH = Path(__file__).resolve().parents[2] / "frontend" / "lib" / "scenarios-data.ts"


def main() -> None:
    with httpx.Client(timeout=30.0) as client:
        scenario_list = client.get(f"{API_ROOT}/scenarios").raise_for_status().json()
        scenarios: dict[str, object] = {}
        for item in scenario_list["scenarios"]:
            name = item["name"]
            payload = client.get(f"{API_ROOT}/scenarios/{name}").raise_for_status().json()
            scenarios[name] = payload

    content = (
        "// AUTO-GENERATED — baked from the FastAPI MILP solver.\n"
        "// Regenerate by running the API and `uv run python scripts/rebake_scenarios.py`.\n\n"
        'import type { Scenario, ScenarioListItem } from "./api";\n\n'
        f"export const SCENARIO_LIST: ScenarioListItem[] = {json.dumps(scenario_list['scenarios'], indent=2)};\n\n"
        f"export const SCENARIOS: Record<string, Scenario> = {json.dumps(scenarios, indent=2)};\n"
    )
    OUT_PATH.write_text(content + "\n")


if __name__ == "__main__":
    main()
