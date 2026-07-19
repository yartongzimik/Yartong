export type PayoutProviderConfiguration = {
  providerName: string | null;
  configured: boolean;
  missingVariables: string[];
};

export type CreateExternalPayoutInput = {
  payoutId: string;
  providerAccountRef: string;
  amount: number;
  currency: string;
  idempotencyKey: string;
};

export type CreateExternalPayoutResult = {
  providerPayoutRef: string;
  status: "PENDING" | "PROCESSING";
};

export interface PayoutProviderAdapter {
  readonly name: string;
  createPayout(input: CreateExternalPayoutInput): Promise<CreateExternalPayoutResult>;
}

export function getPayoutProviderConfiguration(): PayoutProviderConfiguration {
  const providerName = process.env.PAYOUT_PROVIDER?.trim() || null;
  const required = ["PAYOUT_PROVIDER_SECRET_KEY", "PAYOUT_WEBHOOK_SECRET"];
  const missingVariables = providerName
    ? required.filter((name) => !process.env[name]?.trim())
    : ["PAYOUT_PROVIDER", ...required];

  return {
    providerName,
    configured: Boolean(providerName) && missingVariables.length === 0,
    missingVariables,
  };
}

export function assertPayoutProviderConfigured(): void {
  const config = getPayoutProviderConfiguration();
  if (!config.configured) {
    throw new Error(
      `Payout provider is not configured. Missing: ${config.missingVariables.join(", ")}.`,
    );
  }
}

/**
 * Production adapters must obey these invariants:
 * - payout destinations are referenced only by opaque provider account IDs;
 * - bank/account credentials never transit Yartong forms or application logs;
 * - every createPayout call uses a stable idempotency key;
 * - webhook signatures are verified before payout state changes;
 * - duplicate/out-of-order provider events are safe to replay;
 * - terminal payout states cannot regress;
 * - monetary amounts use integer minor units and server-derived currency.
 */
export const PAYOUT_PROVIDER_INVARIANTS = [
  "opaque-destination-reference",
  "stable-idempotency-key",
  "verified-webhook-signatures",
  "replay-safe-events",
  "non-regressing-terminal-states",
  "integer-minor-units",
] as const;
