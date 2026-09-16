import { BeforeAfterDesktop } from "./before-after-desktop";
import { BeforeAfterMobile } from "./before-after-mobile";

/**
 * Section 05, "A week in Marcus's pocket".
 *
 * Two compositions, mutually exclusive at 1024px, shipped as siblings like the
 * hero and the marquee. `hidden` / `desk:hidden` is `display: none`, so only
 * one pair of phones is ever in the accessibility tree - and, because the
 * inactive pair is not laid out either, the 16s choreography in
 * `styles/motion/before-after.css` needs no breakpoint of its own.
 */
export function BeforeAfter() {
  return (
    <>
      <BeforeAfterDesktop />
      <BeforeAfterMobile />
    </>
  );
}
