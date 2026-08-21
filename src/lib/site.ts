// Site-wide constants: navigation, social links, contact details.
// Single source of truth so header/footer/pages stay in sync.

export const QUOTE_PATH = "/get-quote";
export const QUOTE_PATH_FR = "/fr/get-quote";

export type Locale = "en" | "fr";

// English canonical path -> French canonical path, for every route that
// exists in both locales. Routes without a French counterpart (e.g.
// /give-back-act) simply aren't listed here.
export const LOCALIZED_ROUTES: ReadonlyArray<readonly [string, string]> = [
  ["/", "/fr"],
  ["/our-water-solutions", "/fr/our-water-solutions"],
  ["/our-impact", "/fr/our-impact"],
  ["/what-we-do", "/fr/what-we-do"],
  ["/read-me", "/fr/read-me"],
  ["/partners", "/fr/partners"],
  ["/news-about-sustainability", "/fr/news-about-sustainability"],
  ["/get-quote", "/fr/get-quote"],
  ["/contact-1", "/fr/contact-1"],
  ["/faqs", "/fr/faqs"],
  ["/cookies-policy", "/fr/cookies-policy"],
];

export function getLocale(pathname: string): Locale {
  return pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";
}

/**
 * Given the current pathname, return the equivalent URL in the other
 * locale for the header language toggle. Falls back to that locale's
 * home page when the current route has no translated counterpart.
 */
export function otherLocaleHref(pathname: string): string {
  const locale = getLocale(pathname);
  if (locale === "fr") {
    const enPath = pathname === "/fr" ? "/" : pathname.replace(/^\/fr/, "") || "/";
    const found = LOCALIZED_ROUTES.find(([en]) => en === enPath);
    return found ? found[0] : "/";
  }
  const found = LOCALIZED_ROUTES.find(([en]) => en === pathname);
  return found ? found[1] : "/fr";
}

export const social = {
  instagram: "http://www.instagram.com/olandstations",
  linkedin: "https://www.linkedin.com/company/oland-stations/",
  youtube: "https://www.youtube.com/@olandstations336",
} as const;

export const contact = {
  phone: "(438)-389-4057",
  phoneHref: "tel:+14383894057",
  info: "info@olandstations.com",
  marketing: "marketing@olandstations.com",
  location: "Montreal, CA",
} as const;

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href?: string; children?: NavChild[] };

export const nav: NavItem[] = [
  { label: "Our Solutions", href: "/our-water-solutions" },
  { label: "FAQs", href: "/faqs" },
  {
    label: "About",
    children: [
      { label: "Who we are", href: "/what-we-do" },
      { label: "Founder's Letter", href: "/read-me" },
      { label: "Our Impact", href: "/our-impact" },
      { label: "Partners", href: "/partners" },
    ],
  },
  {
    label: "News",
    children: [{ label: "News", href: "/news-about-sustainability" }],
  },
  { label: "Contact", href: "/contact-1" },
];

// French counterpart of `nav`, kept as a plain mirror (not derived) so the
// two stay easy to read and diff against each other.
export const navFr: NavItem[] = [
  { label: "Nos solutions", href: "/fr/our-water-solutions" },
  { label: "FAQ", href: "/fr/faqs" },
  {
    label: "À propos",
    children: [
      { label: "Qui sommes-nous", href: "/fr/what-we-do" },
      { label: "Lettre de la fondatrice", href: "/fr/read-me" },
      { label: "Notre impact", href: "/fr/our-impact" },
      { label: "Partenaires", href: "/fr/partners" },
    ],
  },
  {
    label: "Actualités",
    children: [{ label: "Actualités", href: "/fr/news-about-sustainability" }],
  },
  { label: "Contact", href: "/fr/contact-1" },
];
