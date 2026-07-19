import { ProviderCard } from "@/components/marketplace/provider-card";
import { ProviderFilters } from "@/components/marketplace/provider-filters";
import { PublicShell } from "@/components/layout/public-shell";
import { getProviderDiscovery, type ProviderSearchParams, type PublicProviderRole, type WorkerRoleFilter } from "@/lib/marketplace/providers";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function first(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }
function workerRoles(role?: string): { filter: WorkerRoleFilter; roles: PublicProviderRole[] } {
  if (role === "skilled") return { filter: "skilled", roles: ["SKILLED_PROVIDER"] };
  if (role === "labourer") return { filter: "labourer", roles: ["LABOURER"] };
  return { filter: "all", roles: ["SKILLED_PROVIDER", "LABOURER"] };
}

export default async function WorkersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { filter, roles } = workerRoles(first(params.role));
  const query: ProviderSearchParams = { q: first(params.q), location: first(params.location), role: filter, skill: first(params.skill), page: first(params.page) };
  const discovery = await getProviderDiscovery(roles, query);
  const selectedLocation = discovery.locations.find((location) => location.slug === query.location);

  return (
    <PublicShell>
      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 sm:py-16">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/75">Worker marketplace</p>
        <div className="mt-4 max-w-3xl">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">Find skilled providers and labourers</h1>
          <p className="mt-4 text-base leading-7 text-white/65 sm:text-lg">Browse onboarding-complete Yartong worker profiles using database-backed filters for role, location, search and skills.</p>
        </div>
        <ProviderFilters action="/workers" locations={discovery.locations} defaults={{ q: query.q, location: query.location, role: filter, skill: query.skill }} roleOptions={[{ label: "All", value: "all" }, { label: "Skilled Providers", value: "skilled" }, { label: "Labourers", value: "labourer" }]} />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-white/65">
          <p>{discovery.total} provider{discovery.total === 1 ? "" : "s"} found{selectedLocation ? ` in ${selectedLocation.name}` : " across active locations"}.</p>
          <p>Reviews are not available yet.</p>
        </div>
        {discovery.providers.length ? <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{discovery.providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div> : <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.05] p-8 text-white"><h2 className="text-2xl font-black">No matching workers yet</h2><p className="mt-3 max-w-2xl text-white/65">Try clearing filters, choosing another active location, or searching a different skill. Public profiles only appear after providers complete onboarding and remain active.</p></div>}
        {discovery.totalPages > 1 ? <nav className="mt-8 flex flex-wrap gap-3" aria-label="Pagination">{Array.from({ length: discovery.totalPages }, (_, i) => i + 1).map((page) => <a key={page} href={`/workers?${new URLSearchParams({ ...(query.q ? { q: query.q } : {}), ...(query.location ? { location: query.location } : {}), role: filter, ...(query.skill ? { skill: query.skill } : {}), page: String(page) })}`} className={`rounded-full px-4 py-2 text-sm font-bold ${page === discovery.page ? "bg-white text-[#14091f]" : "border border-white/10 text-white/70"}`}>{page}</a>)}</nav> : null}
      </section>
    </PublicShell>
  );
}
