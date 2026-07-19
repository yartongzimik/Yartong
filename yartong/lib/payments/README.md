# Payment integration boundary

Yartong persists canonical payment orders and provider event identities independently from any specific gateway.

Production payment processing is intentionally disabled until a real provider adapter is configured with credentials in the deployment environment.

Required launch-time variables are documented in `.env.example` and must be supplied directly to the hosting/payment provider dashboards, not committed to source control.

The payment provider adapter must preserve:

- idempotent payment-order creation
- unique provider event IDs
- signature verification before accepting webhook state transitions
- server-side amount/currency ownership checks
- immutable payment history/auditability
- no client-controlled success state

Until a provider is configured, UI must clearly state that checkout is unavailable rather than simulating payment success.
