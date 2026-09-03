import type { Metadata } from "next";
import Calculator from "./Calculator";

// Internal staff tool — not site content. English only, not localized, not
// in the nav or sitemap. Cloudflare Access sits in front of this path in
// the dashboard (no auth code here); robots match /get-quote's pattern.
export const metadata: Metadata = {
  title: "Impact Calculator — O'land Stations",
  description:
    "Internal tool: calculates O'land impact-report figures and charts from event usage data, entirely in the browser.",
  robots: { index: false, follow: false },
};

export default function ImpactCalculatorPage() {
  return <Calculator />;
}
