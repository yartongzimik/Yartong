import Link from "next/link";

/* ==========================================================================
   TYPES
   ========================================================================== */

type QuickJobUrgency =
  | "IMMEDIATE"
  | "TODAY"
  | "TOMORROW"
  | "THIS_WEEK";

type QuickJobPaymentType =
  | "DAILY"
  | "FIXED";

interface QuickJob {
  id: string;
  title: string;
  description: string;
  trade: string;
  location: string;
  postedAgo: string;
  startLabel: string;
  duration: string;
  workersNeeded: number;
  budget: number;
  paymentType: QuickJobPaymentType;
  urgency: QuickJobUrgency;
  urgencyLabel: string;
  verifiedCustomer: boolean;
  applications: number;
  href: string;
}

interface IconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

/* ==========================================================================
   DEVELOPMENT DATA

   This will later be replaced by current Quick Job records from the API.
   Expired, filled and cancelled jobs should be filtered before rendering.
   ========================================================================== */

const QUICK_JOBS: QuickJob[] = [
  {
    id: "quick-job-001",
    title: "Two labourers needed for unloading cement",
    description:
      "Help unload cement bags and move them into a ground-floor storage area.",
    trade: "General Labour",
    location: "Senapati Town",
    postedAgo: "18 minutes ago",
    startLabel: "Start today",
    duration: "4–5 hours",
    workersNeeded: 2,
    budget: 700,
    paymentType: "DAILY",
    urgency: "IMMEDIATE",
    urgencyLabel: "Urgent",
    verifiedCustomer: true,
    applications: 3,
    href: "/quick-jobs/quick-job-001",
  },
  {
    id: "quick-job-002",
    title: "Plumber required for leaking kitchen pipe",
    description:
      "Inspect and repair a leaking connection below the kitchen sink.",
    trade: "Plumbing",
    location: "Senapati Town",
    postedAgo: "42 minutes ago",
    startLabel: "Today before 5 PM",
    duration: "1–2 hours",
    workersNeeded: 1,
    budget: 900,
    paymentType: "FIXED",
    urgency: "TODAY",
    urgencyLabel: "Today",
    verifiedCustomer: true,
    applications: 5,
    href: "/quick-jobs/quick-job-002",
  },
  {
    id: "quick-job-003",
    title: "Electrician needed to install four lights",
    description:
      "Install four ceiling lights in two completed rooms. Wiring points are ready.",
    trade: "Electrical",
    location: "Mao",
    postedAgo: "1 hour ago",
    startLabel: "Tomorrow morning",
    duration: "Half day",
    workersNeeded: 1,
    budget: 1400,
    paymentType: "FIXED",
    urgency: "TOMORROW",
    urgencyLabel: "Tomorrow",
    verifiedCustomer: true,
    applications: 2,
    href: "/quick-jobs/quick-job-003",
  },
  {
    id: "quick-job-004",
    title: "Painter required for one bedroom",
    description:
      "Prepare and repaint one bedroom. Paint and basic materials will be provided.",
    trade: "Painting",
    location: "Paomata",
    postedAgo: "2 hours ago",
    startLabel: "Within this week",
    duration: "1 day",
    workersNeeded: 1,
    budget: 1800,
    paymentType: "FIXED",
    urgency: "THIS_WEEK",
    urgencyLabel: "This week",
    verifiedCustomer: false,
    applications: 7,
    href: "/quick-jobs/quick-job-004",
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

function getPaymentLabel(
  paymentType: QuickJobPaymentType,
): string {
  switch (paymentType) {
    case "DAILY":
      return "per worker";

    case "FIXED":
      return "fixed";
  }
}

function getUrgencyClass(
  urgency: QuickJobUrgency,
): string {
  switch (urgency) {
    case "IMMEDIATE":
      return "quick-job-listing__urgency--immediate";

    case "TODAY":
      return "quick-job-listing__urgency--today";

    case "TOMORROW":
      return "quick-job-listing__urgency--tomorrow";

    case "THIS_WEEK":
      return "quick-job-listing__urgency--week";
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

function ClockIcon({
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
        cx="12"
        cy="12"
        r="9"
      />
      <path d="M12 7v5l3 2" />
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

function CalendarIcon({
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
        y="5"
        width="18"
        height="16"
        rx="2"
      />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function UsersIcon({
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
        cx="9"
        cy="8"
        r="3"
      />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <circle
        cx="17"
        cy="9"
        r="2.5"
      />
      <path d="M15 15.5a5 5 0 0 1 6 4.5" />
    </svg>
  );
}

function ShieldCheckIcon({
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

/* ==========================================================================
   QUICK JOB CARD
   ========================================================================== */

interface QuickJobCardProps {
  job: QuickJob;
}

function QuickJobCard({
  job,
}: QuickJobCardProps) {
  const urgencyClass =
    getUrgencyClass(job.urgency);

  return (
    <article className="quick-job-listing">
      <div className="quick-job-listing__main">
        <div className="quick-job-listing__header">
          <div className="quick-job-listing__badges">
            <span
              className={`quick-job-listing__urgency ${urgencyClass}`}
            >
              {job.urgencyLabel}
            </span>

            <span className="quick-job-listing__trade">
              {job.trade}
            </span>

            {job.verifiedCustomer ? (
              <span className="quick-job-listing__verified">
                <ShieldCheckIcon className="quick-job-listing__meta-icon" />

                Verified customer
              </span>
            ) : null}
          </div>

          <span className="quick-job-listing__posted">
            {job.postedAgo}
          </span>
        </div>

        <div className="quick-job-listing__content">
          <h3 className="quick-job-listing__title">
            <Link href={job.href}>
              {job.title}
            </Link>
          </h3>

          <p className="quick-job-listing__description text-clamp-2">
            {job.description}
          </p>
        </div>

        <div className="quick-job-listing__details">
          <span className="quick-job-listing__detail">
            <LocationIcon className="quick-job-listing__meta-icon" />

            {job.location}
          </span>

          <span className="quick-job-listing__detail">
            <CalendarIcon className="quick-job-listing__meta-icon" />

            {job.startLabel}
          </span>

          <span className="quick-job-listing__detail">
            <ClockIcon className="quick-job-listing__meta-icon" />

            {job.duration}
          </span>

          <span className="quick-job-listing__detail">
            <UsersIcon className="quick-job-listing__meta-icon" />

            {job.workersNeeded}{" "}
            {job.workersNeeded === 1
              ? "worker"
              : "workers"}
          </span>
        </div>
      </div>

      <div className="quick-job-listing__aside">
        <div className="quick-job-listing__budget">
          <span className="quick-job-listing__budget-label">
            Budget
          </span>

          <strong className="quick-job-listing__budget-value">
            {formatCurrency(job.budget)}
          </strong>

          <span className="quick-job-listing__payment-type">
            {getPaymentLabel(
              job.paymentType,
            )}
          </span>
        </div>

        <span className="quick-job-listing__applications">
          {job.applications}{" "}
          {job.applications === 1
            ? "application"
            : "applications"}
        </span>

        <Link
          className="button button--quick-job button--full"
          href={job.href}
        >
          View and apply
        </Link>
      </div>
    </article>
  );
}

/* ==========================================================================
   SECTION
   ========================================================================== */

export function QuickJobs() {
  return (
    <section
      className="homepage-section"
      aria-labelledby="quick-jobs-title"
    >
      <div className="container">
        <div className="section-header">
          <div className="section-header__content">
            <span className="eyebrow">
              Fast local opportunities
            </span>

            <h2
              id="quick-jobs-title"
              className="heading-2"
            >
              Small jobs that need quick action.
            </h2>

            <p className="section-description">
              Quick Jobs help customers find nearby workers
              for urgent, short-duration and clearly defined
              tasks without creating a full project request.
            </p>
          </div>

          <div className="section-header__actions">
            <Link
              className="button button--outline"
              href="/quick-jobs"
            >
              Browse all Quick Jobs

              <ArrowRightIcon className="button__icon" />
            </Link>
          </div>
        </div>

        <div className="home-quick-jobs">
          {QUICK_JOBS.map((job) => (
            <QuickJobCard
              key={job.id}
              job={job}
            />
          ))}
        </div>

        <div className="quick-jobs-callout">
          <div className="quick-jobs-callout__icon">
            <BriefcaseIcon className="button__icon" />
          </div>

          <div className="quick-jobs-callout__content">
            <span className="quick-jobs-callout__title">
              Need help with a small or urgent task?
            </span>

            <span className="quick-jobs-callout__description">
              Post the task, location, start time, expected
              duration and payment so available workers can
              respond quickly.
            </span>
          </div>

          <Link
            className="button button--quick-job"
            href="/quick-jobs?create=true"
          >
            Post a Quick Job
          </Link>
        </div>
      </div>
    </section>
  );
}

export default QuickJobs;