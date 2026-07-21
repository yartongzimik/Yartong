export type RefundState = "REQUESTED" | "PROCESSING" | "SUCCEEDED" | "FAILED" | "CANCELLED";
export type PayoutState = "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "REVERSED";
export type ReconciliationState = "BALANCED" | "UNDERPAID" | "OVERPAID" | "PENDING";

export type FinancialAmounts = {
  grossPaid: number;
  refunded: number;
  providerPayout: number;
};

export type ReconciliationSummary = FinancialAmounts & {
  expectedNet: number;
  variance: number;
  state: ReconciliationState;
};

function assertNonNegativeInteger(name: string, value: number): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative integer in the currency's smallest unit.`);
  }
}

export function summarizeReconciliation(amounts: FinancialAmounts): ReconciliationSummary {
  assertNonNegativeInteger("grossPaid", amounts.grossPaid);
  assertNonNegativeInteger("refunded", amounts.refunded);
  assertNonNegativeInteger("providerPayout", amounts.providerPayout);

  if (amounts.refunded > amounts.grossPaid) {
    throw new Error("Refunded amount cannot exceed gross paid amount.");
  }

  const expectedNet = amounts.grossPaid - amounts.refunded;
  const variance = amounts.providerPayout - expectedNet;
  let state: ReconciliationState = "BALANCED";

  if (amounts.grossPaid === 0 && amounts.providerPayout === 0) {
    state = "PENDING";
  } else if (variance < 0) {
    state = "UNDERPAID";
  } else if (variance > 0) {
    state = "OVERPAID";
  }

  return {
    ...amounts,
    expectedNet,
    variance,
    state,
  };
}

export function refundableAmount(grossPaid: number, alreadyRefunded: number): number {
  assertNonNegativeInteger("grossPaid", grossPaid);
  assertNonNegativeInteger("alreadyRefunded", alreadyRefunded);
  if (alreadyRefunded > grossPaid) throw new Error("Refunded amount cannot exceed gross paid amount.");
  return grossPaid - alreadyRefunded;
}

export function assertRefundAmountAllowed(grossPaid: number, alreadyRefunded: number, requested: number): void {
  assertNonNegativeInteger("requested", requested);
  if (requested === 0) throw new Error("Refund amount must be greater than zero.");
  if (requested > refundableAmount(grossPaid, alreadyRefunded)) {
    throw new Error("Refund amount exceeds the remaining refundable balance.");
  }
}
