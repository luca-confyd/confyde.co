import { Reveal } from "@/components/primitives/reveal";
import { GET_BACK, GET_BACK_CARDS } from "@/content/what-you-get-back";

import { DAPPLED_FOREST } from "./dappled-forest";

/**
 * "What you get back", desktop composition.
 *
 * Three cards on a dappled forest plate. Mutually exclusive with
 * `what-you-get-back-mobile.tsx` at 1024px - the mobile artboard draws no plate
 * at all, so the two are different compositions rather than one that reflows.
 */
export function WhatYouGetBackDesktop() {
  return (
    <section
      data-section="what-you-get-back-desktop"
      className="mx-auto hidden w-full max-w-[1280px] px-6 pb-24 desk:block"
    >
      <div className="rounded-xl px-12 pt-18 pb-16" style={DAPPLED_FOREST}>
        <Reveal
          anim="up-blur"
          duration={0.5}
          className="mx-auto mb-14 flex max-w-[760px] flex-col items-center gap-4 text-center"
        >
          {/*
            [CONTRAST - tech lead to rule.] The artboard sets this eyebrow in
            lime-700 (#95B225), NOT the bright lime-500 the before/after band's
            eyebrow uses on the same forest tone. Measured against the rendered
            plate it lands below AA for 12px text. `--color-eyebrow` is not the
            fix: that token darkens lime-700 for LIGHT surfaces and would make
            this worse. The smallest change that clears the threshold is
            lime-500, which is also what every other on-forest eyebrow on the
            page already uses - see the section's report for the measured
            ratios. Shipped as drawn pending the ruling, because switching it is
            a visible colour change on the design.
          */}
          <span className="text-[12px] font-extrabold tracking-[0.14em] text-lime-700 uppercase">
            {GET_BACK.eyebrow}
          </span>

          {/*
            `<h2>`, matching the page's other section headings. `.display` +
            `.display-2` reproduce the artboard's `.pf-h2` exactly.

            The hard break is the artboard's, and `text-balance` is applied over
            it: the break sets the two lines the client wants and balance keeps
            the second from orphaning if the measure ever narrows.
          */}
          <h2 className="display display-2 text-white text-balance">
            {GET_BACK.headingFirst}
            <br />
            {GET_BACK.headingSecond}
          </h2>
        </Reveal>

        {/*
          `auto-fit minmax(260px, 1fr)` with exactly three cards: three tracks
          fit from 1024px up, so it is always 3 across and the card width runs
          continuously from ~269px to ~381px.
        */}
        <div className="grid items-stretch gap-5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          {GET_BACK_CARDS.map((card, index) => (
            /*
              [LOG] 18px radius. docs/brand.md bans 16px and above and names 12
              as the card radius, and every other card on this page is 12. It is
              what the artboard draws, so it ships (RULINGS.md principle 1) -
              but it is the one value in these three bands that contradicts the
              brand doc outright rather than merely sitting off the scale.

              `shadow-border-default` on a near-white card over a dark plate is
              the artboard's own choice and it does read: the hairline is what
              separates the card from the forest behind it.
            */
            <Reveal
              key={card.lead}
              anim="up-blur"
              delay={index * 0.08}
              duration={0.5}
              className="shadow-border-default flex flex-col gap-2.5 rounded-[18px] bg-pf-surface-50 px-7 py-8"
            >
              {/* `--color-eyebrow`, the corrected tone: lime-700 on this
                  near-white card measures ~2.3:1 where AA needs 4.5:1. */}
              <span className="text-[11.5px] font-extrabold tracking-[0.12em] text-eyebrow uppercase">
                {card.eyebrowDesktop}
              </span>

              {/*
                Fraunces at a plain weight 600, not `.display`: the artboard
                sets the family and the weight here and no variation axes, so
                `.display`'s desktop cut (wght 420, SOFT 100, opsz 10) would
                render these figures visibly lighter than drawn.
              */}
              <span className="font-display text-[34px] leading-[1.05] font-semibold text-pf-ink-900">
                {card.figureDesktop}
              </span>

              <span className="text-[15.5px] leading-[1.35] font-bold text-pf-ink-900">
                {card.lead}
              </span>

              {/*
                `mt-auto` pins the body to the foot of the stretched card, which
                is what keeps the three rules level across a row whose leads run
                to one line or two.

                [LOG] The artboard's third card carries an empty `<p><br></p>`
                between the lead and this paragraph. It is editor debris - an
                empty paragraph a screen reader announces as a blank - and with
                `mt-auto` doing the alignment it earns nothing, so it is dropped
                (RULINGS.md principle 1's corollary on inert markup).
              */}
              <p className="mt-auto border-t border-pf-ink-200 pt-3.5 text-[14.5px] leading-[1.55] text-slate-500">
                {card.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
