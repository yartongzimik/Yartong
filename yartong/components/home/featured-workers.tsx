import Link from "next/link";

/* ==========================================================================
   TYPES
   ========================================================================== */

type WorkerAvailability =
  | "AVAILABLE"
  | "BUSY"
  | "LIMITED";

type WorkerSkillLevel =
  | "FOUNDATION"
  | "PROFESSIONAL"
  | "SPECIALIST"
  | "MASTER";

interface FeaturedWorker {
  id: string;
  name: string;
  initials: string;
  headline: string;
  primaryTrade: string;
  additionalTrades: string[];
  skillLevel: WorkerSkillLevel;
  location: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  responseRate: number;
  startingPrice: number;
  priceUnit: string;
  verified: boolean;
  availability: WorkerAvailability;
  availabilityText: string;
  profileHref: string;
  imageUrl?: string;
}

interface IconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

/* ==========================================================================
   DEVELOPMENT DATA

   This data keeps the homepage functional while the real database and
   recommendation engine are not connected. The component is structured so
   the array can later be replaced by an API response without changing the UI.
   ========================================================================== */

const FEATURED_WORKERS: FeaturedWorker[] = [
  {
    id: "worker-001",
    name: "A. Shimray",
    initials: "AS",
    headline:
      "Residential masonry, plastering and structural repair specialist.",
    primaryTrade: "Mason",
    additionalTrades: [
      "Plastering",
      "Concrete",
    ],
    skillLevel: "SPECIALIST",
    location: "Senapati Town",
    experienceYears: 9,
    rating: 4.9,
    reviewCount: 47,
    completedJobs: 86,
    responseRate: 96,
    startingPrice: 900,
    priceUnit: "day",
    verified: true,
    availability: "AVAILABLE",
    availabilityText: "Available this week",
    profileHref: "/workers/worker-001",
  },
  {
    id: "worker-002",
    name: "K. Pao",
    initials: "KP",
    headline:
      "Electrical installation, household wiring and fault-repair professional.",
    primaryTrade: "Electrician",
    additionalTrades: [
      "Wiring",
      "Maintenance",
    ],
    skillLevel: "PROFESSIONAL",
    location: "Senapati Town",
    experienceYears: 6,
    rating: 4.8,
    reviewCount: 31,
    completedJobs: 64,
    responseRate: 92,
    startingPrice: 850,
    priceUnit: "day",
    verified: true,
    availability: "LIMITED",
    availabilityText: "Limited availability",
    profileHref: "/workers/worker-002",
  },
  {
    id: "worker-003",
    name: "R. Zimik",
    initials: "RZ",
    headline:
      "Custom furniture, doors, windows and roofing woodwork.",
    primaryTrade: "Carpenter",
    additionalTrades: [
      "Furniture",
      "Roofing",
    ],
    skillLevel: "MASTER",
    location: "Senapati",
    experienceYears: 14,
    rating: 4.9,
    reviewCount: 59,
    completedJobs: 112,
    responseRate: 89,
    startingPrice: 1200,
    priceUnit: "day",
    verified: true,
    availability: "BUSY",
    availabilityText: "Next available in 5 days",
    profileHref: "/workers/worker-003",
  },
];

/* ==========================================================================
   HELPERS
   ========================================================================== */

function formatCurrency(
  value: number,
): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getSkillLevelLabel(
  skillLevel: WorkerSkillLevel,
): string {
  switch (skillLevel) {
    case "FOUNDATION":
      return "Foundation";

    case "PROFESSIONAL":
      return "Professional";

    case "SPECIALIST":
      return "Specialist";

    case "MASTER":
      return "Master";
  }
}

function getAvailabilityClass(
  availability: WorkerAvailability,
): string {
  switch (availability) {
    case "AVAILABLE":
      return "worker-card__availability--available";

    case "LIMITED":
      return "worker-card__availability--limited";

    case "BUSY":
      return "worker-card__availability--busy";
  }
}

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

function StarIcon({
  className,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="m12 2.8 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 17l-5.56 2.92 1.06-6.2L3 9.33l6.22-.9L12 2.8Z" />
    </svg>
  );
}

function VerifiedIcon({
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
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 2 2.1 2.9-.4.8 2.8 2.6 1.4-1.3 2.7 1.3 2.7-2.6 1.4-.8 2.8-2.9-.4-2 2.1-2-2.1-2.9.4-.8-2.8-2.6-1.4L5 11.6 3.7 8.9l2.6-1.4.8-2.8 2.9.4L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function LocationIcon({
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
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle
        cx="12"
        cy="10"
        r="2.5"
      />
    </svg>
  );
}

function BriefcaseIcon({
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

function MessageIcon({
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
      <path d="M5 18.5 3.5 21l3.8-.9A9 9 0 1 0 5 18.5Z" />
      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
    </svg>
  );
}

/* ==========================================================================
   WORKER CARD
   ========================================================================== */

interface WorkerCardProps {
  worker: FeaturedWorker;
}

function WorkerCard({
  worker,
}: WorkerCardProps) {
  const skillLevelLabel =
    getSkillLevelLabel(worker.skillLevel);

  const availabilityClass =
    getAvailabilityClass(
      worker.availability,
    );

  return (
    <article className="card card--interactive worker-card">
      <div className="card__body">
        <div className="worker-card__profile">
          <div className="worker-card__avatar">
            {worker.imageUrl ? (
              <img
                src={worker.imageUrl}
                alt={`${worker.name} profile`}
                width={64}
                height={64}
              />
            ) : (
              <span
                className="worker-card__avatar-fallback"
                aria-hidden="true"
              >
                {worker.initials}
              </span>
            )}
          </div>

          <div className="worker-card__identity">
            <div className="worker-card__name-row">
              <Link
                className="worker-card__name"
                href={worker.profileHref}
              >
                {worker.name}
              </Link>

              {worker.verified ? (
                <>
                  <VerifiedIcon
                    className="worker-card__verified-icon"
                  />

                  <span className="sr-only">
                    Verified Yartong profile
                  </span>
                </>
              ) : null}
            </div>

            <span className="worker-card__trade">
              {worker.primaryTrade}
            </span>

            <span className="worker-card__location">
              <LocationIcon className="worker-card__meta-icon" />

              {worker.location}
            </span>
          </div>
        </div>

        <div className="worker-card__summary">
          <div className="worker-card__badges">
            <span
              className="worker-card__skill-level"
              data-skill-level={worker.skillLevel}
            >
              {skillLevelLabel}
            </span>

            <span
              className={`worker-card__availability ${availabilityClass}`}
            >
              {worker.availabilityText}
            </span>
          </div>

          <p className="worker-card__headline text-clamp-3">
            {worker.headline}
          </p>

          <div className="worker-card__skills">
            {worker.additionalTrades.map(
              (trade) => (
                <span
                  key={trade}
                  className="worker-card__skill"
                >
                  {trade}
                </span>
              ),
            )}
          </div>

          <div className="worker-card__rating-row">
            <span className="worker-card__rating">
              <StarIcon className="worker-card__star" />

              <strong>
                {worker.rating.toFixed(1)}
              </strong>

              <span>
                ({worker.reviewCount} reviews)
              </span>
            </span>

            <span className="worker-card__experience">
              {worker.experienceYears} years experience
            </span>
          </div>

          <div className="worker-card__metrics">
            <div className="worker-card__metric">
              <span className="worker-card__metric-value">
                {worker.completedJobs}
              </span>

              <span className="worker-card__metric-label">
                Jobs completed
              </span>
            </div>

            <div className="worker-card__metric">
              <span className="worker-card__metric-value">
                {worker.responseRate}%
              </span>

              <span className="worker-card__metric-label">
                Response rate
              </span>
            </div>

            <div className="worker-card__metric">
              <span className="worker-card__metric-value">
                {formatCurrency(
                  worker.startingPrice,
                )}
              </span>

              <span className="worker-card__metric-label">
                Starting per {worker.priceUnit}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card__footer worker-card__footer">
        <Link
          className="button button--outline"
          href={worker.profileHref}
        >
          View profile
        </Link>

        <Link
          className="button button--primary"
          href={`/messages?recipient=${worker.id}`}
        >
          <MessageIcon className="button__icon" />

          Send request
        </Link>
      </div>
    </article>
  );
}

/* ==========================================================================
   SECTION
   ========================================================================== */

export function FeaturedWorkers() {
  return (
    <section
      className="homepage-section"
      aria-labelledby="featured-workers-title"
    >
      <div className="container">
        <div className="section-header">
          <div className="section-header__content">
            <span className="eyebrow">
              Skilled professionals
            </span>

            <h2
              id="featured-workers-title"
              className="heading-2"
            >
              Discover trusted people for your next job.
            </h2>

            <p className="section-description">
              Compare verified profiles, skill levels,
              experience, availability, ratings and work
              performance before sending a request.
            </p>
          </div>

          <div className="section-header__actions">
            <Link
              className="button button--outline"
              href="/workers"
            >
              Browse all workers

              <ArrowRightIcon className="button__icon" />
            </Link>
          </div>
        </div>

        <div className="home-featured-grid">
          {FEATURED_WORKERS.map(
            (worker) => (
              <WorkerCard
                key={worker.id}
                worker={worker}
              />
            ),
          )}
        </div>

        <div className="featured-workers-note">
          <div className="featured-workers-note__icon">
            <BriefcaseIcon className="button__icon" />
          </div>

          <div className="featured-workers-note__content">
            <span className="featured-workers-note__title">
              Need several trades for one project?
            </span>

            <span className="featured-workers-note__description">
              Post one detailed job request and allow relevant
              providers, labourers and contractors to respond.
            </span>
          </div>

          <Link
            className="button button--secondary"
            href="/post-job"
          >
            Post a Job
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedWorkers;