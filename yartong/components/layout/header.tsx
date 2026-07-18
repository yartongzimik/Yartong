"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

import { PLATFORM, ROUTES } from "@/lib/constants";
import { PUBLIC_NAVIGATION, type NavigationItem } from "@/lib/navigation";

const navFocusStyles = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-200";

const contractorNavigationItem: NavigationItem = {
  id: "find-contractors",
  label: "Find Contractors",
  href: ROUTES.trades,
  description: "Browse local contractors and project teams.",
  visibleToPublic: true,
};

const primaryNavigationIds = [
  "find-workers",
  "find-contractors",
  "materials",
  "quick-jobs",
  "advertise",
];

function getPrimaryNavigation() {
  const publicNavigationById = new Map(PUBLIC_NAVIGATION.map((item) => [item.id, item]));

  return primaryNavigationIds.map((id) => {
    if (id === contractorNavigationItem.id) {
      return contractorNavigationItem;
    }

    const item = publicNavigationById.get(id);

    if (!item) {
      throw new Error(`Missing public navigation item: ${id}`);
    }

    return item;
  });
}

const primaryNavigation = getPrimaryNavigation();

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("keydown", closeOnEscape);

    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07050D]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href={ROUTES.home} className={`text-2xl font-black tracking-tight text-white ${navFocusStyles}`} onClick={closeMenu}>
          {PLATFORM.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 text-sm font-medium text-white/70 lg:flex">
          {primaryNavigation.map((item) => (
            <Link key={item.id} className={`transition hover:text-white ${navFocusStyles}`} href={item.href}>
              {item.label === "Find Materials" ? "Materials" : item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link className={`text-sm font-semibold text-white/75 transition hover:text-white ${navFocusStyles}`} href={ROUTES.login}>Login</Link>
          <Link className={`rounded-full bg-white px-4 py-2 text-sm font-bold text-[#180722] shadow-lg shadow-fuchsia-500/20 transition hover:bg-fuchsia-100 ${navFocusStyles}`} href={ROUTES.join}>Join</Link>
        </div>

        <button
          type="button"
          aria-controls={menuId}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className={`inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10 lg:hidden ${navFocusStyles}`}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </div>

      <div id={menuId} className={`${isMenuOpen ? "block" : "hidden"} border-t border-white/10 bg-[#100719] px-6 py-5 shadow-2xl shadow-fuchsia-950/40 lg:hidden`}>
        <nav aria-label="Mobile primary" className="mx-auto flex max-w-7xl flex-col gap-2 text-sm font-bold text-white/80">
          {primaryNavigation.map((item) => (
            <Link key={item.id} className={`rounded-2xl px-4 py-3 transition hover:bg-white/10 hover:text-white ${navFocusStyles}`} href={item.href} onClick={closeMenu}>
              {item.label === "Find Materials" ? "Materials" : item.label}
            </Link>
          ))}
          <div className="mt-3 grid gap-2 border-t border-white/10 pt-4">
            <Link className={`rounded-2xl px-4 py-3 transition hover:bg-white/10 hover:text-white ${navFocusStyles}`} href={ROUTES.login} onClick={closeMenu}>Login</Link>
            <Link className={`rounded-2xl bg-white px-4 py-3 text-[#180722] shadow-lg shadow-fuchsia-500/20 transition hover:bg-fuchsia-100 ${navFocusStyles}`} href={ROUTES.join} onClick={closeMenu}>Join</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
