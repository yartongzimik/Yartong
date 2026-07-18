/* ==========================================================================
   TYPES
   ========================================================================== */

type TestimonialRole =
  | "CUSTOMER"
  | "SKILLED_PROVIDER"
  | "CONTRACTOR"
  | "MATERIAL_SUPPLIER";

interface Testimonial {
  id: string;
  name: string;
  initials: string;
  role: TestimonialRole;
  roleLabel: string;
  location: string;
  rating: number;
  quote: string;
  outcome?: string;
  imageUrl?: string;
}

interface IconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

/* ==========================================================================
   DEVELOPMENT DATA

   These are illustrative testimonials for development only.
   Replace them with verified platform reviews once production data exists.
   ========================================================================== */

const TESTIMONIALS: Testimonial[] = [
  {
    id: "testimonial-001",
    name: "L. Pamei",
    initials: "LP",
    role: "CUSTOMER",
    roleLabel: "Homeowner",
    location: "Senapati Town",
    rating: 5,
    quote:
      "It was easier to compare people before contacting them. I could see ratings, experience and availability instead of asking around blindly.",
    outcome: "Found a mason and electrician for a home repair project.",
  },
  {
    id: "testimonial-002",
    name: "K. John",
    initials: "KJ",
    role: "SKILLED_PROVIDER",
    roleLabel: "Skilled Provider",
    location: "Senapati",
    rating: 5,
    quote:
      "A proper profile gives customers more confidence. The business insights are especially useful because I can understand how many people are viewing and contacting me.",
    outcome: "Uses Yartong to track enquiries and profile growth.",
  },
  {
    id: "testimonial-003",
    name: "Apei Construction",
    initials: "AC",
    role: "CONTRACTOR",
    roleLabel: "Contractor",
    location: "Senapati",
    rating: 5,
    quote:
      "For larger projects, customers need more than a phone number. A professional business page with project history and reviews makes the conversation much more serious.",
    outcome: "Receives project enquiries through a structured business profile.",
  },
  {
    id: "testimonial-004",
    name: "Senapati Building Centre",
    initials: "SB",
    role: "MATERIAL_SUPPLIER",
    roleLabel: "Material Supplier",
    location: "Senapati Town",
    rating: 4,
    quote:
      "Customers often ask for materials we do not stock. Demand insights would help us understand what products people are searching for before we expand inventory.",
    outcome: "Uses marketplace demand signals to plan product expansion.",
  },
];

/* ==========================================================================
   HELPERS
   ========================================================================== */

function getRoleClass(
  role: TestimonialRole,
): string {
  switch (role) {
    case "CUSTOMER":
      return "home-testimonial__role-badge--customer";

    case "SKILLED_PROVIDER":
      return "home-testimonial__role-badge--provider";

    case "CONTRACTOR":
      return "home-testimonial__role-badge--contractor";

    case "MATERIAL_SUPPLIER":
      return "home-testimonial__role-badge--supplier";
  }
}

/* ==========================================================================
   ICONS
   ========================================================================== */

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

function QuoteIcon({
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
      <path d="M9.7 5.5C5.4 7 3 10 3 14.5V20h7v-7H6.7c.3-2.3 1.8-3.9 4.5-4.9L9.7 5.5Zm10 0C15.4 7 13 10 13 14.5V20h7v-7h-3.3c.3-2.3 1.8-3.9 4.5-4.9l-1.5-2.6Z" />
    </svg>
  );
}

/* ==========================================================================
   TESTIMONIAL CARD
   ========================================================================== */

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({
  testimonial,
}: TestimonialCardProps) {
  const roleClass =
    getRoleClass(testimonial.role);

  return (
    <article className="home-testimonial">
      <div className="home-testimonial__top">
        <QuoteIcon className="home-testimonial__quote-icon" />

        <div
          className="home-testimonial__rating"
          aria-label={`${testimonial.rating} out of 5 stars`}
        >
          {Array.from(
            {
              length: 5,
            },
            (_, index) => (
              <StarIcon
                key={`${testimonial.id}-star-${index}`}
                className={
                  index < testimonial.rating
                    ? "home-testimonial__star home-testimonial__star--active"
                    : "home-testimonial__star"
                }
              />
            ),
          )}
        </div>
      </div>

      <blockquote className="home-testimonial__quote">
        “{testimonial.quote}”
      </blockquote>

      {testimonial.outcome ? (
        <p className="home-testimonial__outcome">
          {testimonial.outcome}
        </p>
      ) : null}

      <div className="home-testimonial__author">
        <div className="home-testimonial__avatar">
          {testimonial.imageUrl ? (
            <img
              src={testimonial.imageUrl}
              alt={`${testimonial.name} profile`}
              width={48}
              height={48}
            />
          ) : (
            <span
              className="home-testimonial__avatar-fallback"
              aria-hidden="true"
            >
              {testimonial.initials}
            </span>
          )}
        </div>

        <div className="home-testimonial__identity">
          <span className="home-testimonial__name">
            {testimonial.name}
          </span>

          <span
            className={`home-testimonial__role-badge ${roleClass}`}
          >
            {testimonial.roleLabel}
          </span>

          <span className="home-testimonial__location">
            {testimonial.location}
          </span>
        </div>
      </div>
    </article>
  );
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export function Testimonials() {
  return (
    <section
      className="homepage-section homepage-section--surface"
      aria-labelledby="home-testimonials-title"
    >
      <div className="container">
        <div className="section-header">
          <div className="section-header__content">
            <span className="eyebrow">
              Built around real marketplace needs
            </span>

            <h2
              id="home-testimonials-title"
              className="heading-2"
            >
              Better information creates better decisions.
            </h2>

            <p className="section-description">
              Yartong is designed to improve how customers,
              workers, contractors and suppliers find each
              other, communicate and build long-term trust.
            </p>
          </div>
        </div>

        <div className="home-testimonials">
          {TESTIMONIALS.map(
            (testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
              />
            ),
          )}
        </div>

        <p className="home-testimonials__disclaimer">
          Testimonials shown during development are illustrative.
          Production reviews will come from verified Yartong
          interactions and completed marketplace activity.
        </p>
      </div>
    </section>
  );
}

export default Testimonials;