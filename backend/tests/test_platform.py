import pytest

import api.platform as platform


@pytest.fixture(autouse=True)
def reset_platform_store():
    platform._STORE = platform._seed_store()
    yield
    platform._STORE = platform._seed_store()


def _payload(lat: float = 38.0, lon: float = 23.75) -> platform.SubmissionCreate:
    return platform.SubmissionCreate(
        business_name="Test Athens Retail",
        site_name="Ampelokipi Store",
        sector="Retail",
        meter_id="GR-TST-001",
        location=platform.SiteLocation(district="Ampelokipi", lat=lat, lon=lon),
        usage_batch=[
            platform.UsageInterval(
                start_at="2026-04-28T00:00:00+03:00",
                end_at="2026-04-28T00:15:00+03:00",
                kwh=125.0,
            )
        ],
        receipt_hash="bill-0x999",
    )


def test_canonical_hash_is_deterministic():
    payload = _payload()
    first = platform.canonical_submission_hash(payload)
    second = platform.canonical_submission_hash(payload)
    assert first == second
    assert first.startswith("0x")


def test_create_submission_uses_next_available_id():
    existing_ids = [int(submission_id.split("-")[1]) for submission_id in platform._STORE["submissions"]]
    expected_id = f"sub-{max(existing_ids) + 1:03d}"
    record = platform.create_submission(_payload())
    assert record.submission_id == expected_id
    assert record.canonical_hash.startswith("0x")
    assert record.proof_hash.startswith("0x")
    assert platform.list_sites()[-1].latest_submission_id == expected_id


def test_cannot_mint_before_verification():
    record = platform.create_submission(_payload())
    with pytest.raises(ValueError):
        platform.mint_receipt_token(record.submission_id)


def test_verify_then_mint_then_admit():
    record = platform.create_submission(_payload())
    verification = platform.verify_submission(record.submission_id)
    token = platform.mint_receipt_token(record.submission_id)
    admitted = platform.admit_submission_to_operator(record.submission_id)

    assert verification.status == platform.VerificationStatus.verified
    assert token.submission_id == record.submission_id
    assert admitted.token_id == token.token_id

    site = next(
        site
        for site in platform.list_sites()
        if site.latest_submission_id == record.submission_id
    )
    assert site.stage == platform.SubmissionStage.admitted
    assert site.admitted_to_optimizer is True


def test_outside_athens_is_rejected():
    record = platform.create_submission(_payload(lat=39.0, lon=22.0))
    verification = platform.verify_submission(record.submission_id)
    assert verification.status == platform.VerificationStatus.rejected
