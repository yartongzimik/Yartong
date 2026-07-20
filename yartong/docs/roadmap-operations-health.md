# Marketplace Milestone 20 — Operational Reliability & System Health Center

## Goal

Give Yartong operators a truthful, database-backed view of launch-critical failure signals without inventing uptime guarantees or depending on a third-party observability vendor before one is configured.

## Health signals

The admin system health center exposes:

- failed/unresolved Prisma migrations;
- unresolved disputes and disputes older than seven days;
- canonical catalog products waiting for review;
- failed engagement payment orders;
- failed provider payment events;
- unread in-app notifications older than seven days;
- currently active durable mutation-rate-limit keys.

## Reliability principles

- Database migration failures are treated as critical deployment blockers.
- Payment failures are operational signals, not proof of money movement or refund state.
- Stale disputes and catalog queues require human operations workflows rather than automatic destructive actions.
- Rate-limit state is shown as aggregate operational context only; no IP address, message body, credential or private authentication material is exposed.
- The health center remains admin-only and derives its counts server-side.

## Product surface

`/admin/system-health` provides a severity banner, queue-aware operational cards and direct navigation into existing dispute and catalog review workflows.

This milestone complements `/api/health`: the API endpoint remains a minimal readiness signal for infrastructure, while the admin page is a human operations dashboard for marketplace health.
