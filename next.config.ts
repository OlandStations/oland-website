import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Cloudflare Pages hosting (no Next.js server at runtime).
  output: "export",
  // next/image requires the Image Optimization API, which needs a server.
  // Cloudflare Pages serves the /out directory as static files, so images
  // are served unoptimized (as-is) instead.
  images: { unoptimized: true },
};

export default nextConfig;
