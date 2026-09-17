import { LogoMarqueeDesktop } from "./logo-marquee-desktop";
import { LogoMarqueeMobile } from "./logo-marquee-mobile";

/**
 * Section 03.
 *
 * Named for the source comment rather than its contents: the artboards call it
 * the logo marquee, and it carries no logos - fourteen capabilities set as
 * type. The name is kept so the component, the spec and the comment agree.
 *
 * Two compositions, mutually exclusive at 1024px, shipped as siblings like the
 * hero above. `hidden` / `desk:hidden` is `display: none`, so only one of the
 * two `<h2>` elements and only one of the two term lists is ever in the
 * accessibility tree.
 */
export function LogoMarquee() {
  return (
    <>
      <LogoMarqueeDesktop />
      <LogoMarqueeMobile />
    </>
  );
}
