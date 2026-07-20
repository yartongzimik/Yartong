import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";
import { requireUser } from "@/lib/authz";
import { getDashboardForRole, ROLE_LABELS } from "@/lib/onboarding";
import { prisma } from "@/lib/prisma";

import { updateAccountProfileAction } from "./actions";

type Props = {
  searchParams: Promise<{ saved?: string; error?: string }>;
};

const field =
  "min-h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-fuchsia-200 focus:ring-2 focus:ring-fuchsia-200/40";

export default async function AccountPage({ searchParams }: Props) {
  const currentUser = await requireUser();
  const params = await searchParams;
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: currentUser.id },
    select: {
      id: true,
      displayName: true,
      email: true,
      image: true,
      primaryRole: true,
      verificationStatus: true,
      primaryLocation: { select: { name: true, district: true, state: true } },
      customerProfile: { select: { bio: true } },
      skilledProviderProfile: {
        select: {
          businessName: true,
          headline: true,
          bio: true,
          experienceYears: true,
          skills: true,
          serviceRadiusKm: true,
          availableForWork: true,
        },
      },
      labourerProfile: {
        select: {
          headline: true,
          bio: true,
          experienceYears: true,
          skills: true,
          availableForWork: true,
        },
      },
      contractorProfile: {
        select: {
          businessName: true,
          headline: true,
          bio: true,
          experienceYears: true,
          teamSize: true,
          projectTypes: true,
          serviceRadiusKm: true,
          availableForWork: true,
        },
      },
      materialSupplierProfile: {
        select: {
          businessName: true,
          headline: true,
          bio: true,
          materialCategories: true,
        },
      },
    },
  });

  const isProvider = ["SKILLED_PROVIDER", "LABOURER", "CONTRACTOR"].includes(user.primaryRole);
  const isBusinessRole = ["SKILLED_PROVIDER", "CONTRACTOR", "MATERIAL_SUPPLIER"].includes(user.primaryRole);

  let stats: { label: string; value: number; detail: string }[] = [];
  if (user.primaryRole === "CUSTOMER") {
    const [published, drafts, active, completed] = await Promise.all([
      prisma.job.count({ where: { customerId: user.id, status: "PUBLISHED" } }),
      prisma.job.count({ where: { customerId: user.id, status: "DRAFT" } }),
      prisma.engagement.count({ where: { customerId: user.id, status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS", "DISPUTED"] } } }),
      prisma.engagement.count({ where: { customerId: user.id, status: "COMPLETED" } }),
    ]);
    stats = [
      { label: "Published jobs", value: published, detail: "Live marketplace listings" },
      { label: "Draft jobs", value: drafts, detail: "Jobs still being prepared" },
      { label: "Active engagements", value: active, detail: "Current hired-provider work" },
      { label: "Completed engagements", value: completed, detail: "Finished Yartong work" },
    ];
  } else if (isProvider) {
    const [applications, accepted, active, completed] = await Promise.all([
      prisma.jobApplication.count({ where: { providerId: user.id } }),
      prisma.jobApplication.count({ where: { providerId: user.id, status: "ACCEPTED" } }),
      prisma.engagement.count({ where: { providerId: user.id, status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS", "DISPUTED"] } } }),
      prisma.engagement.count({ where: { providerId: user.id, status: "COMPLETED" } }),
    ]);
    stats = [
      { label: "Applications", value: applications, detail: "Jobs you have applied to" },
      { label: "Accepted", value: accepted, detail: "Applications that became hires" },
      { label: "Active engagements", value: active, detail: "Current work in progress" },
      { label: "Completed engagements", value: completed, detail: "Finished Yartong work" },
    ];
  }

  const profile =
    user.skilledProviderProfile ??
    user.labourerProfile ??
    user.contractorProfile ??
    user.materialSupplierProfile ??
    user.customerProfile;
  const businessName =
    user.skilledProviderProfile?.businessName ??
    user.contractorProfile?.businessName ??
    user.materialSupplierProfile?.businessName ??
    "";
  const headline =
    user.skilledProviderProfile?.headline ??
    user.labourerProfile?.headline ??
    user.contractorProfile?.headline ??
    user.materialSupplierProfile?.headline ??
    "";
  const bio = profile?.bio ?? "";
  const experienceYears =
    user.skilledProviderProfile?.experienceYears ??
    user.labourerProfile?.experienceYears ??
    user.contractorProfile?.experienceYears ??
    "";
  const skills =
    user.skilledProviderProfile?.skills ??
    user.labourerProfile?.skills ??
    user.contractorProfile?.projectTypes ??
    user.materialSupplierProfile?.materialCategories ??
    [];
  const serviceRadiusKm =
    user.skilledProviderProfile?.serviceRadiusKm ??
    user.contractorProfile?.serviceRadiusKm ??
    "";
  const availableForWork =
    user.skilledProviderProfile?.availableForWork ??
    user.labourerProfile?.availableForWork ??
    user.contractorProfile?.availableForWork ??
    false;
  const teamSize = user.contractorProfile?.teamSize ?? "";
  const roleLabel =
    user.primaryRole in ROLE_LABELS
      ? ROLE_LABELS[user.primaryRole as keyof typeof ROLE_LABELS]
      : user.primaryRole;

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-6 py-10 text-white sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/75">Account hub</p>
            <h1 className="mt-3 text-4xl font-black sm:text-5xl">Profile, account and activity</h1>
            <p className="mt-3 text-white/65">{roleLabel} · {user.primaryLocation?.name ?? "No location"} · {user.verificationStatus.replaceAll("_", " ")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {isProvider ? <Link href={`/providers/${user.id}`} className="rounded-full border border-white/15 px-5 py-3 font-bold">View public profile</Link> : null}
            <Link href={getDashboardForRole(user.primaryRole)} className="rounded-full bg-white px-5 py-3 font-black text-[#160620]">Back to dashboard</Link>
          </div>
        </div>

        {params.saved ? <p className="mt-6 rounded-2xl border border-emerald-200/25 bg-emerald-300/10 p-4 text-emerald-100">Profile saved.</p> : null}
        {params.error ? <p className="mt-6 rounded-2xl border border-rose-200/25 bg-rose-300/10 p-4 text-rose-100">Profile could not be saved. Check the highlighted information and try again.</p> : null}

        {stats.length ? (
          <section className="mt-8">
            <div className="flex items-end justify-between gap-4">
              <div><p className="text-xs font-black uppercase tracking-[0.25em] text-white/45">Real account statistics</p><h2 className="mt-2 text-2xl font-black">Your Yartong activity</h2></div>
              <span className="rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-100">Live database counts</span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => <article key={stat.label} className="rounded-3xl border border-white/10 bg-white/[0.05] p-5"><p className="text-sm text-white/55">{stat.label}</p><p className="mt-2 text-4xl font-black">{stat.value}</p><p className="mt-2 text-xs text-white/45">{stat.detail}</p></article>)}
            </div>
            {isProvider ? <p className="mt-3 text-sm text-white/50">Profile views, search appearances and enquiry conversion are not shown yet because Yartong does not currently persist those events. This page intentionally avoids the homepage demo numbers.</p> : null}
          </section>
        ) : null}

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.72fr]">
          <form action={updateAccountProfileAction} className="space-y-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <div><p className="text-xs font-black uppercase tracking-[0.25em] text-fuchsia-200/70">Edit profile</p><h2 className="mt-2 text-2xl font-black">Account information</h2></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div><label htmlFor="displayName" className="text-sm font-bold">Display name</label><input id="displayName" name="displayName" defaultValue={user.displayName} className={field} required /></div>
              <div><label htmlFor="image" className="text-sm font-bold">Profile image URL</label><input id="image" name="image" type="url" defaultValue={user.image ?? ""} className={field} placeholder="https://…" /></div>
            </div>
            <p className="text-xs leading-5 text-white/45">Your Google photo is used automatically when available. Direct image-file uploads and portfolio galleries require the upcoming managed media-storage integration; this field safely supports an HTTPS profile image in the meantime.</p>
            {isBusinessRole ? <div><label htmlFor="businessName" className="text-sm font-bold">Business name</label><input id="businessName" name="businessName" defaultValue={businessName} className={field} /></div> : null}
            {user.primaryRole !== "CUSTOMER" ? <div><label htmlFor="headline" className="text-sm font-bold">Professional headline</label><input id="headline" name="headline" defaultValue={headline} className={field} maxLength={140} /></div> : null}
            <div><label htmlFor="bio" className="text-sm font-bold">About</label><textarea id="bio" name="bio" defaultValue={bio} className={`${field} min-h-32`} maxLength={800} /></div>
            {user.primaryRole !== "CUSTOMER" ? <div><label htmlFor="skills" className="text-sm font-bold">{user.primaryRole === "CONTRACTOR" ? "Project types" : user.primaryRole === "MATERIAL_SUPPLIER" ? "Material categories" : "Skills"}</label><input id="skills" name="skills" defaultValue={skills.join(", ")} className={field} /></div> : null}
            {isProvider ? <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="experienceYears" className="text-sm font-bold">Experience years</label><input id="experienceYears" name="experienceYears" type="number" min="0" max="60" defaultValue={experienceYears} className={field} /></div>{user.primaryRole !== "LABOURER" ? <div><label htmlFor="serviceRadiusKm" className="text-sm font-bold">Service radius (km)</label><input id="serviceRadiusKm" name="serviceRadiusKm" type="number" min="0" max="1000" defaultValue={serviceRadiusKm} className={field} /></div> : null}</div> : null}
            {user.primaryRole === "CONTRACTOR" ? <div><label htmlFor="teamSize" className="text-sm font-bold">Team size</label><input id="teamSize" name="teamSize" type="number" min="1" max="500" defaultValue={teamSize} className={field} /></div> : null}
            {isProvider ? <label className="flex items-center gap-3 rounded-2xl border border-white/10 p-4"><input type="checkbox" name="availableForWork" defaultChecked={availableForWork} /><span className="font-bold">Available for work</span></label> : null}
            <button className="rounded-full bg-fuchsia-300 px-6 py-3 font-black text-[#160620] hover:bg-fuchsia-200">Save profile</button>
          </form>

          <aside className="space-y-5">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-white/45">Account</p>
              <h2 className="mt-2 text-xl font-black">Identity & access</h2>
              <dl className="mt-5 space-y-4 text-sm"><div><dt className="text-white/45">Email</dt><dd className="mt-1 font-bold">{user.email ?? "Not available"}</dd></div><div><dt className="text-white/45">Role</dt><dd className="mt-1 font-bold">{roleLabel}</dd></div><div><dt className="text-white/45">Verification</dt><dd className="mt-1 font-bold">{user.verificationStatus.replaceAll("_", " ")}</dd></div></dl>
            </section>
            <section className="rounded-[2rem] border border-amber-200/15 bg-amber-300/[0.06] p-6">
              <h2 className="text-xl font-black">Media uploads</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">Profile photo URLs are editable now. Secure direct uploads, portfolio galleries and deletion controls need a configured object-storage provider and signed upload flow; they are intentionally not simulated.</p>
            </section>
          </aside>
        </section>
      </main>
    </PublicShell>
  );
}
