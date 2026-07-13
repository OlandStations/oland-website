// Circular O'land logo mark — a water drop inside a ring, in brand blue.
// Inline SVG so it scales crisply and inherits color where needed.

export default function Logo({
  className = "",
  title = "O'land Stations logo",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="23" fill="var(--color-blue)" />
      <circle cx="24" cy="24" r="23" fill="none" stroke="var(--color-steel)" strokeWidth="1.5" />
      {/* water drop */}
      <path
        d="M24 11c0 0 9 9.8 9 16.2A9 9 0 0 1 24 36a9 9 0 0 1-9-8.8C15 20.8 24 11 24 11z"
        fill="white"
      />
      <path
        d="M20 27.5a4 4 0 0 0 3 3.4"
        fill="none"
        stroke="var(--color-blue)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
