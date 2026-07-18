import Link from "next/link";

import { PLATFORM, ROUTES } from "@/lib/constants";

/* ==========================================================================
   ICON TYPES
   ========================================================================== */

interface IconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

/* ==========================================================================
   ICONS
   ========================================================================== */

function InstagramIcon({
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
        y="3"
        width="18"
        height="18"
        rx="5"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
      />
      <circle
        cx="17.5"
        cy="6.5"
        r="0.75"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function FacebookIcon({
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
      <path d="M13.6 22v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V4.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.4V14h2.8v8h3.4Z" />
    </svg>
  );
}

function YoutubeIcon({
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
      <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.6 4.6 12 4.6 12 4.6s-5.6 0-7.5.5A3 3 0 0 0 2.4 7.2 31 31 0 0 0 1.9 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 7.5.5 7.5.5s5.6 0 7.5-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM10 15.4V8.6l5.9 3.4-5.9 3.4Z" />
    </svg>
  );
}

function LinkedinIcon({
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
      <path d="M5.3 7.9H2.2V22h3.1V7.9ZM3.7 2A1.8 1.8 0 1 0 3.7 5.6 1.8 1.8 0 0 0 3.7 2ZM22 13.9c0-4.3-2.3-6.3-5.4-6.3a4.7 4.7 0 0 0-4.2 2.3V7.9h-3V22h3.1v-7c0-1.8.3-3.6 2.6-3.6 2.2 0 2.3 2.1 2.3 3.8V22H22v-8.1Z" />
    </svg>
  );
}

/* ==========================================================================
   FOOTER DATA
   ========================================================================== */

const marketplaceLinks = [
  {
    label: "Find Workers",
    href: ROUTES.workers,
  },
  {
    label: "Find Materials",
    href: ROUTES.materials,
  },
  {
    label: "Quick Jobs",
    href: ROUTES.quickJobs,
  },
  {
    label: "Post a Job",
    href: ROUTES.postJob,
  },
  {
    label: "Advertise on Yartong",
    href: ROUTES.advertise,
  },
];

const joinLinks = [
  {
    label: "Register as Customer",
    href: `${ROUTES.register}?role=CUSTOMER`,
  },
  {
    label: "Become a Skilled Provider",
    href: `${ROUTES.register}?role=SKILLED_PROVIDER`,
  },
  {
    label: "Register as Labourer",
    href: `${ROUTES.register}?role=LABOURER`,
  },
  {
    label: "Register as Contractor",
    href: `${ROUTES.register}?role=CONTRACTOR`,
  },
  {
    label: "Register as Material Supplier",
    href: `${ROUTES.register}?role=MATERIAL_SUPPLIER`,
  },
];

const companyLinks = [
  {
    label: "About Yartong",
    href: "/about",
  },
  {
    label: "How Yartong Works",
    href: "/how-it-works",
  },
  {
    label: "Trust and Verification",
    href: "/trust",
  },
  {
    label: "Help Centre",
    href: "/help",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const legalLinks = [
  {
    label: "Terms of Service",
    href: "/terms",
  },
  {
    label: "Privacy Policy",
    href: "/privacy",
  },
  {
    label: "Cookie Policy",
    href: "/cookies",
  },
  {
    label: "Community Guidelines",
    href: "/guidelines",
  },
];

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="site-footer"
      aria-labelledby="site-footer-heading"
    >
      <h2
        id="site-footer-heading"
        className="sr-only"
      >
        Yartong site information
      </h2>

      <div className="container">
        <div className="site-footer__main">
          <section className="site-footer__brand">
            <Link
              className="site-footer__logo"
              href={ROUTES.home}
              aria-label="Yartong homepage"
            >
              Yartong
            </Link>

            <p className="site-footer__description">
              Yartong connects customers with skilled providers,
              labourers, contractors and construction-material
              suppliers. We are beginning in Senapati and building a
              platform designed to grow with local communities.
            </p>

            <div className="site-footer__socials">
              <a
                className="icon-button icon-button--ghost icon-button--round"
                href="#"
                aria-label="Yartong on Instagram"
                title="Instagram"
              >
                <InstagramIcon className="button__icon" />
              </a>

              <a
                className="icon-button icon-button--ghost icon-button--round"
                href="#"
                aria-label="Yartong on Facebook"
                title="Facebook"
              >
                <FacebookIcon className="button__icon" />
              </a>

              <a
                className="icon-button icon-button--ghost icon-button--round"
                href="#"
                aria-label="Yartong on YouTube"
                title="YouTube"
              >
                <YoutubeIcon className="button__icon" />
              </a>

              <a
                className="icon-button icon-button--ghost icon-button--round"
                href="#"
                aria-label="Yartong on LinkedIn"
                title="LinkedIn"
              >
                <LinkedinIcon className="button__icon" />
              </a>
            </div>

            <div className="stack stack--xs">
              <span className="text-caption">
                Support
              </span>

              <a
                className="text-link text-link--subtle"
                href={`mailto:${PLATFORM.supportEmail}`}
              >
                {PLATFORM.supportEmail}
              </a>
            </div>
          </section>

          <nav
            className="site-footer__column"
            aria-labelledby="footer-marketplace-heading"
          >
            <h3
              id="footer-marketplace-heading"
              className="site-footer__heading"
            >
              Marketplace
            </h3>

            {marketplaceLinks.map((link) => (
              <Link
                key={link.href}
                className="site-footer__link"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <nav
            className="site-footer__column"
            aria-labelledby="footer-join-heading"
          >
            <h3
              id="footer-join-heading"
              className="site-footer__heading"
            >
              Join Yartong
            </h3>

            {joinLinks.map((link) => (
              <Link
                key={link.href}
                className="site-footer__link"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <nav
            className="site-footer__column"
            aria-labelledby="footer-company-heading"
          >
            <h3
              id="footer-company-heading"
              className="site-footer__heading"
            >
              Company
            </h3>

            {companyLinks.map((link) => (
              <Link
                key={link.href}
                className="site-footer__link"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="site-footer__bottom">
          <p>
            © {currentYear} Yartong. All rights reserved.
          </p>

          <nav
            className="site-footer__legal"
            aria-label="Legal information"
          >
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                className="site-footer__link"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;