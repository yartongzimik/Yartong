# Yartong Web App

Yartong is a Senapati-first construction and services marketplace connecting customers, skilled providers, labourers, contractors, and material suppliers. The repository now contains a database-backed marketplace rather than the original Milestone 0 skeleton.

## Current product status

Implemented core workflows include:

- Auth.js/NextAuth authentication with PostgreSQL/Prisma sessions, Google OAuth, optional Facebook OAuth, controlled QA demo login, account-state enforcement, and role-specific onboarding.
- Public provider discovery and profiles for skilled providers, labourers, and contractors.
- Customer job posting, public job discovery, applications, hiring, engagements/work orders, quotes, private messaging, verified reviews, verification requests, and disputes.
- Role dashboards, account/profile management, in-app notifications, admin operations, review moderation, catalog moderation, and system-health views.
- Supplier catalog/inventory, material ordering/reservation, fulfillment, and material-payment preparation.
- Engagement payment infrastructure with a Razorpay adapter and signed webhook processing.
- Browser security headers, durable mutation rate limiting, CI validation, and production migration deployment.

The following integrations are intentionally incomplete and must not be represented as production-complete:

- Refunds/payouts: reconciliation/domain helpers exist, but provider refund and payout workflows are not yet complete.
- Media uploads: provider-neutral signed-upload interfaces and validation exist, but no concrete object-storage adapter is active.
- External KYC: internal verification works; the external verification adapter is still provider-dependent.
- External email/SMS/push delivery: the in-app notification system is authoritative; no concrete external delivery adapter is active.
- Realtime messaging, advanced search/ranking, and production observability/disaster recovery remain future milestones.

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- PostgreSQL
- Prisma 6
- Auth.js / NextAuth 5 beta with `@auth/prisma-adapter`
- GitHub Actions CI
- Vercel deployment
- Razorpay payment integration boundary

## Repository structure

```text
yartong/
  app/                 Next.js routes, server actions, APIs and protected layouts
  components/          Shared UI, marketplace, dashboard and layout components
  lib/                 Authz, marketplace domains, payments, storage and provider adapters
  prisma/
    schema.prisma      Canonical Prisma data model
    migrations/        Production SQL migration history
    seed.ts            Non-production deterministic QA/demo seed
  docs/                Architecture and roadmap notes
  public/              Static assets
```

## Local setup

```bash
cd yartong
npm install
cp .env.example .env.local
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

The seed script refuses to run when `NODE_ENV=production`.

## Required environment

Core:

```text
DATABASE_URL
AUTH_SECRET
AUTH_URL
```

Authentication providers:

```text
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET
AUTH_FACEBOOK_ID
AUTH_FACEBOOK_SECRET
```

QA-only seeded email login:

```text
ENABLE_DEMO_LOGIN=false
DEMO_LOGIN_PASSWORD=
```

Never use `DEMO_LOGIN_PASSWORD` as a real-user password. Keep demo login disabled in public production unless an explicitly controlled QA deployment requires it.

Payments:

```text
PAYMENT_PROVIDER=razorpay
PAYMENT_PROVIDER_PUBLIC_KEY
PAYMENT_PROVIDER_SECRET_KEY
PAYMENT_WEBHOOK_SECRET
```

Razorpay webhook endpoint:

```text
https://YOUR_DOMAIN/api/payments/razorpay/webhook
```

Provider-dependent future integrations are documented in `.env.example`, including media storage, external verification/KYC, and external notification delivery. Do not commit real credentials.

## Authentication flow

New OAuth users enter the safe `ONBOARDING_PENDING` role and must complete:

```text
Sign in / create account
→ choose account type
→ role-specific onboarding
→ create profile
→ role dashboard
```

Public onboarding supports Customer, Skilled Provider, Labourer, Contractor, and Material Supplier. `ADMIN` is never publicly selectable.

Blocked accounts (`SUSPENDED`, `REJECTED`, `DEACTIVATED`) are denied protected marketplace access.

## Demo / QA accounts

`prisma/seed.ts` creates deterministic `isDemo=true` users and marketplace records for non-production testing. Demo login requires both:

```text
ENABLE_DEMO_LOGIN=true
DEMO_LOGIN_PASSWORD=<deployment-only QA password>
```

Seeded demo emails use the reserved `.local` domain and are not real customer identities.

## Database and migrations

Use Prisma migrations as an append-only production history. Do not reset shared or production databases.

Development:

```bash
npm run db:migrate
```

Production/release:

```bash
npm run db:status
npm run db:deploy
```

The production build currently runs migration deployment before Prisma generation and the Next.js build. Migration failures therefore fail the deployment closed.

## Quality checks

```bash
npm run db:generate
npx prisma format
npx prisma validate
npm run lint
npm run typecheck
npm run build:ci
```

GitHub Actions runs these checks for pull requests and pushes to `main`.

## Security boundaries

- Authorization is enforced server-side from the authenticated user, not browser-supplied user IDs.
- Marketplace ownership checks are applied to customer/provider/supplier/admin mutations.
- Payment amounts originate from server-owned records; browser callbacks do not mark money as successful.
- Razorpay webhook signatures are verified before payment-event processing.
- External provider secrets remain deployment-only.
- Security headers include CSP, frame denial, MIME protection, referrer policy and permissions policy.
- Rate-limit storage contains bounded mutation keys rather than private message bodies or credentials.

## Roadmap status

Broadly complete: Backend Milestones 1–2 and Marketplace Milestones 1–22 plus 29 and 31.

Partially complete foundations requiring production adapters/workflows: Marketplace 23 (refunds/payouts), 24 (external notifications), 25 (media storage), and 26 (external KYC).

Next major product milestones after repository/QA consolidation:

1. Marketplace 27 — Search, ranking and discovery V2.
2. Marketplace 28 — Realtime messaging and communication reliability.
3. Marketplace 30 — Production observability, backup and disaster recovery.

Repository documentation should describe actual runtime capability rather than treating a merged foundation PR as proof that an external provider integration is live.
