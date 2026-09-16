import type { ReactNode } from "react";

import { HeroDesktop } from "./hero-desktop";
import { HeroMobile } from "./hero-mobile";

/**
 * Section 02.
 *
 * Two compositions, mutually exclusive at 1024px, shipped as siblings rather
 * than as one tree that reflows - they share a headline and a primary CTA and
 * almost nothing else. `hidden` / `desk:hidden` is `display: none`, so only one
 * of the two `<h1>` elements is ever in the accessibility tree.
 */
export function Hero({ cardFooter }: { cardFooter?: ReactNode }) {
  return (
    <>
      <HeroDesktop cardFooter={cardFooter} />
      <HeroMobile />
    </>
  );
}
