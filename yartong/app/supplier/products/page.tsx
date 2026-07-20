import { PublicShell } from "@/components/layout/public-shell";
import { requireRole } from "@/lib/authz";
import { formatMoney } from "@/lib/jobs/validation";
import { getCatalogCategories, getSupplierListings } from "@/lib/marketplace/catalog";

import { createSupplierListingAction, setSupplierListingStatusAction } from "./actions";

export default async function SupplierProductsPage() {
  const supplier = await requireRole("MATERIAL_SUPPLIER");
  const [categories, listings] = await Promise.all([
    getCatalogCategories(),
    getSupplierListings(supplier.id),
  ]);

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-6 py-10 text-white sm:py-14">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-200/75">Supplier catalog studio</p>
          <h1 className="mt-3 text-3xl font-black sm:text-5xl">Products & listings</h1>
          <p className="mt-3 max-w-3xl leading-7 text-white/60">
            Add sellable products to Yartong's canonical catalog, then manage your own seller SKU, price, minimum order and fulfillment terms separately from physical inventory.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <a href="/supplier/inventory" className="rounded-full border border-white/15 px-4 py-2 font-bold">Manage inventory</a>
            <a href="/materials" className="rounded-full border border-white/15 px-4 py-2 font-bold">View public catalog</a>
          </div>
        </section>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <h2 className="text-2xl font-black">Your listings</h2>
            <p className="mt-2 text-sm text-white/50">Availability is derived from inventory on hand minus reserved stock. Pausing a listing removes it from public discovery without deleting history.</p>
            <div className="mt-6 space-y-4">
              {listings.length ? listings.map((listing) => (
                <article key={listing.listingId} className="rounded-3xl border border-white/10 bg-black/15 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-200/60">{listing.categoryName}</p>
                      <h3 className="mt-2 text-xl font-black">{listing.productName}</h3>
                      <p className="mt-1 text-sm text-white/55">{listing.variantName} · {listing.unitQuantity} {listing.unitName}</p>
                    </div>
                    <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-black">{listing.status}</span>
                  </div>
                  <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-4">
                    <div><dt className="text-white/40">Price</dt><dd className="mt-1 font-bold">{formatMoney(listing.price, listing.currency)}</dd></div>
                    <div><dt className="text-white/40">Seller SKU</dt><dd className="mt-1 font-bold">{listing.sellerSku}</dd></div>
                    <div><dt className="text-white/40">Available</dt><dd className="mt-1 font-bold">{listing.availableQty} {listing.unitName}</dd></div>
                    <div><dt className="text-white/40">Minimum order</dt><dd className="mt-1 font-bold">{listing.minOrderQty} {listing.unitName}</dd></div>
                  </dl>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a href={`/materials/${listing.productId}`} className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold">Public product</a>
                    {listing.status === "ACTIVE" ? (
                      <form action={setSupplierListingStatusAction.bind(null, listing.listingId, "PAUSED")}>
                        <button className="rounded-full border border-amber-200/20 px-4 py-2 text-sm font-bold text-amber-100">Pause listing</button>
                      </form>
                    ) : listing.status === "PAUSED" ? (
                      <form action={setSupplierListingStatusAction.bind(null, listing.listingId, "ACTIVE")}>
                        <button className="rounded-full border border-emerald-200/20 px-4 py-2 text-sm font-bold text-emerald-100">Reactivate</button>
                      </form>
                    ) : null}
                  </div>
                </article>
              )) : <p className="rounded-2xl border border-white/10 p-5 text-sm text-white/50">You have not created a supplier listing yet.</p>}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <h2 className="text-2xl font-black">Add product & listing</h2>
            <p className="mt-2 text-sm leading-6 text-white/50">Use a precise product and variant name. Standard GTIN/barcode and manufacturer part numbers are optional because many local materials do not have them.</p>
            <form action={createSupplierListingAction} className="mt-6 space-y-5">
              <div>
                <label className="text-sm font-bold" htmlFor="categoryId">Category</label>
                <select id="categoryId" name="categoryId" required className="mt-2 w-full rounded-2xl border border-white/15 bg-[#120b1d] px-4 py-3">
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="text-sm font-bold" htmlFor="productName">Product name</label><input id="productName" name="productName" required maxLength={240} className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" placeholder="Portland Pozzolana Cement" /></div>
                <div><label className="text-sm font-bold" htmlFor="brandName">Brand / manufacturer</label><input id="brandName" name="brandName" maxLength={160} className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" /></div>
              </div>
              <div><label className="text-sm font-bold" htmlFor="productDescription">Product description</label><textarea id="productDescription" name="productDescription" maxLength={6000} rows={4} className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="text-sm font-bold" htmlFor="variantName">Variant / pack</label><input id="variantName" name="variantName" required maxLength={240} className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" placeholder="50 kg bag" /></div>
                <div><label className="text-sm font-bold" htmlFor="manufacturerPartNumber">Manufacturer part number</label><input id="manufacturerPartNumber" name="manufacturerPartNumber" maxLength={160} className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div><label className="text-sm font-bold" htmlFor="unitQuantity">Pack quantity</label><input id="unitQuantity" name="unitQuantity" type="number" step="0.001" min="0.001" defaultValue="1" required className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" /></div>
                <div><label className="text-sm font-bold" htmlFor="unitName">Unit</label><input id="unitName" name="unitName" required maxLength={80} className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" placeholder="bag, kg, piece, metre" /></div>
                <div><label className="text-sm font-bold" htmlFor="gtin">GTIN / barcode</label><input id="gtin" name="gtin" maxLength={32} className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div><label className="text-sm font-bold" htmlFor="sellerSku">Your SKU</label><input id="sellerSku" name="sellerSku" required maxLength={160} className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" /></div>
                <div><label className="text-sm font-bold" htmlFor="price">Price (₹)</label><input id="price" name="price" type="number" min="0.01" step="0.01" required className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" /></div>
                <div><label className="text-sm font-bold" htmlFor="minOrderQty">Minimum order</label><input id="minOrderQty" name="minOrderQty" type="number" min="0.001" step="0.001" defaultValue="1" required className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-2xl border border-white/10 p-4 text-sm font-bold"><input type="checkbox" name="deliveryAvailable" /> Delivery available</label>
                <div><label className="text-sm font-bold" htmlFor="leadTimeDays">Lead time (days)</label><input id="leadTimeDays" name="leadTimeDays" type="number" min="0" step="1" className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" /></div>
              </div>
              <button className="rounded-full bg-white px-6 py-3 font-black text-[#14091f]">Create product listing</button>
            </form>
          </section>
        </div>
      </main>
    </PublicShell>
  );
}
