import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { ROUTES } from "@/lib/constants";
import type { BusinessAnalytics, TimeSeriesPoint } from "@/lib/types";

type GrowthMetric = {
  label: string;
  value: string;
  detail: string;
  tone: "fuchsia" | "violet" | "emerald" | "amber";
};

const demoTrend: TimeSeriesPoint[] = [
  { date: "Week 1", value: 38 },
  { date: "Week 2", value: 46 },
  { date: "Week 3", value: 41 },
  { date: "Week 4", value: 57 },
  { date: "Week 5", value: 64 },
  { date: "Week 6", value: 72 },
];

const demoAnalyticsPreview: Pick<
  BusinessAnalytics,
  "profileViews" | "searchAppearances" | "contactRequests" | "responseRate" | "activityTrend"
> = {
  profileViews: {
    label: "Profile views",
    value: 248,
    previousValue: 196,
    percentageChange: 27,
    trend: "UP",
  },
  searchAppearances: {
    label: "Search appearances",
    value: 912,
    previousValue: 760,
    percentageChange: 20,
    trend: "UP",
  },
  contactRequests: {
    label: "Enquiries",
    value: 36,
    previousValue: 29,
    percentageChange: 24,
    trend: "UP",
  },
  responseRate: {
    label: "Response rate",
    value: 88,
    previousValue: 82,
    percentageChange: 7,
    trend: "UP",
  },
  activityTrend: demoTrend,
};

const growthMetrics: GrowthMetric[] = [
  {
    label: demoAnalyticsPreview.profileViews.label,
    value: demoAnalyticsPreview.profileViews.value.toLocaleString("en-IN"),
    detail: "+27% demo growth",
    tone: "fuchsia",
  },
  {
    label: demoAnalyticsPreview.searchAppearances.label,
    value: demoAnalyticsPreview.searchAppearances.value.toLocaleString("en-IN"),
    detail: "Local discovery preview",
    tone: "violet",
  },
  {
    label: demoAnalyticsPreview.contactRequests.label,
    value: demoAnalyticsPreview.contactRequests.value.toLocaleString("en-IN"),
    detail: "Calls, messages, quote requests",
    tone: "emerald",
  },
  {
    label: demoAnalyticsPreview.responseRate.label,
    value: `${demoAnalyticsPreview.responseRate.value}%`,
    detail: "Mock reply health",
    tone: "amber",
  },
];

const toneClasses: Record<GrowthMetric["tone"], string> = {
  fuchsia: "border-fuchsia-200/20 bg-fuchsia-300/[0.09] text-fuchsia-100",
  violet: "border-violet-200/20 bg-violet-300/[0.09] text-violet-100",
  emerald: "border-emerald-200/20 bg-emerald-300/[0.08] text-emerald-100",
  amber: "border-amber-200/20 bg-amber-300/[0.08] text-amber-100",
};

function getTrendCoordinates(points: TimeSeriesPoint[]) {
  const max = Math.max(...points.map((point) => point.value));
  const min = Math.min(...points.map((point) => point.value));
  const range = Math.max(max - min, 1);

  return points.map((point, index) => {
    const x = 10 + (index / Math.max(points.length - 1, 1)) * 280;
    const y = 108 - ((point.value - min) / range) * 76;

    return { ...point, x, y };
  });
}

function buildTrendPath(points: ReturnType<typeof getTrendCoordinates>) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
}

export function TrustAndGrowth() {
  const trendCoordinates = getTrendCoordinates(demoAnalyticsPreview.activityTrend);
  const trendPath = buildTrendPath(trendCoordinates);

  return (
    <Section className="overflow-hidden bg-[#07050D] py-12 sm:py-16" containerClassName="relative">
      <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" aria-hidden="true" />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-fuchsia-200/15 bg-gradient-to-br from-[#1C0B2C]/95 via-[#12091F]/95 to-[#08050D]/95 p-5 shadow-xl shadow-fuchsia-950/35 backdrop-blur sm:p-6 lg:p-8">
        <div className="absolute right-8 top-6 h-28 w-28 rounded-full border border-fuchsia-200/10" aria-hidden="true" />
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/75">Business Growth Intelligence</p>
            <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight text-white sm:text-4xl">Turn local demand into business growth</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/66 sm:text-lg sm:leading-8">
              A future business view can help providers understand visibility, demand, enquiries, and opportunities without guessing what customers need.
            </p>
            <div className="mt-5 inline-flex rounded-full border border-amber-200/25 bg-amber-200/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-amber-100">
              Preview data only · Demo insights
            </div>
            <Link href={ROUTES.advertise} className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-black text-[#16091f] shadow-lg shadow-fuchsia-500/20 transition hover:bg-fuchsia-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-200 focus:ring-offset-2 focus:ring-offset-[#12091F]">
              Explore advertising options <span className="ml-1" aria-hidden="true">→</span>
            </Link>
          </div>

          <Card className="relative overflow-hidden border-fuchsia-200/15 bg-white/[0.07] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-fuchsia-100/70">Mock analytics panel</p>
                <h3 className="mt-2 text-xl font-black text-white">Local demand snapshot</h3>
              </div>
              <span className="w-fit rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-bold text-white/65">Not live data</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {growthMetrics.map((metric) => (
                <div key={metric.label} className={`rounded-2xl border p-3 ${toneClasses[metric.tone]}`}>
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-white/55">{metric.label}</p>
                  <p className="mt-2 text-2xl font-black text-white sm:text-3xl">{metric.value}</p>
                  <p className="mt-1 text-xs font-bold text-white/58">{metric.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-black text-white">Profile growth preview</p>
                <p className="text-xs font-bold text-emerald-100">Demo trend +34</p>
              </div>
              <svg role="img" aria-labelledby="growth-chart-title growth-chart-desc" viewBox="0 0 300 128" className="mt-3 h-32 w-full overflow-visible">
                <title id="growth-chart-title">Mock profile growth trend</title>
                <desc id="growth-chart-desc">Demo profile growth rises from 38 in week 1 to 72 in week 6, with one small dip in week 3.</desc>
                <path d="M10 108 H290" stroke="rgba(255,255,255,0.14)" strokeWidth="1" aria-hidden="true" />
                <path d="M10 70 H290" stroke="rgba(255,255,255,0.08)" strokeWidth="1" aria-hidden="true" />
                <path d="M10 32 H290" stroke="rgba(255,255,255,0.08)" strokeWidth="1" aria-hidden="true" />
                <path d={trendPath} fill="none" stroke="url(#growthGradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                {trendCoordinates.map((point, index) => (
                  <circle key={point.date} cx={point.x} cy={point.y} r="4" fill="#F8F6FF" opacity={index === trendCoordinates.length - 1 ? "1" : "0.72"} aria-hidden="true" />
                ))}
                <defs>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B4DFF" />
                    <stop offset="0.55" stopColor="#E126FF" />
                    <stop offset="1" stopColor="#68F5A4" />
                  </linearGradient>
                </defs>
              </svg>
              <p className="mt-2 text-xs leading-5 text-white/55">This compact visualization is illustrative only; analytics collection, persistence, and entitlement controls are not active here.</p>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}
