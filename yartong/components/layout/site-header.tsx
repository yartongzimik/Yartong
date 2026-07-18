"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getPublicNavigation,
} from "@/lib/navigation";
import { ROUTES } from "@/lib/constants";

/* ==========================================================================
   TYPES
   ========================================================================== */

interface IconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

/* ==========================================================================
   ICONS
   Inline SVG avoids introducing an icon-library dependency at this stage.
   ========================================================================== */

function MenuIcon({
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
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CloseIcon({
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
    >
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
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

function isRouteActive(
  pathname: string,
  href: string,
): boolean {
  if (href === ROUTES.home) {
    return pathname === ROUTES.home;
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export function SiteHeader() {
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] =
    useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const closeButtonRef =
    useRef<HTMLButtonElement>(null);

  const mobileMenuButtonRef =
    useRef<HTMLButtonElement>(null);

  const publicNavigation =
    getPublicNavigation(null);

  /* ------------------------------------------------------------------------
     Header scroll state
     ------------------------------------------------------------------------ */

  useEffect(() => {
    function updateHeaderState() {
      setIsScrolled(window.scrollY > 12);
    }

    updateHeaderState();

    window.addEventListener(
      "scroll",
      updateHeaderState,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateHeaderState,
      );
    };
  }, []);

  /* ------------------------------------------------------------------------
     Close mobile navigation after route changes
     ------------------------------------------------------------------------ */

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  /* ------------------------------------------------------------------------
     Mobile menu focus, Escape handling and background scroll lock
     ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.removeAttribute(
        "data-scroll-locked",
      );

      return;
    }

    document.body.setAttribute(
      "data-scroll-locked",
      "true",
    );

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);

        window.setTimeout(() => {
          mobileMenuButtonRef.current?.focus();
        }, 0);
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.clearTimeout(focusTimer);

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.removeAttribute(
        "data-scroll-locked",
      );
    };
  }, [isMobileMenuOpen]);

  function openMobileMenu() {
    setIsMobileMenuOpen(true);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);

    window.setTimeout(() => {
      mobileMenuButtonRef.current?.focus();
    }, 0);
  }

  return (
    <>
      <header
        className="site-header"
        data-scrolled={isScrolled}
      >
        <div className="container site-header__inner">
          <Link
            className="site-header__brand"
            href={ROUTES.home}
            aria-label="Yartong homepage"
          >
            Yartong
          </Link>

          <nav
            className="site-header__navigation"
            aria-label="Primary navigation"
          >
            {publicNavigation.map((item) => {
              const isActive = isRouteActive(
                pathname,
                item.href,
              );

              return (
                <Link
                  key={item.id}
                  className="site-header__link"
                  href={item.href}
                  aria-current={
                    isActive
                      ? "page"
                      : undefined
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="site-header__actions">
            <Link
              className="button button--ghost"
              href={ROUTES.login}
            >
              Login
            </Link>

            <Link
              className="button button--primary"
              href={ROUTES.join}
            >
              Join Yartong
            </Link>

            <button
              ref={mobileMenuButtonRef}
              className="icon-button site-header__mobile-menu"
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={openMobileMenu}
            >
              <MenuIcon
                className="button__icon"
              />
            </button>
          </div>
        </div>
      </header>

      <button
        className="mobile-navigation-backdrop"
        type="button"
        aria-label="Close navigation menu"
        tabIndex={
          isMobileMenuOpen
            ? 0
            : -1
        }
        data-open={isMobileMenuOpen}
        onClick={closeMobileMenu}
      />

      <aside
        id="mobile-navigation"
        className="mobile-navigation"
        data-open={isMobileMenuOpen}
        aria-hidden={!isMobileMenuOpen}
        aria-label="Mobile navigation"
      >
        <div className="mobile-navigation__header">
          <Link
            className="site-header__brand"
            href={ROUTES.home}
            onClick={closeMobileMenu}
          >
            Yartong
          </Link>

          <button
            ref={closeButtonRef}
            className="icon-button"
            type="button"
            aria-label="Close navigation menu"
            onClick={closeMobileMenu}
          >
            <CloseIcon
              className="button__icon"
            />
          </button>
        </div>

        <nav
          className="mobile-navigation__body"
          aria-label="Mobile primary navigation"
        >
          {publicNavigation.map((item) => {
            const isActive = isRouteActive(
              pathname,
              item.href,
            );

            return (
              <Link
                key={item.id}
                className="mobile-navigation__link"
                href={item.href}
                aria-current={
                  isActive
                    ? "page"
                    : undefined
                }
                tabIndex={
                  isMobileMenuOpen
                    ? 0
                    : -1
                }
                onClick={closeMobileMenu}
              >
                <span>{item.label}</span>

                <ArrowRightIcon
                  className="button__icon"
                />
              </Link>
            );
          })}
        </nav>

        <div className="mobile-navigation__footer">
          <Link
            className="button button--outline button--full"
            href={ROUTES.login}
            tabIndex={
              isMobileMenuOpen
                ? 0
                : -1
            }
            onClick={closeMobileMenu}
          >
            Login
          </Link>

          <Link
            className="button button--primary button--full"
            href={ROUTES.join}
            tabIndex={
              isMobileMenuOpen
                ? 0
                : -1
            }
            onClick={closeMobileMenu}
          >
            Choose account type
          </Link>
        </div>
      </aside>
    </>
  );
}

export default SiteHeader;