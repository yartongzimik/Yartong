"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { ROUTES } from "@/lib/constants";

type DiscoveryMode = "workers" | "contractors" | "materials" | "quick-jobs";

const contractorDiscoveryHref = ROUTES.trades;

const modes: Record<DiscoveryMode, { label: string; placeholder: string; context: string; href: string }> = {
  workers: {
    label: "Workers",
    placeholder: "Search carpenters, plumbers, painters near Senapati",
    context: "Browse skilled workers ready for local home and site work.",
    href: ROUTES.workers,
  },
  contractors: {
    label: "Contractors",
    placeholder: "Search renovation, roofing, or full-build contractors",
    context: "Compare project teams for larger repairs and construction.",
    href: contractorDiscoveryHref,
  },
  materials: {
    label: "Materials",
    placeholder: "Search cement, steel, pipes, paint, and suppliers",
    context: "Find nearby material suppliers with retail and wholesale options.",
    href: ROUTES.materials,
  },
  "quick-jobs": {
    label: "Quick Jobs",
    placeholder: "Search urgent repairs, installs, loading, and day work",
    context: "Post or discover smaller jobs that need fast local help.",
    href: ROUTES.quickJobs,
  },
};

export function Hero() {
  const [activeMode, setActiveMode] = useState<DiscoveryMode>("workers");
  const active = useMemo(() => modes[activeMode], [activeMode]);

  return (
    <section className="relative overflow-hidden pb-16 pt-20 sm:pb-24 sm:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(225,38,255,0.32),transparent_32%),radial-gradient(circle_at_70%_25%,rgba(155,77,255,0.28),transparent_28%)]" />
      <Container className="relative">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-5 inline-flex rounded-full border border-fuchsia-300/25 bg-fuchsia-300/10 px-4 py-2 text-sm font-semibold text-fuchsia-100">
            Senapati premium local work marketplace
          </p>
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl">
            Discover trusted labour, teams, and materials faster.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Yartong keeps discovery focused: choose what you need, scan curated previews, and continue to the closest public destination when ready.
          </p>

          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.07] p-3 shadow-2xl shadow-fuchsia-950/30 backdrop-blur">
            <div className="grid gap-2 sm:grid-cols-4">
              {(Object.keys(modes) as DiscoveryMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setActiveMode(mode)}
                  className={`rounded-full px-4 py-3 text-sm font-bold transition ${
                    activeMode === mode
                      ? "bg-white text-[#180722] shadow-lg shadow-fuchsia-500/30"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {modes[mode].label}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-col gap-3 rounded-[1.4rem] bg-[#0B0612] p-3 sm:flex-row">
              <input
                className="min-h-14 flex-1 rounded-2xl border border-white/10 bg-white px-5 text-base font-medium text-slate-950 outline-none placeholder:text-slate-500"
                placeholder={active.placeholder}
                aria-label={`${active.label} search`}
              />
              <Link
                href={active.href}
                className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-[#9B4DFF] to-[#E126FF] px-6 text-base font-black text-white shadow-lg shadow-fuchsia-600/30"
              >
                Explore {active.label}
              </Link>
            </div>
            <p className="px-3 pb-2 pt-3 text-sm text-white/60">{active.context}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
