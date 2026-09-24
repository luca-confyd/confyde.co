import { Reveal } from "@/components/primitives/reveal";
import { CUSTOMER_STORIES } from "@/content/customer-stories";

import { StoryCard } from "./story-card";

/**
 * Section 06, customer stories.
 *
 * [ADDITION, NOT A PORT] The mobile artboard has no customer-stories section at
 * all - its nearest neighbour is the "Working with
 * Confyde." testimonial carousel, which is different content (pull quotes from
 * named owners, no photographs, no article titles) and belongs to another
 * section. Hiding this band below 1024 would drop three real customer stories
 * from the small-screen page, so it is adapted rather than gated: the same
 * three records stack full width inside the same 560px column, the same 16/32px
 * gutters and the same warm card shadow the mobile social-proof band uses. Only
 * the row geometry and the surrounding air are forked; no copy, no imagery and
 * no type scale changes with the breakpoint. Flagged for the tech lead as an
 * addition the artboard does not draw.
 */
export function CustomerStories() {
  return (
    /*
      The artboard's section also carries `gap: 36px` with a single child,
      `overflow: hidden` with nothing that overflows, and `border-radius: 8px`
      with no background or shadow to round. All three are inert in the render,
      so they are dropped rather than transcribed (RULINGS.md principle 1).

      Below 1024: `max-w-[592px]` is the 560px column cap plus its 16px gutters,
      stepping to 624/32 at 640px - the same pair the social-proof band uses, so
      the two bands' left edges line up.

      `sm-only:` and not `sm:`: this element sets `max-w` and `px` at both the
      640 and the 1024 breakpoint, and Tailwind emits the `desk` block first, so
      a plain `sm:` would win at 1440px.
    */
    <section
      id="case-studies"
      data-section="customer-stories"
      className="mx-auto flex w-full max-w-[592px] flex-col px-4 py-[34px] sm-only:max-w-[624px] sm-only:px-8 desk:max-w-[1440px] desk:px-0 desk:pt-16 desk:pb-24"
    >
      <div className="mx-auto flex w-full flex-col desk:max-w-[1280px] desk:px-6">
        {/*
          One `<h2>`, at the same level as the marquee's and the social-proof
          band's, so the page outline stays h1 -> h2 -> h2 with no skip.

          `.display-2-mobile` is scoped below 1024 in styles/base.css and voices
          the smaller optical size the mobile artboards use for a section
          heading; at desk it falls away and `.display`'s own desktop cut takes
          over at the artboard's 3rem.
        */}
        <Reveal
          as="h2"
          anim="up-blur"
          duration={0.5}
          className="display display-2-mobile mb-4 text-center text-[26px] text-ink desk:mb-9 desk:text-[3rem] desk:leading-[1.2] desk:tracking-[-0.008em] desk:text-pf-ink-900"
        >
          Where we’ve worked
        </Reveal>

        {/*
          A stack below 1024, the artboard's wrapping three-up row above it. The
          row never actually wraps - three cards at 33.333% minus the gap always
          fit - but `flex-wrap` is what the artboard writes and it is the safe
          side of the rounding at 1024px.

          The three reveals keep their staggered 0.15 / 0.25 / 0.35 delays, so
          unlike the social-proof grid they cannot collapse into one observer on
          the parent: the stagger IS the effect.
        */}
        <div className="flex flex-col gap-3 desk:flex-row desk:flex-wrap desk:justify-center desk:gap-6">
          {CUSTOMER_STORIES.map((story, index) => (
            <StoryCard key={story.studio} story={story} delay={0.15 + index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
