import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";
import { JobCard } from "@/components/marketplace/job-ui";
import {
  JOB_PROVIDER_ROLE_LABELS,
  JOB_URGENCY_LABELS,
  ROUTES,
} from "@/lib/constants";
import {
  getJobDiscovery,
  type JobSearchParams,
} from "@/lib/marketplace/jobs";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function paginationHref(query: JobSearchParams, page: number) {
  const params = new URLSearchParams();

  if (query.q) params.set("q", query.q);
  if (query.location) params.set("location", query.location);
  if (query.category) params.set("category", query.category);
  if (query.skill) params.set("skill", query.skill);
  if (query.urgency) params.set("urgency", query.urgency);
  if (query.providerRole) params.set("providerRole", query.providerRole);
  params.set("page", String(page));

  return `${ROUTES.quickJobs}?${params.toString()}`;
}

export default async function QuickJobsPage({ searchParams }: Props) {
  const params = await searchParams;
  const query: JobSearchParams = {
    q: first(params.q),
    location: first(params.location),
    category: first(params.category),
    skill: first(params.skill),
    urgency: first(params.urgency),
    providerRole: first(params.providerRole),
    page: first(params.page),
  };
  const discovery = await getJobDiscovery(query);

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-6 py-12 text-white">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/75">
          Public job discovery
        </p>
        <h1 className="mt-4 text-5xl font-black">Quick jobs</h1>

        <form className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-white/[0.06] p-5 md:grid-cols-3">
          <input
            name="q"
            placeholder="Search jobs"
            defaultValue={query.q}
            className="rounded-xl bg-black/30 p-3"
          />
          <select
            name="location"
            defaultValue={query.location}
            className="rounded-xl bg-black/30 p-3"
          >
            <option value="">All locations</option>
            {discovery.locations.map((location) => (
              <option key={location.slug} value={location.slug}>
                {location.name}
              </option>
            ))}
          </select>
          <input
            name="category"
            placeholder="Category"
            defaultValue={query.category}
            className="rounded-xl bg-black/30 p-3"
          />
          <input
            name="skill"
            placeholder="Skill"
            defaultValue={query.skill}
            className="rounded-xl bg-black/30 p-3"
          />
          <select
            name="urgency"
            defaultValue={query.urgency}
            className="rounded-xl bg-black/30 p-3"
          >
            <option value="">Any urgency</option>
            {Object.entries(JOB_URGENCY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            name="providerRole"
            defaultValue={query.providerRole}
            className="rounded-xl bg-black/30 p-3"
          >
            <option value="">Any worker role</option>
            {Object.entries(JOB_PROVIDER_ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button className="rounded-full bg-white px-5 py-3 font-black text-[#14091f]">
            Filter jobs
          </button>
        </form>

        <p className="mt-6 text-white/65">
          {discovery.total} published job{discovery.total === 1 ? "" : "s"} found.
        </p>

        {discovery.jobs.length ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {discovery.jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-white/10 p-8">
            <h2 className="text-2xl font-black">No published jobs found</h2>
          </div>
        )}

        {discovery.totalPages > 1 ? (
          <nav className="mt-8 flex gap-3" aria-label="Pagination">
            {Array.from(
              { length: discovery.totalPages },
              (_, index) => index + 1,
            ).map((page) => (
              <Link
                key={page}
                href={paginationHref(query, page)}
                aria-current={page === discovery.page ? "page" : undefined}
                className={`rounded-full px-4 py-2 font-bold ${
                  page === discovery.page
                    ? "bg-white text-[#14091f]"
                    : "border border-white/10 text-white/70"
                }`}
              >
                {page}
              </Link>
            ))}
          </nav>
        ) : null}
      </main>
    </PublicShell>
  );
}
