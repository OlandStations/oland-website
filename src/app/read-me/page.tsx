import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title:
    "A letter from our Founder | Join the Movement – Reduce Plastic Waste Today — O'land water stations for events",
  description:
    "Learn about O'land Water Stations' mission to eliminate single-use plastics, featuring our founder's message and impactful initiatives for a sustainable future.",
};

export default function ReadMePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative aspect-[16/7] w-full overflow-hidden">
          <Image
            src="/images/founders-letter/founders-letter-banner.jpg"
            alt="Founder's Letter banner image"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <p className="eyebrow text-steel">Our cause it&rsquo;s timeless</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Create a world without single-use plastic
          </h1>
        </div>
      </section>

      {/* Letter */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-10 lg:gap-14">
          <div className="relative aspect-square w-48 shrink-0 overflow-hidden rounded-full shadow-lg ring-4 ring-white sm:w-56 lg:w-64">
            <Image
              src="/images/founders-letter/rachel.jpeg"
              alt="Rachel, founder of O'land Stations"
              fill
              sizes="(min-width: 1024px) 256px, (min-width: 640px) 224px, 192px"
              className="object-cover"
            />
          </div>
          <div className="w-full max-w-3xl sm:flex-1">
            <h2 className="text-xl font-bold text-steel">
              A Letter from Rachel Labbe-Bellas, our founder -{" "}
              <em className="font-medium">creating a world without single-use plastic</em>.
            </h2>

            <blockquote className="mt-8 space-y-5 border-l-4 border-coral pl-6 text-lg leading-relaxed text-ink/85">
              <p className="font-bold">Dear Community,</p>
              <p>
                Today, I&rsquo;m reaching out to share a reflection on the journey we&rsquo;ve
                undertaken together as a community dedicated to a shared vision – the creation of a
                world free from single-use plastics.
              </p>
              <p>
                As the founder of O&rsquo;land, I am immensely proud of the strides we have taken in
                our mission. Each achievement, whether it&rsquo;s reducing a million plastic bottles,
                expanding our services to new horizons, or witnessing the growth of our dedicated
                team, is akin to revealing another piece of the iceberg. With every success, the
                vision of our collective pursuit becomes clearer not only to me but to all of us.
              </p>
              <p>
                Our cause is more than a commitment; it&rsquo;s a testament to our endurance,
                resilience, and timeless dedication. The goal to create a world without single-use
                plastics is not just a lofty ambition; it&rsquo;s a call to action that we embrace
                with each passing day. Every step we take is a significant stride toward the
                realization of our vision. However, let us be mindful that, despite our
                accomplishments, much of the challenge remains unexplored.
              </p>
              <p>
                Our journey toward a sustainable planet is ongoing. We understand that, although we
                have achieved significant milestones, the path to a world free of single-use plastics
                is far from complete. Yet, it is precisely this ongoing challenge that fuels our
                determination and deepens our commitment.
              </p>
              <p>
                Together, as a united community, we persist in our mission to preserve our
                environment for the well-being of current and future generations. We stand at the
                forefront of change, driven by the belief that our collective efforts will leave a
                lasting impact on the world, be it with our water stations or other products in the
                future.
              </p>
              <p>
                Moreover, I am thrilled to announce our ambitious goal for 2025: to reach the
                milestone of reducing 5 million plastic bottles. This goal serves as a testament to
                our unwavering commitment to our cause and reflects our determination to make a
                tangible difference in the fight against single-use plastics. A heartfelt thanks to{" "}
                <a
                  href="https://www.greensportsalliance.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-coral underline"
                >
                  Green Sports Alliance
                </a>{" "}
                for joining us on this impactful journey.
              </p>
              <p>
                Thank you for being an integral part of this journey. Your dedication, passion, and
                support propel us forward. I am confident that, with our continued collaboration, we
                will not only navigate the uncharted waters but also inspire others to join us in
                creating a world without single-use plastics.
              </p>
              <p>With gratitude and determination,</p>
              <p className="font-bold italic">Rachel Labbe-Bellas,</p>
              <p className="font-bold italic">Founder of O&rsquo;land Stations</p>
              <p className="font-bold italic">January of 2024</p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Logo */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <Image
          src="/images/shared/brand/oland-site-icon-blue.png"
          alt="O'land Stations logo"
          width={200}
          height={200}
          className="mx-auto h-auto w-40 sm:w-48"
        />
      </section>

      {/* Closing */}
      <section className="bg-offwhite">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            It moves us to tears,
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink/75">
            And we hope this testimonial resonates with you as deeply as it does with us.
            Experiencing the heartfelt truth behind our existence through the words of our founder
            helps us grasp why refilling is a necessity for the world, and consequently, for your
            event.
          </p>
        </div>
      </section>
    </>
  );
}
