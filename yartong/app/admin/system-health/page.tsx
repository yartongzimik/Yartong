import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";
import { requireRole } from "@/lib/authz";
import { getOperationsHealthSnapshot, operationsHealthSeverity } from "@/lib/operations-health";

export default async function AdminSystemHealthPage() {
  await requireRole("ADMIN");
  const snapshot = await getOperationsHealthSnapshot();
  const severity = operationsHealthSeverity(snapshot);

  const signals = [
    { label: "Failed database migrations", value: snapshot.failedMigrations, href: null, critical: snapshot.failedMigrations > 0 },
    { label: "Unresolved disputes", value: snapshot.unresolvedDisputes, href: "/admin/disputes", critical: false },
    { label: "Disputes open over 7 days", value: snapshot.staleDisputes, href: "/admin/disputes", critical: snapshot.staleDisputes > 0 },
    { label: "Catalog products pending review", value: snapshot.pendingCatalogReview, href: "/admin/catalog", critical: false },
    { label: "Failed engagement payments", value: snapshot.failedPaymentOrders, href: null, critical: snapshot.failedPaymentOrders > 0 },
    { label: "Failed payment provider events", value: snapshot.failedPaymentEvents, href: null, critical: snapshot.failedPaymentEvents > 0 },
    { label: "Unread notifications older than 7 days", value: snapshot.oldUnreadNotifications, href: null, critical: false },
    { label: "Currently active rate-limit keys", value: snapshot.activeRateLimitKeys, href: null, critical: false },
  ];

  const banner = severity === "critical"
    ? "Critical operational issue detected. Database migration integrity requires immediate operator attention before normal deployment work continues."
    : severity === "attention"
      ? "The platform is operational, but one or more support or payment-processing signals require review."
      : "No critical operational blockers are currently recorded in the database-backed health signals.";

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-6 py-12 text-white">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/75">Admin reliability operations</p>
        <h1 className="mt-3 text-4xl font-black">System health center</h1>
        <p className="mt-3 max-w-3xl text-white/60">
          A server-authoritative operational view of migration integrity, support backlog, catalog stewardship, payment failures, notification aging and active abuse-protection state.
        </p>

        <div className={`mt-7 rounded-3xl border p-5 ${severity === "critical" ? "border-rose-300/30 bg-rose-300/10" : severity === "attention" ? "border-amber-200/25 bg-amber-200/10" : "border-emerald-200/20 bg-emerald-200/10"}`}>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/55">Overall status: {severity}</p>
          <p className="mt-2 leading-7 text-white/80">{banner}</p>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {signals.map((signal) => {
            const card = (
              <article className={`h-full rounded-3xl border p-5 ${signal.critical ? "border-rose-200/25 bg-rose-200/[0.07]" : "border-white/10 bg-white/[0.045]"}`}>
                <p className="text-3xl font-black">{signal.value}</p>
                <p className="mt-2 text-sm leading-6 text-white/55">{signal.label}</p>
                {signal.href ? <span className="mt-4 inline-block text-sm font-bold text-fuchsia-200">Open queue →</span> : null}
              </article>
            );
            return signal.href ? <Link key={signal.label} href={signal.href}>{card}</Link> : <div key={signal.label}>{card}</div>;
          })}
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <h2 className="text-xl font-black">Operator interpretation</h2>
          <div className="mt-4 grid gap-4 text-sm leading-6 text-white/55 md:grid-cols-3">
            <p><strong className="text-white/80">Migration failures</strong> are deployment blockers. Repair them explicitly with Prisma migration tooling; never hide them in normal application startup.</p>
            <p><strong className="text-white/80">Payment failures</strong> are diagnostic signals only. Provider reconciliation and real money movement must remain behind verified provider events.</p>
            <p><strong className="text-white/80">Backlog metrics</strong> identify operational attention, not automatic enforcement. Dispute, catalog and abuse decisions still require the appropriate human workflow.</p>
          </div>
          <p className="mt-6 text-xs text-white/35">Snapshot generated {snapshot.generatedAt.toLocaleString("en-IN")}.</p>
        </section>
      </main>
    </PublicShell>
  );
}
