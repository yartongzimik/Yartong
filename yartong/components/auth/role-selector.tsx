"use client";

import Link from "next/link";
import {
  useRouter,
} from "next/navigation";

/* ==========================================================================
   TYPES
   ========================================================================== */

type RegistrationRole =
  | "CUSTOMER"
  | "SKILLED_PROVIDER"
  | "LABOURER"
  | "CONTRACTOR"
  | "MATERIAL_SUPPLIER";

interface RegistrationRoleOption {
  id: RegistrationRole;
  title: string;
  description: string;
  benefits: string[];
  href: string;
  icon:
    | "customer"
    | "provider"
    | "labourer"
    | "contractor"
    | "supplier";
  featured?: boolean;
}

interface IconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

/* ==========================================================================
   REGISTRATION OPTIONS
   ========================================================================== */

const REGISTRATION_ROLES: RegistrationRoleOption[] = [
  {
    id: "CUSTOMER",
    title: "Customer",
    description:
      "Find workers, contractors and materials, post jobs and manage your projects.",
    benefits: [
      "Post jobs and Quick Jobs",
      "Send hiring requests",
      "Save providers and suppliers",
      "Manage quotations and conversations",
    ],
    href: "/register/customer",
    icon: "customer",
    featured: true,
  },
  {
    id: "SKILLED_PROVIDER",
    title: "Skilled Provider",
    description:
      "Create a professional profile for your trade skills and grow your customer reach.",
    benefits: [
      "Showcase skills and portfolio",
      "Receive customer enquiries",
      "Apply for relevant opportunities",
      "Access business performance insights",
    ],
    href: "/register/provider",
    icon: "provider",
  },
  {
    id: "LABOURER",
    title: "Labourer",
    description:
      "Register for daily-wage, short-term and contract work opportunities.",
    benefits: [
      "Set work availability",
      "Receive suitable work opportunities",
      "Build your performance record",
      "Develop ratings and work history",
    ],
    href: "/register/labourer",
    icon: "labourer",
  },
  {
    id: "CONTRACTOR",
    title: "Contractor",
    description:
      "Build a professional business presence and manage larger project opportunities.",
    benefits: [
      "Showcase completed projects",
      "Present team capabilities",
      "Receive quotation requests",
      "Track business growth and enquiries",
    ],
    href: "/register/contractor",
    icon: "contractor",
  },
  {
    id: "MATERIAL_SUPPLIER",
    title: "Material Supplier",
    description:
      "List construction materials, receive enquiries and understand customer demand.",
    benefits: [
      "Create a supplier storefront",
      "Manage products and inventory",
      "Receive quotation requests",
      "Access business and demand insights",
    ],
    href: "/register/supplier",
    icon: "supplier",
  },
];

/* ==========================================================================
   ICONS
   ========================================================================== */

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
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0" />
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
      <path d="M14 6 4 16l4 4L18 10" />
      <path d="m12 4 2-2 8 8-2 2" />
      <path d="m4 16-2 6 6-2" />
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

function CheckIcon({
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

/* ==========================================================================
   HELPERS
   ========================================================================== */

function getRoleIcon(
  icon: RegistrationRoleOption["icon"],
) {
  switch (icon) {
    case "customer":
      return CustomerIcon;

    case "provider":
      return ProviderIcon;

    case "labourer":
      return LabourerIcon;

    case "contractor":
      return ContractorIcon;

    case "supplier":
      return SupplierIcon;
  }
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export function RoleSelector() {
  const router = useRouter();

  function selectRole(
    option: RegistrationRoleOption,
  ) {
    /*
     * The query parameter gives us a consistent role hint
     * for future analytics and onboarding continuation.
     */
    router.push(
      `${option.href}?role=${option.id}`,
    );
  }

  return (
    <div className="auth-role-selector">
      <div className="auth-role-selector__grid">
        {REGISTRATION_ROLES.map(
          (option) => {
            const Icon =
              getRoleIcon(option.icon);

            return (
              <article
                key={option.id}
                className="auth-role-card"
                data-role={option.id}
                data-featured={
                  option.featured ?? false
                }
              >
                {option.featured ? (
                  <span className="auth-role-card__recommended">
                    Most common
                  </span>
                ) : null}

                <div className="auth-role-card__icon">
                  <Icon className="auth-role-card__icon-svg" />
                </div>

                <div className="auth-role-card__content">
                  <h2 className="auth-role-card__title">
                    {option.title}
                  </h2>

                  <p className="auth-role-card__description">
                    {option.description}
                  </p>
                </div>

                <ul className="auth-role-card__benefits">
                  {option.benefits.map(
                    (benefit) => (
                      <li
                        key={benefit}
                        className="auth-role-card__benefit"
                      >
                        <CheckIcon className="auth-role-card__check" />

                        <span>
                          {benefit}
                        </span>
                      </li>
                    ),
                  )}
                </ul>

                <button
                  className="button button--outline button--full"
                  type="button"
                  onClick={() => {
                    selectRole(option);
                  }}
                >
                  Continue as {option.title}

                  <ArrowRightIcon className="button__icon" />
                </button>
              </article>
            );
          },
        )}
      </div>

      <div className="auth-role-selector__footer">
        <span>
          Already have a Yartong account?
        </span>

        <Link
          className="text-link"
          href="/login"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default RoleSelector;