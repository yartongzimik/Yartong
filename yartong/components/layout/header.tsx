import Link from "next/link";

import { PLATFORM, ROUTES } from "@/lib/constants";

const contractorDiscoveryHref = ROUTES.trades;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07050D]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href={ROUTES.home} className="text-2xl font-black tracking-tight text-white">
          {PLATFORM.name}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-white/70 md:flex">
          <Link className="rounded-full px-1 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07050D]" href={ROUTES.workers}>Find Workers</Link>
          <Link className="rounded-full px-1 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07050D]" href={contractorDiscoveryHref}>Find Contractors</Link>
          <Link className="rounded-full px-1 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07050D]" href={ROUTES.materials}>Materials</Link>
          <Link className="rounded-full px-1 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07050D]" href={ROUTES.quickJobs}>Quick Jobs</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link className="hidden rounded-full px-1 text-sm font-semibold text-white/75 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07050D] sm:inline" href={ROUTES.login}>Login</Link>
          <Link className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#180722] shadow-lg shadow-fuchsia-500/20 transition hover:bg-fuchsia-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07050D]" href={ROUTES.join}>Join</Link>
        </div>
      </div>
    </header>
  );
}
