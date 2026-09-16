import { FaqDesktop } from "./faq-desktop";
import { FaqMobile } from "./faq-mobile";

/**
 * Section: FAQ.
 *
 * Two compositions shipped as siblings and gated by the one breakpoint, like
 * the hero, the marquee and the before/after band. See faq-mobile.tsx for why
 * this band cannot be one composition with `desk:` forks.
 *
 * Both are Server Components: the whole section is native `<details>` and CSS,
 * so it adds nothing to the client bundle and works with JavaScript disabled.
 */
export function Faq() {
  return (
    <>
      <FaqDesktop />
      <FaqMobile />
    </>
  );
}
