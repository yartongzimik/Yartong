import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { requireRole } from "@/lib/authz";
import { formatMoney } from "@/lib/jobs/validation";
import { getPublicCatalogProduct } from "@/lib/marketplace/catalog";
import { getOrderableStocks } from "@/lib/marketplace/material-orders";

import { placeMaterialOrderAction } from "./actions";

type Props = { params: Promise<{ id: string }> };

export default async function MaterialOrderPage({ params }: Props) {
  await requireRole("CUSTOMER");
  const { id } = await params;
  const [catalog, stocks] = await Promise.all([
    getPublicCatalogProduct(id),
    getOrderableStocks(id),
  ]);
  if (!catalog) notFound();

  return (
    <PublicShell>
      <main className="mx-auto max-w-4xl px-6 py-12 text-white">
        <Link href={`/materials/${id}`} className="text-sm font-bold text-fuchsia-200">← Back to product</Link>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/70">Material order</p>
        <h1 className="mt-3 text-4xl font-black">Order {catalog.product.name}</h1>
        <p className="mt-3 max-w-2xl text-white/60">Choose one verified supplier stock location. Placing the order reserves the requested quantity immediately to reduce overselling risk.</p>

        {stocks.length ? (
          <form action={placeMaterialOrderAction.bind(null, id)} className="mt-8 space-y-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div>
              <label className="text-sm font-bold" htmlFor="stockSelection">Supplier, variant & stock location</label>
              <select id="stockSelection" name="stockSelection" required className="mt-2 w-full rounded-2xl border border-white/15 bg-[#120b1d] px-4 py-3">
                {stocks.map((stock) => (
                  <option key={stock.stockId} value={`${stock.stockId}|${stock.listingId}`}>
                    {stock.supplierBusinessName || stock.supplierName} — {stock.variantName} — {stock.locationName} — {formatMoney(stock.price, stock.currency)} — {stock.availableQty} available
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-bold" htmlFor="quantity">Quantity</label>
                <input id="quantity" name="quantity" type="number" min="0.001" step="0.001" required className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" />
              </div>
              <div>
                <label className="text-sm font-bold" htmlFor="fulfillmentMethod">Fulfillment</label>
                <select id="fulfillmentMethod" name="fulfillmentMethod" required className="mt-2 w-full rounded-2xl border border-white/15 bg-[#120b1d] px-4 py-3">
                  <option value="PICKUP">Pickup</option>
                  <option value="DELIVERY">Delivery</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-bold" htmlFor="deliveryAddress">Delivery address (required only for delivery)</label>
              <textarea id="deliveryAddress" name="deliveryAddress" maxLength={700} rows={3} className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" />
            </div>
            <div>
              <label className="text-sm font-bold" htmlFor="customerNote">Order note</label>
              <textarea id="customerNote" name="customerNote" maxLength={2000} rows={3} className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" placeholder="Site directions, preferred pickup window, or other useful fulfillment details." />
            </div>
            <div className="rounded-2xl border border-amber-200/15 bg-amber-200/10 p-4 text-sm text-amber-50/80">
              This workflow reserves stock and creates a supplier order. Payment collection is not simulated here; payment remains a separate production-provider integration.
            </div>
            <button className="rounded-full bg-white px-6 py-3 font-black text-[#14091f]">Place order & reserve stock</button>
          </form>
        ) : (
          <p className="mt-8 rounded-3xl border border-white/10 p-6 text-white/55">No supplier location currently has recorded available stock for this product.</p>
        )}
      </main>
    </PublicShell>
  );
}
