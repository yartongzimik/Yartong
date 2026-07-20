import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { formatMoney } from "@/lib/jobs/validation";
import { getPublicCatalogProduct } from "@/lib/marketplace/catalog";

type Props = { params: Promise<{ id: string }> };

export default async function MaterialProductDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await getPublicCatalogProduct(id);
  if (!result) notFound();
  const { product, listings } = result;

  return (
    <PublicShell>
      <main className="mx-auto max-w-6xl px-6 py-10 text-white sm:py-14">
        <Link href="/materials" className="text-sm font-bold text-fuchsia-200">← Back to materials</Link>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(225,38,255,0.14),transparent_35%),rgba(255,255,255,0.04)] p-6 sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-fuchsia-200/70">{product.categoryName}</p>
              <h1 className="mt-3 text-4xl font-black sm:text-5xl">{product.name}</h1>
              {product.brandName ? <p className="mt-2 text-lg font-bold text-white/45">{product.brandName}</p> : null}
            </div>
            {product.manufacturerPartNumber ? <div className="rounded-2xl border border-white/10 px-4 py-3 text-sm"><p className="text-white/35">Manufacturer part no.</p><p className="mt-1 font-black">{product.manufacturerPartNumber}</p></div> : null}
          </div>
          {product.description ? <p className="mt-6 max-w-4xl whitespace-pre-wrap leading-7 text-white/65">{product.description}</p> : null}
        </section>

        <section className="mt-8">
          <div>
            <p className="text-sm font-bold text-white/40">Real marketplace offers</p>
            <h2 className="mt-1 text-3xl font-black">Compare suppliers</h2>
          </div>

          {listings.length ? (
            <div className="mt-6 space-y-4">
              {listings.map((listing) => (
                <article key={listing.listingId} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                  <div className="grid gap-6 lg:grid-cols-[1.3fr_0.8fr_0.8fr_auto] lg:items-center">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-white/40">{listing.variantName}</p>
                      <h3 className="mt-2 text-xl font-black">{listing.supplierBusinessName || listing.supplierName}</h3>
                      <p className="mt-1 text-sm text-white/45">Seller SKU {listing.sellerSku}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">Price</p>
                      <p className="mt-1 text-2xl font-black">{formatMoney(listing.price, listing.currency)}</p>
                      <p className="mt-1 text-xs text-white/40">Minimum {listing.minOrderQty}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">Inventory</p>
                      <p className={`mt-1 font-black ${listing.availableQty > 0 ? "text-emerald-200" : "text-white/45"}`}>{listing.availableQty > 0 ? `${listing.availableQty} available` : "Stock not recorded"}</p>
                      <p className="mt-1 text-xs text-white/40">{listing.deliveryAvailable ? "Delivery available" : "Pickup / supplier terms"}{listing.leadTimeDays != null ? ` · ${listing.leadTimeDays} day lead time` : ""}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 px-4 py-3 text-center text-sm font-bold text-white/55">Ordering workflow coming next</div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-3xl border border-white/10 p-6 text-white/50">This product currently has no active supplier listing.</p>
          )}

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-white/45">
            Yartong separates product identity, supplier offers and physical stock. Prices and availability shown here come from active supplier listings and recorded inventory; no global stock claims are fabricated.
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
