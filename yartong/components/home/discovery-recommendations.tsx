"use client";

import { useState } from "react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { ROUTES } from "@/lib/constants";
import {
  MOCK_CONTRACTOR_PROFILES,
  MOCK_MATERIAL_PRODUCTS,
  MOCK_MATERIAL_SUPPLIER_PROFILES,
  MOCK_QUICK_JOBS,
  MOCK_SKILLED_PROVIDER_PROFILES,
} from "@/lib/mock-data";

type DiscoveryTab = "workers" | "contractors" | "materials" | "quick-jobs";

const contractorDiscoveryHref = ROUTES.trades;

const tabs: Record<DiscoveryTab, { label: string; href: string; eyebrow: string }> = {
  workers: { label: "Workers", href: ROUTES.workers, eyebrow: "Available professionals" },
  contractors: { label: "Contractors", href: contractorDiscoveryHref, eyebrow: "Project-ready teams" },
  materials: { label: "Materials/Suppliers", href: ROUTES.materials, eyebrow: "Supply previews" },
  "quick-jobs": { label: "Quick Jobs", href: ROUTES.quickJobs, eyebrow: "Fast work board" },
};

const previewCards: Record<DiscoveryTab, Array<{ title: string; meta: string; detail: string }>> = {
  workers: MOCK_SKILLED_PROVIDER_PROFILES.slice(0, 3).map((worker) => ({
    title: worker.businessName ?? worker.headline,
    meta: `${worker.averageRating.toFixed(1)} rating · ${worker.completedJobs} jobs`,
    detail: worker.headline,
  })),
  contractors: MOCK_CONTRACTOR_PROFILES.slice(0, 3).map((contractor) => ({
    title: contractor.businessName,
    meta: `${contractor.teamSize} person team · ${contractor.completedProjects} projects`,
    detail: contractor.headline,
  })),
  materials: MOCK_MATERIAL_PRODUCTS.slice(0, 2)
    .map((product) => ({
      title: product.name,
      meta: `${product.stockStatus.replaceAll("_", " ").toLowerCase()} · ${product.unit.toLowerCase()}`,
      detail: product.description,
    }))
    .concat(
      MOCK_MATERIAL_SUPPLIER_PROFILES.slice(0, 1).map((supplier) => ({
        title: supplier.businessName,
        meta: `${supplier.productCount} products · ${supplier.averageRating.toFixed(1)} rating`,
        detail: supplier.description,
      })),
    ),
  "quick-jobs": MOCK_QUICK_JOBS.slice(0, 3).map((job) => ({
    title: job.title,
    meta: `${job.urgency.replaceAll("_", " ").toLowerCase()} · ${job.numberOfWorkers} worker${job.numberOfWorkers > 1 ? "s" : ""}`,
    detail: job.description,
  })),
};

export function DiscoveryRecommendations() {
  const [activeTab, setActiveTab] = useState<DiscoveryTab>("workers");
  const active = tabs[activeTab];

  return (
    <Section className="bg-[#0B0612]">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-fuchsia-200/75">Compact discovery</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Recommended on Yartong</h2>
          <p className="mt-3 max-w-2xl text-white/62">Switch categories to preview one focused set at a time without expanding the homepage.</p>
        </div>
        <Link href={active.href} className="text-sm font-bold text-fuchsia-200 hover:text-white">
          View all {active.label} →
        </Link>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-3">
        <div className="grid gap-2 md:grid-cols-4" role="tablist" aria-label="Recommendation categories">
          {(Object.keys(tabs) as DiscoveryTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                activeTab === tab
                  ? "bg-gradient-to-r from-[#9B4DFF] to-[#E126FF] text-white shadow-lg shadow-fuchsia-700/30"
                  : "text-white/65 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tabs[tab].label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {previewCards[activeTab].map((card) => (
            <Card key={`${activeTab}-${card.title}`} className="min-h-52">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-fuchsia-200/70">{active.eyebrow}</p>
              <h3 className="mt-4 text-xl font-black text-white">{card.title}</h3>
              <p className="mt-2 text-sm font-semibold capitalize text-emerald-200">{card.meta}</p>
              <p className="mt-4 text-sm leading-6 text-white/65">{card.detail}</p>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
