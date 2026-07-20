import { EngagementStatus, PaymentStatus } from "@prisma/client";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { requireUser } from "@/lib/authz";
import { formatMoney } from "@/lib/jobs/validation";
import { getPaymentProviderConfiguration } from "@/lib/payments/provider";
import { prisma } from "@/lib/prisma";

import { cancelPreparedPaymentOrderAction, preparePaymentOrderAction } from "./actions";
import { RazorpayCheckoutButton } from "./razorpay-checkout";

type Props = { params: Promise<{ id: string }> };

const PAYABLE_STATUSES: EngagementStatus[] = [EngagementStatus.CONFIRMED, EngagementStatus.IN_PROGRESS, EngagementStatus.COMPLETED];

export default async function EngagementPaymentPage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const engagement = await prisma.engagement.findFirst({
    where: { id, OR: [{ customerId: user.id }, { providerId: user.id }] },
    select: {
      id: true,
      customerId: true,
      providerId: true,
      status: true,
      agreedPrice: true,
      currency: true,
      job: { select: { title: true } },
      paymentOrder: {
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          providerName: true,
          providerPaymentRef: true,
          failureMessage: true,
          paidAt: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!engagement) notFound();
  const isCustomer = engagement.customerId === user.id;
  const payable = PAYABLE_STATUSES.includes(engagement.status) && engagement.agreedPrice !== null && engagement.agreedPrice > 0;
  const providerConfig = getPaymentProviderConfiguration();
  const razorpayReady = providerConfig.configured && providerConfig.providerName?.toLowerCase() === "razorpay";

  return (
    <PublicShell>
      <main className="mx-auto max-w-4xl px-6 py-12 text-white">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/75">Secure payment</p>
        <h1 className="mt-3 text-4xl font-black">Payment for {engagement.job.title}</h1>
        <p className="mt-3 text-white/60">Yartong creates the payment order server-side. Payment completion is confirmed from signed Razorpay webhooks rather than trusting browser success callbacks.</p>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.05] p-6">
          <dl className="grid gap-5 sm:grid-cols-2">
            <div><dt className="text-sm text-white/45">Agreed amount</dt><dd className="mt-1 text-2xl font-black">{engagement.agreedPrice === null ? "Not finalized" : formatMoney(engagement.agreedPrice, engagement.currency)}</dd></div>
            <div><dt className="text-sm text-white/45">Engagement status</dt><dd className="mt-1 font-bold">{engagement.status.replaceAll("_", " ")}</dd></div>
          </dl>
        </section>

        {!razorpayReady ? (
          <section className="mt-6 rounded-3xl border border-amber-200/20 bg-amber-200/10 p-6 text-amber-50">
            <h2 className="font-black">Razorpay merchant configuration required</h2>
            <p className="mt-2 text-sm leading-6 text-amber-50/75">Set PAYMENT_PROVIDER=razorpay plus the merchant key id, secret key and webhook secret in the deployment environment. No credentials are stored in source control.</p>
          </section>
        ) : (
          <section className="mt-6 rounded-3xl border border-emerald-200/20 bg-emerald-200/10 p-6 text-emerald-50">
            <h2 className="font-black">Secure checkout is available</h2>
            <p className="mt-2 text-sm text-emerald-50/75">Razorpay order creation and signed webhook reconciliation are enabled for this deployment.</p>
          </section>
        )}

        {engagement.paymentOrder ? (
          <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-6">
            <h2 className="text-2xl font-black">Payment order</h2>
            <p className="mt-3 text-white/65">{formatMoney(engagement.paymentOrder.amount, engagement.paymentOrder.currency)} · {engagement.paymentOrder.status.replaceAll("_", " ")}</p>
            {engagement.paymentOrder.failureMessage ? <p className="mt-3 text-sm text-rose-100">{engagement.paymentOrder.failureMessage}</p> : null}
            {isCustomer && razorpayReady && [PaymentStatus.CREATED, PaymentStatus.REQUIRES_ACTION].includes(engagement.paymentOrder.status) ? (
              <RazorpayCheckoutButton engagementId={engagement.id} name={user.displayName} email={user.email} />
            ) : null}
            {isCustomer && engagement.paymentOrder.status === PaymentStatus.CREATED ? (
              <form action={cancelPreparedPaymentOrderAction.bind(null, engagement.id)} className="mt-4"><button className="rounded-full border border-white/15 px-5 py-3 font-black">Cancel prepared payment order</button></form>
            ) : null}
          </section>
        ) : isCustomer && payable ? (
          <form action={preparePaymentOrderAction.bind(null, engagement.id)} className="mt-6"><button className="rounded-full bg-white px-6 py-3 font-black text-[#14091f]">Prepare payment order</button></form>
        ) : null}

        {!payable ? <p className="mt-6 rounded-2xl border border-white/10 p-4 text-sm text-white/55">Payment preparation becomes available after the engagement is confirmed and has a positive agreed price.</p> : null}
      </main>
    </PublicShell>
  );
}
