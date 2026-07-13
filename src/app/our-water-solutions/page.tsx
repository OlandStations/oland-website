import type { Metadata } from "next";
import Link from "next/link";
import Placeholder from "@/components/Placeholder";
import CtaButton from "@/components/CtaButton";
import Accordion from "@/components/Accordion";
import { QUOTE_PATH } from "@/lib/site";

export const metadata: Metadata = {
  title: "Eco-Friendly Water Stations for Events & Indoor Spaces — O'land water stations for events",
  description:
    "Boost sustainability and profits with our customizable water stations, perfect outdoor events of any size and indoor venues. Water Stations that drive your ROI.",
};

const products = [
  { name: "Impact Report", img: "product-impact-report.jpg" },
  { name: "Maintenance Package", img: "product-maintenance-package.png" },
  { name: "Installation", img: "product-installation.jpg" },
  { name: "Standard 6-Tap Refill Station", img: "product-standard-6tap.jpg" },
  { name: "Mini O'land (2-Tap)", img: "product-mini-oland-2tap.png" },
  { name: "Premium 6-Tap Refill Station", img: "product-premium-6tap.jpg" },
];

const learnItems = [
  {
    title: "Materials",
    content: (
      <p>
        All our models are made with galvanized steel and stainless steel for durability and minimal
        waste.
      </p>
    ),
  },
  {
    title: "Customization",
    content: (
      <p>
        It all starts with the idea of making drinking water sustainably easy and enjoyable.
        That&rsquo;s why all our models are customizable, allowing you to print designs created by
        your event or sponsored by your event&rsquo;s sponsors&mdash;you might even get your station
        for free!
      </p>
    ),
  },
  {
    title: "What is included?",
    content: (
      <p>
        We work with the objective of reducing plastic waste and that&rsquo;s why we offer our
        &ldquo;Eco Impact Performance Package&rdquo; where you receive an impact report detailing
        your contribution to plastic waste reduction, and carbon footprint reduction to highlight
        your commitment to sustainability.
      </p>
    ),
  },
  {
    title: "Installation",
    content: (
      <p>
        The first stations is installed by us - we train and onboard your onsite personnel during
        your first O&rsquo;land Station installation for seamless integration.
      </p>
    ),
  },
  {
    title: "Why choose O'land",
    content: (
      <p>
        All our models are designed for large crowds, ensuring easy installation and delivered fully
        assembled. We aim to make the transition to a world without single-use plastic even easier
        for you.
      </p>
    ),
  },
];

export default function OurSolutionsPage() {
  return (
    <>
      {/* Heading + product grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">Our Solutions</h1>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link
              key={p.name}
              href={QUOTE_PATH}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10 transition-shadow hover:shadow-lg"
            >
              <Placeholder
                alt={p.name}
                data-img={p.img}
                rounded={false}
                className="aspect-square w-full"
              />
              <div className="flex items-center justify-between p-5">
                <h2 className="text-lg font-bold text-ink">{p.name}</h2>
                <span className="text-sm font-bold uppercase tracking-wide text-coral group-hover:underline">
                  Request a quote
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Blue CTA band */}
      <section className="bg-blue text-white">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            We are already creating a world without single-use plastic!
          </h2>
          <p className="mt-6 text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl">
            Let us help and make it <span className="text-sand">easier</span> for you!
          </p>
          <div className="mt-8">
            <CtaButton href={QUOTE_PATH} variant="coral">
              Request a quote
            </CtaButton>
          </div>
        </div>
      </section>

      {/* Eco Package Impact Report */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Eco Package Impact Report
            </h2>
            <p className="mt-5 text-lg text-ink/75">
              Fill out some info and we will be in touch shortly! We can&rsquo;t wait to hear from
              you!
            </p>
            <div className="mt-7">
              <CtaButton href={QUOTE_PATH} variant="coral">
                Get a Quote
              </CtaButton>
            </div>
          </div>
          <Placeholder
            alt="An infographic about CO2 emissions reduction achieved by reducing single-use plastic bottles, showing a total reduction of 37.4 billion tonnes in 2023, with a visual of a crumpled plastic water bottle and a blue button that says 'Download your certificate here.'"
            data-img="eco-impact-report-infographic.jpg"
            className="aspect-[4/3] w-full"
          />
        </div>
      </section>

      {/* Learn About Our Stations */}
      <section className="bg-offwhite">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <Placeholder
              alt="A man is handing out water bottles at the Brita Refill Station during a music festival in an outdoor setting"
              data-img="brita-handing-out-bottles.jpg"
              className="aspect-[4/3] w-full"
            />
            <div>
              <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Learn About Our Stations
              </h2>
              <Accordion items={learnItems} defaultOpen={0} />
              <div className="mt-8">
                <CtaButton href={QUOTE_PATH} variant="coral">
                  Get a Quote
                </CtaButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
