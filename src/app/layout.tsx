import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.olandstations.com"),
  title: {
    default: "Water Stations for Events | O'land Stations",
    template: "%s",
  },
  description:
    "Discover our premium water stations designed to elevate large crowd events. With 360-degree custom designs for optimal guest experience, eco-friendly, free impact data and more. Choose sustainability with our innovative hydration solutions!",
  icons: {
    icon: "/images/oland-site-icon-blue.png",
  },
  openGraph: {
    siteName: "O'land water stations for events",
    type: "website",
    locale: "en_CA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA" className={manrope.variable}>
      <body className="min-h-screen bg-white antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-coral focus:px-4 focus:py-2 focus:font-bold focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
