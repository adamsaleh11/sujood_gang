"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { Button } from "@/components/ui/button";
import type { SiteCopy } from "@/lib/content/copy";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  copy: SiteCopy;
};

export function SiteHeader({ copy }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="border-border/70 bg-background/88 sticky top-0 z-50 border-b backdrop-blur-xl">
      <a
        href="#main"
        className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2"
      >
        {copy.accessibility.skipToMain}
      </a>
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="focus-visible:ring-ring/50 flex min-h-11 items-center gap-3 rounded-lg focus-visible:ring-3 focus-visible:outline-none"
          onClick={closeMenu}
        >
          <Image
            src="/images/logo.png"
            alt={copy.brand.name}
            width={40}
            height={40}
            priority
            className="shadow-soft rounded-full"
          />
          <span className="flex flex-col leading-none">
            <span className="font-semibold tracking-normal">
              {copy.brand.name}
            </span>
            <span className="text-muted-foreground text-xs">
              {copy.brand.tagline}
            </span>
          </span>
        </Link>

        <nav
          aria-label={copy.accessibility.primaryNavigation}
          className="hidden items-center gap-1 md:flex"
        >
          {copy.nav.links.map((link) => (
            <Button
              key={link.id}
              nativeButton={false}
              variant="ghost"
              render={<Link href={link.href} />}
              className="min-h-11 px-3"
            >
              {link.label}
            </Button>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <Button
            nativeButton={false}
            render={
              <TrackedLink
                href={copy.hero.primaryCta.href}
                eventName="primary_cta_clicked"
                eventProperties={{ placement: "header" }}
              />
            }
            className="min-h-11 px-4"
          >
            {copy.hero.primaryCta.label}
          </Button>
        </div>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-label={
            isOpen ? copy.accessibility.closeMenu : copy.accessibility.openMenu
          }
          onClick={() => setIsOpen((current) => !current)}
          className="border-border bg-background text-foreground hover:bg-muted focus-visible:ring-ring/50 inline-flex size-11 items-center justify-center rounded-lg border transition-colors focus-visible:ring-3 focus-visible:outline-none md:hidden"
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <div
        className={cn(
          "border-border/70 duration-base grid border-t transition-[grid-template-rows] ease-[var(--ease-out-soft)] md:hidden",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <nav
            aria-label={copy.accessibility.primaryNavigation}
            className="flex flex-col gap-2 px-4 py-4"
          >
            {copy.nav.links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={closeMenu}
                className="hover:bg-muted focus-visible:ring-ring/50 min-h-11 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:outline-none"
              >
                {link.label}
              </Link>
            ))}
            <Button
              nativeButton={false}
              render={
                <TrackedLink
                  href={copy.hero.primaryCta.href}
                  eventName="primary_cta_clicked"
                  eventProperties={{ placement: "mobile_menu" }}
                  onClick={closeMenu}
                />
              }
              className="mt-2 min-h-11"
            >
              {copy.hero.primaryCta.label}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
