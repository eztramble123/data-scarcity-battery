from __future__ import annotations

import hashlib
import json
from copy import deepcopy
from datetime import datetime, timezone
from enum import Enum

from pydantic import BaseModel, Field

from api.chain import get_chain_service


ATHENS_BOUNDS = {
    "lat_min": 37.87,
    "lat_max": 38.10,
    "lon_min": 23.62,
    "lon_max": 23.85,
}


class VerificationStatus(str, Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"


class OnchainStatus(str, Enum):
    not_minted = "not_minted"
    minted = "minted"


class SubmissionStage(str, Enum):
    submitted = "submitted"
    verified = "verified"
    minted = "minted"
    admitted = "admitted"


class SiteLocation(BaseModel):
    country: str = "GR"
    region: str = "Attica"
    city: str = "Athens"
    district: str
    lat: float
    lon: float


class UsageInterval(BaseModel):
    start_at: str
    end_at: str
    kwh: float = Field(gt=0)


class SubmissionCreate(BaseModel):
    business_name: str
    site_name: str
    sector: str
    meter_id: str
    location: SiteLocation
    usage_batch: list[UsageInterval]
    receipt_hash: str | None = None


class SubmissionRecord(SubmissionCreate):
    submission_id: str
    submitted_at: str
    canonical_hash: str
    proof_hash: str
    verification_status: VerificationStatus
    onchain_status: OnchainStatus
    token_id: str | None = None


class VerificationRecord(BaseModel):
    submission_id: str
    verified_at: str
    verifier_ref: str
    checks: dict[str, bool]
    status: VerificationStatus
    summary: str


class ProofArtifact(BaseModel):
    submission_id: str
    canonical_hash: str
    proof_hash: str
    generated_at: str


class ReceiptTokenView(BaseModel):
    token_id: str
    submission_id: str
    proof_hash: str
    minted_at: str
    chain: str
    owner_ref: str
    network: str | None = None
    chain_id: int | None = None
    contract_address: str | None = None
    tx_hash: str | None = None


class AthensMapSite(BaseModel):
    site_id: str
    business_name: str
    site_name: str
    sector: str
    district: str
    lat: float
    lon: float
    annual_mwh: float
    latest_submission_id: str
    stage: SubmissionStage
    proof_hash: str
    token_id: str | None
    admitted_to_optimizer: bool
    meter_id: str
    last_submission_at: str


class PlatformOverview(BaseModel):
    submitted: int
    verified: int
    minted: int
    admitted: int
    businesses: int
    annual_mwh: float


def _now_iso() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


def canonical_submission_hash(payload: SubmissionCreate) -> str:
    canonical = json.dumps(payload.model_dump(mode="json"), sort_keys=True, separators=(",", ":"))
    return "0x" + hashlib.sha1(canonical.encode("utf-8")).hexdigest()


def proof_hash_for(canonical_hash: str) -> str:
    return "0x" + hashlib.sha1(f"proof:{canonical_hash}".encode("utf-8")).hexdigest()


def _is_in_athens(location: SiteLocation) -> bool:
    return (
        ATHENS_BOUNDS["lat_min"] <= location.lat <= ATHENS_BOUNDS["lat_max"]
        and ATHENS_BOUNDS["lon_min"] <= location.lon <= ATHENS_BOUNDS["lon_max"]
    )


def _seed_store() -> dict[str, dict]:
    submissions = {
        "sub-001": SubmissionRecord(
            submission_id="sub-001",
            business_name="Piraeus Cold Storage",
            site_name="Piraeus Port Warehouse",
            sector="Cold chain logistics",
            meter_id="GR-PIR-001",
            location=SiteLocation(district="Piraeus", lat=37.9431, lon=23.6466),
            usage_batch=[
                UsageInterval(start_at="2026-04-28T00:00:00+03:00", end_at="2026-04-28T00:15:00+03:00", kwh=367.1)
            ],
            receipt_hash="bill-0x111",
            submitted_at="2026-04-29T10:15:00+03:00",
            canonical_hash="0x5f0cf2f215b6de5304b62d92c2a872de1de2a907",
            proof_hash="0x7c1bf9a0d32e91aa4d0ef0e55013b8f0c5a8a61e",
            verification_status=VerificationStatus.verified,
            onchain_status=OnchainStatus.minted,
            token_id="rt-001",
        ),
        "sub-003": SubmissionRecord(
            submission_id="sub-003",
            business_name="Marousi Data Campus",
            site_name="North Athens Data Hall",
            sector="Data center",
            meter_id="GR-MAR-203",
            location=SiteLocation(district="Marousi", lat=38.0558, lon=23.8054),
            usage_batch=[
                UsageInterval(start_at="2026-04-28T00:00:00+03:00", end_at="2026-04-28T00:15:00+03:00", kwh=612.4)
            ],
            receipt_hash="bill-0x333",
            submitted_at="2026-04-29T11:45:00+03:00",
            canonical_hash="0x63e3e11d7fd8f3ae9cbf98ab8d1f0ca6e4c0ea42",
            proof_hash="0x42af8c9db1ac6a7acbb7f8b06c82af720434ae2b",
            verification_status=VerificationStatus.verified,
            onchain_status=OnchainStatus.not_minted,
            token_id=None,
        ),
        "sub-006": SubmissionRecord(
            submission_id="sub-006",
            business_name="Kolonaki Coffee House",
            site_name="Kolonaki Espresso Bar",
            sector="Cafe",
            meter_id="GR-KOL-044",
            location=SiteLocation(district="Kolonaki", lat=37.9788, lon=23.7421),
            usage_batch=[
                UsageInterval(start_at="2026-04-28T00:00:00+03:00", end_at="2026-04-28T00:15:00+03:00", kwh=6.4)
            ],
            receipt_hash="bill-0x666",
            submitted_at="2026-04-29T12:18:00+03:00",
            canonical_hash="0x6a2b36310db2a9714d4f3bd3e4f72ef4a7d7fa96",
            proof_hash="0x57c4a1b8d0335f09d0df43a7f4d2c2c9e0de61a4",
            verification_status=VerificationStatus.pending,
            onchain_status=OnchainStatus.not_minted,
            token_id=None,
        ),
        "sub-007": SubmissionRecord(
            submission_id="sub-007",
            business_name="Nea Smyrni Oven",
            site_name="Neighborhood Bakery",
            sector="Bakery",
            meter_id="GR-NSM-219",
            location=SiteLocation(district="Nea Smyrni", lat=37.9456, lon=23.7128),
            usage_batch=[
                UsageInterval(start_at="2026-04-28T00:00:00+03:00", end_at="2026-04-28T00:15:00+03:00", kwh=5.7)
            ],
            receipt_hash="bill-0x777",
            submitted_at="2026-04-29T11:32:00+03:00",
            canonical_hash="0xd9a9c447acff81d71cfc4d1e3d32d761e8baf713",
            proof_hash="0x48de4382f74e0cb68f88033ea097903f1d854fcb",
            verification_status=VerificationStatus.verified,
            onchain_status=OnchainStatus.not_minted,
            token_id=None,
        ),
        "sub-008": SubmissionRecord(
            submission_id="sub-008",
            business_name="Exarchia Print Studio",
            site_name="Corner Print Shop",
            sector="Print shop",
            meter_id="GR-EXA-071",
            location=SiteLocation(district="Exarchia", lat=37.9873, lon=23.7321),
            usage_batch=[
                UsageInterval(start_at="2026-04-28T00:00:00+03:00", end_at="2026-04-28T00:15:00+03:00", kwh=7.2)
            ],
            receipt_hash="bill-0x888",
            submitted_at="2026-04-29T10:52:00+03:00",
            canonical_hash="0x255e6a28f9001f94db0942ccb851c3b932ab5b6d",
            proof_hash="0x8ce79290bfbd8f11dd7b8dcc6fe40e7604c1a4f6",
            verification_status=VerificationStatus.verified,
            onchain_status=OnchainStatus.minted,
            token_id="rt-008",
        ),
    }
    verifications = {
        "sub-001": VerificationRecord(
            submission_id="sub-001",
            verified_at="2026-04-29T10:22:00+03:00",
            verifier_ref="athens-grid-validator-1",
            checks={"athens_site": True, "positive_usage": True, "meter_present": True},
            status=VerificationStatus.verified,
            summary="Verified against Athens site bounds and meter batch rules.",
        ),
        "sub-003": VerificationRecord(
            submission_id="sub-003",
            verified_at="2026-04-29T11:52:00+03:00",
            verifier_ref="athens-grid-validator-2",
            checks={"athens_site": True, "positive_usage": True, "meter_present": True},
            status=VerificationStatus.verified,
            summary="Verified against Athens site bounds and meter batch rules.",
        ),
        "sub-007": VerificationRecord(
            submission_id="sub-007",
            verified_at="2026-04-29T11:39:00+03:00",
            verifier_ref="athens-grid-validator-3",
            checks={"athens_site": True, "positive_usage": True, "meter_present": True},
            status=VerificationStatus.verified,
            summary="Verified against Athens site bounds and meter batch rules.",
        ),
        "sub-008": VerificationRecord(
            submission_id="sub-008",
            verified_at="2026-04-29T10:58:00+03:00",
            verifier_ref="athens-grid-validator-2",
            checks={"athens_site": True, "positive_usage": True, "meter_present": True},
            status=VerificationStatus.verified,
            summary="Verified against Athens site bounds and meter batch rules.",
        ),
    }
    tokens = {
        "rt-001": ReceiptTokenView(
            token_id="rt-001",
            submission_id="sub-001",
            proof_hash="0x7c1bf9a0d32e91aa4d0ef0e55013b8f0c5a8a61e",
            minted_at="2026-04-29T10:25:00+03:00",
            chain="mock-athens-receipt-chain",
            owner_ref="Piraeus Cold Storage",
            network="sepolia",
            chain_id=11155111,
        ),
        "rt-008": ReceiptTokenView(
            token_id="rt-008",
            submission_id="sub-008",
            proof_hash="0x8ce79290bfbd8f11dd7b8dcc6fe40e7604c1a4f6",
            minted_at="2026-04-29T11:01:00+03:00",
            chain="mock-athens-receipt-chain",
            owner_ref="Exarchia Print Studio",
            network="sepolia",
            chain_id=11155111,
        ),
    }
    sites = {
        "ath-001": AthensMapSite(
            site_id="ath-001",
            business_name="Piraeus Cold Storage",
            site_name="Piraeus Port Warehouse",
            sector="Cold chain logistics",
            district="Piraeus",
            lat=37.9431,
            lon=23.6466,
            annual_mwh=12840,
            latest_submission_id="sub-001",
            stage=SubmissionStage.admitted,
            proof_hash="0x7c1bf9a0d32e91aa4d0ef0e55013b8f0c5a8a61e",
            token_id="rt-001",
            admitted_to_optimizer=True,
            meter_id="GR-PIR-001",
            last_submission_at="2026-04-29T10:15:00+03:00",
        ),
        "ath-003": AthensMapSite(
            site_id="ath-003",
            business_name="Marousi Data Campus",
            site_name="North Athens Data Hall",
            sector="Data center",
            district="Marousi",
            lat=38.0558,
            lon=23.8054,
            annual_mwh=22100,
            latest_submission_id="sub-003",
            stage=SubmissionStage.verified,
            proof_hash="0x42af8c9db1ac6a7acbb7f8b06c82af720434ae2b",
            token_id=None,
            admitted_to_optimizer=False,
            meter_id="GR-MAR-203",
            last_submission_at="2026-04-29T11:45:00+03:00",
        ),
        "ath-006": AthensMapSite(
            site_id="ath-006",
            business_name="Kolonaki Coffee House",
            site_name="Kolonaki Espresso Bar",
            sector="Cafe",
            district="Kolonaki",
            lat=37.9788,
            lon=23.7421,
            annual_mwh=210,
            latest_submission_id="sub-006",
            stage=SubmissionStage.submitted,
            proof_hash="0x57c4a1b8d0335f09d0df43a7f4d2c2c9e0de61a4",
            token_id=None,
            admitted_to_optimizer=False,
            meter_id="GR-KOL-044",
            last_submission_at="2026-04-29T12:18:00+03:00",
        ),
        "ath-007": AthensMapSite(
            site_id="ath-007",
            business_name="Nea Smyrni Oven",
            site_name="Neighborhood Bakery",
            sector="Bakery",
            district="Nea Smyrni",
            lat=37.9456,
            lon=23.7128,
            annual_mwh=185,
            latest_submission_id="sub-007",
            stage=SubmissionStage.verified,
            proof_hash="0x48de4382f74e0cb68f88033ea097903f1d854fcb",
            token_id=None,
            admitted_to_optimizer=False,
            meter_id="GR-NSM-219",
            last_submission_at="2026-04-29T11:32:00+03:00",
        ),
        "ath-008": AthensMapSite(
            site_id="ath-008",
            business_name="Exarchia Print Studio",
            site_name="Corner Print Shop",
            sector="Print shop",
            district="Exarchia",
            lat=37.9873,
            lon=23.7321,
            annual_mwh=260,
            latest_submission_id="sub-008",
            stage=SubmissionStage.minted,
            proof_hash="0x8ce79290bfbd8f11dd7b8dcc6fe40e7604c1a4f6",
            token_id="rt-008",
            admitted_to_optimizer=False,
            meter_id="GR-EXA-071",
            last_submission_at="2026-04-29T10:52:00+03:00",
        ),
    }
    return {
        "submissions": submissions,
        "verifications": verifications,
        "tokens": tokens,
        "sites": sites,
    }


_STORE = _seed_store()


def _next_numeric_id(prefix: str, bucket: dict[str, object]) -> str:
    current = [
        int(key.split("-")[-1])
        for key in bucket
        if key.startswith(f"{prefix}-") and key.split("-")[-1].isdigit()
    ]
    nxt = max(current, default=0) + 1
    return f"{prefix}-{nxt:03d}"


def platform_overview() -> PlatformOverview:
    sites = list(_STORE["sites"].values())
    return PlatformOverview(
        submitted=sum(1 for site in sites if site.stage == SubmissionStage.submitted),
        verified=sum(1 for site in sites if site.stage == SubmissionStage.verified),
        minted=sum(1 for site in sites if site.stage == SubmissionStage.minted),
        admitted=sum(1 for site in sites if site.stage == SubmissionStage.admitted),
        businesses=len(sites),
        annual_mwh=sum(site.annual_mwh for site in sites),
    )


def list_sites() -> list[AthensMapSite]:
    return list(_STORE["sites"].values())


def list_submissions() -> list[SubmissionRecord]:
    return list(_STORE["submissions"].values())


def get_submission(submission_id: str) -> SubmissionRecord:
    return _STORE["submissions"][submission_id]


def create_submission(payload: SubmissionCreate) -> SubmissionRecord:
    submission_id = _next_numeric_id("sub", _STORE["submissions"])
    canonical_hash = canonical_submission_hash(payload)
    proof_hash = proof_hash_for(canonical_hash)
    record = SubmissionRecord(
        **payload.model_dump(),
        submission_id=submission_id,
        submitted_at=_now_iso(),
        canonical_hash=canonical_hash,
        proof_hash=proof_hash,
        verification_status=VerificationStatus.pending,
        onchain_status=OnchainStatus.not_minted,
        token_id=None,
    )
    _STORE["submissions"][submission_id] = record

    site_id = _next_numeric_id("ath", _STORE["sites"])
    _STORE["sites"][site_id] = AthensMapSite(
        site_id=site_id,
        business_name=payload.business_name,
        site_name=payload.site_name,
        sector=payload.sector,
        district=payload.location.district,
        lat=payload.location.lat,
        lon=payload.location.lon,
        annual_mwh=sum(interval.kwh for interval in payload.usage_batch) * 365 / 1000,
        latest_submission_id=submission_id,
        stage=SubmissionStage.submitted,
        proof_hash=proof_hash,
        token_id=None,
        admitted_to_optimizer=False,
        meter_id=payload.meter_id,
        last_submission_at=record.submitted_at,
    )
    return record


def verify_submission(submission_id: str) -> VerificationRecord:
    record = _STORE["submissions"][submission_id]
    checks = {
        "athens_site": _is_in_athens(record.location),
        "positive_usage": all(interval.kwh > 0 for interval in record.usage_batch),
        "meter_present": bool(record.meter_id.strip()),
    }
    status = VerificationStatus.verified if all(checks.values()) else VerificationStatus.rejected
    verification = VerificationRecord(
        submission_id=submission_id,
        verified_at=_now_iso(),
        verifier_ref="athens-grid-validator-1",
        checks=checks,
        status=status,
        summary="Verified against Athens site bounds and usage batch rules."
        if status == VerificationStatus.verified
        else "Rejected by Athens site or interval validation.",
    )
    _STORE["verifications"][submission_id] = verification
    record.verification_status = status
    for site in _STORE["sites"].values():
        if site.latest_submission_id == submission_id:
            site.stage = SubmissionStage.verified if status == VerificationStatus.verified else SubmissionStage.submitted
    return verification


def mint_receipt_token(submission_id: str) -> ReceiptTokenView:
    record = _STORE["submissions"][submission_id]
    if record.verification_status != VerificationStatus.verified:
        raise ValueError("submission must be verified before minting")
    if record.token_id:
        return _STORE["tokens"][record.token_id]

    token_id = _next_numeric_id("rt", _STORE["tokens"])
    chain_result = get_chain_service().mint_receipt_token(
        submission_id=submission_id,
        proof_hash=record.proof_hash,
        owner_ref=record.business_name,
    )
    token = ReceiptTokenView(
        token_id=token_id,
        submission_id=submission_id,
        proof_hash=record.proof_hash,
        minted_at=_now_iso(),
        chain="mock-athens-receipt-chain",
        owner_ref=record.business_name,
        network=chain_result.network,
        chain_id=chain_result.chain_id,
        contract_address=chain_result.contract_address,
        tx_hash=chain_result.tx_hash,
    )
    _STORE["tokens"][token_id] = token
    record.token_id = token_id
    record.onchain_status = OnchainStatus.minted
    for site in _STORE["sites"].values():
        if site.latest_submission_id == submission_id:
            site.token_id = token_id
            site.stage = SubmissionStage.minted
    return token


def admit_submission_to_operator(submission_id: str) -> SubmissionRecord:
    record = _STORE["submissions"][submission_id]
    if record.onchain_status != OnchainStatus.minted or not record.token_id:
        raise ValueError("submission must be minted before admission")
    for site in _STORE["sites"].values():
        if site.latest_submission_id == submission_id:
            site.stage = SubmissionStage.admitted
            site.admitted_to_optimizer = True
    return record


def list_tokens() -> list[ReceiptTokenView]:
    return list(_STORE["tokens"].values())


def get_token(token_id: str) -> ReceiptTokenView:
    return _STORE["tokens"][token_id]


def operator_datasets() -> dict:
    admitted_sites = [site for site in _STORE["sites"].values() if site.admitted_to_optimizer]
    return {
        "admitted_sites": len(admitted_sites),
        "annual_mwh": sum(site.annual_mwh for site in admitted_sites),
        "sites": [deepcopy(site) for site in admitted_sites],
        "operator_story": "Admitted Athens demand batches are now available to sharpen battery optimization and decision explanations.",
    }
