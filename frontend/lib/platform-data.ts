import type { Scenario } from "./api";

export type SubmissionStage = "submitted" | "verified" | "minted" | "admitted";

export type AthensSite = {
  site_id: string;
  business_name: string;
  site_name: string;
  sector: string;
  district: string;
  lat: number;
  lon: number;
  annual_mwh: number;
  latest_submission_id: string;
  stage: SubmissionStage;
  proof_hash: string;
  token_id: string | null;
  admitted_to_optimizer: boolean;
  meter_id: string;
  last_submission_at: string;
};

export type UsageInterval = {
  start_at: string;
  end_at: string;
  kwh: number;
};

export type SubmissionRecord = {
  submission_id: string;
  business_name: string;
  site_name: string;
  district: string;
  sector: string;
  submitted_at: string;
  usage_intervals: number;
  total_kwh: number;
  canonical_hash: string;
  proof_hash: string;
  verification_status: "pending" | "verified";
  onchain_status: "not_minted" | "minted";
  token_id: string | null;
};

export type ReceiptTokenRecord = {
  token_id: string;
  submission_id: string;
  proof_hash: string;
  minted_at: string;
  chain: string;
  owner_ref: string;
};

export const ATHENS_SITES: AthensSite[] = [
  {
    site_id: "ath-001",
    business_name: "Piraeus Cold Storage",
    site_name: "Piraeus Port Warehouse",
    sector: "Cold chain logistics",
    district: "Piraeus",
    lat: 37.9431,
    lon: 23.6466,
    annual_mwh: 12840,
    latest_submission_id: "sub-001",
    stage: "admitted",
    proof_hash: "0x7c1bf9a0d32e91aa4d0ef0e55013b8f0c5a8a61e",
    token_id: "rt-001",
    admitted_to_optimizer: true,
    meter_id: "GR-PIR-001",
    last_submission_at: "2026-04-29T10:15:00+03:00",
  },
  {
    site_id: "ath-002",
    business_name: "Athens Metro Retail",
    site_name: "Monastiraki Retail Cluster",
    sector: "Retail",
    district: "Athens Center",
    lat: 37.9764,
    lon: 23.7258,
    annual_mwh: 7640,
    latest_submission_id: "sub-002",
    stage: "minted",
    proof_hash: "0x97f4cb59880b7ccbd004b1aef7db1715f3246048",
    token_id: "rt-002",
    admitted_to_optimizer: false,
    meter_id: "GR-ATH-114",
    last_submission_at: "2026-04-29T11:00:00+03:00",
  },
  {
    site_id: "ath-003",
    business_name: "Marousi Data Campus",
    site_name: "North Athens Data Hall",
    sector: "Data center",
    district: "Marousi",
    lat: 38.0558,
    lon: 23.8054,
    annual_mwh: 22100,
    latest_submission_id: "sub-003",
    stage: "verified",
    proof_hash: "0x42af8c9db1ac6a7acbb7f8b06c82af720434ae2b",
    token_id: null,
    admitted_to_optimizer: false,
    meter_id: "GR-MAR-203",
    last_submission_at: "2026-04-29T11:45:00+03:00",
  },
  {
    site_id: "ath-004",
    business_name: "Kifisia Food Works",
    site_name: "Kifisia Processing Plant",
    sector: "Food processing",
    district: "Kifisia",
    lat: 38.0735,
    lon: 23.8084,
    annual_mwh: 9350,
    latest_submission_id: "sub-004",
    stage: "submitted",
    proof_hash: "0x18b0be193e2c74489d058d8ae8b5162a44ef618c",
    token_id: null,
    admitted_to_optimizer: false,
    meter_id: "GR-KIF-018",
    last_submission_at: "2026-04-29T12:05:00+03:00",
  },
  {
    site_id: "ath-005",
    business_name: "Elliniko Cooling Hub",
    site_name: "South Grid Cooling Campus",
    sector: "Commercial cooling",
    district: "Elliniko",
    lat: 37.8886,
    lon: 23.7364,
    annual_mwh: 11980,
    latest_submission_id: "sub-005",
    stage: "admitted",
    proof_hash: "0xa7584782cc24a75d3b89bc4f8b56ef8a251d94ea",
    token_id: "rt-005",
    admitted_to_optimizer: true,
    meter_id: "GR-ELL-901",
    last_submission_at: "2026-04-29T09:40:00+03:00",
  },
  {
    site_id: "ath-006",
    business_name: "Kolonaki Coffee House",
    site_name: "Kolonaki Espresso Bar",
    sector: "Cafe",
    district: "Kolonaki",
    lat: 37.9788,
    lon: 23.7421,
    annual_mwh: 210,
    latest_submission_id: "sub-006",
    stage: "submitted",
    proof_hash: "0x57c4a1b8d0335f09d0df43a7f4d2c2c9e0de61a4",
    token_id: null,
    admitted_to_optimizer: false,
    meter_id: "GR-KOL-044",
    last_submission_at: "2026-04-29T12:18:00+03:00",
  },
  {
    site_id: "ath-007",
    business_name: "Nea Smyrni Oven",
    site_name: "Neighborhood Bakery",
    sector: "Bakery",
    district: "Nea Smyrni",
    lat: 37.9456,
    lon: 23.7128,
    annual_mwh: 185,
    latest_submission_id: "sub-007",
    stage: "verified",
    proof_hash: "0x48de4382f74e0cb68f88033ea097903f1d854fcb",
    token_id: null,
    admitted_to_optimizer: false,
    meter_id: "GR-NSM-219",
    last_submission_at: "2026-04-29T11:32:00+03:00",
  },
  {
    site_id: "ath-008",
    business_name: "Exarchia Print Studio",
    site_name: "Corner Print Shop",
    sector: "Print shop",
    district: "Exarchia",
    lat: 37.9873,
    lon: 23.7321,
    annual_mwh: 260,
    latest_submission_id: "sub-008",
    stage: "minted",
    proof_hash: "0x8ce79290bfbd8f11dd7b8dcc6fe40e7604c1a4f6",
    token_id: "rt-008",
    admitted_to_optimizer: false,
    meter_id: "GR-EXA-071",
    last_submission_at: "2026-04-29T10:52:00+03:00",
  },
];

export const SUBMISSIONS: SubmissionRecord[] = [
  {
    submission_id: "sub-001",
    business_name: "Piraeus Cold Storage",
    site_name: "Piraeus Port Warehouse",
    district: "Piraeus",
    sector: "Cold chain logistics",
    submitted_at: "2026-04-29T10:15:00+03:00",
    usage_intervals: 96,
    total_kwh: 35240,
    canonical_hash: "0x5f0cf2f215b6de5304b62d92c2a872de1de2a907",
    proof_hash: "0x7c1bf9a0d32e91aa4d0ef0e55013b8f0c5a8a61e",
    verification_status: "verified",
    onchain_status: "minted",
    token_id: "rt-001",
  },
  {
    submission_id: "sub-002",
    business_name: "Athens Metro Retail",
    site_name: "Monastiraki Retail Cluster",
    district: "Athens Center",
    sector: "Retail",
    submitted_at: "2026-04-29T11:00:00+03:00",
    usage_intervals: 96,
    total_kwh: 16880,
    canonical_hash: "0x6f70226a1d4f57f2cd1c77e40dd12d21fa01ba99",
    proof_hash: "0x97f4cb59880b7ccbd004b1aef7db1715f3246048",
    verification_status: "verified",
    onchain_status: "minted",
    token_id: "rt-002",
  },
  {
    submission_id: "sub-003",
    business_name: "Marousi Data Campus",
    site_name: "North Athens Data Hall",
    district: "Marousi",
    sector: "Data center",
    submitted_at: "2026-04-29T11:45:00+03:00",
    usage_intervals: 96,
    total_kwh: 60700,
    canonical_hash: "0x63e3e11d7fd8f3ae9cbf98ab8d1f0ca6e4c0ea42",
    proof_hash: "0x42af8c9db1ac6a7acbb7f8b06c82af720434ae2b",
    verification_status: "verified",
    onchain_status: "not_minted",
    token_id: null,
  },
  {
    submission_id: "sub-004",
    business_name: "Kifisia Food Works",
    site_name: "Kifisia Processing Plant",
    district: "Kifisia",
    sector: "Food processing",
    submitted_at: "2026-04-29T12:05:00+03:00",
    usage_intervals: 96,
    total_kwh: 22450,
    canonical_hash: "0x13c05f2f4762d24d43f6a6ccd26d0c4ec1275d8b",
    proof_hash: "0x18b0be193e2c74489d058d8ae8b5162a44ef618c",
    verification_status: "pending",
    onchain_status: "not_minted",
    token_id: null,
  },
  {
    submission_id: "sub-005",
    business_name: "Elliniko Cooling Hub",
    site_name: "South Grid Cooling Campus",
    district: "Elliniko",
    sector: "Commercial cooling",
    submitted_at: "2026-04-29T09:40:00+03:00",
    usage_intervals: 96,
    total_kwh: 31420,
    canonical_hash: "0xbc4938d12f76fb9a9a83e2101b2d1ad7876ffac3",
    proof_hash: "0xa7584782cc24a75d3b89bc4f8b56ef8a251d94ea",
    verification_status: "verified",
    onchain_status: "minted",
    token_id: "rt-005",
  },
  {
    submission_id: "sub-006",
    business_name: "Kolonaki Coffee House",
    site_name: "Kolonaki Espresso Bar",
    district: "Kolonaki",
    sector: "Cafe",
    submitted_at: "2026-04-29T12:18:00+03:00",
    usage_intervals: 96,
    total_kwh: 620,
    canonical_hash: "0x6a2b36310db2a9714d4f3bd3e4f72ef4a7d7fa96",
    proof_hash: "0x57c4a1b8d0335f09d0df43a7f4d2c2c9e0de61a4",
    verification_status: "pending",
    onchain_status: "not_minted",
    token_id: null,
  },
  {
    submission_id: "sub-007",
    business_name: "Nea Smyrni Oven",
    site_name: "Neighborhood Bakery",
    district: "Nea Smyrni",
    sector: "Bakery",
    submitted_at: "2026-04-29T11:32:00+03:00",
    usage_intervals: 96,
    total_kwh: 540,
    canonical_hash: "0xd9a9c447acff81d71cfc4d1e3d32d761e8baf713",
    proof_hash: "0x48de4382f74e0cb68f88033ea097903f1d854fcb",
    verification_status: "verified",
    onchain_status: "not_minted",
    token_id: null,
  },
  {
    submission_id: "sub-008",
    business_name: "Exarchia Print Studio",
    site_name: "Corner Print Shop",
    district: "Exarchia",
    sector: "Print shop",
    submitted_at: "2026-04-29T10:52:00+03:00",
    usage_intervals: 96,
    total_kwh: 710,
    canonical_hash: "0x255e6a28f9001f94db0942ccb851c3b932ab5b6d",
    proof_hash: "0x8ce79290bfbd8f11dd7b8dcc6fe40e7604c1a4f6",
    verification_status: "verified",
    onchain_status: "minted",
    token_id: "rt-008",
  },
];

export const TOKENS: ReceiptTokenRecord[] = [
  {
    token_id: "rt-001",
    submission_id: "sub-001",
    proof_hash: "0x7c1bf9a0d32e91aa4d0ef0e55013b8f0c5a8a61e",
    minted_at: "2026-04-29T10:25:00+03:00",
    chain: "mock-athens-receipt-chain",
    owner_ref: "Piraeus Cold Storage",
  },
  {
    token_id: "rt-002",
    submission_id: "sub-002",
    proof_hash: "0x97f4cb59880b7ccbd004b1aef7db1715f3246048",
    minted_at: "2026-04-29T11:12:00+03:00",
    chain: "mock-athens-receipt-chain",
    owner_ref: "Athens Metro Retail",
  },
  {
    token_id: "rt-005",
    submission_id: "sub-005",
    proof_hash: "0xa7584782cc24a75d3b89bc4f8b56ef8a251d94ea",
    minted_at: "2026-04-29T09:49:00+03:00",
    chain: "mock-athens-receipt-chain",
    owner_ref: "Elliniko Cooling Hub",
  },
  {
    token_id: "rt-008",
    submission_id: "sub-008",
    proof_hash: "0x8ce79290bfbd8f11dd7b8dcc6fe40e7604c1a4f6",
    minted_at: "2026-04-29T11:01:00+03:00",
    chain: "mock-athens-receipt-chain",
    owner_ref: "Exarchia Print Studio",
  },
];

export const SUBMISSION_SCHEMA_PREVIEW = {
  business_name: "string",
  site_name: "string",
  sector: "string",
  meter_id: "string",
  location: {
    country: "GR",
    region: "Attica",
    city: "Athens",
    district: "Marousi",
    lat: 38.0558,
    lon: 23.8054,
  },
  usage_batch: [
    {
      start_at: "2026-04-28T00:00:00+03:00",
      end_at: "2026-04-28T00:15:00+03:00",
      kwh: 612.4,
    },
  ],
  receipt_hash: "optional_document_or_bill_hash",
} as const;

export function getPlatformOverview() {
  const submitted = ATHENS_SITES.filter((site) => site.stage === "submitted").length;
  const verified = ATHENS_SITES.filter((site) => site.stage === "verified").length;
  const minted = ATHENS_SITES.filter((site) => site.stage === "minted").length;
  const admitted = ATHENS_SITES.filter((site) => site.stage === "admitted").length;
  const annualMwh = ATHENS_SITES.reduce((acc, site) => acc + site.annual_mwh, 0);
  return {
    submitted,
    verified,
    minted,
    admitted,
    annualMwh,
    businesses: ATHENS_SITES.length,
  };
}

export function getStageColor(stage: SubmissionStage) {
  switch (stage) {
    case "submitted":
      return "#f59e0b";
    case "verified":
      return "#38bdf8";
    case "minted":
      return "#a855f7";
    case "admitted":
      return "#84cc16";
  }
}

export function getStageLabel(stage: SubmissionStage) {
  switch (stage) {
    case "submitted":
      return "submitted";
    case "verified":
      return "verified off-chain";
    case "minted":
      return "minted on-chain";
    case "admitted":
      return "admitted to model";
  }
}

export function getOperatorNarrative(scenario: Scenario) {
  const admittedSites = ATHENS_SITES.filter((site) => site.admitted_to_optimizer);
  const topSite = admittedSites[0];
  return {
    admittedSites: admittedSites.length,
    annualMwh: admittedSites.reduce((acc, site) => acc + site.annual_mwh, 0),
    headline:
      scenario.name === "curtailment"
        ? "Admitted Athens demand data sharpens when the battery should absorb midday surplus."
        : "Admitted Athens demand data improves how the operator ranks normal arbitrage windows.",
    detail: topSite
      ? `${topSite.site_name} is already feeding the optimization layer with verified demand batches.`
      : "No admitted Athens site is feeding the optimization layer yet.",
  };
}

export function getSiteById(siteId: string) {
  return ATHENS_SITES.find((site) => site.site_id === siteId) ?? ATHENS_SITES[0];
}

export function getSubmissionForSite(siteId: string) {
  const site = getSiteById(siteId);
  return SUBMISSIONS.find((submission) => submission.submission_id === site.latest_submission_id) ?? null;
}

export function getTokenForSite(siteId: string) {
  const site = getSiteById(siteId);
  return site.token_id ? TOKENS.find((token) => token.token_id === site.token_id) ?? null : null;
}
