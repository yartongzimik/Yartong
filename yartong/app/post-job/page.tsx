import { JobForm } from "@/components/marketplace/job-ui";
import { PublicShell } from "@/components/layout/public-shell";
import { createJobAction } from "@/app/customer/jobs/actions";
import { requireRole } from "@/lib/authz";
import { getActiveJobLocations } from "@/lib/marketplace/jobs";
export default async function PostJobPage(){ await requireRole("CUSTOMER"); const locations=await getActiveJobLocations(); return <PublicShell><main className="mx-auto max-w-5xl px-6 py-12"><p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/75">Customer job posting</p><h1 className="mt-4 text-4xl font-black text-white">Post a job</h1><p className="mt-3 text-white/65">Save a private draft or publish a job for public worker discovery.</p><JobForm action={createJobAction} locations={locations}/></main></PublicShell> }
