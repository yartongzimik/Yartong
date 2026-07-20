import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";
import { requireRole } from "@/lib/authz";
import { formatMoney } from "@/lib/jobs/validation";
import { listMaterialOrdersForUser } from "@/lib/marketplace/material-orders";

export default async function SupplierMaterialOrdersPage() {
  const supplier = await requireRole("MATERIAL_SUPPLIER");
  const orders = await listMaterialOrdersForUser(supplier.id, true);

  return (
    <PublicShell>
      <main className="mx-auto max-w-6xl px-6 py-12 text-white">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/70">Supplier fulfillment</p>
            <h1 className="mt-3 text-4xl font-black">Material orders</h1>
            <p className="mt-3 max-w-2xl text-white/60">Review placed orders, accept only what you can fulfill, prepare reserved stock and close orders when pickup or delivery is complete.</p>
          </div>
          <Link href="/supplier/inventory" className="rounded-full border border-white/15 px-5 py-3 font-black">Inventory</Link>
        </div>

        <section className="mt-8 space-y-4">
          {orders.length ? orders.map((order) => (
            <Link key={order.id} href={`/supplier/orders/${order.id}`} className="block rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-fuchsia-200/25">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-200/60">{order.orderNumber} · {order.status}</p>
                  <h2 className="mt-2 text-xl font-black">{order.productName}</h2>
                  <p className="mt-1 text-sm text-white/50">{order.variantName} · {order.quantity} {order.unitName} · Customer {order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black">{formatMoney(order.subtotal, order.currency)}</p>
                  <p className="mt-1 text-xs text-white/40">{order.fulfillmentMethod} · {order.locationName}</p>
                </div>
              </div>
            </Link>
          )) : <p className="rounded-3xl border border-white/10 p-8 text-white/50">No material orders yet.</p>}
        </section>
      </main>
    </PublicShell>
  );
}
