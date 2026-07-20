# Marketplace Milestone 19 — Catalog Moderation & Canonical Data Quality

## Product goal

Protect Yartong's long-term catalog quality while allowing supplier-led growth. A world-scale marketplace cannot treat every supplier-entered name as a new product, and it cannot blindly merge records that merely look similar.

## Operating strategy

- Supplier submissions can enter a review lifecycle instead of becoming permanently trusted canonical data by default.
- Admins can approve, send back to review, archive, or restore products with an auditable reason trail.
- Exact normalized-name duplicate detection is a triage signal only. Human reviewers must consider brand, model, GTIN, manufacturer part number, unit and specification before merging.
- A merge preserves variants, supplier listings, orders and inventory history by re-parenting variants to the chosen active canonical product instead of deleting commerce records.
- The source product is retained as `MERGED` for history and traceability.
- Every moderation decision is recorded in `CatalogModerationEvent` with actor, source product, optional canonical target, note and timestamp.

## Safety and integrity

- Only ADMIN accounts can perform moderation actions.
- State transitions are validated server-side under row locks.
- The canonical merge target must be active.
- Merged products cannot be silently reactivated through the moderation action.
- Merge rationale is mandatory.
- Admin mutations use the durable database-backed rate limiter.
- Public catalog queries continue to expose only active canonical products, active variants and active supplier listings.

## Product surface

`/admin/catalog` provides:

- catalog-health counters;
- pending-review and canonical product queue;
- exact normalized-name duplicate candidates;
- approve, re-review, archive and restore actions;
- deliberate source-to-target canonical merge controls.

## Scale direction

This milestone establishes operational catalog stewardship. Future import pipelines can add stronger duplicate scoring using GTIN, MPN, brand aliases and structured attributes, but those signals should feed review rather than silently collapsing product identity.
