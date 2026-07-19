# Yartong Web App

Yartong is an early-stage Next.js application for a local construction-services marketplace. The intended product connects customers with skilled workers, labourers, contractors, and construction-material suppliers.

This repository is currently in **Milestone 0 stabilization**. It contains the application skeleton, route placeholders, domain types, mock data, route constants, role definitions, and permission helpers. It does **not** yet implement authentication, database persistence, messaging, payments, production search, admin workflows, or live marketplace transactions.

## Current Status

Implemented today:

- A minimal public homepage at `/`.
- Valid placeholder modules for planned App Router pages.
- Central route constants, platform constants, role/permission helpers, domain types, skill-level metadata, search-tracking helpers, and development mock data.
- Basic Next.js, TypeScript, Tailwind CSS, and ESLint setup.

Not implemented yet:

- Authentication or user sessions.
- Database integration, migrations, or production data access.
- Real worker, job, material, supplier, messaging, payment, membership, advertising, or admin workflows.
- Production search or analytics persistence.
- Automated tests beyond lint/typecheck/build checks.

## Tech Stack

- Next.js App Router
- React
- TypeScript with strict mode
- Tailwind CSS
- ESLint with Next.js rules
- npm package management

## Local Setup

Install dependencies from the app directory:

```bash
cd yartong
npm install
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Run project checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## Project Structure

```text
yartong/
  app/          Next.js App Router routes and root layout
  components/   Planned reusable UI, layout, card, form, messaging, and analytics components
  lib/          Domain types, constants, permissions, navigation, mock data, and helper utilities
  public/       Static assets and placeholder images
```

Many route and component files are intentionally minimal placeholders while the project skeleton is stabilized. Placeholder pages should not be treated as completed product features.

## Mock Data Status

`lib/mock-data.ts` contains development-only sample data for planning and UI work before a database is introduced. It should not contain real personal information and should be replaced or isolated behind a development data layer when persistence is added.

## High-Level Roadmap

1. Stabilize the skeleton, build, typecheck, metadata, package naming, and documentation.
2. Build the shared design system and public layout components.
3. Implement public marketplace browsing with mock data.
4. Add authentication, roles, and route protection.
5. Add database schema, migrations, seed data, and persistence.
6. Implement customer job posting and management.
7. Implement worker, labourer, contractor, and supplier workflows.
8. Implement messaging, contact sharing, admin moderation, memberships, advertising, and payments.
9. Add testing, CI, monitoring, security hardening, and production deployment documentation.

## Backend Milestone 1 foundation

Yartong Backend Milestone 1 uses PostgreSQL with Prisma as the production data layer and Auth.js/NextAuth with the Prisma adapter for authentication.

### Required environment variables

Copy `.env.example` to `.env.local` for local development and configure:

- `DATABASE_URL` — PostgreSQL connection string.
- `AUTH_SECRET` — generated Auth.js secret; never commit a real value.
- `AUTH_URL` — local or deployed application URL when required by Auth.js hosting.
- `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` — optional Google OAuth credentials; Google sign-in is enabled only when both are present.
- `ENABLE_DEV_CREDENTIALS` — set to `true` only in local development to sign in as seeded demo users.

### Local setup

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

The seed script refuses to run when `NODE_ENV=production`. It creates Senapati as initial location data and idempotent demo users for every Yartong role.

### Migration workflow

Use `npm run db:migrate` for local development migrations. Use `npm run db:deploy` during release deployment after reviewing the generated SQL. Do not run destructive resets against shared or production databases.

### Vercel deployment notes

Configure the same required variables in Vercel project settings, including the production `DATABASE_URL`, `AUTH_SECRET`, and production app URL. Add Google provider credentials only when Google sign-in should be enabled. Keep `ENABLE_DEV_CREDENTIALS=false` in production.

### Release expectations

Before release, run Prisma generate, validate the schema, run linting, typechecking, and build. Apply migrations with `prisma migrate deploy` as an explicit release step, not automatically from application startup.

## Backend Milestone 2 authentication and onboarding

Yartong uses Auth.js with the Prisma adapter as the single authentication system. Google sign-in is shown only when `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are configured. Development demo login is shown only when `ENABLE_DEV_CREDENTIALS=true` and `NODE_ENV` is not `production`.

New OAuth users are created with the safe `ONBOARDING_PENDING` role and `ACTIVE` account status. They receive no role-specific marketplace dashboard access until they complete `/onboarding`, select one public role, choose an active database `Location`, and create the matching role profile. Public onboarding allows Customer, Skilled Provider, Labourer, Contractor and Material Supplier. Admin is not selectable.

For local testing:

1. Set `DATABASE_URL` and `AUTH_SECRET`.
2. Run `npm run db:generate` and apply migrations with your normal Prisma workflow.
3. Seed demo users with `npm run db:seed`.
4. Set `ENABLE_DEV_CREDENTIALS=true` in development.
5. Visit `/login` and use one of the seeded demo emails such as `customer.demo@yartong.local`, or configure Google credentials and sign in with Google.

Blocked accounts with `SUSPENDED`, `REJECTED` or `DEACTIVATED` status are redirected to `/account-blocked` and denied protected dashboard access.
