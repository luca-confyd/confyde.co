import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
