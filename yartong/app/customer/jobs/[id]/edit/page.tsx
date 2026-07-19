import { notFound } from "next/navigation";
import { PublicShell } from "@/components/layout/public-shell";
import { JobForm } from "@/components/marketplace/job-ui";
import { updateDraftJobAction } from "../../actions";
import { requireRole } from "@/lib/authz";
import { getActiveJobLocations, getCustomerJob } from "@/lib/marketplace/jobs";
type Props={params:Promise<{id:string}>};
export default async function EditJobPage({params}:Props){ const user=await requireRole("CUSTOMER"); const {id}=await params; const job=await getCustomerJob(user.id,id); if(!job || job.status!=="DRAFT") notFound(); const locations=await getActiveJobLocations(); return <PublicShell><main className="mx-auto max-w-5xl px-6 py-12"><h1 className="text-4xl font-black text-white">Edit draft job</h1><JobForm action={updateDraftJobAction.bind(null,id)} locations={locations} submitLabel="Save changes" draftLabel="Save draft" job={job}/></main></PublicShell> }
