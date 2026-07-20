import {
  AccountStatus,
  EngagementStatus,
  JobStatus,
  PaymentEventStatus,
  PaymentStatus,
  UserRole,
  VerificationRequestStatus,
} from "@prisma/client";
import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";
import { prisma } from "@/lib/prisma";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export default async function AdminDashboardPage() {
  const [
    activeUsers,
    onboardingPending,
    publishedJobs,
    activeEngagements,
    pendingVerifications,
    failedPayments,
    failedPaymentEvents,
    recentUsers,
    recentVerifications,
  ] = await Promise.all([
    prisma.user.count({ where: { accountStatus: AccountStatus.ACTIVE } }),
    prisma.user.count({ where: { primaryRole: UserRole.ONBOARDING_PENDING } }),
    prisma.job.count({ where: { status: JobStatus.PUBLISHED } }),
    prisma.engagement.count({
      where: {
        status: {
          in: [
            EngagementStatus.PENDING,
            EngagementStatus.CONFIRMED,
            EngagementStatus.IN_PROGRESS,
            EngagementStatus.DISPUTED,
          ],
        },
      },
    }),
    prisma.verificationRequest.count({
      where: {
        status: {
          in: [
            VerificationRequestStatus.SUBMITTED,
            VerificationRequestStatus.UNDER_REVIEW,
          ],
        },
      },
    }),
    prisma.paymentOrder.count({ where: { status: PaymentStatus.FAILED } }),
    prisma.paymentEvent.count({ where: { status: PaymentEventStatus.FAILED } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        displayName: true,
        email: true,
        primaryRole: true,
        accountStatus: true,
        createdAt: true,
      },
    }),
    prisma.verificationRequest.findMany({
      where: {
        status: {
          in: [
            VerificationRequestStatus.SUBMITTED,
            VerificationRequestStatus.UNDER_REVIEW,
          ],
        },
      },
      orderBy: { submittedAt: "desc" },
      take: 5,
      select: {
        id: true,
        type: true,
        status: true,
        submittedAt: true,
        applicant: { select: { displayName: true } },
      },
    }),
  ]);

  const metrics = [
    { label: "Active users", value: activeUsers },
    { label: "Onboarding pending", value: onboardingPending },
    { label: "Published jobs", value: publishedJobs },
    { label: "Active engagements", value: activeEngagements },
    { label: "Verification queue", value: pendingVerifications },
    { label: "Payment failures", value: failedPayments + failedPaymentEvents },
  ];

  const actions = [
    {
      label: "Verification queue",
      href: "/admin/verifications",
      description: "Review identity, business and professional credential requests.",
    },
    {
      label: "User administration",
      href: "/admin/users",
      description: "Open the reserved account-management area for moderation and support workflows.",
    },
    {
      label: "Marketplace categories",
      href: "/admin/categories",
      description: "Open the reserved category-management surface for future controlled taxonomy changes.",
    },
    {
      label: "Platform analytics",
      href: "/admin/analytics",
      description: "Open the reserved analytics area; no fabricated business metrics are shown here.",
    },
  ];

  return (
    <PublicShell>
      <main className="mx-auto w-full max-w-7xl px-6 py-10 text-white sm:py-14">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-200/75">
            Admin operations
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-5xl">Yartong control center</h1>
          <p className="mt-3 max-w-3xl leading-7 text-white/60">
            Monitor real marketplace activity, trust queues and payment integration health from server-authoritative data.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-xs text-white/45">{metric.label}</p>
                <p className="mt-2 text-3xl font-black">{metric.value}</p>
              </div>
            ))}
          </div>
        </section>

        {(failedPayments > 0 || failedPaymentEvents > 0) ? (
          <p className="mt-5 rounded-2xl border border-rose-200/20 bg-rose-200/10 p-4 text-sm text-rose-50/80">
            Payment integration requires attention: {failedPayments} failed payment order(s) and {failedPaymentEvents} failed provider event(s) are recorded.
          </p>
        ) : null}

        <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-fuchsia-200/30 hover:bg-fuchsia-200/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
            >
              <h2 className="font-black">{action.label}</h2>
              <p className="mt-2 text-sm leading-6 text-white/50">{action.description}</p>
              <span className="mt-5 inline-block text-sm font-bold text-fuchsia-200">Open →</span>
            </Link>
          ))}
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black">Recent accounts</h2>
              <Link href="/admin/users" className="text-sm font-bold text-fuchsia-200">
                View users
              </Link>
            </div>
            <div className="mt-5 divide-y divide-white/10">
              {recentUsers.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold">{item.displayName || item.email || "Unnamed account"}</p>
                      <p className="mt-1 text-xs text-white/45">
                        {item.primaryRole.replaceAll("_", " ")} · {item.accountStatus}
                      </p>
                    </div>
                    <span className="text-xs text-white/35">{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black">Verification queue</h2>
              <Link href="/admin/verifications" className="text-sm font-bold text-fuchsia-200">
                Review queue
              </Link>
            </div>
            {recentVerifications.length ? (
              <div className="mt-5 divide-y divide-white/10">
                {recentVerifications.map((item) => (
                  <Link
                    key={item.id}
                    href="/admin/verifications"
                    className="block py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold">{item.applicant.displayName || "Applicant"}</p>
                        <p className="mt-1 text-xs text-white/45">
                          {item.type.replaceAll("_", " ")} · {item.status.replaceAll("_", " ")}
                        </p>
                      </div>
                      <span className="text-xs text-white/35">{formatDate(item.submittedAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-white/50">No verification requests are waiting for review.</p>
            )}
          </section>
        </div>
      </main>
    </PublicShell>
  );
}
