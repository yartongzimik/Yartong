import Link from "next/link";

/* ==========================================================================
   TYPES
   ========================================================================== */

type SupplierVerification =
  | "VERIFIED"
  | "PREMIUM"
  | "STANDARD";

type DeliveryStatus =
  | "AVAILABLE"
  | "LIMITED"
  | "PICKUP_ONLY";

interface FeaturedSupplier {
  id: string;
  businessName: string;
  ownerName: string;
  initials: string;
  location: string;
  description: string;
  categories: string[];
  productCount: number;
  completedOrders: number;
  rating: number;
  reviewCount: number;
  responseRate: number;
  verification: SupplierVerification;
  deliveryStatus: DeliveryStatus;
  deliveryLabel: string;
  minimumOrder?: number;
  profileHref: string;
  imageUrl?: string;
}

interface IconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

/* ==========================================================================
   DEVELOPMENT DATA
   Replace this array with database/API results later without changing the UI.
   ========================================================================== */

const FEATURED_SUPPLIERS: FeaturedSupplier[] = [
  {
    id: "supplier-001",
    businessName: "Senapati Build Mart",
    ownerName: "P. Danii",
    initials: "SB",
    location: "Senapati Town",
    description:
      "Construction materials for residential projects, repairs and contractor supply requirements.",
    categories: [
      "Cement",
      "Steel",
      "Rebar",
      "Roofing",
    ],
    productCount: 128,
    completedOrders: 314,
    rating: 4.9,
    reviewCount: 76,
    responseRate: 96,
    verification: "PREMIUM",
    deliveryStatus: "AVAILABLE",
    deliveryLabel: "Local delivery available",
    minimumOrder: 2000,
    profileHref: "/supplier/supplier-001",
  },
  {
    id: "supplier-002",
    businessName: "Northern Hardware & Glass",
    ownerName: "K. Poumai",
    initials: "NH",
    location: "Mao",
    description:
      "Hardware, glass, aluminium sections and interior finishing materials for homes and businesses.",
    categories: [
      "Glass",
      "Hardware",
      "Aluminium",
      "Tools",
    ],
    productCount: 94,
    completedOrders: 221,
    rating: 4.8,
    reviewCount: 49,
    responseRate: 92,
    verification: "VERIFIED",
    deliveryStatus: "LIMITED",
    deliveryLabel: "Delivery on selected orders",
    minimumOrder: 3000,
    profileHref: "/supplier/supplier-002",
  },
  {
    id: "supplier-003",
    businessName: "Hill District Interiors",
    ownerName: "R. Zeliang",
    initials: "HD",
    location: "Senapati",
    description:
      "False ceiling, wall panels, lighting accessories and interior finishing products.",
    categories: [
      "False Ceiling",
      "Panels",
      "Lighting",
      "Interior",
    ],
    productCount: 71,
    completedOrders: 167,
    rating: 4.7,
    reviewCount: 38,
    responseRate: 89,
    verification: "VERIFIED",
    deliveryStatus: "PICKUP_ONLY",
    deliveryLabel: "Store pickup available",
    profileHref: "/supplier/supplier-003",
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

function getVerificationLabel(
  verification: SupplierVerification,
): string {
  switch (verification) {
    case "PREMIUM":
      return "Premium supplier";

    case "VERIFIED":
      return "Verified supplier";

    case "STANDARD":
      return "Supplier";
  }
}

function getDeliveryClass(
  deliveryStatus: DeliveryStatus,
): string {
  switch (deliveryStatus) {
    case "AVAILABLE":
      return "supplier-card__delivery--available";

    case "LIMITED":
      return "supplier-card__delivery--limited";

    case "PICKUP_ONLY":
      return "supplier-card__delivery--pickup";
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

function DeliveryIcon({
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
      <path d="M3 6h11v11H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle
        cx="7"
        cy="19"
        r="2"
      />
      <circle
        cx="18"
        cy="19"
        r="2"
      />
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

function StoreIcon({
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
      <path d="M3 9h18" />
      <path d="M5 9v11h14V9" />
      <path d="m4 4-1 5h18l-1-5H4Z" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

/* ==========================================================================
   SUPPLIER CARD
   ========================================================================== */

interface SupplierCardProps {
  supplier: FeaturedSupplier;
}

function SupplierCard({
  supplier,
}: SupplierCardProps) {
  const verificationLabel =
    getVerificationLabel(
      supplier.verification,
    );

  const deliveryClass =
    getDeliveryClass(
      supplier.deliveryStatus,
    );

  return (
    <article className="card card--interactive supplier-card">
      <div className="card__body">
        <div className="supplier-card__header">
          <div className="supplier-card__logo">
            {supplier.imageUrl ? (
              <img
                src={supplier.imageUrl}
                alt={`${supplier.businessName} logo`}
                width={60}
                height={60}
              />
            ) : (
              <span
                className="supplier-card__logo-fallback"
                aria-hidden="true"
              >
                {supplier.initials}
              </span>
            )}
          </div>

          <div className="supplier-card__identity">
            <div className="supplier-card__name-row">
              <Link
                className="supplier-card__name"
                href={supplier.profileHref}
              >
                {supplier.businessName}
              </Link>

              {supplier.verification !== "STANDARD" ? (
                <>
                  <VerifiedIcon
                    className="supplier-card__verified-icon"
                  />

                  <span className="sr-only">
                    {verificationLabel}
                  </span>
                </>
              ) : null}
            </div>

            <span className="supplier-card__owner">
              Managed by {supplier.ownerName}
            </span>

            <span className="supplier-card__location">
              <LocationIcon className="supplier-card__meta-icon" />

              {supplier.location}
            </span>
          </div>
        </div>

        <div className="supplier-card__summary">
          <div className="supplier-card__badges">
            <span
              className="supplier-card__verification"
              data-verification={supplier.verification}
            >
              {verificationLabel}
            </span>

            <span
              className={`supplier-card__delivery ${deliveryClass}`}
            >
              <DeliveryIcon className="supplier-card__meta-icon" />

              {supplier.deliveryLabel}
            </span>
          </div>

          <p className="supplier-card__description text-clamp-3">
            {supplier.description}
          </p>

          <div className="supplier-card__categories">
            {supplier.categories.map(
              (category) => (
                <span
                  key={category}
                  className="supplier-card__category"
                >
                  {category}
                </span>
              ),
            )}
          </div>

          <div className="supplier-card__rating-row">
            <span className="supplier-card__rating">
              <StarIcon className="supplier-card__star" />

              <strong>
                {supplier.rating.toFixed(1)}
              </strong>

              <span>
                ({supplier.reviewCount} reviews)
              </span>
            </span>

            {supplier.minimumOrder ? (
              <span className="supplier-card__minimum">
                Minimum order{" "}
                {formatCurrency(
                  supplier.minimumOrder,
                )}
              </span>
            ) : null}
          </div>

          <div className="supplier-card__stats">
            <div className="worker-card__metric">
              <span className="worker-card__metric-value">
                {supplier.productCount}
              </span>

              <span className="worker-card__metric-label">
                Products listed
              </span>
            </div>

            <div className="worker-card__metric">
              <span className="worker-card__metric-value">
                {supplier.completedOrders}
              </span>

              <span className="worker-card__metric-label">
                Orders completed
              </span>
            </div>

            <div className="worker-card__metric">
              <span className="worker-card__metric-value">
                {supplier.responseRate}%
              </span>

              <span className="worker-card__metric-label">
                Response rate
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card__footer supplier-card__footer">
        <Link
          className="button button--outline"
          href={supplier.profileHref}
        >
          View store
        </Link>

        <Link
          className="button button--primary"
          href={`/messages?recipient=${supplier.id}&intent=quotation`}
        >
          <MessageIcon className="button__icon" />

          Request quotation
        </Link>
      </div>
    </article>
  );
}

/* ==========================================================================
   SECTION
   ========================================================================== */

export function FeaturedSuppliers() {
  return (
    <section
      className="homepage-section homepage-section--surface"
      aria-labelledby="featured-suppliers-title"
    >
      <div className="container">
        <div className="section-header">
          <div className="section-header__content">
            <span className="eyebrow">
              Materials and suppliers
            </span>

            <h2
              id="featured-suppliers-title"
              className="heading-2"
            >
              Source construction materials with greater confidence.
            </h2>

            <p className="section-description">
              Compare local suppliers, product categories,
              ratings, delivery options, response performance
              and order history before requesting quotations.
            </p>
          </div>

          <div className="section-header__actions">
            <Link
              className="button button--outline"
              href="/materials"
            >
              Explore materials

              <ArrowRightIcon className="button__icon" />
            </Link>
          </div>
        </div>

        <div className="home-featured-grid">
          {FEATURED_SUPPLIERS.map(
            (supplier) => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
              />
            ),
          )}
        </div>

        <div className="featured-suppliers-note">
          <div className="featured-suppliers-note__icon">
            <StoreIcon className="button__icon" />
          </div>

          <div className="featured-suppliers-note__content">
            <span className="featured-suppliers-note__title">
              Sell construction materials on Yartong
            </span>

            <span className="featured-suppliers-note__description">
              Create a professional supplier profile, list
              products, receive quotation requests and track
              customer demand through business analytics.
            </span>
          </div>

          <Link
            className="button button--secondary"
            href="/register?role=MATERIAL_SUPPLIER"
          >
            Register as supplier
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedSuppliers;