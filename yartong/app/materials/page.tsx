import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";
import { formatMoney } from "@/lib/jobs/validation";
import { getCatalogCategories, listPublicCatalog } from "@/lib/marketplace/catalog";

type Props = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export default async function MaterialsPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const [categories, products] = await Promise.all([
    getCatalogCategories(),
    listPublicCatalog({ q, category }),
  ]);

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-6 py-10 text-white sm:py-14">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(155,77,255,0.2),transparent_35%),rgba(255,255,255,0.04)] p-6 sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-200/75">Yartong materials marketplace</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black sm:text-6xl">Find the right product, variant and supplier.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/60">
            Search a canonical product catalog while comparing real supplier listings, prices and available inventory. Yartong only displays products and stock actually recorded by marketplace suppliers.
          </p>

          <form className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-black/20 p-3 md:grid-cols-[1fr_260px_auto]" action="/materials">
            <label className="sr-only" htmlFor="q">Search materials</label>
            <input id="q" name="q" type="search" defaultValue={q} placeholder="Search cement, tools, cable, pipe, paint, brand or SKU…" className="min-h-14 rounded-2xl border border-white/10 bg-white/[0.05] px-5 outline-none focus:border-fuchsia-300/50" />
            <label className="sr-only" htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue={category} className="min-h-14 rounded-2xl border border-white/10 bg-[#120b1d] px-4">
              <option value="">All categories</option>
              {categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
            </select>
            <button className="min-h-14 rounded-2xl bg-white px-6 font-black text-[#14091f]">Search catalog</button>
          </form>
        </section>

        <section className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white/45">{products.length} variant{products.length === 1 ? "" : "s"} currently listed</p>
              <h2 className="mt-1 text-3xl font-black">Marketplace catalog</h2>
            </div>
            {(q || category) ? <Link href="/materials" className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold">Clear filters</Link> : null}
          </div>

          {products.length ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {products.map((item) => (
                <Link key={`${item.productId}-${item.variantId}`} href={`/materials/${item.productId}`} className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-0.5 hover:border-fuchsia-200/30 hover:bg-fuchsia-200/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300">
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-white/55">{item.categoryName}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${item.availableQty > 0 ? "bg-emerald-200/10 text-emerald-100" : "bg-white/[0.06] text-white/45"}`}>
                      {item.availableQty > 0 ? `${item.availableQty} available` : "Stock not recorded"}
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-black group-hover:text-fuchsia-100">{item.productName}</h3>
                  {item.brandName ? <p className="mt-1 text-sm font-bold text-white/45">{item.brandName}</p> : null}
                  <p className="mt-4 text-sm text-white/65">{item.variantName} · {item.unitQuantity} {item.unitName}</p>
                  <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                    <div><p className="text-xs text-white/35">From</p><p className="mt-1 text-xl font-black">{formatMoney(item.minPrice, item.currency)}</p></div>
                    <div className="text-right"><p className="text-xs text-white/35">Suppliers</p><p className="mt-1 font-black">{item.listingCount}</p></div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[2rem] border border-dashed border-white/15 p-10 text-center">
              <h3 className="text-xl font-black">No matching supplier listings yet</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/50">The catalog is designed to scale broadly, but Yartong does not fabricate products or stock. Try a broader search as suppliers add real listings.</p>
            </div>
          )}
        </section>
      </main>
    </PublicShell>
  );
}
