import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";
import { requireRole } from "@/lib/authz";
import {
  getSupplierInventoryLocations,
  getSupplierInventoryStocks,
  getSupplierListings,
} from "@/lib/marketplace/catalog";
import { prisma } from "@/lib/prisma";

import { createInventoryLocationAction, setInventoryStockAction } from "./actions";

export default async function SupplierInventoryPage() {
  const supplier = await requireRole("MATERIAL_SUPPLIER");
  const [locations, stocks, listings, serviceLocations] = await Promise.all([
    getSupplierInventoryLocations(supplier.id),
    getSupplierInventoryStocks(supplier.id),
    getSupplierListings(supplier.id),
    prisma.location.findMany({ where: { isActive: true }, orderBy: [{ isPrimary: "desc" }, { name: "asc" }], select: { id: true, name: true, state: true } }),
  ]);

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-6 py-10 text-white sm:py-14">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-200/75">Inventory operations</p>
          <h1 className="mt-3 text-3xl font-black sm:text-5xl">Stock by location</h1>
          <p className="mt-3 max-w-3xl leading-7 text-white/60">
            Track physical stock separately for each store, warehouse, yard or depot. Available stock is always calculated as on-hand minus reserved quantity, preserving a clean boundary for future ordering and fulfillment.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/supplier/products" className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold">Manage product listings</Link>
            <Link href="/materials" className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold">View public catalog</Link>
          </div>
        </section>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <h2 className="text-2xl font-black">Inventory balances</h2>
            <p className="mt-2 text-sm text-white/50">Each manual quantity change creates an inventory movement entry for audit history.</p>
            <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
              {stocks.length ? (
                <div className="divide-y divide-white/10">
                  {stocks.map((stock) => (
                    <article key={stock.stockId} className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-200/60">{stock.locationName}</p>
                          <h3 className="mt-2 font-black">{stock.productName}</h3>
                          <p className="mt-1 text-sm text-white/50">{stock.variantName} · SKU {stock.sellerSku}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-right text-sm">
                          <div><p className="text-white/35">On hand</p><p className="mt-1 font-black">{stock.onHand}</p></div>
                          <div><p className="text-white/35">Reserved</p><p className="mt-1 font-black">{stock.reserved}</p></div>
                          <div><p className="text-white/35">Available</p><p className="mt-1 font-black text-emerald-200">{stock.available}</p></div>
                        </div>
                      </div>
                      {stock.reorderPoint !== null && stock.available <= stock.reorderPoint ? (
                        <p className="mt-4 rounded-2xl border border-amber-200/20 bg-amber-200/10 p-3 text-xs font-bold text-amber-100">Reorder signal: available quantity is at or below {stock.reorderPoint}.</p>
                      ) : null}
                    </article>
                  ))}
                </div>
              ) : (
                <p className="p-6 text-sm text-white/50">No stock balances yet. Create an inventory location, then assign stock to one of your product listings.</p>
              )}
            </div>

            {listings.length && locations.length ? (
              <form action={setInventoryStockAction} className="mt-8 rounded-3xl border border-white/10 bg-black/15 p-6">
                <h3 className="text-xl font-black">Set / reconcile stock count</h3>
                <p className="mt-2 text-sm text-white/50">Enter the verified physical on-hand quantity. Yartong records the difference as an adjustment movement instead of erasing history.</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-bold" htmlFor="listingId">Product listing</label>
                    <select id="listingId" name="listingId" required className="mt-2 w-full rounded-2xl border border-white/15 bg-[#120b1d] px-4 py-3">
                      {listings.map((listing) => <option key={listing.listingId} value={listing.listingId}>{listing.productName} — {listing.variantName} ({listing.sellerSku})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold" htmlFor="inventoryLocationId">Inventory location</label>
                    <select id="inventoryLocationId" name="inventoryLocationId" required className="mt-2 w-full rounded-2xl border border-white/15 bg-[#120b1d] px-4 py-3">
                      {locations.filter((location) => location.isActive).map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold" htmlFor="onHand">Verified on-hand quantity</label>
                    <input id="onHand" name="onHand" type="number" min="0" step="0.001" required className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" />
                  </div>
                  <div>
                    <label className="text-sm font-bold" htmlFor="reorderPoint">Reorder point</label>
                    <input id="reorderPoint" name="reorderPoint" type="number" min="0" step="0.001" className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-bold" htmlFor="reason">Adjustment reason</label>
                  <input id="reason" name="reason" maxLength={1000} className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" placeholder="Physical stock count, opening balance, received shipment…" />
                </div>
                <button className="mt-5 rounded-full bg-white px-6 py-3 font-black text-[#14091f]">Save stock count</button>
              </form>
            ) : null}
          </section>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
              <h2 className="text-2xl font-black">Inventory locations</h2>
              <div className="mt-5 space-y-3">
                {locations.map((location) => (
                  <div key={location.id} className="rounded-2xl border border-white/10 p-4">
                    <p className="font-black">{location.name}</p>
                    <p className="mt-1 text-xs text-white/45">{location.yartongLocationName || "Custom location"}{location.addressLine ? ` · ${location.addressLine}` : ""}</p>
                  </div>
                ))}
                {!locations.length ? <p className="text-sm text-white/50">No inventory locations created yet.</p> : null}
              </div>
            </div>

            <form action={createInventoryLocationAction} className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
              <h2 className="text-xl font-black">Add store / warehouse / yard</h2>
              <div className="mt-5">
                <label className="text-sm font-bold" htmlFor="name">Location name</label>
                <input id="name" name="name" required maxLength={160} className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" placeholder="Main warehouse" />
              </div>
              <div className="mt-4">
                <label className="text-sm font-bold" htmlFor="locationId">Yartong service location</label>
                <select id="locationId" name="locationId" className="mt-2 w-full rounded-2xl border border-white/15 bg-[#120b1d] px-4 py-3">
                  <option value="">Not linked</option>
                  {serviceLocations.map((location) => <option key={location.id} value={location.id}>{location.name}, {location.state}</option>)}
                </select>
              </div>
              <div className="mt-4">
                <label className="text-sm font-bold" htmlFor="addressLine">Address / directions</label>
                <input id="addressLine" name="addressLine" maxLength={500} className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" />
              </div>
              <button className="mt-5 rounded-full border border-fuchsia-200/30 bg-fuchsia-200/10 px-5 py-3 font-black text-fuchsia-100">Create inventory location</button>
            </form>
          </section>
        </div>
      </main>
    </PublicShell>
  );
}
