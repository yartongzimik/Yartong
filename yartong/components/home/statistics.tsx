
import type { CSSProperties } from "react";
import Link from "next/link";

/* ==========================================================================
   TYPES
   ========================================================================== */

interface PlatformStatistic {
  id: string;
  value: string;
  label: string;
  description: string;
}

interface InsightPoint {
  id: string;
  title: string;
  description: string;
}

interface IconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

/* ==========================================================================
   DEVELOPMENT DATA

   These are illustrative values for the development homepage only.
   Replace them with real platform metrics once production analytics exist.
   ========================================================================== */

const PLATFORM_STATISTICS: PlatformStatistic[] = [
  {
    id: "workers",
    value: "250+",
    label: "Worker profiles",
    description:
      "Skilled providers and labourers discoverable through Yartong.",
  },
  {
    id: "contractors",
    value: "45+",
    label: "Contractor businesses",
    description:
      "Teams and contractors available for larger construction projects.",
  },
  {
    id: "materials",
    value: "1,200+",
    label: "Material listings",
    description:
      "Construction products and supplier inventory across key categories.",
  },
  {
    id: "searches",
    value: "4,800+",
    label: "Marketplace searches",
    description:
      "Demand signals helping Yartong understand what local customers need.",
  },
];

const INSIGHT_POINTS: InsightPoint[] = [
  {
    id: "demand",
    title: "Understand local demand",
    description:
      "Search activity helps identify missing trades, materials and service categories.",
  },
  {
    id: "growth",
    title: "Support business growth",
    description:
      "Providers and suppliers can track visibility, enquiries, response rates and repeat customers.",
  },
  {
    id: "trust",
    title: "Improve marketplace trust",
    description:
      "Performance, verification and review signals help customers make better decisions.",
  },
];

/* ==========================================================================
   ICONS
   ========================================================================== */

function ArrowRightIcon({
  className,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function SearchInsightIcon({
  className,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />
      <path d="m20 20-3.5-3.5" />
      <path d="M8 11h6" />
      <path d="M11 8v6" />
    </svg>
  );
}

function ChartIcon({
  className,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19V3" />
    </svg>
  );
}

function ShieldIcon({
  className,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 5 6v5c0 4.8 2.9 8.1 7 10 4.1-1.9 7-5.2 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export function Statistics() {
  return (
    <section
      className="homepage-section homepage-section--gradient"
      aria-labelledby="home-statistics-title"
    >
      <div className="container">
        <div className="statistics-layout">
          <div className="statistics-layout__content">
            <span className="eyebrow">
              Data-driven marketplace
            </span>

            <h2
              id="home-statistics-title"
              className="heading-2"
            >
              Yartong learns from demand, not assumptions.
            </h2>

            <p className="section-description">
              Every search, enquiry and marketplace interaction
              can help us understand what customers are looking
              for, where supply is missing and which categories
              should be introduced next.
            </p>

            <div className="statistics-insights">
              {INSIGHT_POINTS.map((point, index) => {
                const Icon =
                  index === 0
                    ? SearchInsightIcon
                    : index === 1
                      ? ChartIcon
                      : ShieldIcon;

                return (
                  <article
                    key={point.id}
                    className="statistics-insight"
                  >
                    <span className="statistics-insight__icon">
                      <Icon className="button__icon" />
                    </span>

                    <div className="statistics-insight__content">
                      <h3 className="statistics-insight__title">
                        {point.title}
                      </h3>

                      <p className="statistics-insight__description">
                        {point.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="statistics-layout__actions">
              <Link
                className="button button--primary"
                href="/about"
              >
                Learn about Yartong

                <ArrowRightIcon className="button__icon" />
              </Link>

              <Link
                className="button button--outline"
                href="/register"
              >
                Join the marketplace
              </Link>
            </div>
          </div>

          <div className="statistics-dashboard">
            <div className="statistics-dashboard__header">
              <div>
                <span className="eyebrow eyebrow--plain">
                  Marketplace snapshot
                </span>

                <h3 className="statistics-dashboard__title">
                  Growing with local demand
                </h3>
              </div>

              <span className="statistics-dashboard__status">
                Development data
              </span>
            </div>

            <div className="home-stats statistics-dashboard__stats">
              {PLATFORM_STATISTICS.map(
                (statistic) => (
                  <article
                    key={statistic.id}
                    className="home-stat"
                  >
                    <strong className="home-stat__value">
                      {statistic.value}
                    </strong>

                    <span className="home-stat__label">
                      {statistic.label}
                    </span>

                    <span className="home-stat__description">
                      {statistic.description}
                    </span>
                  </article>
                ),
              )}
            </div>

            <div
              className="statistics-dashboard__chart"
              aria-hidden="true"
            >
              <div className="statistics-dashboard__chart-grid" />

              <div className="statistics-dashboard__bars">
                <span
                  className="statistics-dashboard__bar"
                  style={{ "--bar-height": "34%" } as CSSProperties}
                />
                <span
                  className="statistics-dashboard__bar"
                  style={{ "--bar-height": "49%" } as CSSProperties}
                />
                <span
                  className="statistics-dashboard__bar"
                  style={{ "--bar-height": "43%" } as CSSProperties}
                />
                <span
                  className="statistics-dashboard__bar"
                  style={{ "--bar-height": "62%" } as CSSProperties}
                />
                <span
                  className="statistics-dashboard__bar"
                  style={{ "--bar-height": "72%" } as CSSProperties}
                />
                <span
                  className="statistics-dashboard__bar"
                  style={{ "--bar-height": "83%" } as CSSProperties}
                />
                <span
                  className="statistics-dashboard__bar"
                  style={{ "--bar-height": "94%" } as CSSProperties}
                />
              </div>
            </div>

            <div className="statistics-dashboard__footer">
              <span>
                Search demand
              </span>

              <strong>
                Trending upward
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Statistics;