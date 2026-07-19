import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { ROUTES } from "@/lib/constants";

type IntentPathway = {
  title: string;
  description: string;
  href: string;
  action: string;
  intent: "hire" | "work";
  icon: "post" | "worker" | "contractor" | "materials" | "quick";
};

const pathways: IntentPathway[] = [
  {
    title: "Post a Job",
    description: "Share the work you need done and invite trusted local responses.",
    href: ROUTES.postJob,
    action: "Start a post",
    intent: "hire",
    icon: "post",
  },
  {
    title: "Hire a Worker",
    description: "Browse skilled providers for repairs, installs, and day-to-day tasks.",
    href: ROUTES.workers,
    action: "View workers",
    intent: "hire",
    icon: "worker",
  },
  {
    title: "Find a Contractor",
    description: "Compare teams for larger builds, renovations, and managed projects.",
    href: ROUTES.trades,
    action: "Find teams",
    intent: "hire",
    icon: "contractor",
  },
  {
    title: "Find Materials",
    description: "Check local construction supplies and supplier options faster.",
    href: ROUTES.materials,
    action: "Browse supplies",
    intent: "hire",
    icon: "materials",
  },
  {
    title: "Find Quick Work",
    description: "Jump to urgent short-duration jobs needing available hands.",
    href: ROUTES.quickJobs,
    action: "See quick jobs",
    intent: "work",
    icon: "quick",
  },
];

function PathwayIcon({ icon }: { icon: IntentPathway["icon"] }) {
  const common = "h-5 w-5";

  if (icon === "worker") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    );
  }

  if (icon === "contractor") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M6 21V8l6-4 6 4v13" />
        <path d="M9 21v-7h6v7" />
      </svg>
    );
  }

  if (icon === "materials") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" />
        <path d="m4 12 8 4.5 8-4.5" />
        <path d="m4 16.5 8 4.5 8-4.5" />
      </svg>
    );
  }

  if (icon === "quick") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h12v16H6z" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h3" />
    </svg>
  );
}

export function IntentPathways() {
  return (
    <Section className="overflow-hidden bg-[#090511] py-10 sm:py-12" containerClassName="relative">
      <div className="absolute inset-x-6 top-1/2 h-px bg-gradient-to-r from-transparent via-fuchsia-300/20 to-transparent" aria-hidden="true" />
      <div className="relative rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.035] to-fuchsia-500/[0.06] p-4 shadow-2xl shadow-fuchsia-950/25 backdrop-blur sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-fuchsia-200/75">Quick pathways</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">What do you want to do?</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/60">Choose a focused route into Yartong without scanning the whole marketplace.</p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {pathways.map((pathway) => {
            const isWorkIntent = pathway.intent === "work";
            return (
              <Link
                key={pathway.title}
                href={pathway.href}
                className="group block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090511]"
              >
                <Card className={`flex h-full flex-col p-4 transition group-hover:-translate-y-0.5 group-hover:border-fuchsia-200/35 group-hover:bg-white/[0.09] ${isWorkIntent ? "border-violet-200/20 bg-violet-300/[0.07]" : "border-fuchsia-200/15"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border ${isWorkIntent ? "border-violet-200/25 bg-violet-300/15 text-violet-100" : "border-fuchsia-200/25 bg-fuchsia-300/15 text-fuchsia-100"}`}>
                      <PathwayIcon icon={pathway.icon} />
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wider ${isWorkIntent ? "bg-violet-200/12 text-violet-100" : "bg-fuchsia-200/12 text-fuchsia-100"}`}>
                      {isWorkIntent ? "Work" : "Hire"}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-black text-white">{pathway.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-5 text-white/62">{pathway.description}</p>
                  <span className="mt-4 inline-flex min-h-10 items-center text-sm font-black text-fuchsia-100 transition group-hover:text-white">
                    {pathway.action} <span className="ml-1 transition group-hover:translate-x-0.5" aria-hidden="true">→</span>
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
