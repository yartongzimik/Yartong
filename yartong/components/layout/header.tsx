import Link from "next/link";

import { auth, signOut } from "@/auth";
import { PLATFORM, ROUTES } from "@/lib/constants";
import { getDashboardForRole } from "@/lib/onboarding";

const primaryNav = [
  ["Materials", ROUTES.materials],
  ["Trades & Services", ROUTES.trades],
  ["Yartong Workforce", ROUTES.workers],
  ["Quick Jobs", ROUTES.quickJobs],
  ["Post a Job", ROUTES.postJob],
  ["Advertise", ROUTES.advertise],
] as const;

export async function Header() {
  const session = await auth();
  const dashboardHref = session?.user ? getDashboardForRole(session.user.primaryRole) : null;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07050D]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-[1540px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 items-center gap-4 border-b border-white/10">
          <Link href={ROUTES.home} className="shrink-0">
            <span className="block text-2xl font-black tracking-[-0.05em] text-white sm:text-3xl">YAR<span className="text-fuchsia-300">TONG</span></span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 sm:block">Build. Connect. Grow.</span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center gap-3 lg:flex">
            <div className="shrink-0 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/75">⌖ Senapati, Manipur</div>
            <div className="flex min-w-0 flex-1 overflow-hidden rounded-xl border border-white/10 bg-white">
              <input aria-label="Search Yartong" className="min-w-0 flex-1 px-4 py-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-500" placeholder="Search materials, trades, services..." />
              <button type="button" className="bg-[#160720] px-6 text-sm font-black text-white">Search</button>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {dashboardHref ? (
              <>
                <Link className="hidden text-sm font-bold text-white/70 transition hover:text-white md:inline" href="/account">Account</Link>
                <Link className="rounded-xl bg-white px-4 py-2.5 text-sm font-black text-[#160720]" href={dashboardHref}>Dashboard</Link>
                <form action={async () => { "use server"; await signOut({ redirectTo: ROUTES.home }); }}>
                  <button className="hidden text-sm font-bold text-rose-100/75 transition hover:text-rose-100 sm:inline">Logout</button>
                </form>
              </>
            ) : (
              <>
                <Link className="hidden text-sm font-bold text-white/70 transition hover:text-white md:inline" href={ROUTES.join}>Become a Provider</Link>
                <span className="hidden h-5 w-px bg-white/10 md:block" />
                <Link className="text-sm font-bold text-white/75 transition hover:text-white" href={ROUTES.login}>Login</Link>
                <Link className="rounded-xl bg-gradient-to-r from-[#9B4DFF] to-[#E126FF] px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-fuchsia-900/25" href={ROUTES.join}>Register</Link>
              </>
            )}
          </div>
        </div>

        <nav className="hidden min-h-14 items-center justify-between gap-3 overflow-x-auto text-sm font-bold text-white/72 md:flex" aria-label={`${PLATFORM.name} marketplace navigation`}>
          {primaryNav.map(([label, href]) => (
            <Link key={label} href={href} className="whitespace-nowrap rounded-lg px-3 py-2 transition hover:bg-white/[0.06] hover:text-white">{label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}