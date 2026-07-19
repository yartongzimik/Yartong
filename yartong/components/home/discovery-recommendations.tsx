"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import {
  AVAILABILITY_LABELS,
  JOB_URGENCY_LABELS,
  MATERIAL_STOCK_LABELS,
  ROUTES,
  VERIFICATION_LABELS,
} from "@/lib/constants";
import {
  MOCK_CONTRACTOR_PROFILES,
  MOCK_LOCATIONS,
  MOCK_MATERIAL_CATEGORIES,
  MOCK_MATERIAL_PRODUCTS,
  MOCK_MATERIAL_SUPPLIER_PROFILES,
  MOCK_QUICK_JOBS,
  MOCK_SKILLED_PROVIDER_PROFILES,
  MOCK_TRADE_CATEGORIES,
  MOCK_USERS,
} from "@/lib/mock-data";

const TAB_IDS = ["workers", "contractors", "materials", "quick-jobs"] as const;

type DiscoveryTab = (typeof TAB_IDS)[number];

type DiscoveryTabConfig = {
  label: string;
  shortLabel: string;
  href: string;
  cta: string;
  countLabel: string;
};

type SmartDiscoveryCard = {
  id: string;
  eyebrow: string;
  title: string;
  headline: string;
  description?: string;
  href: string;
  actionLabel: string;
  primaryMeta: string;
  secondaryMeta?: string;
  trustMeta?: string;
  chips: string[];
};

const tabs: Record<DiscoveryTab, DiscoveryTabConfig> = {
  workers: {
    label: "Workers",
    shortLabel: "Workers",
    href: ROUTES.workers,
    cta: "View all workers",
    countLabel: `${MOCK_SKILLED_PROVIDER_PROFILES.length} previews`,
  },
  contractors: {
    label: "Contractors",
    shortLabel: "Teams",
    href: ROUTES.trades,
    cta: "View all contractors",
    countLabel: `${MOCK_CONTRACTOR_PROFILES.length} preview`,
  },
  materials: {
    label: "Materials / Suppliers",
    shortLabel: "Supplies",
    href: ROUTES.materials,
    cta: "View all materials",
    countLabel: `${MOCK_MATERIAL_PRODUCTS.length + MOCK_MATERIAL_SUPPLIER_PROFILES.length} listings`,
  },
  "quick-jobs": {
    label: "Quick Jobs",
    shortLabel: "Quick Jobs",
    href: ROUTES.quickJobs,
    cta: "View quick jobs",
    countLabel: `${MOCK_QUICK_JOBS.length} open jobs`,
  },
};

const locationById = new Map(MOCK_LOCATIONS.map((location) => [location.id, location.name]));
const userById = new Map(MOCK_USERS.map((user) => [user.id, user]));
const tradeById = new Map(MOCK_TRADE_CATEGORIES.map((trade) => [trade.id, trade.name]));
const materialCategoryById = new Map(MOCK_MATERIAL_CATEGORIES.map((category) => [category.id, category.name]));
const supplierById = new Map(MOCK_MATERIAL_SUPPLIER_PROFILES.map((supplier) => [supplier.id, supplier]));

function readableBusinessType(type: string) {
  return type.replaceAll("_", " ").toLowerCase();
}

function serviceAreas(locationIds: string[]) {
  return locationIds.map((id) => locationById.get(id)).filter(Boolean).slice(0, 2).join(" + ");
}

function getDiscoveryCards(): Record<DiscoveryTab, SmartDiscoveryCard[]> {
  const workers = MOCK_SKILLED_PROVIDER_PROFILES.slice(0, 3).map((worker) => {
    const user = userById.get(worker.userId);
    const primaryService = worker.services.find((service) => service.isPrimaryService) ?? worker.services[0];
    const location = serviceAreas(worker.serviceLocationIds) || user?.location?.name;

    return {
      id: worker.id,
      eyebrow: primaryService?.name ?? "Skilled worker",
      title: worker.businessName ?? user?.displayName ?? "Yartong worker",
      headline: worker.headline,
      href: `${ROUTES.workerProfile}/${worker.id}`,
      actionLabel: "View Profile",
      primaryMeta: `★ ${worker.averageRating.toFixed(1)} (${worker.totalReviews} reviews)`,
      secondaryMeta: `${worker.completedJobs} jobs completed`,
      trustMeta: user ? VERIFICATION_LABELS[user.verificationStatus] : `Trust ${worker.trustScore}`,
      chips: [AVAILABILITY_LABELS[worker.availabilityStatus], location ? `📍 ${location}` : "Local service"],
    };
  });

  const contractors = MOCK_CONTRACTOR_PROFILES.slice(0, 3).map((contractor) => ({
    id: contractor.id,
    eyebrow: contractor.tradeCategoryIds.map((id) => tradeById.get(id)).filter(Boolean).slice(0, 2).join(" + ") || "Project contractor",
    title: contractor.businessName,
    headline: contractor.headline,
    description: contractor.description,
    href: ROUTES.trades,
    actionLabel: "View Contractors",
    primaryMeta: `★ ${contractor.averageRating.toFixed(1)} rating`,
    secondaryMeta: `${contractor.completedProjects} projects completed`,
    trustMeta: `${contractor.teamSize} member team`,
    chips: [AVAILABILITY_LABELS[contractor.availabilityStatus], `${contractor.activeProjects} active projects`],
  }));

  const materials = [
    ...MOCK_MATERIAL_PRODUCTS.slice(0, 2).map((product) => {
      const supplier = supplierById.get(product.supplierId);

      return {
        id: product.id,
        eyebrow: materialCategoryById.get(product.categoryId) ?? "Material",
        title: product.name,
        headline: `${MATERIAL_STOCK_LABELS[product.stockStatus]}${product.availableQuantity ? ` · ${product.availableQuantity} ${product.unit.toLowerCase()}` : ""}`,
        description: product.description,
        href: `${ROUTES.materialProfile}/${product.slug}`,
        actionLabel: "View Material",
        primaryMeta: supplier ? supplier.businessName : "Local supplier",
        secondaryMeta: product.deliveryAvailable ? "Delivery available" : "Pickup / enquiry",
        trustMeta: supplier ? `★ ${supplier.averageRating.toFixed(1)} supplier` : undefined,
        chips: [product.brand ?? "Construction supply", product.priceType.replaceAll("_", " ").toLowerCase()],
      };
    }),
    ...MOCK_MATERIAL_SUPPLIER_PROFILES.slice(0, 1).map((supplier) => ({
      id: supplier.id,
      eyebrow: `${readableBusinessType(supplier.businessType)} supplier`,
      title: supplier.businessName,
      headline: `${supplier.productCount} products · ${supplier.completedOrders} completed orders`,
      description: supplier.description,
      href: ROUTES.materials,
      actionLabel: "View Supplier",
      primaryMeta: `★ ${supplier.averageRating.toFixed(1)} supplier rating`,
      secondaryMeta: supplier.offersDelivery ? "Delivery available" : "Enquiry only",
      trustMeta: `${supplier.responseRate}% response rate`,
      chips: [supplier.offersWholesale ? "Wholesale" : "Retail", serviceAreas(supplier.serviceLocationIds) || "Local supply"],
    })),
  ];

  const quickJobs = MOCK_QUICK_JOBS.slice(0, 3).map((job) => ({
    id: job.id,
    eyebrow: tradeById.get(job.tradeCategoryId) ?? "Quick job",
    title: job.title,
    headline: JOB_URGENCY_LABELS[job.urgency],
    description: job.description,
    href: ROUTES.quickJobs,
    actionLabel: "View Job",
    primaryMeta: `${job.numberOfWorkers} worker${job.numberOfWorkers > 1 ? "s" : ""} needed`,
    secondaryMeta: job.expectedDuration.replaceAll("_", " ").toLowerCase(),
    trustMeta: job.pincode ? `PIN ${job.pincode}` : undefined,
    chips: [job.paymentType.replaceAll("_", " ").toLowerCase(), job.status.toLowerCase()],
  }));

  return { workers, contractors, materials, "quick-jobs": quickJobs };
}

export function DiscoveryRecommendations() {
  const [activeTab, setActiveTab] = useState<DiscoveryTab>("workers");
  const active = tabs[activeTab];
  const discoveryCards = useMemo(() => getDiscoveryCards(), []);

  return (
    <Section className="overflow-hidden bg-[#0B0612] py-12 sm:py-16" containerClassName="relative">
      <div className="absolute left-1/2 top-6 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" aria-hidden="true" />
      <div className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-fuchsia-950/25 backdrop-blur sm:p-5 lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/75">Smart Discovery Hub</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Discover trusted local options</h2>
            <p className="mt-3 text-sm leading-6 text-white/65 sm:text-base">Compare workers, project teams, supplies, and urgent jobs from one trusted local view.</p>
          </div>
          <Link href={active.href} className="inline-flex min-h-11 items-center justify-center rounded-full border border-fuchsia-200/25 bg-fuchsia-200/10 px-5 text-sm font-black text-fuchsia-100 transition hover:border-fuchsia-100/60 hover:bg-fuchsia-200/20 focus:outline-none focus:ring-2 focus:ring-fuchsia-200 focus:ring-offset-2 focus:ring-offset-[#0B0612]">
            {active.cta} →
          </Link>
        </div>

        <div className="mt-5 grid gap-2 rounded-[1.25rem] border border-white/10 bg-black/20 p-2 sm:grid-cols-2 lg:grid-cols-4" role="tablist" aria-label="Smart discovery categories">
          {TAB_IDS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`smart-discovery-${tab}`}
                id={`smart-discovery-tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`min-h-12 rounded-xl px-4 py-3 text-left text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-fuchsia-200 focus:ring-offset-2 focus:ring-offset-[#13091d] ${
                  isActive
                    ? "border border-fuchsia-200/40 bg-gradient-to-r from-[#9B4DFF] to-[#E126FF] text-white shadow-lg shadow-fuchsia-700/25"
                    : "border border-transparent text-white/70 hover:border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span>{tabs[tab].label}</span>
                  {isActive ? <span className="rounded-full bg-white/20 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider">Active</span> : null}
                </span>
                <span className="mt-1 block text-xs font-semibold text-white/55">{tabs[tab].countLabel}</span>
              </button>
            );
          })}
        </div>

        <div id={`smart-discovery-${activeTab}`} role="tabpanel" aria-labelledby={`smart-discovery-tab-${activeTab}`} className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {discoveryCards[activeTab].map((card) => (
            <Card key={`${activeTab}-${card.id}`} className="flex min-h-0 flex-col p-4 transition hover:-translate-y-0.5 hover:border-fuchsia-200/30 hover:bg-white/[0.08]">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-200/75">{card.eyebrow}</p>
                <span className="rounded-full border border-emerald-200/20 bg-emerald-200/10 px-2.5 py-1 text-xs font-bold text-emerald-100">{card.primaryMeta}</span>
              </div>
              <h3 className="mt-3 text-lg font-black leading-tight text-white">{card.title}</h3>
              <p className="mt-2 text-sm font-semibold text-fuchsia-100/90">{card.headline}</p>
              {card.description ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/62">{card.description}</p> : null}
              <dl className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-white/75">
                {card.secondaryMeta ? <div className="rounded-2xl bg-white/[0.06] p-3"><dt className="text-white/40">Track record</dt><dd className="mt-1">{card.secondaryMeta}</dd></div> : null}
                {card.trustMeta ? <div className="rounded-2xl bg-white/[0.06] p-3"><dt className="text-white/40">Trust signal</dt><dd className="mt-1">{card.trustMeta}</dd></div> : null}
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                {card.chips.filter(Boolean).map((chip) => <span key={chip} className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold capitalize text-white/65">{chip}</span>)}
              </div>
              <Link href={card.href} className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-black text-[#14091f] transition hover:bg-fuchsia-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-200 focus:ring-offset-2 focus:ring-offset-[#14091f]">
                {card.actionLabel}
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
