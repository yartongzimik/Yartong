import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { requireRole } from "@/lib/authz";
import { formatMoney } from "@/lib/jobs/validation";
import { getMaterialOrderForUser } from "@/lib/marketplace/material-orders";

import { cancelPlacedMaterialOrderAction } from "../actions";

type Props = { params: Promise<{ id: string }> };

export default async function CustomerMaterialOrderDetailPage({ params }: Props) {
  const customer = await requireRole("CUSTOMER");
  const { id } = await params;
  const order = await getMaterialOrderForUser(id, customer.id);
  if (!order || order.customerId !== customer.id) notFound();

  const steps = ["PLACED", "ACCEPTED", "PREPARING", "READY", "FULFILLED"];
  const currentIndex = steps.indexOf(order.status);

  return (
    <PublicShell>
      <main className="mx-auto max-w-4xl px-6 py-12 text-white">
        <Link href="/customer/material-orders" className="text-sm font-bold text-fuchsia-200">← Back to material orders</Link>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-fuchsia-200/70">{order.orderNumber} · {order.status}</p>
        <h1 className="mt-3 text-4xl font-black">{order.productName}</h1>
        <p className="mt-2 text-white/55">{order.variantName} · {order.quantity} {order.unitName}</p>

        {!['REJECTED', 'CANCELLED'].includes(order.status) ? (
          <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="font-black">Order progress</h2>
            <div className="mt-5 grid gap-2 sm:grid-cols-5">
              {steps.map((step, index) => (
                <div key={step} className={`rounded-2xl border p-3 text-center text-xs font-black ${index <= currentIndex ? "border-emerald-200/25 bg-emerald-200/10 text-emerald-100" : "border-white/10 text-white/35"}`}>
                  {step}
                </div>
              ))}
            </div>
          </section>
        ) : (
          <p className="mt-8 rounded-2xl border border-rose-200/20 bg-rose-200/10 p-4 text-sm text-rose-50">This order is {order.status.toLowerCase()}. Any active inventory reservation has been released.</p>
        )}

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <dl className="grid gap-5 sm:grid-cols-2">
            <div><dt className="text-sm text-white/40">Supplier</dt><dd className="mt-1 font-black">{order.supplierName}</dd></div>
            <div><dt className="text-sm text-white/40">Order total</dt><dd className="mt-1 text-2xl font-black">{formatMoney(order.subtotal, order.currency)}</dd></div>
            <div><dt className="text-sm text-white/40">Fulfillment</dt><dd className="mt-1 font-black">{order.fulfillmentMethod} · {order.locationName}</dd></div>
            <div><dt className="text-sm text-white/40">Unit price</dt><dd className="mt-1 font-black">{formatMoney(order.unitPrice, order.currency)}</dd></div>
          </dl>
          {order.deliveryAddress ? <p className="mt-5 rounded-2xl bg-white/[0.04] p-4 text-sm text-white/65"><strong className="text-white">Delivery address:</strong> {order.deliveryAddress}</p> : null}
          {order.customerNote ? <p className="mt-3 rounded-2xl bg-white/[0.04] p-4 text-sm text-white/65"><strong className="text-white">Your note:</strong> {order.customerNote}</p> : null}
          {order.supplierNote ? <p className="mt-3 rounded-2xl bg-amber-200/10 p-4 text-sm text-amber-50/80"><strong>Supplier note:</strong> {order.supplierNote}</p> : null}
        </section>

        {order.status === "PLACED" ? (
          <form action={cancelPlacedMaterialOrderAction.bind(null, order.id)} className="mt-6">
            <button className="rounded-full border border-rose-200/25 px-5 py-3 font-black text-rose-100">Cancel before supplier acceptance</button>
          </form>
        ) : null}

        <p className="mt-6 text-sm leading-6 text-white/45">This order lifecycle manages inventory reservation and fulfillment status. It does not represent successful payment collection; payment remains behind Yartong's separate verified payment-provider boundary.</p>
      </main>
    </PublicShell>
  );
}
