import { CtaBandMobile } from "./cta-band-mobile";
import { CtaStageDesktop } from "./cta-stage-desktop";

/**
 * Section 13, the pinned CTA stage.
 *
 * Two compositions, mutually exclusive at 1024px, shipped as siblings the way
 * the hero and the marquee are: the pinned scroll-scrub above, a static band
 * below. They are gated by `display: none`, so exactly one is laid out, exactly
 * one is in the accessibility tree, and none of the scrub's CSS needs a media
 * query of its own.
 */
export function CtaStage() {
  return (
    <>
      <CtaStageDesktop />
      <CtaBandMobile />
    </>
  );
}
