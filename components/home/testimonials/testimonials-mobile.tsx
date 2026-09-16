import { TESTIMONIALS_MOBILE } from "@/content/testimonials";

import { TestimonialScroller } from "./carousel";
import { MOBILE_CARD } from "./geometry";
import { TestimonialCardMobile } from "./testimonial-card-mobile";

/**
 * Section 06, <1024px.
 *
 * Three cards on a plain snap scroller: no arrows and no drift, as drawn. The
 * scroller is still the client leaf, because the keyboard paging that makes a
 * mandatory-snap container usable without a mouse is the same code on both
 * breakpoints - see carousel.tsx.
 *
 * No `Reveal` here. The mobile board runs no entrance animations in this band
 * and the desktop board runs two, and that difference ships as drawn.
 */
export function TestimonialsMobile() {
  return (
    <section data-section="testimonials-mobile" className="pb-[34px] desk:hidden">
      {/* `.display` carries the family and weight, `.display-2-mobile` the
          mobile board's `.m-h2` cut (opsz 32, line-height 1.14, -0.005em); both
          fall away above 1024, which this subtree never reaches. 20px of side
          margin, as drawn - the strip itself keeps its own 16px. */}
      <h2 className="display display-2-mobile mx-5 mb-4 text-center text-[26px] text-ink">
        The best landscape businesses run on Bramble.
      </h2>

      <TestimonialScroller
        label="Customer testimonials"
        geometry={MOBILE_CARD}
        /* 4px of top padding so the focus ring is not clipped by the scroll
           box, and 8px below: both are the artboard's own `padding:4px 16px 8px`
           and neither needed changing to make room for the ring. */
        scrollerClassName="px-4 pt-1 pb-2"
        trackClassName="gap-[var(--testi-gap)]"
      >
        {TESTIMONIALS_MOBILE.map((testimonial, index) => (
          <TestimonialCardMobile key={testimonial.org} testimonial={testimonial} index={index} />
        ))}
      </TestimonialScroller>
    </section>
  );
}
