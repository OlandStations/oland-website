import type { Metadata } from "next";
import Image from "next/image";
import Accordion from "@/components/Accordion";

export const metadata: Metadata = {
  title: "FAQs | Enhance Your Event Experience – Learn More — O'land water stations for events",
  description:
    "Learn about O'land water stations for events, their features, installation, and customization options. Discover sustainable hydration solutions for large crowds.",
};

const aboutItems = [
  {
    title: "Materials",
    content: (
      <p>
        All our models are made with galvanized steel and stainless steel for a long lifetime and
        less waste.
      </p>
    ),
  },
  {
    title: "Customization",
    content: (
      <p>
        It all starts with the idea of making drinking water sustainably easy and enjoyable.
        That&rsquo;s why all our models are customizable, allowing you to print designs created by
        your own event or sponsored by your event&rsquo;s sponsors - you can even get your station
        for free.
      </p>
    ),
  },
  {
    title: "Installation",
    content: (
      <p>
        <strong>The first station is installed by us</strong> - we train and onboard your onsite
        personnel during your first O&rsquo;land Station installation for seamless integration.
      </p>
    ),
  },
  {
    title: "What is included",
    content: (
      <p>
        We work with the objective of reducing plastic waste and that&rsquo;s why we offer our
        &ldquo;Eco Impact Performance Package&rdquo; with our stations, where you receive an impact
        report detailing your contribution to plastic waste reduction, and carbon footprint
        reduction to highlight your commitment to sustainability.
      </p>
    ),
  },
  {
    title: "Why O'land",
    content: (
      <p>
        All our models are designed for large crowds, ensuring easy installation and delivered fully
        assembled. We aim to make the transition to a world without single-use plastic even easier
        for you.
      </p>
    ),
  },
];

const faqItems = [
  {
    title:
      "There is no location that is perfectly flat and leveled for installation. Can I still install my water station?",
    content: (
      <p>
        Yes. We recommend installing the station on as flat and leveled a surface as possible.
        However, if this is not feasible, you can use our adjustable feet to level and stabilize the
        station.
      </p>
    ),
  },
  {
    title: "There are no drains nearby. Can I still install my water station?",
    content: (
      <p>
        Yes. Ideally, we want to send the water to a drain, but we understand this is not always
        possible. You do need to install the drain hose and send the water away from the station. We
        do not want to leave the station without a grey water hose since the water from the sinks
        will pool around the station and it will seem like the station is leaking. Send the hose away
        from the station, towards a nearby drain, ditch, unused space, etc.
      </p>
    ),
  },
  {
    title: "How many faucets per station?",
    content: (
      <p>
        Standard station: 6 water bottle refill faucets. Mini: 2 water bottle refill &amp; 2 mouth
        drinking.
      </p>
    ),
  },
  {
    title: "Is it possible to have personalized branding?",
    content: (
      <p>
        The station comes with free O&rsquo;land branding (no extra cost). You also have the option
        to personalize your branding (6 sides, 3 panels per side) at an extra cost. Note that there
        is a delay to respect for sending us branding designs to print &amp; install on your station
        before delivery. You can also decide to brand the station yourself. Please note it is
        important to use specific material. For more info on specs &amp; material, please contact us.
      </p>
    ),
  },
  {
    title: "If it possible to customize umbrellas?",
    content: (
      <p>
        Umbrellas are made of plexiglass, which there is an option of branding the plexiglass if you
        desire. You could also special order specific colours of plexiglass (for purchases only).
        Contact us for more information.
      </p>
    ),
  },
  {
    title: "How many sides does the station have",
    content: (
      <p>
        Standard: Each station has 6 sides. Each side has 3 panels. Mini: 4 sides with 4 taps.
      </p>
    ),
  },
  {
    title: "What can be found inside the water station",
    content: (
      <p>
        The inside of the station is where all the plumbing is located, along with the carbon
        filter, water meter and antenna. On stations with water chillers, you can also find the 3
        water chillers (standard station) or 2 chillers (mini O&rsquo;land).
      </p>
    ),
  },
  {
    title: "What size/type of hoses are needed and are they provided.",
    content: (
      <p>
        Incoming water: 5/8&quot; ID <strong>food grade (NSF)</strong>. Grey water drain: 2&quot; ID
        (suggested heavy duty backwash hose or PVC with cable mats). Available for purchase. For
        rentals: can provide incoming food grade hose for additional cost. Grey water provided for
        free (X ft, if you require extra, you need to inform us).
      </p>
    ),
  },
  {
    title: "How do the chillers work. Do they require constant maintenance & fill ups?",
    content: (
      <p>
        Chillers have a separate tank that must be filled up/checked for water level once a year.
        This reservoir is completely unrelated to the water that comes out of faucets for us to
        drink. This means you never run out of cold water and must not refill them all the time. For
        chillers to work, they must be filled with water that has mineral concentration between
        150-350 ppm and require a 3 prong 120V electric connection. Contact us for more information.
      </p>
    ),
  },
  {
    title:
      "If we lost a few bolts that hold the panels / umbrellas. What bolts do we use to replace them?",
    content: (
      <p>
        For anything that can be removed (panels, umbrellas, sink filter, etc) use: BUTTON CAP ZINC
        M-6 X 20. For structural parts use (depending on size): BOLT ZINC METR.M-6*1.00*20 OR BOLT
        ZINC METR.M-8*1.25*20.
      </p>
    ),
  },
  {
    title: "Our forklift supports are loose or dangling under the station. What do we do?",
    content: (
      <p>
        Each forklift support is secured to the bottom of the station using QTY 6 X BOLT ZINC
        METR.M-6*1.00*20 with washer, inserted into the rivetnuts under the base of station.
      </p>
    ),
  },
];

export default function FaqsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Intro + about accordion + image */}
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">FAQs</h1>
          <p className="mt-5 text-lg text-ink/75">
            Take a moment to learn about our stations. Listed to your right, you&rsquo;ll find
            answers to frequently asked questions and more details below each section.
          </p>
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold text-steel">About our stations</h2>
            <Accordion items={aboutItems} />
          </div>
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl ring-1 ring-inset ring-ink/10 lg:sticky lg:top-24">
          <Image
            src="/images/faq/IMG_5985.jpeg"
            alt="A woman in a straw hat filling a pink tumbler from a water refill station with a 'Banque Nationale' sign, outdoors with other people in the background."
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Full FAQ accordion */}
      <div className="mt-20">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">FAQs</h2>
        <div className="mt-8 max-w-4xl">
          <Accordion items={faqItems} />
        </div>
      </div>
    </div>
  );
}
