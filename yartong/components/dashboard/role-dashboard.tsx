import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";

type Metric = {
  label: string;
  value: string | number;
  helper?: string;
};

type Action = {
  label: string;
  href: string;
  description: string;
};

type Activity = {
  title: string;
  href: string;
  meta: string;
};

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  metrics: Metric[];
  actions: Action[];
  activityTitle: string;
  activities: Activity[];
  emptyActivity: string;
  notice?: string;
};

export function RoleDashboard({
  eyebrow,
  title,
  subtitle,
  metrics,
  actions,
  activityTitle,
  activities,
  emptyActivity,
  notice,
}: Props) {
  return (
    <PublicShell>
      <main className="mx-auto w-full max-w-6xl px-6 py-10 text-white sm:py-14">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-fuchsia-950/10 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-200/75">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-5xl">{title}</h1>
          <p className="mt-3 max-w-3xl leading-7 text-white/60">{subtitle}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-white/50">{metric.label}</p>
                <p className="mt-2 text-3xl font-black">{metric.value}</p>
                {metric.helper ? (
                  <p className="mt-2 text-xs leading-5 text-white/40">{metric.helper}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {notice ? (
          <p className="mt-5 rounded-2xl border border-amber-200/15 bg-amber-200/[0.08] p-4 text-sm leading-6 text-amber-50/80">
            {notice}
          </p>
        ) : null}

        <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-fuchsia-200/30 hover:bg-fuchsia-200/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
            >
              <p className="font-black text-white group-hover:text-fuchsia-100">{action.label}</p>
              <p className="mt-2 text-sm leading-6 text-white/50">{action.description}</p>
              <span className="mt-5 inline-block text-sm font-bold text-fuchsia-200">Open →</span>
            </Link>
          ))}
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
          <h2 className="text-2xl font-black">{activityTitle}</h2>
          {activities.length ? (
            <div className="mt-5 divide-y divide-white/10">
              {activities.map((activity) => (
                <Link
                  key={`${activity.href}-${activity.title}`}
                  href={activity.href}
                  className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <span className="font-bold text-white/90 hover:text-fuchsia-100">{activity.title}</span>
                  <span className="shrink-0 text-xs text-white/40">{activity.meta}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-white/50">{emptyActivity}</p>
          )}
        </section>
      </main>
    </PublicShell>
  );
}
