import { PublicShell } from "@/components/layout/public-shell";
import { requireRole } from "@/lib/authz";
import {
  getCatalogModerationSummary,
  listCatalogDuplicateCandidates,
  listCatalogModerationProducts,
} from "@/lib/marketplace/catalog-admin";

import { mergeCatalogProductAction, moderateCatalogProductAction } from "./actions";

export default async function AdminCatalogPage() {
  await requireRole("ADMIN");

  const [summary, products, duplicateCandidates] = await Promise.all([
    getCatalogModerationSummary(),
    listCatalogModerationProducts(),
    listCatalogDuplicateCandidates(),
  ]);

  const metrics = [
    ["Pending review", summary.pendingReview],
    ["Active canonical products", summary.active],
    ["Supplier submitted", summary.supplierSubmitted],
    ["Possible duplicate groups", summary.duplicateGroups],
    ["Archived", summary.archived],
    ["Merged aliases", summary.merged],
  ] as const;

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-6 py-12 text-white">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/75">Admin catalog operations</p>
        <h1 className="mt-3 text-4xl font-black">Canonical catalog moderation</h1>
        <p className="mt-3 max-w-3xl text-white/60">
          Keep Yartong&apos;s product graph clean as the marketplace grows. Approve supplier-submitted products, quarantine questionable records, and merge true duplicates without deleting supplier listings or inventory history.
        </p>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
              <p className="text-3xl font-black">{value}</p>
              <p className="mt-1 text-sm text-white/55">{label}</p>
            </article>
          ))}
        </section>

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-200/70">Duplicate signals</p>
              <h2 className="mt-2 text-2xl font-black">Exact normalized-name candidates</h2>
            </div>
            <p className="max-w-xl text-sm text-white/50">These are review hints, not automatic decisions. Brand, size, specification and manufacturer identifiers still need human judgment before a merge.</p>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {duplicateCandidates.length === 0 ? <p className="text-white/50">No exact normalized-name duplicate pairs detected.</p> : null}
            {duplicateCandidates.map((candidate) => (
              <article key={`${candidate.leftId}:${candidate.rightId}`} className="rounded-3xl border border-amber-200/15 bg-amber-200/[0.04] p-5">
                <p className="font-black">{candidate.leftName} <span className="text-white/35">↔</span> {candidate.rightName}</p>
                <p className="mt-2 break-all text-xs text-white/45">{candidate.leftId} ({candidate.leftStatus})</p>
                <p className="mt-1 break-all text-xs text-white/45">{candidate.rightId} ({candidate.rightStatus})</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-fuchsia-200/70">Moderation queue</p>
          <h2 className="mt-2 text-2xl font-black">Products requiring catalog stewardship</h2>
          <div className="mt-6 space-y-5">
            {products.length === 0 ? <p className="text-white/50">No catalog products found.</p> : null}
            {products.map((product) => (
              <article key={product.id} className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-black">{product.name}</h3>
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] font-bold text-white/60">{product.status}</span>
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] font-bold text-white/60">{product.source}</span>
                    </div>
                    <p className="mt-2 text-sm text-white/55">{product.categoryName}{product.brandName ? ` · ${product.brandName}` : ""}</p>
                    <p className="mt-1 text-sm text-white/45">{product.variantCount} variants · {product.listingCount} supplier listings{product.supplierName ? ` · submitted by ${product.supplierName}` : ""}</p>
                    <p className="mt-2 break-all text-xs text-white/35">Canonical ID: {product.id}</p>
                  </div>
                  <p className="text-xs text-white/35">{product.createdAt.toLocaleString("en-IN")}</p>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-4">
                  {product.status === "PENDING_REVIEW" ? (
                    <form action={moderateCatalogProductAction.bind(null, product.id, "ACTIVE")} className="space-y-2">
                      <textarea name="note" maxLength={1000} rows={3} placeholder="Approval note (optional)" className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" />
                      <button className="rounded-full bg-emerald-200 px-4 py-2 text-sm font-black text-[#102019]">Approve canonical product</button>
                    </form>
                  ) : null}

                  {product.status === "ACTIVE" ? (
                    <form action={moderateCatalogProductAction.bind(null, product.id, "PENDING_REVIEW")} className="space-y-2">
                      <textarea name="note" maxLength={1000} rows={3} placeholder="Reason for re-review" className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" />
                      <button className="rounded-full border border-amber-200/25 px-4 py-2 text-sm font-bold text-amber-100">Send to review</button>
                    </form>
                  ) : null}

                  {product.status === "ARCHIVED" ? (
                    <form action={moderateCatalogProductAction.bind(null, product.id, "PENDING_REVIEW")} className="space-y-2">
                      <textarea name="note" maxLength={1000} rows={3} placeholder="Restore note" className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" />
                      <button className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold">Restore to review</button>
                    </form>
                  ) : (
                    <form action={moderateCatalogProductAction.bind(null, product.id, "ARCHIVED")} className="space-y-2">
                      <textarea name="note" maxLength={1000} rows={3} placeholder="Archive reason" className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" />
                      <button className="rounded-full border border-rose-200/25 px-4 py-2 text-sm font-bold text-rose-100">Archive product</button>
                    </form>
                  )}

                  {product.status === "ACTIVE" || product.status === "PENDING_REVIEW" ? (
                    <form action={mergeCatalogProductAction.bind(null, product.id)} className="space-y-2 xl:col-span-2">
                      <input name="targetProductId" required placeholder="Active canonical target product ID" className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" />
                      <textarea name="note" required maxLength={1000} rows={3} placeholder="Required merge rationale" className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" />
                      <button className="rounded-full border border-fuchsia-200/25 px-4 py-2 text-sm font-bold text-fuchsia-100">Merge into canonical target</button>
                    </form>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
