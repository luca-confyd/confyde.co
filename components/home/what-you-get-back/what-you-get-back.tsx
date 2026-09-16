import { WhatYouGetBackDesktop } from "./what-you-get-back-desktop";
import { WhatYouGetBackMobile } from "./what-you-get-back-mobile";

/**
 * "What you get back".
 *
 * Two compositions, mutually exclusive at 1024px. The copy is all but identical
 * across the two artboards - two strings differ, and both are the client's own
 * edit - but the treatment is not: desktop sets three near-white cards on a
 * dappled forest plate with a white heading, mobile sets three white cards
 * straight on the canvas with an ink heading. Nothing about the surface, the
 * card tone, the shadow or the heading colour survives the breakpoint, so this
 * is the same argument drawn twice rather than one layout that reflows.
 *
 * `hidden` / `desk:hidden` is `display: none`, so only one set of three cards
 * is ever in the accessibility tree.
 */
export function WhatYouGetBack() {
  return (
    <>
      <WhatYouGetBackDesktop />
      <WhatYouGetBackMobile />
    </>
  );
}
