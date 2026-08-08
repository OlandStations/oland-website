import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CtaButton from "@/components/CtaButton";
import Reveal from "@/components/Reveal";
import LogoCarousel from "@/components/LogoCarousel";
import { QUOTE_PATH, social } from "@/lib/site";

// Staggered transition-delay utilities cycled across testimonial cards.
// Kept as literal strings so Tailwind can detect and generate them.
const revealDelays = ["delay-100", "delay-200", "delay-300"];

export const metadata: Metadata = {
  title: "Water Stations for Events | O'land Stations",
  description:
    "Discover our premium water stations designed to elevate large crowd events. With 360-degree custom designs for optimal guest experience, eco-friendly, free impact data and more. Choose sustainability with our innovative hydration solutions!",
};

// 6 client testimonials (exact text from the live site).
const testimonials = [
  {
    quote:
      "There was no doubt that we wanted to work with O'land. It's such a devoted company, that shares the same values as us, such as taking good care of our planet. We don't find that kind of philosophy with other companies in the market.",
    author: "Eric Fortin Lambert, Director of Operations at Evenko",
  },
  {
    quote:
      "We used O'land this year at our festival. We had had complaints about the water delivery being too slow and causing long lines in previous years and I shared this concern with the team. They assured me it wouldn't be a problem - and they delivered! We had nothing but great feedback - which was important given the heat we had on the day of the event! The team was super accommodating and a joy to work with!",
    author: "Sherri McGurnaghan — Montreal Highland Games 2024",
  },
  {
    quote:
      "At the Olympic Park, we believe that every small gesture counts to improve the situation of marine life, which is why we bought from O'land. This eco-responsible company offers mobile water infrastructure. So don't forget your reusable water bottle the next time you visit the Esplanade!",
    author: "Olympic Park",
  },
  {
    quote:
      "Overall, great product! Was a huge success and we are excited to see more development in future years.",
    author: "Emily Simon, Whitecap Entertainment",
  },
  {
    quote:
      "From an idea in an innovation competition to measurable impact in the real world! O'land Stations delivers on its mission - one avoided water bottle at a time.",
    author: "Kariann Aarup, Acqua Action Toronto IWA",
  },
  {
    quote:
      "Having the portable water refill station on-site was a game changer. It provided easy access to hydration for athletes and spectators while cutting down on single-use plastic. It's an efficient, environmentally responsible solution that we'd absolutely use again.",
    author: "Gabe Amick, Hamilton County Sports Authority",
  },
];

export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <section className="relative min-h-[85vh]">
        <Image
          src="/images/hero.png"
          alt="People at O'land water station"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center text-white sm:px-6 lg:px-8">
          <Reveal className="reveal w-full">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Premium Sustainable Water Stations for Events and Venues
            </h1>
            <div className="mt-8 flex justify-center">
              <CtaButton href={QUOTE_PATH} variant="coral">
                Get a Quote
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. 360-degree custom design */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="reveal-right">
            <Image
              src="/images/brita-station.jpg"
              alt="Brita branded Water Refill Station"
              width={600}
              height={600}
              className="w-full h-auto rounded-2xl"
            />
          </Reveal>
          <Reveal className="reveal-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-blue sm:text-4xl">
              360-degree custom design
            </h2>
            <p className="mt-5 text-lg text-ink/75">
              Engage your audience with custom branding and create a seamless flow at your event,
              enhancing the overall user experience.
            </p>
            <div className="mt-7">
              <CtaButton href={QUOTE_PATH} variant="coral">
                Get a quote
              </CtaButton>
            </div>
            <p className="mt-8 text-xl font-bold text-steel">
              1 IN 2 consumers agree that sponsorship has a positive impact on brands involved
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3. No lines / No waste — full-bleed cropped banner */}
      <section className="relative w-full overflow-hidden h-[500px]">
        <Image
          src="/images/no-line-no-waste.jpg"
          alt="No line no waste"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
          <p className="text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
            &ldquo;No lines
            <br />
            No waste&rdquo;
          </p>
        </div>
      </section>

      {/* 4. Fan-centric design */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="reveal-right">
            <p className="eyebrow text-coral">Fan-Centric Design</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Brand elevation and fan loyalty
            </h2>
            <p className="mt-5 text-lg text-ink/75">
              Our water stations are designed to prioritize your clients. We understand that
              providing a superior user experience with equipment like ours not only makes it easier
              to reduce plastic usage but also enhances the overall experience &amp; hydration safety
              for fans at event. This approach helps build awareness and trust in your sponsors,
              making their involvement more impactful.
            </p>
          </Reveal>
          <Reveal className="reveal-left">
            <Image
              src="/images/Fan-Centric-Design.jpg"
              alt="Fan centric design at festival"
              width={600}
              height={600}
              className="w-full h-auto rounded-2xl"
            />
          </Reveal>
        </div>
      </section>

      {/* 5. Filtered & Chilled Water */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal className="reveal-left">
              <h2 className="text-3xl font-extrabold tracking-tight text-blue sm:text-4xl">
                Filtered &amp; Chilled Water
              </h2>
              <p className="mt-5 text-lg text-teal">
                Quench your thirst with our premium filtered, fast and chilled water, delivering
                crisp refreshment every time.
              </p>
              <div className="mt-7">
                <CtaButton href={QUOTE_PATH} variant="coral">
                  Get a quote
                </CtaButton>
              </div>
            </Reveal>
            <Reveal className="reveal-right">
              <Image
                src="/images/Filtered-Chilled-Water.jpg"
                alt="Fan enjoying filtered chilled water"
                width={480}
                height={640}
                className="aspect-[3/4] w-full max-w-[480px] rounded-2xl object-cover"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6a. Creating a world without — text strip */}
      <section className="bg-[#f2f2f1]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-8 text-center text-xl font-extrabold uppercase tracking-tight sm:text-2xl lg:px-8">
          <span className="text-blue">
            Creating a world{" "}
            <span className="underline decoration-teal decoration-4 underline-offset-4">
              without
            </span>
          </span>
          <span className="text-ink">Single-use plastic bottles</span>
        </div>
      </section>

      {/* 6b. Refill a bottle in 5 seconds */}
      <section className="bg-blue">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* LEFT: refill-in-action photo */}
          <div className="flex items-center justify-center">
            <div className="relative aspect-[4/5] w-full max-w-[500px] overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/images/faq/IMG_5985.jpeg"
                alt="A guest refilling a reusable bottle in seconds at a branded O'land water station"
                fill
                sizes="(min-width: 1024px) 500px, 90vw"
                className="object-cover"
              />
            </div>
          </div>
          {/* RIGHT: large headline, vertically centred */}
          <div className="flex items-center">
            <p className="text-5xl font-extrabold text-white lg:text-7xl">
              Refill a bottle in 5 seconds
            </p>
          </div>
        </div>
      </section>

      {/* 7. For the planet we love — full-bleed background image */}
      <section className="relative min-h-[600px] overflow-hidden">
        <Image
          src="/images/for-the-planet-we-love.jpg"
          alt=""
          fill
          className="object-cover"
        />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* LEFT: semi-transparent blue card */}
          <Reveal className="reveal-left">
            <div className="rounded-xl bg-blue/85 p-8">
              <p className="text-lg font-semibold text-white">
                In our journey towards a sustainable future, we recognize the profound impact that
                each of our water stations has on people, events and the planet.
              </p>
              <p className="mt-4 text-lg font-semibold text-white">
                O&rsquo;land Water Stations, our commitment lies in the responsible design and
                manufacturing of our products, ensuring they have a minimal impact on the
                environment. We are dedicated to crafting water stations that stand the test of time,
                embodying environmental responsibility while minimizing waste.
              </p>
            </div>
          </Reveal>
          {/* RIGHT: text directly on the image */}
          <Reveal className="reveal-right">
            <div className="text-white drop-shadow-lg">
              <h2 className="text-5xl font-bold leading-tight text-blue">
                <span className="block w-fit border-b-2 border-blue pb-1">For the planet</span>
                <span className="mt-2 block w-fit border-b-2 border-blue pb-1">we love</span>
              </h2>
              <p className="mt-6 text-2xl">We saved over:</p>
              <p className="mt-2 text-3xl">
                4 MILLION plastic bottles &amp; <span className="font-extrabold">57,505t</span> of
                CO2e emissions
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8. Rent / Purchase */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-blue sm:text-4xl">
            Choose your option and <span className="text-coral">get a quote</span>
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-12">
            {[
              {
                title: "Rent",
                src: "/images/Rent.jpg",
                alt: "A young man at a festival near a water filling station",
              },
              {
                title: "Purchase",
                src: "/images/purchase.png",
                alt: "Water station outdoors at an event",
              },
            ].map((opt, i) => (
              <Reveal key={opt.title} className={`flex flex-col ${i === 0 ? "reveal-left" : "reveal-right"}`}>
                <div className="aspect-[3/4] overflow-hidden rounded-xl">
                  <Image
                    src={opt.src}
                    alt={opt.alt}
                    width={700}
                    height={900}
                    className="h-full w-full rounded-xl object-cover"
                  />
                </div>
                <h3 className="mt-6 text-center text-2xl font-extrabold text-ink">
                  {opt.title.toUpperCase()}
                </h3>
                <p className="mt-2 text-center text-ink/60">
                  only the highest quality materials and manufacturing
                </p>
                <div className="mt-6 flex justify-center">
                  <Link
                    href={QUOTE_PATH}
                    className="inline-flex items-center justify-center rounded-full bg-coral px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-coral/90"
                  >
                    Click here
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-blue sm:text-4xl">
          What our clients are saying
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.author} className="reveal h-full" delay={revealDelays[i % revealDelays.length]}>
              <figure className="flex h-full flex-col rounded-2xl bg-offwhite p-7 ring-1 ring-ink/5">
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8 text-coral"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.5 7C6.5 7 4 9.5 4 12.5V19h6v-6H7.2c0-1.6 1-2.7 2.3-2.9V7Zm10 0c-3 0-5.5 2.5-5.5 5.5V19h6v-6h-2.8c0-1.6 1-2.7 2.3-2.9V7Z" />
                </svg>
                <blockquote className="mt-4 flex-1 text-ink/80">{t.quote}</blockquote>
                <figcaption className="mt-5 text-sm font-bold text-steel">{t.author}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 10. Clients */}
      <LogoCarousel />

      {/* 11. Instagram + updates CTA (replaces the unwired newsletter form and
          the Instagram placeholder tiles for V1). */}
      <section className="bg-offwhite">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Join Us on Instagram
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink/75">
            Follow O&rsquo;land for event highlights, impact stories, behind-the-scenes moments,
            and refill station inspiration.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-ink/60">
            Want O&rsquo;land updates? Follow us on Instagram or contact our team for news,
            partnerships, and event updates.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-coral px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all duration-200 hover:bg-coral/90 hover:shadow-md"
            >
              Follow us on Instagram
            </a>
            <CtaButton href="/contact-1" variant="outline-dark">
              Contact us
            </CtaButton>
          </div>
        </div>
      </section>
    </>
  );
}
