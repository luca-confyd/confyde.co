"use client";

import { useCountUp } from "@/lib/use-count-up";

/**
 * The one client leaf in this chapter. It renders nothing; it exists so the
 * count-up observer has somewhere to mount without the rest of the section
 * leaving the server.
 *
 * It is mounted inside the desktop chapter rather than in `<PageEffects>`
 * because chapter 3 is the only band on the page that counts, and because the
 * desktop chapter is `display: none` below 1024px - an IntersectionObserver
 * never fires on an element in a `display: none` subtree, so the strip cannot
 * count at a width where the artboard does not draw it.
 */
export function CountUpRuntime() {
  useCountUp();
  return null;
}
