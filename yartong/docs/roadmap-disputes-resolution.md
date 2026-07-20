# Marketplace Milestone 12 — Disputes & Resolution Workflow

## Product strategy

Yartong disputes are designed around early resolution, procedural fairness, fraud resistance, and an auditable support workflow.

### Marketplace principles

1. **Resolve before escalating when safe.** Participants are encouraged to state the issue and desired outcome clearly before an administrator intervenes.
2. **One canonical case per engagement.** A work engagement can have at most one active dispute case, preventing fragmented or contradictory support trails.
3. **Both sides can be heard.** Customers and hired providers can submit statements to the same case, and neither side can edit the other participant's evidence.
4. **Structured decisions, not silent moderation.** Administrative outcomes use explicit resolution types and written reasons.
5. **No automatic money movement.** Dispute resolution can recommend or record a financial outcome, but it cannot mark a payment refunded or charge a user without a verified payment-provider operation.
6. **Immutable audit trail.** Every status transition and participant/admin statement is recorded as a dispute event.
7. **Safety and fraud escalation.** Severe allegations can be categorized distinctly and remain visible to administrators for account-level follow-up.

## Lifecycle

`OPEN -> AWAITING_RESPONSE -> UNDER_REVIEW -> RESOLVED`

Alternative terminal state: `CANCELLED` when the opener withdraws before admin review.

An administrator may move an open case directly into review when urgent. Resolution stores an explicit outcome and explanation.

## Roles

- **Customer / Provider:** open a dispute for their own eligible engagement, add statements, view the shared case timeline, and withdraw only before formal review.
- **Administrator / Customer Service:** review the queue, request more information by returning the case to `AWAITING_RESPONSE`, move cases under review, and resolve with an explicit outcome.
- **Founder / Operations:** obtain structured dispute categories and outcomes suitable for future marketplace-quality analytics without exposing private case notes publicly.

## Payment boundary

The dispute record can contain a recommended refund amount in minor currency units. This is an administrative resolution record only. Payment-order state remains authoritative and can change only through the payment integration boundary.
