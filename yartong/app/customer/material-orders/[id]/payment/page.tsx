import Link from "next/link";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { requireRole } from "@/lib/authz";
import { formatMoney } from "@/lib/jobs/validation";
import { getMaterialOrderForUser } from "@/lib/marketplace/material-orders";
import { getPaymentProviderConfiguration } from "@/lib/payments/provider";
import { prisma } from "@/lib/prisma";

import {
  cancelMaterialPaymentOrderAction,
  prepareMaterialPaymentOrderAction,
} from "./actions";

type Props = { params: Promise<{ id: string }> };

type MaterialPayment = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  providerName: string | null;
  providerPaymentRef: string | null;
  failureMessage: string | null;
};

export default async function MaterialPaymentPage({ params }: Props) {
  const customer = await requireRole("CUSTOMER");
  const { id } = await params;
  const order = await getMaterialOrderForUser(id, customer.id);
  if (!order || order.customerId !== customer.id) notFound();

  const payments = await prisma.$queryRaw<MaterialPayment[]>(Prisma.sql`
    SELECT "id", "status"::text AS "status", "amount", "currency", "providerName", "providerPaymentRef", "failureMessage"
    FROM "MaterialPaymentOrder"
    WHERE "materialOrderId" = ${id} AND "customerId" = ${customer.id}
    LIMIT 1
  `);
  const payment = payments[0] ?? null;
  const provider = getPaymentProviderConfiguration();
  const orderClosed = ["REJECTED", "CANCELLED"].includes(order.status);

  return (
    <PublicShell>
      <main className="mx-auto max-w-3xl px-6 py-12 text-white">
        <Link href={`/customer/material-orders/${id}`} className="text-sm font-bold text-fuchsia-200">← Back to order</Link>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-fuchsia-200/70">Material payment</p>
        <h1 className="mt-3 text-4xl font-black">{order.orderNumber}</h1>
        <p className="mt-3 text-white/60">{order.productName} · {order.variantName}</p>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white/40">Order total</p>
              <p className="mt-1 text-3xl font-black">{formatMoney(order.subtotal, order.currency)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 px-4 py-3 text-sm">
              <p className="text-white/40">Payment state</p>
              <p className="mt-1 font-black">{payment?.status ?? "NOT PREPARED"}</p>
            </div>
          </div>

          {!payment ? (
            <form action={prepareMaterialPaymentOrderAction.bind(null, id)} className="mt-6">
              <button disabled={orderClosed} className="rounded-full bg-white px-6 py-3 font-black text-[#14091f] disabled:cursor-not-allowed disabled:opacity-40">
                Prepare secure payment
              </button>
            </form>
          ) : null}

          {payment?.status === "CREATED" ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-amber-200/15 bg-amber-200/10 p-4 text-sm leading-6 text-amber-50/85">
                {provider.configured
                  ? "Yartong has payment-provider credentials configured, but a production checkout adapter has not yet been activated. No charge has been attempted."
                  : "Payment infrastructure is not yet fully configured. This record safely locks the authoritative order amount and ownership, but no charge has been attempted."}
              </div>
              <form action={cancelMaterialPaymentOrderAction.bind(null, id)}>
                <button className="rounded-full border border-white/15 px-5 py-3 font-black text-white/75">Cancel prepared payment</button>
              </form>
            </div>
          ) : null}

          {payment?.status === "SUCCEEDED" ? (
            <p className="mt-6 rounded-2xl border border-emerald-200/20 bg-emerald-200/10 p-4 text-sm text-emerald-50">Payment has been confirmed by the payment state machine.</p>
          ) : null}

          {payment?.failureMessage ? (
            <p className="mt-6 rounded-2xl border border-rose-200/20 bg-rose-200/10 p-4 text-sm text-rose-50">{payment.failureMessage}</p>
          ) : null}
        </section>

        <p className="mt-6 text-sm leading-6 text-white/45">
          Yartong never accepts a browser-controlled success flag. A material payment can become successful only through a future production gateway adapter and verified provider event processing.
        </p>
      </main>
    </PublicShell>
  );
}
