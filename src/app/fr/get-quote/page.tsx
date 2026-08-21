import type { Metadata } from "next";
import QuoteFormFr from "@/components/QuoteFormFr";

// NOTE: AI-generated French translation — pending Rachel/Amelia review.
export const metadata: Metadata = {
  title: "Demander une soumission — Stations d'eau O'land pour événements",
  description:
    "Demandez une soumission pour les stations de remplissage d'eau durables d'O'land. Parlez-nous de votre événement et nous vous répondrons sous peu.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "/fr/get-quote",
    languages: {
      "en-CA": "/get-quote",
      "fr-CA": "/fr/get-quote",
    },
  },
};

export default function GetQuotePageFr() {
  return <QuoteFormFr />;
}
