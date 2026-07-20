import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";
import { requireRole } from "@/lib/authz";
import { DISPUTE_CATEGORY_LABELS, listAdminDisputes } from "@/lib/marketplace/disputes";

export default async function AdminDisputesPage() {
  await requireRole("ADMIN");
  const disputes = await listAdminDisputes();

  return (
    <PublicShell>
      <main className="mx-auto max-w-6xl px-6 py-12 text-white">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/70">Customer service operations</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black">Disputes & resolution</h1>
            <p className="mt-3 max-w-2xl text-white/60">Prioritize active reviews, urgent safety/fraud categories, and cases waiting longest. Decisions remain auditable and do not silently move payment money.</p>
          </div>
          <Link href="/admin" className="rounded-full border border-white/15 px-5 py-3 font-black">Admin dashboard</Link>
        </div>

        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
          {disputes.length ? (
            <div className="divide-y divide-white/10">
              {disputes.map((dispute) => (
                <Link key={dispute.id} href={`/admin/disputes/${dispute.id}`} className="grid gap-3 p-5 transition hover:bg-white/[0.04] md:grid-cols-[1.2fr_0.8fr_0.7fr]">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/15 px-2 py-1 text-[11px] font-black">{dispute.status.replaceAll("_", " ")}</span>
                      <span className="rounded-full border border-fuchsia-200/20 bg-fuchsia-200/10 px-2 py-1 text-[11px] font-bold text-fuchsia-100">{DISPUTE_CATEGORY_LABELS[dispute.category]}</span>
                    </div>
                    <h2 className="mt-3 font-black">{dispute.title}</h2>
                    <p className="mt-1 text-sm text-white/50">{dispute.jobTitle}</p>
                  </div>
                  <div className="text-sm text-white/65">
                    <p>Customer: <strong className="text-white">{dispute.customerName}</strong></p>
                    <p className="mt-1">Provider: <strong className="text-white">{dispute.providerName}</strong></p>
                  </div>
                  <div className="text-sm text-white/45 md:text-right">
                    Opened {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(dispute.openedAt)}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="p-8 text-white/55">No dispute cases have been opened.</p>
          )}
        </section>
      </main>
    </PublicShell>
  );
}
