import { ProviderCard } from "@/components/marketplace/provider-card";
import { ProviderFilters } from "@/components/marketplace/provider-filters";
import { PublicShell } from "@/components/layout/public-shell";
import {
  getProviderDiscovery,
  type ProviderSearchParams,
} from "@/lib/marketplace/providers";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function tradesPageHref(query: ProviderSearchParams, page: number) {
  return `/trades?${new URLSearchParams({
    ...(query.q ? { q: query.q } : {}),
    ...(query.location ? { location: query.location } : {}),
    ...(query.projectType ? { projectType: query.projectType } : {}),
    page: String(page),
  })}`;
}

export default async function TradesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: ProviderSearchParams = {
    q: first(params.q),
    location: first(params.location),
    projectType: first(params.projectType),
    page: first(params.page),
  };
  const discovery = await getProviderDiscovery(["CONTRACTOR"], query);

  return (
    <PublicShell>
      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 sm:py-16">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/75">
          Contractor marketplace
        </p>
        <div className="mt-4 max-w-3xl">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
            Find local contractors for project work
          </h1>
          <p className="mt-4 text-base leading-7 text-white/65 sm:text-lg">
            Discover active, onboarding-complete contractor profiles by
            location, business name, headline and project type.
          </p>
        </div>
        <ProviderFilters
          action="/trades"
          locations={discovery.locations}
          defaults={{
            q: query.q,
            location: query.location,
            projectType: query.projectType,
          }}
          serviceParam="projectType"
          serviceLabel="Project type"
        />
        <p className="mt-6 text-sm text-white/65">
          {discovery.total} contractor{discovery.total === 1 ? "" : "s"} found.
          Reviews and RFQs are not available in this milestone.
        </p>
        {discovery.providers.length ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {discovery.providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.05] p-8 text-white">
            <h2 className="text-2xl font-black">No matching contractors yet</h2>
            <p className="mt-3 max-w-2xl text-white/65">
              Try another active location or project type. Contractor profiles
              must be active and onboarding-complete before they appear
              publicly.
            </p>
          </div>
        )}
        {discovery.totalPages > 1 ? (
          <nav className="mt-8 flex flex-wrap gap-3" aria-label="Pagination">
            {Array.from({ length: discovery.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <a
                  key={page}
                  href={tradesPageHref(query, page)}
                  className={`rounded-full px-4 py-2 text-sm font-bold ${page === discovery.page ? "bg-white text-[#14091f]" : "border border-white/10 text-white/70"}`}
                  aria-current={page === discovery.page ? "page" : undefined}
                >
                  {page}
                </a>
              ),
            )}
          </nav>
        ) : null}
      </section>
    </PublicShell>
  );
}
