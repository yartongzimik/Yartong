import { JobBudgetType, JobProviderRole, JobStatus, JobUrgency, Prisma } from "@prisma/client";
import { PAGINATION } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { formatBudget } from "@/lib/jobs/validation";

export const publicJobSelect = { id:true, title:true, description:true, category:true, skills:true, targetProviderRoles:true, budgetType:true, budgetMin:true, budgetMax:true, currency:true, urgency:true, preferredStartDate:true, publishedAt:true, createdAt:true, location:{ select:{ id:true, slug:true, name:true, district:true, state:true, country:true } }, customer:{ select:{ displayName:true } } } satisfies Prisma.JobSelect;
export type PublicJob = Prisma.JobGetPayload<{ select: typeof publicJobSelect }> & { budgetLabel:string };
export type JobSearchParams = { q?:string; location?:string; category?:string; skill?:string; urgency?:string; providerRole?:string; page?:string|number };
function clean(v?: string) { return v?.trim() || undefined; }
function pageNumber(page?: string | number) { const n=Number(page ?? 1); return Number.isInteger(n)&&n>0?n:1; }
export function publicJobWhere(params: JobSearchParams): Prisma.JobWhereInput {
  const and: Prisma.JobWhereInput[] = [{ status: JobStatus.PUBLISHED }, { location: { is: { isActive: true } } }];
  const q=clean(params.q), loc=clean(params.location), cat=clean(params.category), skill=clean(params.skill);
  if (q) and.push({ OR:[{ title:{ contains:q, mode:"insensitive" } }, { description:{ contains:q, mode:"insensitive" } }, { category:{ contains:q, mode:"insensitive" } }, { skills:{ has:q } }] });
  if (loc) and.push({ location:{ is:{ slug:loc, isActive:true } } });
  if (cat) and.push({ category:{ equals:cat, mode:"insensitive" } });
  if (skill) and.push({ skills:{ has:skill } });
  if (params.urgency && Object.values(JobUrgency).includes(params.urgency as JobUrgency)) and.push({ urgency: params.urgency as JobUrgency });
  if (params.providerRole && Object.values(JobProviderRole).includes(params.providerRole as JobProviderRole)) and.push({ targetProviderRoles:{ has: params.providerRole as JobProviderRole } });
  return { AND: and };
}
function shape(row: Prisma.JobGetPayload<{ select: typeof publicJobSelect }>): PublicJob { return { ...row, budgetLabel: formatBudget(row.budgetType, row.budgetMin, row.budgetMax, row.currency) }; }
export async function getActiveJobLocations() { return prisma.location.findMany({ where:{ isActive:true }, select:{ id:true, slug:true, name:true, district:true, state:true, country:true }, orderBy:[{ isPrimary:"desc" }, { name:"asc" }] }); }
export async function getJobDiscovery(params: JobSearchParams) { const page=pageNumber(params.page); const where=publicJobWhere(params); const [total, rows, locations] = await prisma.$transaction([prisma.job.count({ where }), prisma.job.findMany({ where, select:publicJobSelect, orderBy:[{ publishedAt:"desc" }, { createdAt:"desc" }], skip:(page-1)*PAGINATION.quickJobsPerPage, take:PAGINATION.quickJobsPerPage }), prisma.location.findMany({ where:{ isActive:true }, select:{ id:true, slug:true, name:true, district:true, state:true, country:true }, orderBy:[{ isPrimary:"desc" }, { name:"asc" }] })]); return { jobs: rows.map(shape), locations, total, page, pageSize:PAGINATION.quickJobsPerPage, totalPages:Math.max(1, Math.ceil(total/PAGINATION.quickJobsPerPage)) }; }
export async function getPublicJobById(id: string) { const job = await prisma.job.findFirst({ where:{ id, status:JobStatus.PUBLISHED, location:{ is:{ isActive:true } } }, select:publicJobSelect }); return job ? shape(job) : null; }
export async function getCustomerJob(customerId:string, id:string) { return prisma.job.findFirst({ where:{ id, customerId }, include:{ location:true } }); }
