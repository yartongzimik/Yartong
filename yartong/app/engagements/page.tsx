import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";
import { requireUser } from "@/lib/authz";
import { formatMoney } from "@/lib/jobs/validation";
import {
  engagementStatusLabel,
  getUserEngagements,
} from "@/lib/marketplace/engagements";

export default async function EngagementsPage() {
  const user = await requireUser();
  const engagements = await getUserEngagements(user.id);

  return (
    <PublicShell>
      <main className="mx-auto max-w-6xl px-6 py-12 text-white">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/75">
          Work engagements
        </p>
        <h1 className="mt-4 text-4xl font-black">My engagements</h1>
        <p className="mt-3 text-white/65">
          Track confirmed hires from acceptance through active work and completion.
        </p>

        {engagements.length ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {engagements.map((engagement) => {
              const counterparty =
                engagement.customerId === user.id
                  ? engagement.provider.displayName
                  : engagement.customer.displayName;

              return (
                <Link
                  key={engagement.id}
                  href={`/engagements/${engagement.id}`}
                  className="rounded-3xl border border-white/10 bg-white/[0.06] p-6"
                >
                  <p className="text-xs font-black uppercase tracking-wider text-fuchsia-100">
                    {engagementStatusLabel(engagement.status)}
                  </p>
                  <h2 className="mt-3 text-2xl font-black">{engagement.job.title}</h2>
                  <p className="mt-2 text-white/65">
                    With {counterparty} · {engagement.job.location.name}, {engagement.job.location.state}
                  </p>
                  <p className="mt-3 font-bold">
                    {engagement.agreedPrice == null
                      ? "Price to be finalized"
                      : formatMoney(engagement.agreedPrice, engagement.currency)}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-white/10 p-8">
            No work engagements yet. An engagement is created when a customer accepts an application.
          </div>
        )}
      </main>
    </PublicShell>
  );
}
