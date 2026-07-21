import Link from "next/link";

type Variant = "coral" | "white" | "outline" | "blue" | "outline-dark";

const styles: Record<Variant, string> = {
  coral: "bg-coral text-white hover:bg-coral/90",
  blue: "bg-blue text-white hover:bg-blue/90",
  white: "bg-white text-ink hover:bg-white/90",
  outline: "border-2 border-white text-white hover:bg-white hover:text-ink",
  "outline-dark": "border-2 border-ink/20 text-ink hover:bg-ink hover:text-white",
};

export default function CtaButton({
  href,
  children,
  variant = "coral",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center justify-center rounded-full px-7 py-3",
        "text-sm font-bold uppercase tracking-wide transition-colors",
        styles[variant],
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
