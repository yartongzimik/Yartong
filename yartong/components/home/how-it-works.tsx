import Link from "next/link";

/* ==========================================================================
   TYPES
   ========================================================================== */

type JourneyType =
  | "CUSTOMER"
  | "PROVIDER";

interface JourneyStep {
  id: string;
  step: string;
  title: string;
  description: string;
}

interface Journey {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  type: JourneyType;
  steps: JourneyStep[];
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

interface IconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

/* ==========================================================================
   DATA
   ========================================================================== */

const JOURNEYS: Journey[] = [
  {
    id: "customer",
    eyebrow: "For customers",
    title: "From need to trusted contact.",
    description:
      "Yartong helps customers move from searching to comparing and contacting the right person or business without relying only on word of mouth.",
    type: "CUSTOMER",
    steps: [
      {
        id: "customer-search",
        step: "01",
        title: "Search or post your requirement",
        description:
          "Find a trade, contractor, labourer or material directly, or describe the job you need completed.",
      },
      {
        id: "customer-compare",
        step: "02",
        title: "Compare relevant profiles",
        description:
          "Review skills, experience, ratings, availability, business performance and other trust signals.",
      },
      {
        id: "customer-contact",
        step: "03",
        title: "Send the first request through Yartong",
        description:
          "Start the conversation on-platform so both sides have a clear and trackable point of contact.",
      },
      {
        id: "customer-complete",
        step: "04",
        title: "Complete the work and review",
        description:
          "After the job is done, your feedback helps strengthen future marketplace trust and provider reputation.",
      },
    ],
    primaryLabel: "Find workers",
    primaryHref: "/workers",
    secondaryLabel: "Post a job",
    secondaryHref: "/post-job",
  },
  {
    id: "provider",
    eyebrow: "For workers and businesses",
    title: "Turn visibility into measurable growth.",
    description:
      "Professionals and suppliers can build a stronger digital presence, respond to opportunities and understand how customers interact with their business.",
    type: "PROVIDER",
    steps: [
      {
        id: "provider-profile",
        step: "01",
        title: "Create a professional profile",
        description:
          "Showcase skills, services, portfolio work, business details, materials or team capabilities.",
      },
      {
        id: "provider-discovery",
        step: "02",
        title: "Get discovered by relevant customers",
        description:
          "Appear in search results and marketplace categories based on what you actually provide.",
      },
      {
        id: "provider-response",
        step: "03",
        title: "Respond to enquiries and jobs",
        description:
          "Receive requests, Quick Job opportunities and quotations through a structured platform workflow.",
      },
      {
        id: "provider-growth",
        step: "04",
        title: "Track performance and grow",
        description:
          "Use visits, responses, ratings, enquiries and customer activity to improve how your business performs.",
      },
    ],
    primaryLabel: "Join Yartong",
    primaryHref: "/register",
    secondaryLabel: "Browse Quick Jobs",
    secondaryHref: "/quick-jobs",
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

function CustomerIcon({
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
      <circle cx="10" cy="8" r="3" />
      <path d="M4 20a6 6 0 0 1 12 0" />
      <path d="m17 11 2 2 3-4" />
    </svg>
  );
}

function ProviderIcon({
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
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        rx="2"
      />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </svg>
  );
}

function getJourneyIcon(
  type: JourneyType,
) {
  switch (type) {
    case "CUSTOMER":
      return CustomerIcon;

    case "PROVIDER":
      return ProviderIcon;
  }
}

/* ==========================================================================
   JOURNEY CARD
   ========================================================================== */

interface JourneyCardProps {
  journey: Journey;
}

function JourneyCard({
  journey,
}: JourneyCardProps) {
  const Icon =
    getJourneyIcon(journey.type);

  return (
    <article
      className="how-it-works-card"
      data-journey={journey.type}
    >
      <div className="how-it-works-card__header">
        <div className="how-it-works-card__icon">
          <Icon className="how-it-works-card__icon-svg" />
        </div>

        <div className="how-it-works-card__heading">
          <span className="how-it-works-card__eyebrow">
            {journey.eyebrow}
          </span>

          <h3 className="how-it-works-card__title">
            {journey.title}
          </h3>

          <p className="how-it-works-card__description">
            {journey.description}
          </p>
        </div>
      </div>

      <ol className="how-it-works-card__steps">
        {journey.steps.map(
          (step) => (
            <li
              key={step.id}
              className="how-it-works-step"
            >
              <div className="how-it-works-step__number">
                {step.step}
              </div>

              <div className="how-it-works-step__content">
                <h4 className="how-it-works-step__title">
                  {step.title}
                </h4>

                <p className="how-it-works-step__description">
                  {step.description}
                </p>
              </div>
            </li>
          ),
        )}
      </ol>

      <div className="how-it-works-card__actions">
        <Link
          className="button button--primary"
          href={journey.primaryHref}
        >
          {journey.primaryLabel}

          <ArrowRightIcon className="button__icon" />
        </Link>

        <Link
          className="button button--outline"
          href={journey.secondaryHref}
        >
          {journey.secondaryLabel}
        </Link>
      </div>
    </article>
  );
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export function HowItWorks() {
  return (
    <section
      className="homepage-section homepage-section--surface"
      aria-labelledby="how-it-works-title"
    >
      <div className="container">
        <div className="section-header">
          <div className="section-header__content">
            <span className="eyebrow">
              How Yartong works
            </span>

            <h2
              id="how-it-works-title"
              className="heading-2"
            >
              A clearer path from search to successful work.
            </h2>

            <p className="section-description">
              Yartong is designed around both sides of the
              marketplace: customers looking for dependable
              help and professionals looking for sustainable
              business opportunities.
            </p>
          </div>

          <div className="section-header__actions">
            <Link
              className="button button--ghost"
              href="/how-it-works"
            >
              Learn more

              <ArrowRightIcon className="button__icon" />
            </Link>
          </div>
        </div>

        <div className="how-it-works-grid">
          {JOURNEYS.map(
            (journey) => (
              <JourneyCard
                key={journey.id}
                journey={journey}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;