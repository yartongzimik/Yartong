"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { PLATFORM, ROUTES } from "@/lib/constants";
import { PUBLIC_NAVIGATION } from "@/lib/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <header className="site-header">
      <Container className="site-header__inner">
        <Link className="brand" href={ROUTES.home} aria-label={`${PLATFORM.name} home`}>
          <span className="brand__mark" aria-hidden="true">Y</span>
          <span><strong>{PLATFORM.name}</strong><small>Senapati construction marketplace</small></span>
        </Link>

        <nav className="site-header__nav" aria-label="Primary navigation">
          {PUBLIC_NAVIGATION.filter((item) => item.visibleToPublic).map((item) => (
            <Link key={item.id} href={item.href}>{item.label}</Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <ButtonLink href={ROUTES.login} variant="ghost" size="sm">Login</ButtonLink>
          <ButtonLink href={ROUTES.join} variant="primary" size="sm">Join Yartong</ButtonLink>
        </div>

        <Button
          aria-controls={menuId}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          className="site-header__menu-button"
          onClick={() => setIsOpen((current) => !current)}
          variant="outline"
          size="sm"
        >
          <span aria-hidden="true">{isOpen ? "Close" : "Menu"}</span>
        </Button>
      </Container>

      <div className="mobile-nav" data-open={isOpen} id={menuId}>
        <Container className="mobile-nav__panel">
          <nav aria-label="Mobile primary navigation">
            {PUBLIC_NAVIGATION.filter((item) => item.visibleToPublic).map((item) => (
              <Link key={item.id} href={item.href} onClick={() => setIsOpen(false)}>
                <span>{item.label}</span>
                {item.description ? <small>{item.description}</small> : null}
              </Link>
            ))}
          </nav>
          <div className="mobile-nav__actions">
            <ButtonLink href={ROUTES.login} variant="outline" onClick={() => setIsOpen(false)}>Login</ButtonLink>
            <ButtonLink href={ROUTES.join} onClick={() => setIsOpen(false)}>Join / Register</ButtonLink>
          </div>
        </Container>
      </div>
    </header>
  );
}
