import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { getPublicProviderById } from "@/lib/marketplace/providers";
import { getPublicProviderReputation } from "@/lib/marketplace/reviews";

export default async function ProviderProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [provider, reputation] = await Promise.all([
    getPublicProviderById(id),
    getPublicProviderReputation(id),
  ]);
  if (!provider) notFound();
  const location = provider.location ? `${provider.location.name}, ${provider.location.district}, ${provider.location.state}` : "Location not specified";
  return (
    <PublicShell>
      <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
        <Link href={provider.role === "CONTRACTOR" ? "/trades" : "/workers"} className="text-sm font-bold text-fuchsia-100 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200">← Back to discovery</Link>
        <section className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/30">
          <div className="bg-gradient-to-br from-[#9B4DFF]/35 via-[#E126FF]/20 to-transparent p-6 sm:p-8">
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#16091f]">{provider.roleLabel}</span>
              {provider.isDemo ? <span className="rounded-full border border-amber-200/30 bg-amber-200/10 px-3 py-1 text-xs font-bold text-amber-100">Demo profile</span> : null}
              <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs font-bold text-white/75">{provider.verificationLabel}</span>
              {reputation.reviewCount > 0 ? <span className="rounded-full border border-emerald-200/20 bg-emerald-200/10 px-3 py-1 text-xs font-bold text-emerald-100">★ {reputation.averageRating?.toFixed(1)} · {reputation.reviewCount} verified review{reputation.reviewCount === 1 ? "" : "s"}</span> : null}
            </div>
            <h1 className="mt-5 break-words text-4xl font-black tracking-tight text-white sm:text-6xl">{provider.businessName ?? provider.displayName}</h1>
            {provider.businessName ? <p className="mt-2 text-lg font-semibold text-white/70">Public representative: {provider.displayName}</p> : null}
            <p className="mt-4 max-w-3xl text-lg leading-8 text-white/75">{provider.headline ?? "Yartong public provider profile."}</p>
          </div>
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_22rem]">
            <div className="min-w-0 space-y-6">
              <section><h2 className="text-2xl font-black text-white">Services and experience</h2><div className="mt-4 flex flex-wrap gap-2">{provider.skills.length ? provider.skills.map((skill) => <span key={skill} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-bold text-white/75">{skill}</span>) : <span className="text-white/60">Services have not been added yet.</span>}</div></section>
              {provider.bio ? <section><h2 className="text-2xl font-black text-white">Profile summary</h2><p className="mt-3 whitespace-pre-line text-base leading-7 text-white/70">{provider.bio}</p></section> : null}
              <section>
                <h2 className="text-2xl font-black text-white">Verified reviews</h2>
                {reputation.reviews.length === 0 ? <p className="mt-3 text-white/60">No verified engagement reviews yet.</p> : <div className="mt-4 space-y-3">{reputation.reviews.map((review) => <article key={review.id} className="rounded-3xl border border-white/10 bg-black/20 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><p className="font-black text-white">{"★".repeat(review.rating)}<span className="text-white/20">{"★".repeat(5-review.rating)}</span></p><p className="text-xs text-white/40">{review.createdAt.toLocaleDateString("en-IN")}</p></div>{review.title ? <h3 className="mt-3 font-black text-white">{review.title}</h3> : null}{review.comment ? <p className="mt-2 text-sm leading-6 text-white/65">{review.comment}</p> : null}<p className="mt-3 text-xs text-white/40">Verified Yartong engagement · {review.author.displayName || "Yartong member"}</p></article>)}</div>}
              </section>
              <section className="rounded-3xl border border-white/10 bg-black/20 p-5"><h2 className="text-xl font-black text-white">Privacy-protected contact</h2><p className="mt-2 text-sm leading-6 text-white/65">Private messaging is available after a customer hires a provider. Yartong does not publish private email or phone numbers on public profiles.</p></section>
            </div>
            <aside className="space-y-3 rounded-3xl border border-white/10 bg-black/20 p-5 text-white/75">
              <h2 className="text-xl font-black text-white">Trust signals</h2>
              <dl className="space-y-3 text-sm">
                <div><dt className="font-bold text-white/45">Location</dt><dd className="mt-1 font-semibold">{location}</dd></div>
                <div><dt className="font-bold text-white/45">Experience</dt><dd className="mt-1 font-semibold">{provider.experienceYears ? `${provider.experienceYears}+ years` : "Not specified"}</dd></div>
                {provider.teamSize ? <div><dt className="font-bold text-white/45">Team size</dt><dd className="mt-1 font-semibold">{provider.teamSize} people</dd></div> : null}
                {provider.serviceRadiusKm ? <div><dt className="font-bold text-white/45">Service radius</dt><dd className="mt-1 font-semibold">Up to {provider.serviceRadiusKm} km</dd></div> : null}
                <div><dt className="font-bold text-white/45">Availability</dt><dd className="mt-1 font-semibold">{provider.availabilityLabel}</dd></div>
                <div><dt className="font-bold text-white/45">Reviews</dt><dd className="mt-1 font-semibold">{reputation.reviewCount === 0 ? "No verified reviews yet" : `${reputation.averageRating?.toFixed(1)} / 5 from ${reputation.reviewCount}`}</dd></div>
              </dl>
            </aside>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
