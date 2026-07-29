export const isAuthBypassEnabled =
  process.env.VERCEL_ENV === "preview" || process.env.ENABLE_PHASE_AUTH_BYPASS === "true";

export const isPaymentExecutionEnabled =
  process.env.ENABLE_PAYMENTS === "true" && !isAuthBypassEnabled;
