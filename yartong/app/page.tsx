"use client";

import Link from "next/link";
import { useState } from "react";
import { PublicShell } from "@/components/layout/public-shell";
import { ROUTES } from "@/lib/constants";

const categories = ["Mason", "Carpenter", "Electrician", "Plumber", "Painter", "Labour"];
const recommendationTabs = {
  Workers: ["Verified plumbers", "Available labourers", "Top-rated electricians"],
  Contractors: ["Residential builders", "Renovation teams", "Site supervisors"],
  Materials: ["Cement suppliers", "Steel vendors", "Sand and aggregates"],
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<keyof typeof recommendationTabs>("Workers");

  return (
    <PublicShell>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-700">Local work marketplace</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-950 md:text-6xl">
            Find trusted workers, contractors and materials near you.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">
            Yartong connects customers with skilled tradespeople, labourers,
            contractors and local material suppliers in just a few clicks.
          </p>
          <form className="mt-8 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-lg ring-1 ring-slate-200 sm:flex-row">
            <label className="sr-only" htmlFor="hero-search">Search marketplace</label>
            <input
              id="hero-search"
              type="search"
              placeholder="Search mason, plumber, carpenter, materials..."
              className="min-h-12 flex-1 rounded-xl border border-slate-200 px-4 text-base outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button className="rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2" type="submit">
              Search
            </button>
          </form>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-xl ring-1 ring-slate-200">
          <div className="flex gap-2" role="tablist" aria-label="Recommendations">
            {(Object.keys(recommendationTabs) as Array<keyof typeof recommendationTabs>).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                className={`flex-1 rounded-full px-3 py-2 text-sm font-bold ${activeTab === tab ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700"}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <ul className="mt-5 space-y-3" aria-live="polite">
            {recommendationTabs[activeTab].map((item) => (
              <li key={item} className="rounded-2xl border border-slate-200 p-4 font-semibold text-slate-800">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <h2 className="text-3xl font-black">Popular Categories</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((item) => (
            <div key={item} className="rounded-xl bg-white p-5 text-center font-semibold shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl bg-emerald-900 p-8 text-white md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-200">Business Growth</p>
            <h2 className="mt-3 text-3xl font-black">Get ready to grow with Yartong advertising.</h2>
            <p className="mt-3 max-w-3xl text-emerald-50">
              Skilled Providers, Contractors and Material Suppliers can prepare for
              future visibility, promoted listings and business insights as Yartong
              expands its marketplace growth tools.
            </p>
          </div>
          <Link className="mt-6 inline-flex rounded-full bg-white px-5 py-3 font-bold text-emerald-900 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-900 md:mt-0" href={ROUTES.advertise}>
            Advertise your business
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
