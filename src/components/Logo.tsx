import Image from "next/image";

export default function Logo({
  className = "",
  title = "O'land Stations logo",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <Image
      src="/images/shared/brand/icone-oland.png"
      alt={title}
      width={96}
      height={96}
      className={className}
    />
  );
}
