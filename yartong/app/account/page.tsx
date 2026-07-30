import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";
import { requireUser } from "@/lib/authz";
import { getDashboardForRole, ROLE_LABELS } from "@/lib/onboarding";
import { prisma } from "@/lib/prisma";

import { updateAccountProfileAction } from "./actions";

type Props = { searchParams: Promise<{ saved?: string; error?: string }> };
const field = "min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100";

export default async function AccountPage({ searchParams }: Props) {
  const currentUser = await requireUser();
  const params = await searchParams;
  const user = await prisma.user.findUniqueOrThrow({ where: { id: currentUser.id }, select: {
    id: true, displayName: true, email: true, image: true, phoneNumber: true, primaryRole: true, verificationStatus: true, createdAt: true,
    primaryLocation: { select: { name: true, district: true, state: true } }, customerProfile: { select: { bio: true } },
    skilledProviderProfile: { select: { businessName: true, headline: true, bio: true, experienceYears: true, skills: true, serviceRadiusKm: true, availableForWork: true } },
    labourerProfile: { select: { headline: true, bio: true, experienceYears: true, skills: true, availableForWork: true } },
    contractorProfile: { select: { businessName: true, headline: true, bio: true, experienceYears: true, teamSize: true, projectTypes: true, serviceRadiusKm: true, availableForWork: true } },
    materialSupplierProfile: { select: { businessName: true, headline: true, bio: true, materialCategories: true } },
  }});
  const isProvider = ["SKILLED_PROVIDER", "LABOURER", "CONTRACTOR"].includes(user.primaryRole);
  const isBusiness = ["SKILLED_PROVIDER", "CONTRACTOR", "MATERIAL_SUPPLIER"].includes(user.primaryRole);
  const profile = user.skilledProviderProfile ?? user.labourerProfile ?? user.contractorProfile ?? user.materialSupplierProfile ?? user.customerProfile;
  const businessName = user.skilledProviderProfile?.businessName ?? user.contractorProfile?.businessName ?? user.materialSupplierProfile?.businessName ?? "";
  const headline = user.skilledProviderProfile?.headline ?? user.labourerProfile?.headline ?? user.contractorProfile?.headline ?? user.materialSupplierProfile?.headline ?? "";
  const skills = user.skilledProviderProfile?.skills ?? user.labourerProfile?.skills ?? user.contractorProfile?.projectTypes ?? user.materialSupplierProfile?.materialCategories ?? [];
  const experienceYears = user.skilledProviderProfile?.experienceYears ?? user.labourerProfile?.experienceYears ?? user.contractorProfile?.experienceYears ?? "";
  const serviceRadiusKm = user.skilledProviderProfile?.serviceRadiusKm ?? user.contractorProfile?.serviceRadiusKm ?? "";
  const availableForWork = user.skilledProviderProfile?.availableForWork ?? user.labourerProfile?.availableForWork ?? user.contractorProfile?.availableForWork ?? false;
  const roleLabel = user.primaryRole in ROLE_LABELS ? ROLE_LABELS[user.primaryRole as keyof typeof ROLE_LABELS] : user.primaryRole;
  const stats = user.primaryRole === "CUSTOMER" ? await Promise.all([
    prisma.job.count({ where: { customerId: user.id } }), prisma.engagement.count({ where: { customerId: user.id } }), prisma.materialOrder.count({ where: { customerId: user.id } }), prisma.review.count({ where: { authorId: user.id } }),
  ]) : await Promise.all([
    prisma.jobApplication.count({ where: { providerId: user.id } }), prisma.engagement.count({ where: { providerId: user.id } }), prisma.review.count({ where: { subjectUserId: user.id } }), prisma.message.count({ where: { senderId: user.id } }),
  ]);
  const statLabels = user.primaryRole === "CUSTOMER" ? ["Projects", "Engagements", "Orders", "Reviews"] : ["Applications", "Engagements", "Reviews", "Messages"];

  return <PublicShell><main className="min-h-screen bg-[#f4f7fb] text-slate-950">
    <div className="mx-auto grid max-w-[1450px] gap-4 px-3 py-4 md:grid-cols-[220px_minmax(0,1fr)] sm:px-5">
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:sticky md:top-36">
        <div className="flex items-center gap-3 border-b border-slate-100 p-2 pb-4"><div className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-blue-50 text-lg font-black text-[#0b376f]">{user.image ? <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${user.image})` }} /> : (user.displayName || "Y").slice(0,1)}</div><div className="min-w-0"><p className="truncate text-sm font-black">{user.displayName}</p><p className="truncate text-[10px] text-slate-500">{roleLabel}</p></div></div>
        <nav className="mt-3 space-y-1 text-xs font-bold"><a href="#profile" className="block rounded-lg bg-blue-50 px-3 py-2.5 text-[#0b376f]">Profile & personal info</a><a href="#activity" className="block rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-50">Account activity</a><a href="#preferences" className="block rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-50">Preferences</a><a href="#security" className="block rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-50">Security & access</a><a href="#status" className="block rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-50">Account status</a></nav>
        <Link href={getDashboardForRole(user.primaryRole)} className="mt-4 block rounded-xl bg-[#0b1b36] px-3 py-2.5 text-center text-xs font-black text-white">Return to workspace</Link>
      </aside>
      <div className="min-w-0 space-y-4">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-[10px] font-black uppercase tracking-[.18em] text-amber-600">My account</p><h1 className="mt-1 text-2xl font-black sm:text-3xl">Profile, information and access</h1><p className="mt-2 text-xs text-slate-500">Manage how you appear on Yartong and control your personal account information.</p></header>
        {params.saved ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-700">Profile saved successfully.</p> : null}{params.error ? <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">Profile could not be saved. Check the information and try again.</p> : null}
        <section id="activity" className="grid grid-cols-2 gap-2 sm:grid-cols-4">{stats.map((value,index)=><div key={statLabels[index]} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-[10px] font-black uppercase text-slate-400">{statLabels[index]}</p><p className="mt-2 text-2xl font-black">{value}</p><div className="mt-3 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{width:`${Math.min(100,20+value*8)}%`}} /></div></div>)}</section>
        <form id="profile" action={updateAccountProfileAction} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4"><div><h2 className="text-lg font-black">Profile information</h2><p className="mt-1 text-xs text-slate-500">Public and personal details used across your account.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600">Member since {user.createdAt.toLocaleDateString("en-IN",{month:"short",year:"numeric"})}</span></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold">Display name<input name="displayName" defaultValue={user.displayName} className={`${field} mt-1.5`} required /></label><label className="text-xs font-bold">Profile photo URL<input name="image" type="url" defaultValue={user.image ?? ""} className={`${field} mt-1.5`} placeholder="https://…" /></label><label className="text-xs font-bold">Email<input value={user.email ?? "Not available"} className={`${field} mt-1.5`} disabled /></label><label className="text-xs font-bold">Phone<input value={user.phoneNumber ?? "Not set"} className={`${field} mt-1.5`} disabled /></label></div>
          {isBusiness ? <label className="mt-4 block text-xs font-bold">Business name<input name="businessName" defaultValue={businessName} className={`${field} mt-1.5`} /></label> : null}
          {user.primaryRole !== "CUSTOMER" ? <label className="mt-4 block text-xs font-bold">Professional headline<input name="headline" defaultValue={headline} className={`${field} mt-1.5`} maxLength={140} /></label> : null}
          <label className="mt-4 block text-xs font-bold">About<textarea name="bio" defaultValue={profile?.bio ?? ""} className={`${field} mt-1.5 min-h-28`} maxLength={800} /></label>
          {user.primaryRole !== "CUSTOMER" ? <label className="mt-4 block text-xs font-bold">{user.primaryRole === "MATERIAL_SUPPLIER" ? "Material categories" : user.primaryRole === "CONTRACTOR" ? "Project types" : "Skills"}<input name="skills" defaultValue={skills.join(", ")} className={`${field} mt-1.5`} /></label> : null}
          {isProvider ? <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold">Experience years<input name="experienceYears" type="number" min="0" max="60" defaultValue={experienceYears} className={`${field} mt-1.5`} /></label>{user.primaryRole !== "LABOURER" ? <label className="text-xs font-bold">Service radius (km)<input name="serviceRadiusKm" type="number" min="0" max="1000" defaultValue={serviceRadiusKm} className={`${field} mt-1.5`} /></label> : null}</div> : null}
          {isProvider ? <label className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold"><input type="checkbox" name="availableForWork" defaultChecked={availableForWork} />Available for work</label> : null}
          <div className="mt-5 flex justify-end"><button className="rounded-xl bg-[#0b1b36] px-5 py-2.5 text-sm font-black text-white shadow-sm active:scale-95">Save changes</button></div>
        </form>
        <section id="preferences" className="grid gap-4 lg:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-black">Preferences</h2><p className="mt-2 text-xs leading-5 text-slate-500">Language, notifications and marketplace preferences will be managed here as the production features are activated.</p><div className="mt-4 space-y-2 text-xs font-bold text-slate-600"><div className="rounded-xl bg-slate-50 p-3">Language: English</div><div className="rounded-xl bg-slate-50 p-3">Location: {user.primaryLocation?.name ?? "Not set"}</div></div></div><div id="security" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-black">Security & access</h2><p className="mt-2 text-xs leading-5 text-slate-500">Authentication controls, connected login providers and active-device management will become available when production authentication is enabled.</p><div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-800">Testing mode is active.</div></div></section>
        <section id="status" className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm"><h2 className="font-black text-rose-700">Account status</h2><p className="mt-2 text-xs leading-5 text-slate-500">Deactivation and permanent deletion are intentionally disabled during the first testing phase. They will include safeguards for active work, orders and records before launch.</p><button type="button" disabled className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-black text-rose-400">Deactivate account — unavailable during testing</button></section>
      </div>
    </div>
  </main></PublicShell>;
}
