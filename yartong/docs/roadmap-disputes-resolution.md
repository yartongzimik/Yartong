# Marketplace Milestone 12 — Disputes & Resolution Workflow

## Product strategy

Yartong disputes are designed around early resolution, procedural fairness, fraud resistance, and an auditable customer-service workflow.

### Marketplace principles

1. **Resolve before escalating when safe.** Participants state the issue and desired outcome clearly before an administrator intervenes.
2. **One canonical case per engagement.** An engagement has at most one dispute case, preventing fragmented and contradictory support trails.
3. **Both sides can be heard.** Customer and hired provider can submit statements to the same case; neither can edit the other participant's evidence.
4. **Structured decisions, not silent moderation.** Administrative outcomes use explicit resolution types and written reasons.
5. **No automatic money movement.** Resolution may record a recommended refund amount, but cannot mutate payment success/refund state without a verified payment-provider operation.
6. **Immutable audit trail.** Status changes and statements are appended as dispute events.
7. **Safety and fraud escalation.** Serious safety, fraud, harassment, and payment allegations use distinct categories for operations follow-up.

## Lifecycle

`OPEN -> AWAITING_RESPONSE -> UNDER_REVIEW -> RESOLVED`

Alternative terminal state: `CANCELLED` when the opener withdraws before formal review.

An administrator may move an urgent case directly into review. A resolved case stores an explicit outcome and explanation.

## Roles

- **Customer / Provider:** open a dispute on their own eligible engagement, add statements, view the shared timeline, and withdraw only before formal review.
- **Administrator / Customer Service:** review the queue, request more information, move cases under review, and resolve with an explicit outcome.
- **Founder / Operations:** obtain structured categories/outcomes suitable for future marketplace-quality analytics without making private case content public.

## Payment boundary

A dispute can store a recommended refund amount in minor currency units as part of the administrative resolution. Payment-order state remains authoritative and can change only through the payment integration boundary.
