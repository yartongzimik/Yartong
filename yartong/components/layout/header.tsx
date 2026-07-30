import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { signOut } from "@/auth";
import { getCurrentUser } from "@/lib/authz";
import { PLATFORM, ROUTES } from "@/lib/constants";
import { getDashboardForRole } from "@/lib/onboarding";
import { isAuthBypassEnabled } from "@/lib/phase-flags";

const primaryNav = [
  ["▦", "Materials", ROUTES.materials],
  ["⚒", "Trades & Services", ROUTES.trades],
  ["♙", "Yartong Workforce", ROUTES.workers],
  ["▧", "RFQ (Request Quote)", ROUTES.postJob],
  ["◇", "Deals", ROUTES.materials],
  ["◷", "Business Intelligence", ROUTES.advertise],
] as const;

export async function Header() {
  const user = await getCurrentUser();
  const dashboardHref = user && user.primaryRole !== "ONBOARDING_PENDING" ? getDashboardForRole(user.primaryRole) : null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 text-slate-950 shadow-sm backdrop-blur-xl">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[78px] items-center gap-4 border-b border-slate-200">
          <Link href={ROUTES.home} className="shrink-0">
            <span className="block text-2xl font-black tracking-[-0.05em] text-[#0b1b36] sm:text-3xl">YAR<span className="text-amber-400">TONG</span></span>
            <span className="hidden text-[10px] font-semibold tracking-wide text-slate-600 sm:block">Build. Connect. Grow.</span>
          </Link>
          <div className="hidden min-w-0 flex-1 items-center gap-5 md:flex">
            <div className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">⌖ Senapati, Manipur⌄</div>
            <div className="flex min-w-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <input aria-label="Search Yartong" className="min-w-0 flex-1 px-4 py-3 text-sm outline-none placeholder:text-slate-400" placeholder="Search materials, trades, services..." />
              <button type="button" className="bg-[#0b1b36] px-6 text-sm font-black text-white">Search</button>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3 text-sm">
            {dashboardHref ? <>
              <Link className="hidden font-semibold text-slate-700 md:inline" href="/account">Account</Link>
              <Link className="rounded-lg bg-[#0b1b36] px-4 py-2.5 font-black text-white" href={dashboardHref}>Dashboard</Link>
              <form action={async () => { "use server"; if (isAuthBypassEnabled) { const store = await cookies(); store.delete("yartong_phase_user"); redirect(ROUTES.home); } await signOut({ redirectTo: ROUTES.home }); }}><button className="hidden font-semibold text-rose-600 sm:inline">Exit account</button></form>
            </> : <>
              <Link className="hidden font-semibold text-slate-800 lg:inline" href={ROUTES.join}>Become a Provider</Link>
              <span className="hidden h-5 w-px bg-slate-200 lg:block" />
              {!isAuthBypassEnabled ? <Link className="font-semibold text-slate-800" href={ROUTES.login}>Login</Link> : null}
              <Link className="rounded-lg bg-amber-400 px-5 py-3 font-black text-slate-950 shadow-sm" href={ROUTES.join}>Register</Link>
            </>}
          </div>
        </div>
        <nav className="hidden min-h-14 items-center justify-between gap-3 overflow-x-auto text-sm font-semibold text-slate-800 md:flex" aria-label={`${PLATFORM.name} marketplace navigation`}>
          {primaryNav.map(([icon, label, href]) => <Link key={label} href={href} className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 transition hover:bg-slate-100"><span className="text-base">{icon}</span>{label}</Link>)}
        </nav>
      </div>
    </header>
  );
}