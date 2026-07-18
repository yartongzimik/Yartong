import Link from "next/link";

/* ==========================================================================
   TYPES
   ========================================================================== */

interface CtaPath {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  icon: CtaIconName;
  theme: "CUSTOMER" | "PROVIDER";
}

type CtaIconName =
  | "search"
  | "briefcase";

interface IconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

/* ==========================================================================
   CTA PATHS
   ========================================================================== */

const CTA_PATHS: CtaPath[] = [
  {
    id: "customer",
    eyebrow: "For customers",
    title: "Start your next project with better information.",
    description:
      "Discover skilled providers, labourers, contractors and material suppliers. Compare profiles, experience, ratings and availability before making contact.",
    primaryLabel: "Find a provider",
    primaryHref: "/workers",
    secondaryLabel: "Post a job",
    secondaryHref: "/post-job",
    icon: "search",
    theme: "CUSTOMER",
  },
  {
    id: "provider",
    eyebrow: "For professionals and businesses",
    title: "Turn your skills and business into a stronger digital presence.",
    description:
      "Create a professional profile, showcase your work, receive enquiries and build a reputation that can grow with every successful customer interaction.",
    primaryLabel: "Join Yartong",
    primaryHref: "/register",
    secondaryLabel: "Explore opportunities",
    secondaryHref: "/quick-jobs",
    icon: "briefcase",
    theme: "PROVIDER",
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

function SearchIcon({
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

function getCtaIcon(
  icon: CtaIconName,
) {
  switch (icon) {
    case "search":
      return SearchIcon;

    case "briefcase":
      return BriefcaseIcon;
  }
}

/* ==========================================================================
   CTA CARD
   ========================================================================== */

interface CtaCardProps {
  path: CtaPath;
}

function CtaCard({
  path,
}: CtaCardProps) {
  const Icon = getCtaIcon(path.icon);

  return (
    <article
      className="home-cta-card"
      data-theme={path.theme}
    >
      <div className="home-cta-card__icon">
        <Icon className="home-cta-card__icon-svg" />
      </div>

      <div className="home-cta-card__content">
        <span className="home-cta-card__eyebrow">
          {path.eyebrow}
        </span>

        <h3 className="home-cta-card__title">
          {path.title}
        </h3>

        <p className="home-cta-card__description">
          {path.description}
        </p>
      </div>

      <div className="home-cta-card__actions">
        <Link
          className="button button--primary"
          href={path.primaryHref}
        >
          {path.primaryLabel}

          <ArrowRightIcon className="button__icon" />
        </Link>

        <Link
          className="button button--outline"
          href={path.secondaryHref}
        >
          {path.secondaryLabel}
        </Link>
      </div>
    </article>
  );
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export function HomeCta() {
  return (
    <section
      className="homepage-section home-cta-section"
      aria-labelledby="home-cta-title"
    >
      <div className="container">
        <div className="home-cta-shell">
          <div className="home-cta-shell__glow" />

          <div className="home-cta-header">
            <span className="eyebrow">
              One marketplace. Two ways to grow.
            </span>

            <h2
              id="home-cta-title"
              className="heading-2"
            >
              Build, hire, work and grow with Yartong.
            </h2>

            <p className="section-description">
              Whether you need trusted people for a project
              or want more customers to discover your skills
              and business, Yartong is designed to make local
              construction services easier to find and trust.
            </p>
          </div>

          <div className="home-cta-grid">
            {CTA_PATHS.map((path) => (
              <CtaCard
                key={path.id}
                path={path}
              />
            ))}
          </div>

          <div className="home-cta-trust">
            <ShieldCheckIcon className="home-cta-trust__icon" />

            <p className="home-cta-trust__text">
              Yartong is being built around transparent
              profiles, meaningful verification, accountable
              marketplace activity and better information for
              everyone involved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeCta;