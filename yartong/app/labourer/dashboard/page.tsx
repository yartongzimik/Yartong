import Link from "next/link";
import { UserRole } from "@prisma/client";

import { PublicShell } from "@/components/layout/public-shell";
import { ROUTES, VERIFICATION_LABELS } from "@/lib/constants";
import { getProviderDashboard } from "@/lib/dashboard";
import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

import { ShareProfileButton } from "./share-profile-button";

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("") || "YL";
}

function formatMonthYear(value: Date) {
  return new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" }).format(value);
}

function formatReviewDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(value);
}

export default async function LabourerDashboardPage() {
  const user = await requireUser();
  const [dashboard, profileUser, reviews] = await Promise.all([
    getProviderDashboard(user.id, UserRole.LABOURER),
    prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: {
        id: true,
        displayName: true,
        image: true,
        createdAt: true,
        verificationStatus: true,
        primaryLocation: { select: { name: true, district: true, state: true } },
        labourerProfile: { select: { headline: true, bio: true, experienceYears: true, skills: true, availableForWork: true } },
      },
    }),
    prisma.review.findMany({
      where: { subjectId: user.id, status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, rating: true, title: true, comment: true, createdAt: true, author: { select: { displayName: true } } },
    }),
  ]);

  const profile = profileUser.labourerProfile;
  const name = profileUser.displayName || "Labourer";
  const rating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : null;
  const location = profileUser.primaryLocation;
  const publicProfileHref = `/providers/${profileUser.id}`;
  const completedJobs = dashboard.metrics.completedEngagements;
  const reviewDistribution = [5, 4, 3, 2, 1].map((score) => ({ score, count: reviews.filter((review) => review.rating === score).length }));

  return (
    <PublicShell>
      <div className="bg-[#f6f7fb] py-3 text-slate-950">
        <main className="mx-auto w-full max-w-[1480px] px-3 sm:px-4 lg:px-5">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <p>Dashboard / Labourer</p>
            <div className="flex flex-wrap gap-1.5">
              <Link href="/notifications" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 shadow-sm">Notifications</Link>
              <ShareProfileButton profilePath={publicProfileHref} />
              <Link href="/account" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 shadow-sm">Edit profile</Link>
            </div>
          </div>

          <section className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:grid-cols-[190px_minmax(0,1fr)_220px] lg:p-4">
            <div className="relative min-h-[220px] overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-violet-900 to-fuchsia-800">
              {profileUser.image ? (
                <div role="img" aria-label={`${name} profile photo`} className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${profileUser.image})` }} />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-5xl font-black text-white/90">{initials(name)}</div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-12">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black ${profile?.availableForWork !== false ? "bg-emerald-400 text-emerald-950" : "bg-slate-200 text-slate-700"}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {profile?.availableForWork !== false ? "Available for work" : "Unavailable"}
                </span>
              </div>
            </div>

            <div className="min-w-0 py-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{name}</h1>
                {profileUser.verificationStatus !== "UNVERIFIED" ? <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-black text-blue-700">✓ Verified</span> : null}
              </div>
              <p className="mt-1 text-sm font-bold text-slate-700">{profile?.headline || "Labourer"}</p>
              <p className="mt-1.5 text-xs font-medium text-slate-500">
                {location ? `📍 ${location.name}, ${location.state}` : "Add your work location"}
                {rating ? `  ·  ★ ${rating.toFixed(1)} (${reviews.length})` : "  ·  No reviews yet"}
              </p>
              <p className="mt-2.5 max-w-3xl text-sm leading-5 text-slate-600 line-clamp-3">
                {profile?.bio || "Add a short introduction about your experience, reliability, work preferences and the kind of site work you are available for."}
              </p>

              <div className="mt-3 grid max-w-xl grid-cols-3 divide-x divide-slate-200 rounded-xl border border-slate-200 bg-slate-50 py-2 text-center">
                <div className="px-2"><p className="text-lg font-black">{profile?.experienceYears ?? 0}+</p><p className="text-[10px] font-bold text-slate-500">Years</p></div>
                <div className="px-2"><p className="text-lg font-black">{completedJobs}</p><p className="text-[10px] font-bold text-slate-500">Completed</p></div>
                <div className="px-2"><p className="text-lg font-black">{rating ? rating.toFixed(1) : "—"}</p><p className="text-[10px] font-bold text-slate-500">Rating</p></div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={ROUTES.quickJobs} className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#9B4DFF] to-[#E126FF] px-4 py-2 text-xs font-black text-white shadow-md shadow-fuchsia-500/20">Find work</Link>
                <Link href={ROUTES.messages} className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-black text-slate-800">Messages</Link>
                <Link href={publicProfileHref} className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-black text-slate-800">Public profile</Link>
              </div>
            </div>

            <aside className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Work status</p><span className={`h-2 w-2 rounded-full ${profile?.availableForWork !== false ? "bg-emerald-500" : "bg-slate-400"}`} /></div>
              <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs lg:grid-cols-1">
                <div><p className="text-[10px] font-bold text-slate-400">Availability</p><p className="font-black text-slate-900">{profile?.availableForWork !== false ? "Available now" : "Unavailable"}</p></div>
                <div><p className="text-[10px] font-bold text-slate-400">Verification</p><p className="font-black text-slate-900">{VERIFICATION_LABELS[profileUser.verificationStatus]}</p></div>
                <div><p className="text-[10px] font-bold text-slate-400">Member since</p><p className="font-black text-slate-900">{formatMonthYear(profileUser.createdAt)}</p></div>
                <div><p className="text-[10px] font-bold text-slate-400">Applications</p><p className="font-black text-slate-900">{dashboard.metrics.activeApplications}</p></div>
                <div><p className="text-[10px] font-bold text-slate-400">Active jobs</p><p className="font-black text-slate-900">{dashboard.metrics.activeEngagements}</p></div>
              </div>
            </aside>
          </section>

          <nav className="mt-3 flex gap-5 overflow-x-auto border-b border-slate-200 bg-white px-3 text-xs font-black text-slate-500" aria-label="Labourer dashboard sections">
            <a href="#overview" className="border-b-2 border-violet-600 py-2.5 text-violet-700">Overview</a>
            <a href="#skills" className="py-2.5 hover:text-slate-900">Skills</a>
            <a href="#activity" className="py-2.5 hover:text-slate-900">Work activity</a>
            <a href="#reviews" className="py-2.5 hover:text-slate-900">Reviews ({reviews.length})</a>
          </nav>

          <section id="overview" className="mt-3 grid gap-3 lg:grid-cols-[0.9fr_1.2fr_0.9fr]">
            <div id="skills" className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
              <h2 className="text-sm font-black">Skills & services</h2>
              {profile?.skills.length ? <ul className="mt-2.5 grid gap-1.5 text-xs font-semibold text-slate-700 sm:grid-cols-2 lg:grid-cols-1">{profile.skills.map((skill) => <li key={skill} className="flex gap-1.5"><span className="text-blue-600">✓</span><span>{skill}</span></li>)}</ul> : <p className="mt-2 text-xs text-slate-500">No skills added yet.</p>}
              <Link href="/account" className="mt-2.5 inline-flex text-xs font-black text-violet-700">Edit skills →</Link>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
              <h2 className="text-sm font-black">About my work</h2>
              <p className="mt-2 text-xs leading-5 text-slate-600 line-clamp-4">{profile?.bio || "Complete your profile so customers can understand your experience, strengths and the type of work you prefer."}</p>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div><dt className="text-[10px] font-bold text-slate-400">Experience</dt><dd className="font-black text-slate-800">{profile?.experienceYears ?? 0}+ years</dd></div>
                <div><dt className="text-[10px] font-bold text-slate-400">Availability</dt><dd className="font-black text-slate-800">{profile?.availableForWork !== false ? "Available" : "Unavailable"}</dd></div>
                <div><dt className="text-[10px] font-bold text-slate-400">Location</dt><dd className="font-black text-slate-800">{location?.name || "Not set"}</dd></div>
                <div><dt className="text-[10px] font-bold text-slate-400">Completed</dt><dd className="font-black text-slate-800">{completedJobs} jobs</dd></div>
              </dl>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
              <h2 className="text-sm font-black">Quick actions</h2>
              <div className="mt-2.5 grid grid-cols-2 gap-2 lg:grid-cols-1">
                <Link href={ROUTES.quickJobs} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-800">Find work →</Link>
                <Link href="/applications" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-800">Applications →</Link>
                <Link href="/engagements" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-800">Jobs →</Link>
                <Link href={ROUTES.messages} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-800">Messages{dashboard.metrics.unreadMessages ? ` (${dashboard.metrics.unreadMessages})` : ""} →</Link>
              </div>
            </div>
          </section>

          <section id="activity" className="mt-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-sm font-black">Recent work activity</h2><p className="text-xs text-slate-500">Applications and confirmed work.</p></div><Link href="/engagements" className="text-xs font-black text-violet-700">View all →</Link></div>
            {dashboard.activities.length ? <div className="mt-2 divide-y divide-slate-100">{dashboard.activities.map((activity) => <Link key={`${activity.href}-${activity.title}`} href={activity.href} className="flex items-center justify-between gap-3 py-2"><div><p className="text-xs font-black text-slate-900">{activity.title}</p><p className="text-[11px] capitalize text-slate-500">{activity.meta.toLowerCase()}</p></div><span className="text-violet-700">→</span></Link>)}</div> : <p className="mt-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">No work activity yet.</p>}
          </section>

          <section id="reviews" className="mt-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-2"><div><h2 className="text-sm font-black">Reviews & ratings</h2><p className="text-xs text-slate-500">Customer feedback.</p></div><Link href={publicProfileHref} className="text-xs font-black text-violet-700">Public profile →</Link></div>
            {reviews.length ? (
              <div className="mt-3 grid gap-4 lg:grid-cols-[190px_minmax(0,1fr)]">
                <div>
                  <div className="flex items-end gap-2"><p className="text-3xl font-black">{rating?.toFixed(1)}</p><p className="pb-1 text-sm text-amber-500">★★★★★</p></div>
                  <p className="text-[11px] font-semibold text-slate-500">{reviews.length} review{reviews.length === 1 ? "" : "s"}</p>
                  <div className="mt-2 space-y-1">{reviewDistribution.map(({ score, count }) => <div key={score} className="grid grid-cols-[20px_1fr_22px] items-center gap-1.5 text-[10px] font-bold text-slate-500"><span>{score}★</span><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-400" style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }} /></div><span>{count}</span></div>)}</div>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {reviews.slice(0, 4).map((review) => <article key={review.id} className="rounded-lg border border-slate-100 p-2.5"><div className="flex items-center justify-between gap-2"><p className="text-xs font-black text-slate-900">{review.author.displayName || "Yartong customer"}</p><time className="text-[10px] font-semibold text-slate-400">{formatReviewDate(review.createdAt)}</time></div><p className="mt-0.5 text-[11px] text-amber-500">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>{review.title ? <p className="mt-1 text-xs font-bold text-slate-800">{review.title}</p> : null}{review.comment ? <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-600">{review.comment}</p> : null}</article>)}
                </div>
              </div>
            ) : <p className="mt-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">No reviews yet.</p>}
          </section>

          <section className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-violet-100 bg-gradient-to-r from-violet-50 to-fuchsia-50 px-4 py-3">
            <div><h2 className="text-sm font-black">Ready for your next job?</h2><p className="text-xs text-slate-600">Browse local opportunities and keep your profile current.</p></div>
            <Link href={ROUTES.quickJobs} className="rounded-lg bg-gradient-to-r from-[#9B4DFF] to-[#E126FF] px-4 py-2 text-xs font-black text-white">Find work</Link>
          </section>
        </main>
      </div>
    </PublicShell>
  );
}
