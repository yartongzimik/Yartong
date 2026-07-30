import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { signOut } from "@/auth";
import { AccountAccessMenu } from "@/components/layout/account-access-menu";
import { getCurrentUser } from "@/lib/authz";
import { ROUTES } from "@/lib/constants";
import { getDashboardForRole } from "@/lib/onboarding";
import { isAuthBypassEnabled } from "@/lib/phase-flags";

export async function Header() {
  const user = await getCurrentUser();
  const hasAccount = Boolean(user && user.primaryRole !== "ONBOARDING_PENDING");
  const accountHref = user && hasAccount ? getDashboardForRole(user.primaryRole) : "/account";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 text-slate-950 shadow-[0_1px_12px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-[1600px] items-center gap-3 px-3 sm:gap-4 sm:px-5 lg:px-7">
        <Link href={ROUTES.home} className="shrink-0 rounded-xl px-1 py-1 active:scale-[0.98]">
          <span className="block text-2xl font-black tracking-[-0.05em] text-[#0b1b36] sm:text-3xl">YAR<span className="text-amber-400">TONG</span></span>
          <span className="hidden text-[9px] font-semibold tracking-wide text-slate-500 sm:block">Build. Connect. Grow.</span>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center gap-2 sm:flex">
          <button type="button" title="Current jurisdiction: Senapati, Manipur" aria-label="Current jurisdiction: Senapati, Manipur" className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-white active:scale-[0.98]">
            <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-white text-sm shadow-sm">⌖</span>
            <span className="hidden lg:inline">Senapati</span>
          </button>

          <div className="flex h-10 min-w-0 flex-1 items-center rounded-full border border-slate-200 bg-slate-100/75 p-1 shadow-inner transition focus-within:border-slate-300 focus-within:bg-white focus-within:shadow-sm">
            <span aria-hidden="true" className="pl-2.5 text-sm text-slate-400">⌕</span>
            <input aria-label="Search Yartong" className="min-w-0 flex-1 bg-transparent px-2.5 text-sm font-medium outline-none placeholder:text-slate-400" placeholder="Search materials, trades, services..." />
            <button type="button" className="h-8 shrink-0 rounded-full bg-[#0b1b36] px-4 text-xs font-black text-white shadow-sm transition hover:bg-[#142e58] active:scale-[0.97]">Search</button>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 text-sm">
          {hasAccount ? (
            <>
              <Link
                href={accountHref}
                title="Open my workspace"
                aria-label="Open my workspace"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-[#0b1b36] shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.96]"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4.5 20c.8-4.1 3.3-6.2 7.5-6.2s6.7 2.1 7.5 6.2" />
                </svg>
              </Link>
              <form action={async () => {
                "use server";
                if (isAuthBypassEnabled) {
                  const store = await cookies();
                  store.delete("yartong_phase_user");
                  redirect(ROUTES.home);
                }
                await signOut({ redirectTo: ROUTES.home });
              }}>
                <button className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.97]">Log out</button>
              </form>
            </>
          ) : (
            <AccountAccessMenu isPreviewAccess={isAuthBypassEnabled} />
          )}
        </div>
      </div>
    </header>
  );
}
