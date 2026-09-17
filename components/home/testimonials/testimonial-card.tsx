import type { Testimonial } from "@/content/testimonials";

import { AVATAR_FILL } from "./avatar-tone";

/**
 * The blurred colour field behind each card, as the two triples the artboard
 * alternates rather than six hand-written sets.
 *
 * Cards 1, 3 and 5 open on forest-100 and close on forest-200; cards 2, 4 and 6
 * open on the darker forest-300 and close on forest-100. Only the first and
 * third blob change - the lime-100 in the middle is constant - so the pattern is
 * an A/B alternation by index and is written as one.
 */
const BLOB_SETS = [
  ["bg-forest-100", "bg-lime-100", "bg-forest-200"],
  ["bg-forest-300", "bg-lime-100", "bg-forest-100"],
] as const;

/* Position and size per blob, in the order above. Three circles far larger than
   the 380px card, anchored outside three of its corners, so what lands inside
   the card is the soft middle of each rather than an edge. */
const BLOB_BOX = [
  "-top-24 -left-16 size-96",
  "-right-20 bottom-10 size-84",
  "right-16 -bottom-24 size-60",
] as const;

/**
 * One desktop testimonial, >=1024px.
 *
 * A Server Component: it is handed to the client scroller as `children`, so the
 * quote, the attribution and the three blobs never reach the browser as
 * JavaScript.
 */
export function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const blobs = BLOB_SETS[index % BLOB_SETS.length];

  return (
    /*
      A square card sized from the geometry module's custom properties, not from
      a literal - the arrow step is derived from the same two numbers and they
      have to stay welded together (see geometry.ts).

      `.grain` is the artboard's `.pf-grain`, character for character, and it
      needs the `relative` here to hang its ::after on. 12px is the brand's card
      radius, which is what the mobile testimonial card and every other card on
      the page draw; the desktop board draws 8px, the brand's BUTTON radius, and
      that shipped as drawn until this card was the only 8px card left on the
      page. A consistency fix, not the fix for the square-cornered grain overlay
      that was reported against this card - that one is in styles/base.css on
      `.grain::after`, and the radius here was never the cause of it.

      The outer card and the blob clip below carry the same value deliberately:
      the colour field would otherwise corner the card back to square.

      `last:mr-5` is the artboard's 20px on the sixth card only: it is the
      lead-out that matches the strip's 20px lead-in, so the last card can reach
      the same inset from the right that the first one has from the left.
    */
    <article className="grain relative h-[var(--testi-card)] w-[var(--testi-card)] flex-shrink-0 snap-start overflow-hidden rounded-xl bg-card last:mr-5">
      {/* The whole field is dimmed to 55% as a group, then each circle carries
          70% of its own - so the blobs read against each other at full strength
          and against the card at a third of it. */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-xl opacity-[0.55]">
        {blobs.map((fill, i) => (
          <span
            key={fill + i}
            className={`absolute rounded-full opacity-[0.7] blur-[40px] ${BLOB_BOX[i]} ${fill}`}
          />
        ))}
      </div>

      <div className="relative z-10 flex h-full flex-col p-5">
        {/*
          Fraunces at the display scale's MOBILE cut - wght 600, SOFT 60,
          opsz 40 - although this card only ever renders at >=1024, where
          `.display` switches to the 420/100/10 cut. So `.display` cannot carry
          it and the axes are set here. Not a heading: it names the business the
          quote comes from, and the six cards are attributions rather than six
          sections of the page.
        */}
        <div className="font-display text-[19px] font-semibold [font-variation-settings:'wght'_600,'SOFT'_60,'opsz'_40] text-pf-ink-900">
          {testimonial.org}
        </div>

        {/* `flex-1` is what pushes the footer to the bottom of a card whose
            quotes run from two lines to five. */}
        <blockquote className="m-0 flex flex-1 flex-col pt-5">
          <p className="m-0 text-[20px] leading-[1.45] text-pf-ink-900">{testimonial.quote}</p>
        </blockquote>

        <footer className="mt-auto flex items-center gap-3">
          {/*
            `aria-hidden="true"` - the initials are the name that follows,
            abbreviated, and a screen reader would otherwise read "DN Dave
            Nguyen". The mobile board writes `aria-hidden=""`, which is not a
            valid value and does nothing (RULINGS.md §03/04 ruling 7); this one
            writes no attribute at all.

            12px on a 40px tile, where the mobile card draws a full circle. A
            real difference between the boards, and both ship as drawn.
          */}
          <span
            aria-hidden="true"
            className={`flex size-10 flex-none items-center justify-center rounded-xl text-[14px] font-extrabold text-white ${AVATAR_FILL[testimonial.tone]}`}
          >
            {testimonial.initials}
          </span>
          <div>
            <p className="m-0 text-[16px] font-bold text-pf-ink-900">{testimonial.name}</p>
            <p className="m-0 text-[16px] text-pf-ink-700">{testimonial.role}</p>
          </div>
        </footer>
      </div>
    </article>
  );
}
