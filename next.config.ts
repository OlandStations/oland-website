import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Real images will be swapped in for the <Placeholder> component later.
  // When that happens, add the Squarespace/own CDN host here for next/image.
  // images: { remotePatterns: [{ protocol: "https", hostname: "..." }] },
  images: { formats: ["image/webp", "image/avif"] },
};

export default nextConfig;
