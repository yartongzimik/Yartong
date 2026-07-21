export type VerificationProviderConfiguration = {
  providerName: string | null;
  configured: boolean;
  missing: string[];
};

export type VerificationSessionRequest = {
  verificationRequestId: string;
  userId: string;
  type: "IDENTITY" | "BUSINESS" | "PROFESSIONAL_CREDENTIAL";
  returnUrl: string;
};

export type VerificationSessionResult = {
  providerName: string;
  providerReference: string;
  status: "PENDING" | "REQUIRES_ACTION" | "PROCESSING";
  redirectUrl?: string;
};

export type TrustedVerificationEvent = {
  providerName: string;
  providerEventId: string;
  providerReference: string;
  status: "PENDING" | "PROCESSING" | "APPROVED" | "REJECTED";
  reason?: string;
  occurredAt: Date;
};

export interface VerificationProviderAdapter {
  readonly providerName: string;
  createSession(request: VerificationSessionRequest): Promise<VerificationSessionResult>;
  verifyWebhook(rawBody: string, signature: string): Promise<TrustedVerificationEvent>;
}

export function getVerificationProviderConfiguration(): VerificationProviderConfiguration {
  const providerName = process.env.VERIFICATION_PROVIDER?.trim() || null;
  const required = [
    ["VERIFICATION_PROVIDER", providerName],
    ["VERIFICATION_PROVIDER_API_KEY", process.env.VERIFICATION_PROVIDER_API_KEY?.trim()],
    ["VERIFICATION_WEBHOOK_SECRET", process.env.VERIFICATION_WEBHOOK_SECRET?.trim()],
  ] as const;

  const missing = required.filter(([, value]) => !value).map(([name]) => name);

  return {
    providerName,
    configured: missing.length === 0,
    missing,
  };
}

export function requireVerificationProviderAdapter(): never {
  const config = getVerificationProviderConfiguration();
  throw new Error(
    config.configured
      ? "A verification provider is configured but no production adapter has been activated yet."
      : `Verification provider is not configured. Missing: ${config.missing.join(", ")}.`,
  );
}
