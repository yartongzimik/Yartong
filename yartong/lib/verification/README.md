# Verification provider integration

Yartong keeps its internal `VerificationRequest` workflow authoritative and integrates external identity/business verification through a provider adapter.

## Security boundary

- Provider API keys and webhook secrets must only be configured in deployment secrets.
- Browser callbacks never approve or reject a verification request.
- A provider result may change Yartong verification state only after a signed server-to-server webhook has been verified.
- Provider references are stored instead of raw identity documents whenever possible.
- Sensitive provider payloads must not be written to application logs.
- Duplicate provider events must be handled idempotently before changing a request.

## Required deployment variables

- `VERIFICATION_PROVIDER`
- `VERIFICATION_PROVIDER_API_KEY`
- `VERIFICATION_WEBHOOK_SECRET`

A concrete vendor adapter and webhook route must be reviewed against the selected provider's current API and data-retention terms before production activation. Until then, Yartong's existing internal admin-review workflow remains available and no external KYC claim is presented as completed.
