import Link from "next/link";

/* ==========================================================================
   TYPES
   ========================================================================== */

type CategoryType =
  | "TRADE"
  | "CONTRACTOR"
  | "LABOURER"
  | "MATERIAL"
  | "SUPPLIER";

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  href: string;
  type: CategoryType;
  availabilityLabel: string;
  icon: CategoryIconName;
  featured?: boolean;
}

type CategoryIconName =
  | "mason"
  | "carpenter"
  | "electrician"
  | "plumber"
  | "painter"
  | "welder"
  | "roofing"
  | "tiles"
  | "ceiling"
  | "glass"
  | "contractor"
  | "labourer"
  | "materials"
  | "supplier";

interface IconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

/* ==========================================================================
   CATEGORY DATA

   This remains local while the homepage uses development data. Later this
   list can be supplied from the database and ranked using Yartong search
   demand, provider availability and location.
   ========================================================================== */

const CATEGORIES: CategoryItem[] = [
  {
    id: "mason",
    name: "Masons",
    description:
      "Brickwork, plastering, concrete work and structural repairs.",
    href: "/workers?trade=mason",
    type: "TRADE",
    availabilityLabel: "Skilled providers",
    icon: "mason",
    featured: true,
  },
  {
    id: "carpenter",
    name: "Carpenters",
    description:
      "Doors, windows, furniture, roofing and custom woodwork.",
    href: "/workers?trade=carpenter",
    type: "TRADE",
    availabilityLabel: "Local professionals",
    icon: "carpenter",
    featured: true,
  },
  {
    id: "electrician",
    name: "Electricians",
    description:
      "Wiring, installations, repairs and electrical maintenance.",
    href: "/workers?trade=electrician",
    type: "TRADE",
    availabilityLabel: "Verified profiles",
    icon: "electrician",
    featured: true,
  },
  {
    id: "plumber",
    name: "Plumbers",
    description:
      "Pipelines, sanitary fittings, drainage and leakage repairs.",
    href: "/workers?trade=plumber",
    type: "TRADE",
    availabilityLabel: "Available services",
    icon: "plumber",
    featured: true,
  },
  {
    id: "painter",
    name: "Painters",
    description:
      "Interior, exterior, texture, polish and finishing services.",
    href: "/workers?trade=painter",
    type: "TRADE",
    availabilityLabel: "Professional finishing",
    icon: "painter",
  },
  {
    id: "welder",
    name: "Welders",
    description:
      "Gates, railings, steel fabrication and repair work.",
    href: "/workers?trade=welder",
    type: "TRADE",
    availabilityLabel: "Fabrication specialists",
    icon: "welder",
  },
  {
    id: "roofing",
    name: "Roofing",
    description:
      "Roof installation, repairs, waterproofing and sheet work.",
    href: "/workers?trade=roofing",
    type: "TRADE",
    availabilityLabel: "Roofing professionals",
    icon: "roofing",
  },
  {
    id: "tiles",
    name: "Tiles and Flooring",
    description:
      "Floor tiles, wall tiles, stone fitting and floor finishing.",
    href: "/workers?trade=tiles",
    type: "TRADE",
    availabilityLabel: "Flooring specialists",
    icon: "tiles",
  },
  {
    id: "false-ceiling",
    name: "False Ceiling",
    description:
      "Ceiling design, gypsum work, panels and interior finishing.",
    href: "/workers?trade=false-ceiling",
    type: "TRADE",
    availabilityLabel: "Interior specialists",
    icon: "ceiling",
  },
  {
    id: "glass",
    name: "Glass Work",
    description:
      "Windows, partitions, railings, storefronts and glass fitting.",
    href: "/workers?trade=glass",
    type: "TRADE",
    availabilityLabel: "Glass professionals",
    icon: "glass",
  },
  {
    id: "contractors",
    name: "Contractors",
    description:
      "Construction teams for houses, renovations and larger projects.",
    href: "/contractor",
    type: "CONTRACTOR",
    availabilityLabel: "Project management",
    icon: "contractor",
    featured: true,
  },
  {
    id: "labourers",
    name: "Labourers",
    description:
      "Daily-wage, short-term and contract labour support.",
    href: "/workers?type=labourer",
    type: "LABOURER",
    availabilityLabel: "Daily and contract work",
    icon: "labourer",
  },
  {
    id: "materials",
    name: "Construction Materials",
    description:
      "Cement, rebar, steel, roofing, pipes, tiles and more.",
    href: "/materials",
    type: "MATERIAL",
    availabilityLabel: "Compare nearby products",
    icon: "materials",
    featured: true,
  },
  {
    id: "suppliers",
    name: "Material Suppliers",
    description:
      "Discover verified shops, dealers, wholesalers and delivery options.",
    href: "/supplier",
    type: "SUPPLIER",
    availabilityLabel: "Business suppliers",
    icon: "supplier",
  },
];

/* ==========================================================================
   ICONS
   ========================================================================== */

function ArrowIcon({
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

function MasonIcon({
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
      <path d="M3 5h8v5H3z" />
      <path d="M13 5h8v5h-8z" />
      <path d="M7 12h8v5H7z" />
      <path d="M3 19h8v2H3z" />
      <path d="M13 19h8v2h-8z" />
    </svg>
  );
}

function CarpenterIcon({
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
      <path d="m4 20 7-7" />
      <path d="m10 4 10 10" />
      <path d="m8 6 2-2 10 10-2 2Z" />
      <path d="m3 21 3-1-2-2-1 3Z" />
    </svg>
  );
}

function ElectricianIcon({
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
      <path d="m13 2-7 11h6l-1 9 7-12h-6l1-8Z" />
    </svg>
  );
}

function PlumberIcon({
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
      <path d="M4 4v6h6" />
      <path d="M20 20v-6h-6" />
      <path d="M10 10h4v4" />
      <path d="M10 14H7a3 3 0 0 1-3-3v-1" />
      <path d="M14 10h3a3 3 0 0 1 3 3v1" />
    </svg>
  );
}

function PainterIcon({
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
      <rect x="3" y="4" width="13" height="6" rx="1" />
      <path d="M16 7h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-5" />
      <path d="M14 13v8" />
      <path d="M11 21h6" />
    </svg>
  );
}

function WelderIcon({
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
      <path d="M5 4h10v8H5z" />
      <path d="M8 12v5" />
      <path d="M12 12v5" />
      <path d="M6 21h8" />
      <path d="m18 5 1-2" />
      <path d="m19 9 2-1" />
      <path d="m18 12 2 2" />
    </svg>
  );
}

function RoofingIcon({
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
      <path d="m3 12 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function TilesIcon({
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
      <rect x="3" y="3" width="8" height="8" />
      <rect x="13" y="3" width="8" height="8" />
      <rect x="3" y="13" width="8" height="8" />
      <rect x="13" y="13" width="8" height="8" />
    </svg>
  );
}

function CeilingIcon({
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
      <path d="M3 5h18" />
      <path d="M5 5v6h14V5" />
      <path d="M8 11v4" />
      <path d="M16 11v4" />
      <path d="M6 15h12v4H6z" />
    </svg>
  );
}

function GlassIcon({
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
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M12 3v18" />
      <path d="M4 12h16" />
      <path d="m8 8 2-2" />
      <path d="m14 17 2-2" />
    </svg>
  );
}

function ContractorIcon({
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
      <path d="M4 21V8l8-5 8 5v13" />
      <path d="M8 21v-7h8v7" />
      <path d="M9 10h.01" />
      <path d="M15 10h.01" />
    </svg>
  );
}

function LabourerIcon({
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
      <circle cx="12" cy="7" r="3" />
      <path d="M5 21a7 7 0 0 1 14 0" />
      <path d="M8 7h8" />
      <path d="M9 4h6" />
    </svg>
  );
}

function MaterialsIcon({
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
      <path d="m12 3 8 4-8 4-8-4 8-4Z" />
      <path d="m4 12 8 4 8-4" />
      <path d="m4 17 8 4 8-4" />
    </svg>
  );
}

function SupplierIcon({
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

function getCategoryIcon(
  icon: CategoryIconName,
) {
  switch (icon) {
    case "mason":
      return MasonIcon;
    case "carpenter":
      return CarpenterIcon;
    case "electrician":
      return ElectricianIcon;
    case "plumber":
      return PlumberIcon;
    case "painter":
      return PainterIcon;
    case "welder":
      return WelderIcon;
    case "roofing":
      return RoofingIcon;
    case "tiles":
      return TilesIcon;
    case "ceiling":
      return CeilingIcon;
    case "glass":
      return GlassIcon;
    case "contractor":
      return ContractorIcon;
    case "labourer":
      return LabourerIcon;
    case "materials":
      return MaterialsIcon;
    case "supplier":
      return SupplierIcon;
  }
}

function getCategoryTypeLabel(
  type: CategoryType,
): string {
  switch (type) {
    case "TRADE":
      return "Trade";
    case "CONTRACTOR":
      return "Contractor";
    case "LABOURER":
      return "Labour";
    case "MATERIAL":
      return "Materials";
    case "SUPPLIER":
      return "Supplier";
  }
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export function CategoryGrid() {
  return (
    <section
      className="homepage-section homepage-section--surface"
      aria-labelledby="home-categories-title"
    >
      <div className="container">
        <div className="section-header">
          <div className="section-header__content">
            <span className="eyebrow">
              Explore Yartong
            </span>

            <h2
              id="home-categories-title"
              className="heading-2"
            >
              Find the right help for every stage of construction.
            </h2>

            <p className="section-description">
              Search skilled professionals, labour support,
              contractors, materials and suppliers from one
              local-first marketplace.
            </p>
          </div>

          <div className="section-header__actions">
            <Link
              className="button button--outline"
              href="/trades"
            >
              View all trades

              <ArrowIcon className="button__icon" />
            </Link>
          </div>
        </div>

        <div className="home-category-grid">
          {CATEGORIES.map((category) => {
            const CategoryIcon =
              getCategoryIcon(category.icon);

            return (
              <Link
                key={category.id}
                className="home-category"
                href={category.href}
                data-category-type={category.type}
                data-featured={category.featured ?? false}
              >
                <span className="home-category__icon">
                  <CategoryIcon
                    className="button__icon"
                  />
                </span>

                <span className="home-category__content">
                  <span className="home-category__topline">
                    <span className="home-category__name">
                      {category.name}
                    </span>

                    <span className="home-category__type">
                      {getCategoryTypeLabel(
                        category.type,
                      )}
                    </span>
                  </span>

                  <span className="home-category__description">
                    {category.description}
                  </span>

                  <span className="home-category__bottom">
                    <span className="home-category__count">
                      {category.availabilityLabel}
                    </span>

                    <ArrowIcon className="home-category__arrow" />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="home-category-summary">
          <div className="home-category-summary__content">
            <span className="home-category-summary__title">
              Cannot find what you need?
            </span>

            <span className="home-category-summary__description">
              Search for it anyway. Yartong records unmet
              demand so new trades and materials can be
              introduced as the platform grows.
            </span>
          </div>

          <Link
            className="button button--secondary"
            href="/workers"
          >
            Search all services

            <ArrowIcon className="button__icon" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CategoryGrid;