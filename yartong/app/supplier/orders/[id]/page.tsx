import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { requireRole } from "@/lib/authz";
import { formatMoney } from "@/lib/jobs/validation";
import { getMaterialOrderForUser } from "@/lib/marketplace/material-orders";

import {
  fulfillMaterialOrderAction,
  rejectMaterialOrderAction,
  transitionMaterialOrderAction,
} from "../actions";

type Props = { params: Promise<{ id: string }> };

export default async function SupplierMaterialOrderDetailPage({ params }: Props) {
  const supplier = await requireRole("MATERIAL_SUPPLIER");
  const { id } = await params;
  const order = await getMaterialOrderForUser(id, supplier.id);
  if (!order || order.supplierId !== supplier.id) notFound();

  return (
    <PublicShell>
      <main className="mx-auto max-w-4xl px-6 py-12 text-white">
        <Link href="/supplier/orders" className="text-sm font-bold text-fuchsia-200">← Back to supplier orders</Link>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-fuchsia-200/70">{order.orderNumber} · {order.status}</p>
        <h1 className="mt-3 text-4xl font-black">{order.productName}</h1>
        <p className="mt-2 text-white/55">{order.variantName} · {order.quantity} {order.unitName}</p>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <dl className="grid gap-5 sm:grid-cols-2">
            <div><dt className="text-sm text-white/40">Customer</dt><dd className="mt-1 font-black">{order.customerName}</dd></div>
            <div><dt className="text-sm text-white/40">Order total</dt><dd className="mt-1 text-2xl font-black">{formatMoney(order.subtotal, order.currency)}</dd></div>
            <div><dt className="text-sm text-white/40">Fulfillment</dt><dd className="mt-1 font-black">{order.fulfillmentMethod} · {order.locationName}</dd></div>
            <div><dt className="text-sm text-white/40">Seller SKU</dt><dd className="mt-1 font-black">{order.sellerSku}</dd></div>
          </dl>
          {order.deliveryAddress ? <p className="mt-5 rounded-2xl bg-white/[0.04] p-4 text-sm text-white/65"><strong className="text-white">Delivery address:</strong> {order.deliveryAddress}</p> : null}
          {order.customerNote ? <p className="mt-3 rounded-2xl bg-white/[0.04] p-4 text-sm text-white/65"><strong className="text-white">Customer note:</strong> {order.customerNote}</p> : null}
          {order.supplierNote ? <p className="mt-3 rounded-2xl bg-amber-200/10 p-4 text-sm text-amber-50/80"><strong>Supplier note:</strong> {order.supplierNote}</p> : null}
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-black">Fulfillment actions</h2>
          <p className="mt-2 text-sm text-white/50">The reserved quantity remains unavailable to other orders until this order is rejected/cancelled or successfully fulfilled.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {order.status === "PLACED" ? (
              <form action={transitionMaterialOrderAction.bind(null, order.id, "ACCEPTED")}><button className="rounded-full bg-white px-5 py-3 font-black text-[#14091f]">Accept order</button></form>
            ) : null}
            {order.status === "ACCEPTED" ? (
              <form action={transitionMaterialOrderAction.bind(null, order.id, "PREPARING")}><button className="rounded-full bg-white px-5 py-3 font-black text-[#14091f]">Mark preparing</button></form>
            ) : null}
            {order.status === "PREPARING" ? (
              <form action={transitionMaterialOrderAction.bind(null, order.id, "READY")}><button className="rounded-full bg-white px-5 py-3 font-black text-[#14091f]">Mark ready</button></form>
            ) : null}
            {order.status === "READY" ? (
              <form action={fulfillMaterialOrderAction.bind(null, order.id)}><button className="rounded-full bg-emerald-100 px-5 py-3 font-black text-emerald-950">Mark fulfilled</button></form>
            ) : null}
          </div>
        </section>

        {order.status === "PLACED" ? (
          <form action={rejectMaterialOrderAction.bind(null, order.id)} className="mt-6 rounded-3xl border border-rose-200/15 bg-rose-200/[0.05] p-6">
            <h2 className="font-black">Reject order & release reservation</h2>
            <textarea name="note" maxLength={2000} rows={3} className="mt-3 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" placeholder="Explain why the order cannot be fulfilled." />
            <button className="mt-4 rounded-full border border-rose-200/25 px-5 py-3 font-black text-rose-100">Reject safely</button>
          </form>
        ) : null}
      </main>
    </PublicShell>
  );
}
