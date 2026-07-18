import Link from "next/link";

/* ==========================================================================
   TYPES
   ========================================================================== */

type TrustFeatureTheme =
  | "VERIFICATION"
  | "REVIEWS"
  | "CONTACT"
  | "PRIVACY"
  | "ACCOUNTABILITY"
  | "REPORTING";

interface TrustFeature {
  id: string;
  title: string;
  description: string;
  theme: TrustFeatureTheme;
}

interface IconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

/* ==========================================================================
   TRUST FEATURES
   ========================================================================== */

const TRUST_FEATURES: TrustFeature[] = [
  {
    id: "verification",
    title: "Meaningful verification",
    description:
      "Yartong can distinguish verified identity, phone, business and platform trust signals instead of treating every profile the same.",
    theme: "VERIFICATION",
  },
  {
    id: "reviews",
    title: "Ratings built from real activity",
    description:
      "Reviews and performance signals help customers understand reliability, responsiveness and the quality of past work.",
    theme: "REVIEWS",
  },
  {
    id: "contact",
    title: "Platform-first contact",
    description:
      "Customers send the first request through Yartong so conversations begin in a structured, trackable way before contact details are shared.",
    theme: "CONTACT",
  },
  {
    id: "privacy",
    title: "Contact details stay private by default",
    description:
      "Phone numbers and other private details are not displayed openly on public profiles. Businesses can choose when to share them after contact begins.",
    theme: "PRIVACY",
  },
  {
    id: "accountability",
    title: "Marketplace accountability",
    description:
      "Response history, completed work, reviews and profile activity create a stronger record than an anonymous phone listing.",
    theme: "ACCOUNTABILITY",
  },
  {
    id: "reporting",
    title: "Reporting and moderation",
    description:
      "Customers and providers will have clear ways to report suspicious activity, misleading profiles and inappropriate behaviour.",
    theme: "REPORTING",
  },
];

/* ==========================================================================
   ICONS
   ========================================================================== */

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

function StarIcon({
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
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3Z" />
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

function LockIcon({
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
        x="5"
        y="10"
        width="14"
        height="11"
        rx="2"
      />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function ActivityIcon({
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
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </svg>
  );
}

function FlagIcon({
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
      <path d="M5 21V4" />
      <path d="M5 5h10l2 3-2 3H5" />
    </svg>
  );
}

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

/* ==========================================================================
   HELPERS
   ========================================================================== */

function getTrustFeatureIcon(
  theme: TrustFeatureTheme,
) {
  switch (theme) {
    case "VERIFICATION":
      return ShieldCheckIcon;

    case "REVIEWS":
      return StarIcon;

    case "CONTACT":
      return MessageIcon;

    case "PRIVACY":
      return LockIcon;

    case "ACCOUNTABILITY":
      return ActivityIcon;

    case "REPORTING":
      return FlagIcon;
  }
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export function TrustSafety() {
  return (
    <section
      className="homepage-section trust-safety-section"
      aria-labelledby="trust-safety-title"
    >
      <div className="container">
        <div className="trust-safety-layout">
          <div className="trust-safety-layout__content">
            <span className="eyebrow">
              Trust before price
            </span>

            <h2
              id="trust-safety-title"
              className="heading-2"
            >
              Better trust signals for local construction work.
            </h2>

            <p className="section-description">
              Yartong is designed to help people make better
              decisions before hiring, accepting work or doing
              business with someone they have never met.
            </p>

            <div className="trust-safety-principle">
              <div className="trust-safety-principle__icon">
                <ShieldCheckIcon className="button__icon" />
              </div>

              <div className="trust-safety-principle__content">
                <span className="trust-safety-principle__title">
                  Trust is layered, not binary.
                </span>

                <p className="trust-safety-principle__description">
                  A verified phone number does not automatically
                  mean someone is an excellent professional.
                  Yartong can combine verification, reviews,
                  responsiveness and marketplace performance to
                  give users a more complete picture.
                </p>
              </div>
            </div>

            <div className="trust-safety-layout__actions">
              <Link
                className="button button--primary"
                href="/trust"
              >
                Learn about trust and verification

                <ArrowRightIcon className="button__icon" />
              </Link>

              <Link
                className="button button--outline"
                href="/guidelines"
              >
                Community guidelines
              </Link>
            </div>
          </div>

          <div className="trust-safety-features">
            {TRUST_FEATURES.map(
              (feature) => {
                const Icon =
                  getTrustFeatureIcon(
                    feature.theme,
                  );

                return (
                  <article
                    key={feature.id}
                    className="trust-feature"
                    data-theme={feature.theme}
                  >
                    <div className="trust-feature__icon">
                      <Icon className="button__icon" />
                    </div>

                    <div className="trust-feature__content">
                      <h3 className="trust-feature__title">
                        {feature.title}
                      </h3>

                      <p className="trust-feature__description">
                        {feature.description}
                      </p>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustSafety;