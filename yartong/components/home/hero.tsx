import Link from "next/link";

import { Container } from "@/components/ui/container";
import { INITIAL_SERVICE_LOCATIONS, PLATFORM, ROUTES, SEARCH_CONFIG } from "@/lib/constants";

const defaultLocation = INITIAL_SERVICE_LOCATIONS[0]?.name ?? SEARCH_CONFIG.defaultLocation;

const popularSearches = [
  { label: "Contractors", href: ROUTES.trades },
  { label: "Plumbers", href: ROUTES.workers },
  { label: "Electricians", href: ROUTES.workers },
  { label: "Building Materials", href: ROUTES.materials },
] as const;

const primaryActions = [
  { label: "Post a Job", href: ROUTES.postJob },
  { label: "Find Workers", href: ROUTES.workers },
  { label: "Quick Jobs", href: ROUTES.quickJobs },
] as const;

const trustSignals = [
  "Verification and ratings",
  "Platform-first contact",
  "Business growth insights",
] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-14 pt-18 sm:pb-20 sm:pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(225,38,255,0.34),transparent_32%),radial-gradient(circle_at_72%_18%,rgba(155,77,255,0.3),transparent_30%),linear-gradient(135deg,rgba(24,7,34,0.96),rgba(7,5,13,0.98))]" />
      <div className="absolute left-1/2 top-16 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <Container className="relative">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="text-center lg:text-left">
            <p className="mb-5 inline-flex rounded-full border border-fuchsia-300/25 bg-fuchsia-300/10 px-4 py-2 text-sm font-semibold text-fuchsia-100 shadow-lg shadow-fuchsia-950/20">
              Senapati-first trusted marketplace
            </p>
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl">
              Build with the right people, skills and materials.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/72 lg:mx-0">
              {PLATFORM.name} connects Senapati with trusted workers, contractors, quick jobs, and construction materials in one premium local marketplace.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              {primaryActions.map((action, index) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={
                    index === 0
                      ? "inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#9B4DFF] to-[#E126FF] px-6 text-sm font-black text-white shadow-lg shadow-fuchsia-600/30 transition hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0612]"
                      : "inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] px-6 text-sm font-black text-white transition hover:bg-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0612]"
                  }
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-3 shadow-2xl shadow-fuchsia-950/30 backdrop-blur">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#0B0612]/95 p-4 sm:p-5">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="min-w-0 flex-1">
                  <label htmlFor="hero-search" className="mb-2 block text-sm font-bold text-white/80">
                    What do you need?
                  </label>
                  <input
                    id="hero-search"
                    type="search"
                    placeholder="Search workers, contractors, quick jobs, materials"
                    className="min-h-14 w-full rounded-2xl border border-white/10 bg-white px-5 text-base font-medium text-slate-950 outline-none placeholder:text-slate-500 focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/25"
                  />
                </div>
                <div className="md:w-48">
                  <label htmlFor="hero-location" className="mb-2 block text-sm font-bold text-white/80">
                    Location
                  </label>
                  <select
                    id="hero-location"
                    defaultValue={defaultLocation}
                    className="min-h-14 w-full rounded-2xl border border-white/10 bg-white px-4 text-base font-bold text-slate-950 outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/25"
                    aria-label="Select service location"
                  >
                    <option value={defaultLocation}>{defaultLocation} Town</option>
                  </select>
                </div>
                <div className="flex md:items-end">
                  <button
                    type="button"
                    className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#9B4DFF] to-[#E126FF] px-7 text-base font-black text-white shadow-lg shadow-fuchsia-600/30 transition hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0612] md:w-auto"
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold text-white/60">Popular searches</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <Link
                      key={search.label}
                      href={search.href}
                      className="inline-flex min-h-10 items-center rounded-full border border-fuchsia-200/15 bg-fuchsia-200/10 px-4 text-sm font-bold text-fuchsia-50 transition hover:bg-fuchsia-200/18 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0612]"
                    >
                      {search.label}
                    </Link>
                  ))}
                </div>
              </div>

              <ul className="mt-6 grid gap-2 text-sm font-semibold text-white/72 sm:grid-cols-3">
                {trustSignals.map((signal) => (
                  <li key={signal} className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-3">
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
