"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  nav,
  navFr,
  QUOTE_PATH,
  QUOTE_PATH_FR,
  getLocale,
  otherLocaleHref,
  type NavItem,
} from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const locale = getLocale(pathname);
  const isFr = locale === "fr";
  const navItems = isFr ? navFr : nav;
  const quotePath = isFr ? QUOTE_PATH_FR : QUOTE_PATH;
  const homeHref = isFr ? "/fr" : "/";
  const quoteLabel = isFr ? "Demander une soumission" : "Get a Quote";
  const otherHref = otherLocaleHref(pathname);

  // Keep the <html lang> attribute in sync with the visible locale. Root
  // layout can only render a single static <html> tag, so this is the
  // lightweight, static-export-friendly way to correct it per route.
  useEffect(() => {
    document.documentElement.lang = isFr ? "fr-CA" : "en-CA";
  }, [isFr]);

  // Close menus on route change.
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href={homeHref} className="flex shrink-0 items-center gap-2" aria-label="O'land Stations home">
          <Image src="/images/shared/brand/oland-alone.png" alt="O'land" width={120} height={40} priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <DesktopNavItem
              key={item.label}
              item={item}
              open={openDropdown === item.label}
              onOpen={() => setOpenDropdown(item.label)}
              onClose={() => setOpenDropdown((cur) => (cur === item.label ? null : cur))}
            />
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          <LanguageToggle isFr={isFr} otherHref={otherHref} className="hidden sm:inline-block" />
          <Link
            href={quotePath}
            className="hidden rounded-full bg-blue px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-blue/90 sm:inline-flex"
          >
            {quoteLabel}
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-ink/10 bg-white px-4 pb-8 pt-2 lg:hidden"
        >
          <nav className="flex flex-col" aria-label="Mobile">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="border-b border-ink/5 py-2">
                  <p className="px-2 py-2 text-xs font-bold uppercase tracking-widest text-steel">
                    {item.label}
                  </p>
                  <div className="flex flex-col">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="rounded-md px-4 py-2.5 text-base font-medium text-ink hover:bg-offwhite"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className="border-b border-ink/5 px-2 py-3.5 text-base font-semibold text-ink hover:bg-offwhite"
                >
                  {item.label}
                </Link>
              ),
            )}
            <Link
              href={quotePath}
              className="mt-5 inline-flex items-center justify-center rounded-full bg-blue px-6 py-3 text-sm font-bold uppercase tracking-wide text-white"
            >
              {quoteLabel}
            </Link>
            <LanguageToggle isFr={isFr} otherHref={otherHref} className="mt-4 px-2" />
          </nav>
        </div>
      )}
    </header>
  );
}

function DesktopNavItem({
  item,
  open,
  onOpen,
  onClose,
}: {
  item: NavItem;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  if (!item.children) {
    return (
      <Link
        href={item.href!}
        className="rounded-md px-3 py-2 text-sm font-semibold text-ink transition-colors hover:text-coral"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-ink transition-colors hover:text-coral"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => (open ? onClose() : onOpen())}
        onFocus={onOpen}
      >
        {item.label}
        <ChevronDown className={open ? "rotate-180" : ""} />
      </button>
      {open && (
        <div className="absolute left-0 top-full min-w-[14rem] pt-2">
          <div className="rounded-xl border border-ink/10 bg-white p-2 shadow-lg shadow-ink/5">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-offwhite hover:text-coral"
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LanguageToggle({
  isFr,
  otherHref,
  className = "",
}: {
  isFr: boolean;
  otherHref: string;
  className?: string;
}) {
  return (
    <div className={`text-sm font-bold ${className}`} aria-label="Language">
      {isFr ? (
        <Link href={otherHref} className="text-steel hover:text-coral" lang="en" hrefLang="en">
          EN
        </Link>
      ) : (
        <span className="text-coral" aria-current="true">
          EN
        </span>
      )}
      <span className="mx-1 text-ink/30">/</span>
      {isFr ? (
        <span className="text-coral" aria-current="true">
          FR
        </span>
      ) : (
        <Link href={otherHref} className="text-steel hover:text-coral" lang="fr" hrefLang="fr">
          FR
        </Link>
      )}
    </div>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 transition-transform ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
