export type UsageIntervalInput = {
  start_at: string;
  end_at: string;
  kwh: number;
};

export type SubmissionCreateInput = {
  business_name: string;
  site_name: string;
  sector: string;
  meter_id: string;
  location: {
    country: string;
    region: string;
    city: string;
    district: string;
    lat: number;
    lon: number;
  };
  usage_batch: UsageIntervalInput[];
  receipt_hash?: string;
};

export type SubmissionCreateResponse = {
  submission_id: string;
  submitted_at: string;
  canonical_hash: string;
  proof_hash: string;
  verification_status: "pending" | "verified" | "rejected";
  onchain_status: "not_minted" | "minted";
  token_id: string | null;
};

const API_ROOT =
  process.env.NEXT_PUBLIC_PLATFORM_API_ROOT?.replace(/\/$/, "") ??
  "http://127.0.0.1:8765";

export async function createPlatformSubmission(payload: SubmissionCreateInput) {
  const response = await fetch(`${API_ROOT}/platform/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Submission failed";
    try {
      const data = await response.json();
      message = data.detail ?? message;
    } catch {
      // Keep fallback message.
    }
    throw new Error(message);
  }

  return (await response.json()) as SubmissionCreateResponse;
}
