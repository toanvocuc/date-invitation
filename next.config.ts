import type { NextConfig } from "next";

/**
 * Vercel: nothing to configure, just deploy.
 *
 * GitHub Pages / any static host: build with
 *   NEXT_STATIC_EXPORT=true NEXT_BASE_PATH=/<repo-name> npm run build
 * and publish the generated `out/` folder.
 */
const isStaticExport = process.env.NEXT_STATIC_EXPORT === "true";
const basePath = process.env.NEXT_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" } : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  images: {
    // Required for a static export, harmless otherwise.
    unoptimized: true,
  },
};

export default nextConfig;
