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

## Backend Foundation (Milestone 1)

Yartong now has the production data and authentication foundation for future backend milestones while preserving the frozen homepage and mock marketplace data.

### Data layer

- PostgreSQL is the production database target.
- Prisma is the ORM and schema/migration workflow.
- `prisma/schema.prisma` defines the core persistent models for users, Auth.js-compatible accounts/sessions/tokens, service locations, and role-specific profile foundations.
- `lib/db.ts` exports a server-side Prisma singleton that is safe for Next.js development hot reload and serverless execution.

### Authentication architecture

- Auth.js / NextAuth is configured in `auth.ts` and `lib/auth/config.ts`.
- Sessions use JWT strategy for this foundation milestone, while the schema includes Auth.js-compatible `Account`, `Session`, and `VerificationToken` models so database-backed providers can be enabled later.
- Google OAuth placeholders are documented for production.
- A development-only credentials provider accepts seeded `@example.test` demo users and is disabled in production.
- Phone/OTP is intentionally not implemented yet, but environment placeholders reserve the future integration path.

### Authorization and route protection

- Server helpers in `lib/auth/server.ts` provide `getCurrentUser`, `requireUser`, `requireRole`, and `requirePermission`.
- Authorization derives from persisted user records and the existing Yartong permission map in `lib/permissions.ts`; client-supplied roles are not trusted.
- `proxy.ts` provides lightweight protection for `/admin`, `/customer`, and `/messages`, with ADMIN-only proxy gating for `/admin` and server helper support for deeper route enforcement.

### Required environment variables

Copy `.env.example` to `.env.local` for local development and configure real values outside version control:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
AUTH_SECRET="replace-with-a-long-random-secret"
AUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
PHONE_OTP_PROVIDER=""
PHONE_OTP_API_KEY=""
```

Never commit real credentials or provider secrets.

### Local PostgreSQL and Prisma workflow

1. Start or provision a local PostgreSQL database.
2. Set `DATABASE_URL` in `.env.local`.
3. Install dependencies:

```bash
npm install
```

4. Generate Prisma Client:

```bash
npm run db:generate
```

5. Create/apply local migrations:

```bash
npm run db:migrate
```

6. Seed safe development data:

```bash
npm run db:seed
```

7. Inspect data when needed:

```bash
npm run db:studio
```

### Seed data

`prisma/seed.ts` creates Senapati as the primary service location plus representative demo users for CUSTOMER, SKILLED_PROVIDER, LABOURER, CONTRACTOR, MATERIAL_SUPPLIER, and ADMIN. Demo records use `@example.test` emails and are marked with `isDemo`.

### Health check

`/api/health/db` performs a minimal server-side `SELECT 1` check and returns only a boolean health response without exposing connection details.

### Vercel configuration

Before deploying backend-enabled routes, configure Vercel project environment variables for `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, and any enabled OAuth/OTP provider secrets. Run Prisma migrations against the managed PostgreSQL database as part of the release process; do not use destructive reset commands on production databases.
