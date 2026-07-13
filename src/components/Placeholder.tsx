// Placeholder stands in for every real image until assets are supplied.
//
// IMPORTANT: each placeholder carries the *real* alt text from the live site
// and a `data-img` filename hint so swapping to <Image> later is 1:1:
//
//   <Placeholder alt="…" data-img="hero.jpg" className="aspect-[4/3]" />
//        ->  <Image src="/img/hero.jpg" alt="…" … />
//
// Do NOT hotlink Squarespace CDN URLs.

type PlaceholderProps = {
  /** Real alt text from the live site (required for accessibility + later swap). */
  alt: string;
  /** Filename hint for the eventual real asset, e.g. "hero-refill.jpg". */
  "data-img": string;
  /** Sizing/shape utilities, e.g. "aspect-[4/3] rounded-2xl". */
  className?: string;
  /** Decorative-only images can pass alt="" — they get aria-hidden. */
  rounded?: boolean;
};

export default function Placeholder({
  alt,
  className = "",
  rounded = true,
  ...rest
}: PlaceholderProps) {
  const decorative = alt.trim() === "";
  return (
    <div
      data-img={rest["data-img"]}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative || undefined}
      title={decorative ? undefined : alt}
      className={[
        "relative flex items-center justify-center overflow-hidden",
        "bg-gradient-to-br from-teal/25 via-sand/30 to-blue/20",
        "ring-1 ring-inset ring-ink/10",
        rounded ? "rounded-2xl" : "",
        className,
      ].join(" ")}
    >
      {/* simple framed-image glyph so empty placeholders read as "image" */}
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-10 w-10 text-steel/40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      {!decorative && (
        <span className="pointer-events-none absolute bottom-1.5 left-2 right-2 truncate text-[10px] font-medium uppercase tracking-wide text-steel/45">
          {rest["data-img"]}
        </span>
      )}
    </div>
  );
}
