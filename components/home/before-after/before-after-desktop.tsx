import { Sprout } from "lucide-react";

import { Reveal } from "@/components/primitives/reveal";
import { COPY } from "@/content/before-after";

import { PhoneAfter } from "./phone-after";
import { PhoneBefore } from "./phone-before";

/*
  #E9C9A6 is the "Before Bramble" label tone. It is a one-off warm sand that
  has no role in the colour system, so it stays a commented local constant
  rather than becoming a token (RULINGS.md §02 ruling 5).

  It was the section's suspected contrast failure and it is clean: the rust
  pill composites to #313B22 over forest-900, and this on it measures 7.51:1.
  Do not "correct" it.
*/
const PILL_LABEL_TONE = "#E9C9A6";

const PILL_LABEL = "font-ui text-[11.5px] font-extrabold tracking-[0.12em] uppercase";

/**
 * Section 05, >=1024px.
 *
 * `hidden desk:block` is the whole mutual exclusion with the mobile
 * composition, and it is also what makes the animation system in
 * `styles/motion/before-after.css` need no media query of its own: below
 * 1024px every element it drives is `display: none`.
 *
 * The two artboards are different compositions rather than one that reflows -
 * ten notifications against three, five calm cards against three, different
 * copy on six rows, photographs on one side only and an entire 16s
 * choreography on one side only - so this cannot be a set of `desk:` forks.
 */
export function BeforeAfterDesktop() {
  return (
    <section
      data-section="before-after-desktop"
      className="mx-auto hidden w-full max-w-[1280px] px-6 pb-24 desk:block"
    >
      {/* No shadow and no border: the forest/cream value step is the whole
          elevation story here, per docs/brand.md. */}
      <div className="overflow-hidden rounded-xl bg-forest-900 px-10 pt-16 pb-14">
        <Reveal
          anim="up-blur"
          duration={0.5}
          className="mx-auto mb-12 flex max-w-[660px] flex-col items-center gap-[14px] text-center"
        >
          {/* lime-500 on forest-900 measures 10.24:1. The corrected
              `--color-eyebrow` token exists for lime-700 eyebrows on LIGHT
              surfaces; applying it here would be a visible, unrequested
              darkening of something that already passes. */}
          <span className="text-[12px] font-extrabold tracking-[0.14em] text-lime-500 uppercase">
            {COPY.eyebrow}
          </span>

          {/*
            One `<h2>` in the section, at the same level as the bands above it.

            NO `white-space: nowrap`. The artboard puts `.pf-oneline` on this
            element, and docs/specs/05-before-after.md §5.4 has it winning at
            >=1280px with `text-wrap: balance` inert. Measured in the browser,
            it is the other way round and `.pf-oneline` never applies at all:
            `white-space` and `text-wrap` are both shorthands for
            `text-wrap-mode`, and the INLINE `text-wrap: balance` outranks the
            stylesheet's `white-space: nowrap`. At 1280 and at 1440 the
            artboard's H2 computes `white-space: normal`, `text-wrap-mode: wrap`,
            `text-wrap-style: balance` and renders on two lines, 115px tall.

            The measurement also disposes of the clipping question the spec
            raised: this heading lives in the header block's 660px box, not the
            panel's 1152px content width, so a nowrap line was never going to
            fit at any viewport. Reproducing the rendered result means balance
            alone, and the inert class is not on our markup
            (RULINGS.md principle 1 + §02 ruling 3). Without this, our headline
            sits on one line and everything below it in the section lands 58px
            high against the artboard.
          */}
          <h2 className="display display-2 text-white text-balance">
            {COPY.heading}
          </h2>

          <p className="max-w-[54ch] text-[16px] leading-[1.6] text-forest-200">{COPY.body}</p>
        </Reveal>

        {/* Two 340px columns, 24px apart, centred in the 1152px panel. */}
        <div className="grid items-start justify-center gap-6 [grid-template-columns:repeat(2,minmax(0,340px))]">
          <Reveal
            anim="up-blur"
            delay={0.1}
            duration={0.5}
            className="flex flex-col items-center gap-[22px]"
          >
            {/* The artboard sets `gap: 9px` on a pill with exactly one child.
                Inert, so it is not on our markup (RULINGS.md §02 ruling 3). */}
            <span className="inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--color-rust)_22%,transparent)] px-4 py-[6px] shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-rust)_45%,transparent)_inset]">
              <span className={PILL_LABEL} style={{ color: PILL_LABEL_TONE }}>
                {COPY.pillBefore}
              </span>
            </span>

            <PhoneBefore />

            {/* A sibling of the frame, not a child of it - so it stays outside
                the `role="img"` and is read in full. These two captions are the
                section's argument. */}
            <p className="max-w-[34ch] text-center font-ui text-[14px] leading-[1.55] text-forest-200">
              {COPY.captionBefore}
            </p>
          </Reveal>

          <Reveal
            anim="up-blur"
            delay={0.18}
            duration={0.5}
            className="flex flex-col items-center gap-[22px]"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-lime-500 py-[6px] pr-4 pl-[13px]">
              <Sprout
                size={15}
                strokeWidth={2.2}
                aria-hidden="true"
                className="flex-none text-forest-900"
              />
              <span className={`${PILL_LABEL} text-forest-900`}>{COPY.pillAfter}</span>
            </span>

            <PhoneAfter />

            <p className="max-w-[34ch] text-center font-ui text-[14px] leading-[1.55] text-white">
              {COPY.captionAfter}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
