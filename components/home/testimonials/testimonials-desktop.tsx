import { Reveal } from "@/components/primitives/reveal";
import { TESTIMONIALS_DESKTOP } from "@/content/testimonials";

import { TestimonialScroller } from "./carousel";
import { DESKTOP_CARD } from "./geometry";
import { TestimonialCard } from "./testimonial-card";

/* FULL BLEED, AND OPENING MID-STRIP.

   The strip used to carry a lead-in that put the first card on the page's
   content rail, so at 1440 the cards began 104px in and the band read as a
   narrower column than the viewport. It now runs edge to edge: no left padding,
   no scroll-padding, so a card can sit against either edge and the six of them
   use the whole width.

   `START_OFFSET` is the other half. Opening at scrollLeft 0 puts a card flush
   to the left edge and the strip looks like it begins there - a static row that
   happens to be cut off on the right. Opening part-way in means the left edge
   cuts THROUGH a card, which is what tells you at a glance that the strip runs
   in both directions. Half a pitch is deliberate: it lands between two snap
   points, so the first thing a drag or an arrow does is settle onto one.

   The scroll-padding that used to be here is gone rather than zeroed - with no
   lead-in there is nothing for the snap positions to respect, and the corner
   clipping it was guarding against was never what caused the square corners
   (that was the grain overlay - see styles/base.css `.grain::after`). */
const START_OFFSET = (DESKTOP_CARD.width + DESKTOP_CARD.gap) / 2;

/**
 * Section 06, >=1024px.
 *
 * A Server Component. Only `TestimonialScroller` - the scroll box, the two
 * arrows and the drift - is a client leaf; the six cards are rendered here and
 * handed through it as children.
 */
export function TestimonialsDesktop() {
  return (
    /*
      `overflow-x-hidden` is load-bearing here in a way it usually is not: the
      strip is deliberately wider than the viewport and the drift can push it
      wider still, and without this the page grows a horizontal scrollbar.

      No background: this band sits on the raw page surface, like the social
      proof band above it.
    */
    <section
      data-section="testimonials-desktop"
      className="mx-auto hidden w-full max-w-full flex-col overflow-x-hidden pt-16 pb-2 desk:flex"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col">
        <Reveal anim="up-blur" duration={0.5} className="mb-12 px-6">
          {/* `<h2>`, at the same level as every other band's, so the page
              outline stays h1 -> h2 with no skip. `.display-2` at >=1024 is
              `.pf-h2`'s 3rem/1.2/-0.008em exactly. */}
          <h2 className="display display-2 text-pf-ink-900">
            What it’s like to work with Confyde.
          </h2>
        </Reveal>
      </div>

      <TestimonialScroller
        /* Named for what the region is, not for how it moves: "carousel" is a
           mechanism and this is announced to someone who cannot see it. */
        label="Customer testimonials"
        geometry={DESKTOP_CARD}
        arrows
        drift
        viewportClassName="relative w-full overflow-hidden"
        initialOffset={START_OFFSET}
        trackClassName="gap-[var(--testi-gap)]"
      >
        {TESTIMONIALS_DESKTOP.map((testimonial, index) => (
          <TestimonialCard key={testimonial.org} testimonial={testimonial} index={index} />
        ))}
      </TestimonialScroller>
    </section>
  );
}
