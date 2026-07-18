import Link from "next/link";

import { PLATFORM, ROUTES } from "@/lib/constants";
import { JOIN_NAVIGATION } from "@/lib/navigation";

const roleLabelPrefix = "Register as ";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07050D] py-10 text-white/65">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p>© 2026 {PLATFORM.name}. Build trusted local work connections.</p>
          <div className="mt-4 flex flex-wrap gap-5 text-sm">
            <Link href={ROUTES.advertise} className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-200">Advertise</Link>
            <Link href={ROUTES.postJob} className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-200">Post a Job</Link>
            <Link href={ROUTES.register} className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-200">Create Account</Link>
          </div>
        </div>

        <nav aria-label="Registration roles" className="md:text-right">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-fuchsia-200/75">Join as</p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm md:max-w-md md:justify-end">
            {JOIN_NAVIGATION.map((item) => (
              <Link key={item.id} href={item.href} className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-200">
                {item.label.replace(roleLabelPrefix, "")}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </footer>
  );
}
