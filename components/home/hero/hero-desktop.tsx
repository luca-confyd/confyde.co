import { Fragment } from "react";

import type { ReactNode } from "react";

import { NavFlipSentinel } from "@/components/chrome/nav-flip-sentinel";
import { NavItem } from "@/components/chrome/nav-item";
import { Reveal } from "@/components/primitives/reveal";
import { BOOKING_URL } from "@/lib/booking";

import { HeroCategories } from "./hero-categories";

/* -----------------------------------------------------------------------------
   The headline, word by word.

   Each word reveals on its own delay, 45ms apart, with a 65ms extra beat across
   the line break - the pause a reader takes anyway. The literal space between
   the spans is load-bearing: without it a screen reader concatenates the text
   nodes into "Confydebuildsyourquotes.".

   [KNOWING EXCEPTION - RULINGS.md §02 ruling 1.] docs/brand.md says a heading is
   a heading through family, weight and size, NOT colour, and lime has four
   sanctioned roles, none of which is a headline. The artboard sets the whole
   second line in lime and that is the hero's entire idea, so it ships as drawn
   and is logged as a knowing exception rather than silently corrected.

   The TONE moved with the background. On the photographic hero the second line
   was lime-500 (#12707A); on the grid's #12201F base that measures 2.89:1,
   under even the 3.0 floor large text gets, because a mid petrol and a dark
   petrol are the same hue at two lightnesses and the base is now the second of
   those. forest-500 (#5698A1) is the next step up the same ramp and clears it
   at 5.11:1.

   The reference artboard reaches for #4FB4BD here, which is brighter again at
   6.87:1. It is not a token, and forest-500 carries the idea - a lighter petrol,
   because the surface underneath went petrol - without minting a colour the
   system would then have to find a name for.
----------------------------------------------------------------------------- */

const HEADLINE_LINES = [
  {
    tone: "",
    words: [
      { word: "The", delay: 0 },
      { word: "AI", delay: 0.045 },
      { word: "consultancy", delay: 0.09 },
      { word: "you", delay: 0.135 },
      { word: "hire", delay: 0.18 },
    ],
  },
  {
    // The artboard's headline is two lines with the second in lime, and that
    // two-tone break is the hero's signature. The new single sentence is split
    // at its own clause boundary to keep it.
    tone: "text-forest-500",
    words: [
      { word: "to", delay: 0.29 },
      { word: "build,", delay: 0.335 },
      { word: "not", delay: 0.38 },
      { word: "just", delay: 0.425 },
      { word: "plan.", delay: 0.47 },
    ],
  },
];

/* -----------------------------------------------------------------------------
   Layers, and why there are none left.

   This section used to carry two: a four-stop SCRIM washing the whole
   photograph, and a VIGNETTE pooling extra ink behind the copy column alone.
   Both existed for one reason - holding white copy at 4.5:1 over pixels that
   changed from one crop to the next - and the grid background removes that
   problem at the source. `#12201f` under white is 15.8:1 everywhere, so a scrim
   would now be buying contrast the copy already has and costing the grid the
   only thing it has to show.

   The `[text-shadow]` on the headline and paragraph went with them, for the same
   reason: a 18px black blur behind type is how you rescue it from a busy
   photograph, and on a flat surface it just smears the edges.
----------------------------------------------------------------------------- */

/**
 * The desktop hero, >=1024px.
 *
 * `hidden desk:block` is the whole mutual exclusion with the mobile hero below
 * it. `display: none` takes the inactive one out of the accessibility tree, so
 * although two `<h1>` elements exist in the DOM only ever one is exposed -
 * which `opacity-0` or `sr-only` would not achieve.
 */
export function HeroDesktop({ cardFooter }: { cardFooter?: ReactNode }) {
  return (
    /* Two nested clipping wrappers, both from the artboard: the outer one clips
       the stage, the inner one the panel. `overflow-x: clip` rather than
       `hidden` because `hidden` would silently create a scroll container and
       break `position: sticky` further down the page. */
    <div data-section="hero-desktop" className="relative hidden max-w-full overflow-x-clip desk:block">
      <div className="relative overflow-x-clip">
        <section className="shadow-border-strong w-full bg-pf-surface-500">
          {/*
            88svh, not vh or dvh: the hero should keep its proportions while a
            mobile browser's chrome is showing rather than resize under the
            reader. On a short viewport it takes MORE of the screen, not less -
            the stat strip is the payoff and it has to stay above the fold.

            `overflow-hidden` is what clips the float-card stack as it flips past
            the panel edge.
          */}
          <div className="relative mx-auto flex min-h-[88svh] w-full max-w-[1920px] flex-col items-center overflow-hidden pt-[88px] hero-short:min-h-[92svh] hero-short:pt-14">
            {/* The plate. Same box the photograph filled - `inset-0` inside the
                panel, `z-0` under the copy - so nothing above it moves; only
                what paints inside it changed. `aria-hidden` because it is now
                decoration in the markup rather than an <img> with an empty alt,
                and there is no longer an image to fail to load, so the flat
                paint-flash colour underneath it is gone too: the class IS the
                flat colour. See styles/grid-surface.css for the three layers. */}
            <div aria-hidden="true" className="grid-surface absolute inset-0 z-0" />

            {/* px-6, matching the content rail's gutter. At widths below 1280 this
                padding is what bounds the category strip rather than its 1232
                cap, so px-5 put the strip 4px outside every band beneath it. */}
            <div className="relative z-20 flex w-full flex-1 flex-col items-center px-6">
              {/* The copy column is 1000px and the stat strip below it is
                  1120px. The difference is intentional: the sentence wants a
                  readable measure, the figures want the full width. */}
              <div className="relative flex w-full max-w-[1000px] flex-1 flex-col items-center justify-center text-center">
                <h1 className="display display-1 text-balance text-pf-ink-100 hero-short:text-[4.25rem]">
                  {HEADLINE_LINES.map((line) => (
                    <span key={line.words[0].word} className="block">
                      {line.words.map((entry, index) => (
                        <Fragment key={entry.word}>
                          {index > 0 ? " " : null}
                          <Reveal
                            as="span"
                            anim="word"
                            delay={entry.delay}
                            className={
                              line.tone ? `inline-block ${line.tone}` : "inline-block"
                            }
                          >
                            {entry.word}
                          </Reveal>
                        </Fragment>
                      ))}
                    </span>
                  ))}
                </h1>

                <Reveal
                  as="p"
                  anim="up-blur"
                  delay={0.32}
                  duration={0.5}
                  /* `text-pretty` earns its place here rather than being
                     decoration: "maintain" is five characters longer than the
                     "fix" it replaced, which at 1440 tipped the paragraph to a
                     fourth line carrying the single word "answers.". The
                     browser's orphan avoidance pulls a word down with it
                     instead. The headline above takes `text-balance` for the
                     different job of evening out two lines it already has. */
                  className="mt-9 max-w-[720px] text-[16px] leading-[1.55] font-medium text-pretty text-white hero-short:mt-[26px]"
                >
                  Confyde is a technical consultancy for businesses that need expertise in AI,
                  software engineering, and strategy. We help plan where AI fits, build agents and
                  automations that take on real work, maintain the software behind them, and connect
                  your data so your people and customers get better answers.
                </Reveal>

                {/* 60px, not the artboard's declared 44px. Its paragraph above
                    never resets the browser's default 1em bottom margin, so the
                    gap it actually renders - and that the design was signed off
                    on - is 44 + 16. Our reset removes that 16, so it is put back
                    here as a real value. */}
                <Reveal
                  anim="up-blur"
                  delay={0.42}
                  duration={0.5}
                  className="mt-15 flex items-center justify-center gap-7 hero-short:mt-12"
                >
                  <NavItem
                    href={BOOKING_URL}
                    tone="dark"
                    className="btn-lime inline-flex h-11 items-center justify-center rounded-xl bg-lime-500 px-10 text-[16px] font-bold whitespace-nowrap text-white shadow-[0_8px_20px_-10px_rgb(51_56_58/0.4)]"
                  >
                    Book a discovery call
                  </NavItem>

                  {/*
                    The second action, deliberately not a second button: the
                    call is the thing to do and this is the way out for someone
                    who is not ready to book one, so it takes the weight of a
                    link rather than competing with the lime.

                    INERT, like the FAQ's "Get in touch" - there is no contact
                    route on this site yet, so it ships as a keyboard-reachable
                    control that announces itself as disabled rather than as a
                    link to nowhere (RULINGS.md §01). Adding `href` is the whole
                    switch when that route lands, and the mailto or the route
                    belongs in lib/, next to BOOKING_URL, so both hero CTAs keep
                    one destination each.
                  */}
                  <NavItem
                    tone="dark"
                    className="text-[16px] font-semibold whitespace-nowrap text-cream underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-white"
                  >
                    Contact us
                  </NavItem>
                </Reveal>
              </div>

              {/* The copy above takes `flex-1`, so this sits at the foot on its
                  own and the free space goes to centring the copy rather than
                  collecting under the button. */}
              {/* The copy above takes `flex-1`, so this sits at the foot on its
                  own and the free space goes to centring the copy rather than
                  collecting under the button. */}
              {/* 1232 is the shared content rail - 1280 less a 24px gutter - so the
                  category strip's dividers line up with the edges of every band
                  below it. The artboard's 1120 predated that rail. */}
              <div className="relative w-full max-w-[1232px] pb-[18px]">
                <HeroCategories />
              </div>
            </div>

            {/* The nav's dark/light flip observes this. It marks where the
                hero's dark pixels end, and the panel is the positioned ancestor
                it pins itself to. Without it the nav stays dark over the cream
                marquee band below. */}
            <NavFlipSentinel />
          </div>

          {/* The artboard draws the trades marquee as the last child of this
              card, not as a band beneath it, so the card's bottom hairline and
              its layered shadow fall below the strip. It arrives as a slot
              rather than an import so the page stays the only place that knows
              what order the sections come in. */}
          {cardFooter}
        </section>
      </div>
    </div>
  );
}
