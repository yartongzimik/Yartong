import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { JOIN_NAVIGATION } from "@/lib/navigation";

const roleLinks = JOIN_NAVIGATION.map((item) => ({
  ...item,
  label: item.label.replace("Register as ", ""),
}));

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 px-6 py-10 text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="text-2xl font-black text-white">Yartong</p>
          <p className="mt-3 max-w-md text-sm text-slate-400">
            A local marketplace for customers, skilled providers, labourers,
            contractors and material suppliers.
          </p>
        </div>
        <nav aria-label="Register by role">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">Join by role</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {roleLinks.map((item) => (
              <li key={item.id}>
                <Link className="text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">Company</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400" href={ROUTES.advertise}>Advertise</Link></li>
            <li><Link className="text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400" href={ROUTES.login}>Login</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
