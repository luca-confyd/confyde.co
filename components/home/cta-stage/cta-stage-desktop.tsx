import { Fragment, type CSSProperties } from "react";

import { NavItem } from "@/components/chrome/nav-item";
import { CTA_CHIPS, CTA_TAIL_WORDS } from "@/content/cta-stage";

import { CtaChip } from "./cta-chip";
import { CtaScrubStage } from "./cta-scrub-stage";

/**
 * The pinned, scroll-scrubbed CTA stage, >=1024px.
 *
 * `hidden desk:block` is the whole mutual exclusion with the mobile band. It
 * matters that it is `display: none` and not `opacity-0` or `sr-only`: the
 * hidden composition leaves the accessibility tree, so although two headings
 * exist in the DOM only one is ever exposed - and, because a `display: none`
 * element never intersects, the scroll listener is never attached below 1024px
 * without a second media query to keep in step with this one.
 *
 * Height is two viewports plus 600px. The 600 is not decoration: the sticky
 * child pins for `offsetHeight − innerHeight = 100vh + 600px` of scrolling, and
 * that is the entire scrub - 1500px at 1440x900.
 *
 * `vh` rather than `svh`/`dvh` as drawn. On desktop they are identical, and
 * this composition never renders where they diverge.
 */
export function CtaStageDesktop() {
  return (
    <CtaScrubStage className="cta-stage relative hidden h-[calc(200vh+600px)] desk:block">
      {/* One viewport tall, pinned to the top. Three layers in DOM order and
          therefore in paint order: field, chips, copy. `overflow-hidden` clips
          all three to the viewport box. */}
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/*
          The ambient field. Its four-stop vertical mask - transparent, opaque
          from 16% to 84%, transparent - is what stops the gradient drawing a
          hard horizontal seam against the sections above and below; on a 900px
          viewport that is a 144px dissolve at each end.

          `-webkit-mask-image` alongside `mask-image`: Safari still needs the
          prefix for the shorthand in this position (same call as RULINGS.md §01
          ruling 6). Tailwind does not emit the prefixed form, so the pair is
          written in styles/motion/cta-stage.css with the gradient itself.
        */}
        <div id="cta-field" aria-hidden="true" className="pointer-events-none absolute inset-0" />

        {/*
          The chip layer.

          `inset-x-0 mx-auto` rather than the artboard's bare `margin: 0 auto`,
          which is inert on an absolutely-positioned box with `left: auto;
          right: auto` - auto margins only resolve against a constrained box.
          Above 1920px the artboard's layer is centred only because the parent
          flex container happens to resolve its static position that way. With
          the two insets present `mx-auto` is real, and the behaviour is
          identical at every width including >1920px. Spec D2.

          `aria-hidden` once, on the layer, not on each chip. Eleven fictional
          company names are decoration, not information: a sighted reader takes
          them in as a shape and never reads `Bluestone Co.`, and serialised
          they would be eleven invented proper nouns interposed between a
          headline and its two buttons. Worse, `opacity` and `filter` do not
          remove anything from the accessibility tree, so at p = 0 a virtual
          cursor would read out eleven chips that are invisible on screen. The
          page has already made this argument twice with real named customers,
          in social proof and in customer stories.
        */}
        <div
          id="cta-chips"
          aria-hidden="true"
          className="absolute inset-x-0 top-0 mx-auto h-screen w-full max-w-[1920px] overflow-hidden"
        >
          {CTA_CHIPS.map((chip) => (
            <CtaChip key={chip.name} chip={chip} />
          ))}
        </div>

        {/* The copy block. `z-10` is what keeps chip 7 behind the button row. */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center gap-6 px-5 text-center">
          {/*
            Exactly one <h2>, so the outline runs unbroken from testimonials to
            customer stories.

            `text-wrap: balance` balances line 1, which is a block span with real
            inline content. It does nothing to the tail, which is a flex
            container - flex items are not text runs. It ships as drawn because
            it is doing real work on the half of the headline it can reach (D12).

            The spaces between the spans are load-bearing and invisible. The
            artboard has no whitespace of any kind between them, so its heading's
            text content is literally `midnight.They'vegotConfydedoingit.` - that
            is what a screen reader announces and what the clipboard receives. It
            renders correctly only because `column-gap` fakes the word spaces.
            Whitespace-only text between flex items does not generate an
            anonymous flex item, so putting the spaces back changes nothing
            visually. Spec D3, §9.5.
          */}
          <h2 className="display display-2 text-pf-ink-900 [text-wrap:balance]">
            <span className="block">The best landscapers aren’t quoting at midnight.</span>{" "}
            <span className="flex flex-wrap justify-center gap-x-[0.3em]">
              {CTA_TAIL_WORDS.map((word, i) => (
                <Fragment key={word}>
                  {/* Between the spans, not inside them: a whitespace-only text
                      node between flex items is discarded rather than becoming
                      an item, but it still lands in `textContent`. Inside a span
                      it would be real trailing whitespace with a real width. */}
                  {i > 0 ? " " : null}
                  <span className="cta-word" style={{ "--wi": i } as CSSProperties}>
                    {word}
                  </span>
                </Fragment>
              ))}
            </span>
          </h2>

          {/* The spaced em dash is the client's. docs/brand.md bans em dashes in
              copy; RULINGS.md principle 3 says we flag rather than edit. D9. */}
          <p className="m-0 text-[18px] text-pf-ink-900">
            Scope, price and send a quote in minutes — not late-night hours.
          </p>

          {/*
            Both CTAs are inert. No destination exists and wiring one is out of
            scope (RULINGS.md §01), so both render as
            `<button type="button" aria-disabled="true">` behind the same NavItem
            the nav uses: keyboard-reachable, announced honestly, no `#` in the
            URL bar. `tone="light"` is the 2px forest ring - both sit on a light
            surface, and the artboard draws no focus style at all, so the brand
            doc governs (RULINGS.md principle 4).

            A fixed-width primary beside an auto-width secondary is as drawn. The
            primary's `padding: 0 16px` is inert against its fixed 288px with
            centred content, so it is dropped rather than transcribed (D10).
          */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <NavItem
              tone="light"
              className="btn-lime inline-flex h-[38px] w-[288px] items-center justify-center rounded-xl bg-lime-500 text-[16px] font-bold text-forest-900 shadow-[0_8px_20px_-10px_rgb(21_48_31/0.4)]"
            >
              Get started for free
            </NavItem>
            <NavItem
              tone="light"
              className="shadow-border-strong inline-flex h-[38px] items-center justify-center rounded-xl bg-card px-5 text-[16px] font-bold text-pf-ink-900"
            >
              Talk to our team
            </NavItem>
          </div>
        </div>
      </div>
    </CtaScrubStage>
  );
}
