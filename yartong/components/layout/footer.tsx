import Link from "next/link";

import { PLATFORM, ROUTES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07050D] py-10 text-white/65">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 sm:px-8 md:flex-row md:items-center md:justify-between">
        <p>© 2026 {PLATFORM.name}. Build trusted local work connections.</p>
        <div className="flex flex-wrap gap-5 text-sm">
          <Link href={ROUTES.advertise} className="hover:text-white">Advertise</Link>
          <Link href={ROUTES.postJob} className="hover:text-white">Post a Job</Link>
          <Link href={ROUTES.register} className="hover:text-white">Create Account</Link>
        </div>
      </div>
    </footer>
  );
}
