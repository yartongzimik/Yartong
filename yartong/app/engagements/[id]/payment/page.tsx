import { EngagementStatus, PaymentStatus } from "@prisma/client";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { requireUser } from "@/lib/authz";
import { formatMoney } from "@/lib/jobs/validation";
import { getPaymentProviderConfiguration } from "@/lib/payments/provider";
import { prisma } from "@/lib/prisma";

import {
  cancelPreparedPaymentOrderAction,
  preparePaymentOrderAction,
} from "./actions";

type Props = { params: Promise<{ id: string }> };

const PAYABLE_STATUSES: EngagementStatus[] = [
  EngagementStatus.CONFIRMED,
  EngagementStatus.IN_PROGRESS,
  EngagementStatus.COMPLETED,
];

export default async function EngagementPaymentPage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const engagement = await prisma.engagement.findFirst({
    where: {
      id,
      OR: [{ customerId: user.id }, { providerId: user.id }],
    },
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
  const payable =
    PAYABLE_STATUSES.includes(engagement.status) &&
    engagement.agreedPrice !== null &&
    engagement.agreedPrice > 0;
  const providerConfig = getPaymentProviderConfiguration();

  return (
    <PublicShell>
      <main className="mx-auto max-w-4xl px-6 py-12 text-white">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/75">
          Payment foundation
        </p>
        <h1 className="mt-3 text-4xl font-black">Payment for {engagement.job.title}</h1>
        <p className="mt-3 text-white/60">
          Yartong records the canonical payment order here. Actual money movement is disabled until a production payment provider and merchant credentials are securely configured.
        </p>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.05] p-6">
          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-white/45">Agreed amount</dt>
              <dd className="mt-1 text-2xl font-black">
                {engagement.agreedPrice === null
                  ? "Not finalized"
                  : formatMoney(engagement.agreedPrice, engagement.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-white/45">Engagement status</dt>
              <dd className="mt-1 font-bold">{engagement.status.replaceAll("_", " ")}</dd>
            </div>
          </dl>
        </section>

        {!providerConfig.configured ? (
          <section className="mt-6 rounded-3xl border border-amber-200/20 bg-amber-200/10 p-6 text-amber-50">
            <h2 className="font-black">Production payment provider not connected yet</h2>
            <p className="mt-2 text-sm leading-6 text-amber-50/75">
              The payment data model, idempotency keys and provider event ledger are ready. No charge will be attempted until the required provider credentials and webhook secret are added securely at launch.
            </p>
          </section>
        ) : (
          <section className="mt-6 rounded-3xl border border-fuchsia-200/20 bg-fuchsia-200/10 p-6 text-fuchsia-50">
            <h2 className="font-black">Provider configuration detected</h2>
            <p className="mt-2 text-sm text-fuchsia-50/75">
              {providerConfig.providerName} credentials are present, but live checkout remains intentionally disabled until the matching production adapter is implemented and verified.
            </p>
          </section>
        )}

        {engagement.paymentOrder ? (
          <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-6">
            <h2 className="text-2xl font-black">Payment order</h2>
            <p className="mt-3 text-white/65">
              {formatMoney(engagement.paymentOrder.amount, engagement.paymentOrder.currency)} · {engagement.paymentOrder.status.replaceAll("_", " ")}
            </p>
            {engagement.paymentOrder.failureMessage ? (
              <p className="mt-3 text-sm text-rose-100">{engagement.paymentOrder.failureMessage}</p>
            ) : null}
            {isCustomer && engagement.paymentOrder.status === PaymentStatus.CREATED ? (
              <form action={cancelPreparedPaymentOrderAction.bind(null, engagement.id)} className="mt-5">
                <button className="rounded-full border border-white/15 px-5 py-3 font-black">
                  Cancel prepared payment order
                </button>
              </form>
            ) : null}
          </section>
        ) : isCustomer && payable ? (
          <form action={preparePaymentOrderAction.bind(null, engagement.id)} className="mt-6">
            <button className="rounded-full bg-white px-6 py-3 font-black text-[#14091f]">
              Prepare payment order
            </button>
          </form>
        ) : null}

        {!payable ? (
          <p className="mt-6 rounded-2xl border border-white/10 p-4 text-sm text-white/55">
            Payment preparation becomes available after the engagement is confirmed and has a positive agreed price.
          </p>
        ) : null}
      </main>
    </PublicShell>
  );
}
