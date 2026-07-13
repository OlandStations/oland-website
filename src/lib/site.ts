// Site-wide constants: navigation, social links, contact details.
// Single source of truth so header/footer/pages stay in sync.

export const QUOTE_PATH = "/get-quote";

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
