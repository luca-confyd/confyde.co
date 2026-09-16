import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Several engineers build in this one working tree at the same time, and
   * concurrent `next build` runs overwrite each other's output mid-read - which
   * surfaces as a page served with no CSS at all, or as a verification run
   * against a half-written build. Setting NEXT_DIST_DIR gives a parallel worker
   * its own output directory so it cannot collide with anyone else's.
   */
  distDir: process.env.NEXT_DIST_DIR ?? ".next",

  /**
   * No `output: "export"`. Every route here is fully prerendered at build time
   * either way, but staying on the default output keeps the Image Optimization
   * API available on Vercel - which matters a great deal for a page that renders
   * the same four photographs eighty times.
   */
  images: {
    formats: ["image/avif", "image/webp"],
    /**
     * Next 16 requires the quality allowlist to be declared explicitly. 75 is the
     * default and covers every card tile and thumbnail; 90 is reserved for the
     * two hero plates and the take-off site plan, where compression artefacts
     * would be visible against flat sky and fine linework respectively.
     */
    qualities: [75, 90],
  },

  // The dev overlay would otherwise appear in every comparison screenshot.
  devIndicators: false,
};

export default nextConfig;
