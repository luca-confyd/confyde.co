"use client";

import { useReveal } from "@/lib/use-reveal";

/**
 * Mounts the page-wide scroll behaviour that has no markup of its own.
 *
 * Rendered once from the page root. Keeping it here rather than in the root
 * layout means the sections themselves stay Server Components - only this one
 * leaf and the handful of genuinely interactive pieces cross into the client.
 */
export function PageEffects() {
  useReveal();
  return null;
}
