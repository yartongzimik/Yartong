import Link from "next/link";
import { UserRole } from "@prisma/client";

import { PublicShell } from "@/components/layout/public-shell";
import { ROUTES, VERIFICATION_LABELS } from "@/lib/constants";
import { getProviderDashboard } from "@/lib/dashboard";
import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

import { ShareProfileButton } from "./share-profile-button";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "YL";
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
        labourerProfile: {
          select: {
            headline: true,
            bio: true,
            experienceYears: true,
            skills: true,
            availableForWork: true,
          },
        },
      },
    }),
    prisma.review.findMany({
      where: { subjectId: user.id, status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        rating: true,
        title: true,
        comment: true,
        createdAt: true,
        author: { select: { displayName: true } },
      },
    }),
  ]);

  const profile = profileUser.labourerProfile;
  const name = profileUser.displayName || "Labourer";
  const rating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : null;
  const location = profileUser.primaryLocation;
  const publicProfileHref = `/providers/${profileUser.id}`;
  const completedJobs = dashboard.metrics.completedEngagements;
  const reviewDistribution = [5, 4, 3, 2, 1].map((score) => ({
    score,
    count: reviews.filter((review) => review.rating === score).length,
  }));

  return (
    <PublicShell>
      <div className="bg-[#f6f7fb] py-6 text-slate-950 sm:py-8">
        <main className="mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <p>Dashboard / Labourer profile</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/notifications" className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 shadow-sm transition hover:border-violet-300">Notifications</Link>
              <ShareProfileButton profilePath={publicProfileHref} />
              <Link href="/account" className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 shadow-sm transition hover:border-violet-300">Edit profile</Link>
            </div>
          </div>

          <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[280px_minmax(0,1fr)_260px] lg:p-7">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-violet-900 to-fuchsia-800 min-h-[330px]">
              {profileUser.image ? (
                <div
                  role="img"
                  aria-label={`${name} profile photo`}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${profileUser.image})` }}
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-7xl font-black text-white/90">{initials(name)}</div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-16">
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ${profile?.availableForWork !== false ? "bg-emerald-400 text-emerald-950" : "bg-slate-200 text-slate-700"}`}>
                  <span className="h-2 w-2 rounded-full bg-current" />
                  {profile?.availableForWork !== false ? "Available for work" : "Not currently available"}
                </span>
              </div>
            </div>

            <div className="py-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{name}</h1>
                {profileUser.verificationStatus !== "UNVERIFIED" ? <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-black text-blue-700">✓ Verified</span> : null}
              </div>
              <p className="mt-2 text-lg font-bold text-slate-700">{profile?.headline || "Labourer"}</p>
              <p className="mt-3 text-sm font-medium text-slate-500">
                {location ? `📍 ${location.name}, ${location.state}` : "Add your work location"}
                {rating ? `  ·  ★ ${rating.toFixed(1)} (${reviews.length} review${reviews.length === 1 ? "" : "s"})` : "  ·  No reviews yet"}
              </p>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
                {profile?.bio || "Add a short introduction about your experience, reliability, work preferences and the kind of site work you are available for."}
              </p>

              <div className="mt-7 grid max-w-2xl grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50 py-4 text-center">
                <div className="px-3"><p className="text-2xl font-black text-slate-950">{profile?.experienceYears ?? 0}+</p><p className="mt-1 text-xs font-bold text-slate-500">Years experience</p></div>
                <div className="px-3"><p className="text-2xl font-black text-slate-950">{completedJobs}</p><p className="mt-1 text-xs font-bold text-slate-500">Jobs completed</p></div>
                <div className="px-3"><p className="text-2xl font-black text-slate-950">{rating ? rating.toFixed(1) : "—"}</p><p className="mt-1 text-xs font-bold text-slate-500">Rating</p></div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={ROUTES.quickJobs} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#9B4DFF] to-[#E126FF] px-6 text-sm font-black text-white shadow-lg shadow-fuchsia-500/20">Find work</Link>
                <Link href={ROUTES.messages} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-black text-slate-800 transition hover:border-violet-300">Messages</Link>
                <Link href={publicProfileHref} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-black text-slate-800 transition hover:border-violet-300">View public profile</Link>
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Work status</p>
              <div className="mt-4 space-y-5">
                <div><p className="text-xs font-bold text-slate-400">Availability</p><p className="mt-1 font-black text-slate-900">{profile?.availableForWork !== false ? "Available now" : "Unavailable"}</p></div>
                <div><p className="text-xs font-bold text-slate-400">Verification</p><p className="mt-1 font-black text-slate-900">{VERIFICATION_LABELS[profileUser.verificationStatus]}</p></div>
                <div><p className="text-xs font-bold text-slate-400">Member since</p><p className="mt-1 font-black text-slate-900">{formatMonthYear(profileUser.createdAt)}</p></div>
                <div><p className="text-xs font-bold text-slate-400">Active applications</p><p className="mt-1 font-black text-slate-900">{dashboard.metrics.activeApplications}</p></div>
                <div><p className="text-xs font-bold text-slate-400">Active jobs</p><p className="mt-1 font-black text-slate-900">{dashboard.metrics.activeEngagements}</p></div>
              </div>
            </aside>
          </section>

          <nav className="mt-5 flex gap-7 overflow-x-auto border-b border-slate-200 bg-white px-5 text-sm font-black text-slate-500" aria-label="Labourer dashboard sections">
            <a href="#overview" className="border-b-2 border-violet-600 py-4 text-violet-700">Overview</a>
            <a href="#skills" className="py-4 hover:text-slate-900">Skills</a>
            <a href="#activity" className="py-4 hover:text-slate-900">Work activity</a>
            <a href="#reviews" className="py-4 hover:text-slate-900">Reviews ({reviews.length})</a>
          </nav>

          <section id="overview" className="mt-5 grid gap-5 lg:grid-cols-[0.85fr_1.15fr_1fr]">
            <div id="skills" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black">Skills & services</h2>
              {profile?.skills.length ? <ul className="mt-4 space-y-3 text-sm font-semibold text-slate-700">{profile.skills.map((skill) => <li key={skill} className="flex gap-2"><span className="text-blue-600">✓</span><span>{skill}</span></li>)}</ul> : <p className="mt-4 text-sm leading-6 text-slate-500">No skills added yet.</p>}
              <Link href="/account" className="mt-5 inline-flex text-sm font-black text-violet-700">Edit skills →</Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black">About my work</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{profile?.bio || "Complete your profile so customers can understand your experience, strengths and the type of work you prefer."}</p>
              <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 text-sm">
                <div><dt className="font-bold text-slate-400">Experience</dt><dd className="mt-1 font-black text-slate-800">{profile?.experienceYears ?? 0}+ years</dd></div>
                <div><dt className="font-bold text-slate-400">Availability</dt><dd className="mt-1 font-black text-slate-800">{profile?.availableForWork !== false ? "Available" : "Unavailable"}</dd></div>
                <div><dt className="font-bold text-slate-400">Location</dt><dd className="mt-1 font-black text-slate-800">{location?.name || "Not set"}</dd></div>
                <div><dt className="font-bold text-slate-400">Completed work</dt><dd className="mt-1 font-black text-slate-800">{completedJobs} jobs</dd></div>
              </dl>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black">Quick actions</h2>
              <div className="mt-4 grid gap-3">
                <Link href={ROUTES.quickJobs} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-800 transition hover:border-violet-300">Find available work →</Link>
                <Link href="/applications" className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-800 transition hover:border-violet-300">My applications →</Link>
                <Link href="/engagements" className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-800 transition hover:border-violet-300">Current & past jobs →</Link>
                <Link href={ROUTES.messages} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-800 transition hover:border-violet-300">Messages {dashboard.metrics.unreadMessages ? `(${dashboard.metrics.unreadMessages} unread)` : ""} →</Link>
              </div>
            </div>
          </section>

          <section id="activity" className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="text-xl font-black">Recent work activity</h2><p className="mt-1 text-sm text-slate-500">Your applications and confirmed work appear here.</p></div>
              <Link href="/engagements" className="text-sm font-black text-violet-700">View all work →</Link>
            </div>
            {dashboard.activities.length ? <div className="mt-5 divide-y divide-slate-100">{dashboard.activities.map((activity) => <Link key={`${activity.href}-${activity.title}`} href={activity.href} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"><div><p className="font-black text-slate-900">{activity.title}</p><p className="mt-1 text-sm capitalize text-slate-500">{activity.meta.toLowerCase()}</p></div><span className="text-violet-700">→</span></Link>)}</div> : <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No work activity yet. Use Find work to start browsing available jobs.</p>}
          </section>

          <section id="reviews" className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-black">Reviews & ratings</h2><p className="mt-1 text-sm text-slate-500">Feedback from completed Yartong engagements.</p></div><Link href={publicProfileHref} className="text-sm font-black text-violet-700">View public profile →</Link></div>
            {reviews.length ? (
              <div className="mt-6 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
                <div>
                  <p className="text-5xl font-black text-slate-950">{rating?.toFixed(1)}</p>
                  <p className="mt-2 text-xl text-amber-500">★★★★★</p>
                  <p className="mt-2 text-sm font-semibold text-slate-500">Based on {reviews.length} review{reviews.length === 1 ? "" : "s"}</p>
                  <div className="mt-5 space-y-2">{reviewDistribution.map(({ score, count }) => <div key={score} className="grid grid-cols-[24px_1fr_28px] items-center gap-2 text-xs font-bold text-slate-500"><span>{score}★</span><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-400" style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }} /></div><span>{count}</span></div>)}</div>
                </div>
                <div className="divide-y divide-slate-100">
                  {reviews.slice(0, 4).map((review) => <article key={review.id} className="py-4 first:pt-0 last:pb-0"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-black text-slate-900">{review.author.displayName || "Yartong customer"}</p><p className="mt-1 text-sm text-amber-500">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p></div><time className="text-xs font-semibold text-slate-400">{formatReviewDate(review.createdAt)}</time></div>{review.title ? <p className="mt-3 font-bold text-slate-800">{review.title}</p> : null}{review.comment ? <p className="mt-2 text-sm leading-6 text-slate-600">{review.comment}</p> : null}</article>)}
                </div>
              </div>
            ) : <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">You do not have reviews yet. Reviews will appear after customers complete eligible work with you.</p>}
          </section>

          <section className="mt-5 flex flex-col items-start justify-between gap-4 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-fuchsia-50 p-6 sm:flex-row sm:items-center">
            <div><h2 className="text-xl font-black text-slate-950">Ready for your next job?</h2><p className="mt-1 text-sm text-slate-600">Browse local opportunities and keep your profile updated so customers can find you.</p></div>
            <Link href={ROUTES.quickJobs} className="rounded-xl bg-gradient-to-r from-[#9B4DFF] to-[#E126FF] px-5 py-3 text-sm font-black text-white">Find work</Link>
          </section>
        </main>
      </div>
    </PublicShell>
  );
}
