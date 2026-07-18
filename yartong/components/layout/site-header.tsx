"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { ROUTES } from "@/lib/constants";
import { PUBLIC_NAVIGATION } from "@/lib/navigation";

const primaryNavigation = [
  PUBLIC_NAVIGATION.find((item) => item.id === "find-workers"),
  { id: "find-contractors", label: "Find Contractors", href: ROUTES.trades },
  PUBLIC_NAVIGATION.find((item) => item.id === "materials"),
  PUBLIC_NAVIGATION.find((item) => item.id === "quick-jobs"),
  PUBLIC_NAVIGATION.find((item) => item.id === "advertise"),
].filter(Boolean) as { id: string; label: string; href: string }[];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href={ROUTES.home}
          className="text-2xl font-black tracking-tight text-emerald-800"
          onClick={closeMenu}
        >
          Yartong
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-5 lg:flex">
          {primaryNavigation.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="text-sm font-semibold text-slate-700 transition hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" href={ROUTES.login}>
            Login
          </Link>
          <Link className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2" href={ROUTES.join}>
            Join
          </Link>
        </div>

        <button
          type="button"
          aria-controls={menuId}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close main menu" : "Open main menu"}
          className="inline-flex items-center rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </div>

      <div id={menuId} hidden={!isOpen} className="border-t border-emerald-100 bg-white lg:hidden">
        <nav aria-label="Mobile navigation" className="mx-auto grid max-w-6xl gap-1 px-6 py-4">
          {primaryNavigation.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="rounded-lg px-3 py-3 font-semibold text-slate-800 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
          <Link href={ROUTES.login} className="rounded-lg px-3 py-3 font-semibold text-slate-800 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500" onClick={closeMenu}>
            Login
          </Link>
          <Link href={ROUTES.join} className="rounded-lg bg-emerald-700 px-3 py-3 font-semibold text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" onClick={closeMenu}>
            Join
          </Link>
        </nav>
      </div>
    </header>
  );
}
