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
