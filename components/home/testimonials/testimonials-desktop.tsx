import { Reveal } from "@/components/primitives/reveal";
import { TESTIMONIALS_DESKTOP } from "@/content/testimonials";

import { TestimonialScroller } from "./carousel";
import { DESKTOP_CARD } from "./geometry";
import { TestimonialCard } from "./testimonial-card";

/**
 * The lead-in that puts the first card's left edge on the page's 1280px measure.
 *
 * `(100vw - 1200px) / 2 + 20px` is the artboard's own expression and it is kept
 * verbatim, including the 1200 where every other band on the page uses 1280 -
 * it is what makes the strip start 40px inside the heading rather than flush
 * with it. Two things worth knowing about it:
 *
 *   - Below 1160px the calc goes negative and CSS clamps padding to zero, so
 *     the strip runs flush to the left edge from 1024 to 1160. That is the
 *     artboard's rendered behaviour at those widths, not a fallback we chose.
 *   - `100vw` includes the classic scrollbar's width, so on a scrollbar-taking
 *     browser the lead-in is ~8px wider than the heading's own inset. Also the
 *     artboard's, and invisible without a ruler.
 */
/* The lead-in puts the first card on the same rail as every other band - 1232px
   centred, so a 24px gutter at 1280 and wider margins above that - rather than
   the artboard's 1200/20, which no longer matches anything around it. */
const RAIL_INSET = "max(24px, calc((100vw - 1232px) / 2))";

/* Both halves are needed. The padding puts the first card on the rail; the
   scroll-padding makes the SNAP positions respect it, and without that the
   scroller snaps the first card flush to its own left edge and clips its
   rounded corners flat - which is what made the cards read as "some rounded,
   some square" depending where you had scrolled to. */
const LEAD_IN = {
  paddingLeft: RAIL_INSET,
  /* The scroll-padding is the half that matters: without it the scroller snaps
     the first card flush to its own left edge, clipping its rounded corners
     flat, which is what made the cards read as "some rounded, some square"
     depending where you had scrolled to. */
  scrollPaddingLeft: RAIL_INSET,
} as const;

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
        scrollerStyle={LEAD_IN}
        trackClassName="gap-[var(--testi-gap)]"
      >
        {TESTIMONIALS_DESKTOP.map((testimonial, index) => (
          <TestimonialCard key={testimonial.org} testimonial={testimonial} index={index} />
        ))}
      </TestimonialScroller>
    </section>
  );
}
