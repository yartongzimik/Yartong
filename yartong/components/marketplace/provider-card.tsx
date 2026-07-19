import Link from "next/link";

import type { PublicProviderCard } from "@/lib/marketplace/providers";

function locationLabel(provider: PublicProviderCard) {
  const location = provider.location;
  return location ? `${location.name}, ${location.state}` : "Location coming soon";
}

export function ProviderCard({ provider }: { provider: PublicProviderCard }) {
  const chips = provider.skills.slice(0, 4);
  return (
    <article className="flex h-full min-w-0 flex-col rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur transition hover:-translate-y-0.5 hover:border-fuchsia-200/30 hover:bg-white/[0.08]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span className="rounded-full border border-fuchsia-200/25 bg-fuchsia-200/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-fuchsia-100">{provider.roleLabel}</span>
        {provider.isDemo ? <span className="rounded-full border border-amber-200/25 bg-amber-200/10 px-3 py-1 text-xs font-bold text-amber-100">Demo</span> : null}
      </div>
      <h2 className="mt-4 break-words text-xl font-black tracking-tight text-white">{provider.businessName ?? provider.displayName}</h2>
      {provider.businessName ? <p className="mt-1 break-words text-sm font-semibold text-white/65">{provider.displayName}</p> : null}
      <p className="mt-3 min-h-12 text-sm leading-6 text-white/70">{provider.headline ?? "Public Yartong profile with marketplace-ready service details."}</p>
      <dl className="mt-4 grid gap-2 text-sm text-white/75 sm:grid-cols-2">
        <div className="rounded-2xl bg-black/20 p-3"><dt className="text-xs font-bold uppercase tracking-wider text-white/40">Location</dt><dd className="mt-1 font-semibold">{locationLabel(provider)}</dd></div>
        <div className="rounded-2xl bg-black/20 p-3"><dt className="text-xs font-bold uppercase tracking-wider text-white/40">Experience</dt><dd className="mt-1 font-semibold">{provider.experienceYears ? `${provider.experienceYears}+ years` : "Not specified"}</dd></div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        {chips.length ? chips.map((chip) => <span key={chip} className="max-w-full rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-white/70">{chip}</span>) : <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-white/55">Services to be added</span>}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
        <span className="rounded-full border border-emerald-200/20 bg-emerald-200/10 px-3 py-1.5 text-emerald-100">{provider.availabilityLabel}</span>
        <span className="rounded-full border border-white/10 px-3 py-1.5 text-white/65">{provider.verificationLabel}</span>
      </div>
      <Link href={`/providers/${provider.id}`} className="mt-auto inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-black text-[#14091f] transition hover:bg-fuchsia-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#14091f]">
        Open public profile
      </Link>
    </article>
  );
}
