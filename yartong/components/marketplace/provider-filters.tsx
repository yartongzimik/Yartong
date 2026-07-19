import Link from "next/link";

import type { PublicLocation } from "@/lib/marketplace/providers";

export function ProviderFilters({ action, locations, defaults, roleOptions, serviceParam = "skill", serviceLabel = "Skill or trade" }: { action: string; locations: PublicLocation[]; defaults: Record<string, string | undefined>; roleOptions?: { label: string; value: string }[]; serviceParam?: string; serviceLabel?: string }) {
  return (
    <form action={action} className="mt-8 rounded-3xl border border-white/10 bg-white/[0.05] p-4 sm:p-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="block text-sm font-bold text-white/80">Search
          <input name="q" defaultValue={defaults.q} placeholder="Name, headline, service" className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-white outline-none placeholder:text-white/35 focus:border-fuchsia-200/60 focus:ring-2 focus:ring-fuchsia-200/30" />
        </label>
        <label className="block text-sm font-bold text-white/80">Location
          <select name="location" defaultValue={defaults.location ?? ""} className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-[#12091d] px-4 text-white outline-none focus:border-fuchsia-200/60 focus:ring-2 focus:ring-fuchsia-200/30">
            <option value="">All active locations</option>
            {locations.map((location) => <option key={location.id} value={location.slug}>{location.name}, {location.state}</option>)}
          </select>
        </label>
        {roleOptions ? <label className="block text-sm font-bold text-white/80">Provider type
          <select name="role" defaultValue={defaults.role ?? "all"} className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-[#12091d] px-4 text-white outline-none focus:border-fuchsia-200/60 focus:ring-2 focus:ring-fuchsia-200/30">
            {roleOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label> : null}
        <label className="block text-sm font-bold text-white/80">{serviceLabel}
          <input name={serviceParam} defaultValue={defaults[serviceParam]} placeholder="e.g. Masonry" className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-white outline-none placeholder:text-white/35 focus:border-fuchsia-200/60 focus:ring-2 focus:ring-fuchsia-200/30" />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button className="min-h-11 rounded-full bg-white px-5 text-sm font-black text-[#14091f] hover:bg-fuchsia-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200" type="submit">Apply filters</button>
        <Link href={action} className="inline-flex min-h-11 items-center rounded-full border border-white/10 px-5 text-sm font-bold text-white/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200">Clear</Link>
      </div>
    </form>
  );
}
