import Image from "next/image";
import { Fragment } from "react";

import type { ReactNode } from "react";

import { NavFlipSentinel } from "@/components/chrome/nav-flip-sentinel";
import { NavItem } from "@/components/chrome/nav-item";
import { Reveal } from "@/components/primitives/reveal";

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
----------------------------------------------------------------------------- */

const HEADLINE_LINES = [
  {
    tone: "",
    words: [
      { word: "Clear", delay: 0 },
      { word: "technical", delay: 0.045 },
      { word: "direction", delay: 0.09 },
    ],
  },
  {
    // The artboard's headline is two lines with the second in lime, and that
    // two-tone break is the hero's signature. The new single sentence is split
    // at its own clause boundary to keep it.
    tone: "text-lime-500",
    words: [
      { word: "for", delay: 0.2 },
      { word: "scaling", delay: 0.245 },
      { word: "businesses.", delay: 0.29 },
    ],
  },
];

/* -----------------------------------------------------------------------------
   Layers.

   Long gradients are pulled out of the markup because a four-stop `linear-gradient`
   written as an arbitrary value is unreadable at the call site. They stay single
   string literals so Tailwind's scanner still sees a complete class.
----------------------------------------------------------------------------- */

/* Four stops in oklab - srgb would bruise the mid-tones as the dark fades out.
   The scrim is load-bearing rather than decorative: it is what holds white copy
   at 4.5:1 over a photograph.

   A NEUTRAL dark, deliberately, and not the brand petrol. This washes the whole
   photograph, so tinting it would push the image towards the brand hue and turn
   a photograph into a swatch. It was forest-900 when the palette was green and
   read as a green photograph; it is #171A1B now and stays neutral through
   palette changes. */
const SCRIM =
  "absolute inset-0 bg-[linear-gradient(to_top,rgb(23_26_27/0.88)_0%,rgb(23_26_27/0.74)_32%,rgb(23_26_27/0.34)_66%,transparent_92%)]";

/* A second, softer pool of ink behind the copy column alone, so the headline
   holds even where the photograph is bright. `-z-10` is load-bearing: this is
   the only positioned element among static siblings, so without it the pool
   paints on top of the very copy it exists to support. It bleeds 56px above the eyebrow
   and 48px below the CTAs - asymmetric, because there is more photograph to
   subdue above. rgba(13,15,16) is a one-off neutral ink darker than the scrim
   above; like the scrim it is deliberately untinted, and it has no role in the
   system to name, so it stays a literal. */
const VIGNETTE =
  "pointer-events-none absolute -z-10 -top-14 -bottom-12 left-1/2 w-[min(1180px,116%)] -translate-x-1/2 bg-[radial-gradient(ellipse_62%_58%_at_50%_46%,rgba(13,15,16,.74)_0%,rgba(13,15,16,.6)_58%,rgba(13,15,16,0)_100%)]";

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
            {/* #171A1B is the paint-flash colour behind the photograph, and it
                is the flat colour the photograph fades into, so it is a
                NEUTRAL dark and not the brand petrol: tinting it would pull
                the whole photograph towards the brand hue. Light enough that
                the panel does not read as a black hole before the image
                decodes. Not a token. It was #20361f when the dark panels were
                green, which had this same problem. */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-[#171A1B]">
              <Image
                src="/images/hero-lifestyle.webp"
                alt=""
                fill
                /* The LCP element. `priority` is deprecated in Next 16, so the
                   two things it used to set are set directly. Quality 90 rather
                   than the default 75: compression artefacts are visible
                   against this photograph's flat sky. */
                loading="eager"
                fetchPriority="high"
                quality={90}
                /* Both heroes are in the DOM at every width, so the inactive
                   one is told it renders at 1px and the browser picks the
                   smallest candidate for it instead of a full-width plate. */
                sizes="(min-width: 1024px) 100vw, 1px"
                className="object-cover [object-position:center_62%]"
              />
              <div className={SCRIM} />
            </div>

            {/* px-6, matching the content rail's gutter. At widths below 1280 this
                padding is what bounds the category strip rather than its 1232
                cap, so px-5 put the strip 4px outside every band beneath it. */}
            <div className="relative z-20 flex w-full flex-1 flex-col items-center px-6">
              {/* The copy column is 1000px and the stat strip below it is
                  1120px. The difference is intentional: the sentence wants a
                  readable measure, the figures want the full width. */}
              <div className="relative flex w-full max-w-[1000px] flex-1 flex-col items-center justify-center text-center">
                <div aria-hidden="true" className={VIGNETTE} />

                <h1 className="display display-1 text-balance text-pf-ink-100 [text-shadow:0_2px_18px_rgb(0_0_0/0.45)] hero-short:text-[4.25rem]">
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
                  className="mt-9 max-w-[720px] text-[16px] leading-[1.55] font-medium text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.5)] hero-short:mt-[26px]"
                >
                  Confyde is a technical consultancy for businesses that need expertise in AI,
                  software engineering, and strategy. We help plan where AI fits, build agents and
                  automations that take on real work, fix the software behind them, and connect
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
                  className="mt-15 flex justify-center hero-short:mt-12"
                >
                  <NavItem
                    tone="dark"
                    className="btn-lime inline-flex h-11 items-center justify-center rounded-xl bg-lime-500 px-10 text-[16px] font-bold whitespace-nowrap text-white shadow-[0_8px_20px_-10px_rgb(51_56_58/0.4)]"
                  >
                    Book a discovery call
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
