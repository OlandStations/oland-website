import type { Metadata } from "next";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Get a Quote — O'land water stations for events",
  description:
    "Request a quote for O'land sustainable water refill stations. Tell us about your event and we'll be in touch shortly.",
  robots: { index: false, follow: false },
};

export default function GetQuotePage() {
  return <QuoteForm />;
}
