import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { signOut } from "@/auth";
import { getCurrentUser } from "@/lib/authz";
import { PLATFORM, ROUTES } from "@/lib/constants";
import { isAuthBypassEnabled } from "@/lib/phase-flags";

const primaryNav = [
  ["▦", "Materials", ROUTES.materials],
  ["⚒", "Trades & Services", ROUTES.trades],
  ["♙", "Yartong Workforce", ROUTES.workers],
  ["▧", "RFQ (Request Quote)", ROUTES.postJob],
  ["◇", "Deals", ROUTES.materials],
  ["◷", "Business Intelligence", ROUTES.advertise],
] as const;

export async function Header({ hideMarketplaceNav = false }: { hideMarketplaceNav?: boolean }) {
  const user = await getCurrentUser();
  const hasAccount = Boolean(user && user.primaryRole !== "ONBOARDING_PENDING");

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 text-slate-950 shadow-sm backdrop-blur-xl">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className={`flex min-h-[76px] items-center gap-3 sm:gap-4 ${hideMarketplaceNav ? "" : "border-b border-slate-200"}`}>
          <Link href={ROUTES.home} className="shrink-0">
            <span className="block text-2xl font-black tracking-[-0.05em] text-[#0b1b36] sm:text-3xl">YAR<span className="text-amber-400">TONG</span></span>
            <span className="hidden text-[10px] font-semibold tracking-wide text-slate-600 sm:block">Build. Connect. Grow.</span>
          </Link>
          <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
            <button type="button" title="Current jurisdiction: Senapati, Manipur" aria-label="Current jurisdiction: Senapati, Manipur" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white"><span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-white text-base shadow-sm">⌖</span><span className="hidden lg:inline">Senapati</span></button>
            <div className="flex h-11 min-w-[240px] flex-1 items-center rounded-full border border-slate-200 bg-slate-100/80 p-1 shadow-inner transition focus-within:border-slate-300 focus-within:bg-white focus-within:shadow-sm"><span aria-hidden="true" className="pl-3 text-sm text-slate-400">⌕</span><input aria-label="Search Yartong" className="min-w-0 flex-1 bg-transparent px-3 text-sm font-medium outline-none placeholder:text-slate-400" placeholder="Search materials, trades, services..." /><button type="button" className="h-9 shrink-0 rounded-full bg-[#0b1b36] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#132b52] active:scale-[0.98]">Search</button></div>
          </div>
          <div className="ml-auto flex items-center gap-3 text-sm">
            {hasAccount ? <form action={async () => { "use server"; if (isAuthBypassEnabled) { const store = await cookies(); store.delete("yartong_phase_user"); redirect(ROUTES.home); } await signOut({ redirectTo: ROUTES.home }); }}><button className="rounded-full border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]">Log out</button></form> : <><Link className="hidden font-semibold text-slate-800 lg:inline" href={ROUTES.join}>Become a Provider</Link><span className="hidden h-5 w-px bg-slate-200 lg:block" /><Link className="rounded-xl bg-amber-400 px-5 py-3 font-black text-slate-950 shadow-sm transition hover:bg-amber-300 active:scale-[0.98]" href={ROUTES.join}>Register / Login</Link></>}
          </div>
        </div>
        {!hideMarketplaceNav ? <nav className="hidden min-h-14 items-center justify-between gap-3 overflow-x-auto text-sm font-semibold text-slate-800 md:flex" aria-label={`${PLATFORM.name} marketplace navigation`}>{primaryNav.map(([icon, label, href]) => <Link key={label} href={href} className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 transition hover:bg-slate-100"><span className="text-base">{icon}</span>{label}</Link>)}</nav> : null}
      </div>
    </header>
  );
}
