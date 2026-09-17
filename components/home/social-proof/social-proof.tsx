import { Reveal } from "@/components/primitives/reveal";
import { LANDSCAPERS } from "@/content/landscapers";

import { LandscaperCard } from "./landscaper-card";

/**
 * Section 04.
 *
 * Unlike the hero and the marquee this is ONE composition at two scales, so it
 * is one component with `desk:` forks rather than two subtrees - the four
 * landscaper records exist once in the DOM, not twice behind `hidden`.
 *
 * TYPE FAMILIES. The names, organisations, avatar initials and pill labels are
 * set in the product faces (`--font-ui` / `--font-ui-serif`, i.e. Hanken
 * Grotesk and Source Serif 4) at BOTH breakpoints. The desktop artboard already
 * does this; the mobile artboard sets the same content in Nunito Sans and
 * Fraunces. The client was asked with both renders in hand and confirmed
 * desktop is correct, so mobile changes to match - which supersedes §03/04
 * ruling 3 and docs/specs/04-social-proof.md §6 defect 3.
 *
 * COLOUR. The eyebrow uses `--color-eyebrow-mobile` / `--color-eyebrow`, the
 * accessibility-corrected pair, not the artboards' `#7E9A2B` and `lime-700`.
 * Both of those measure ~2.3-2.9:1 against their own surfaces where AA needs
 * 4.5:1 at these sizes. They are their own tokens rather than edits to
 * `lime-700`, which passes elsewhere at other sizes.
 */
export function SocialProof() {
  return (
    /*
      Two bands in one. Below 1024: 16px gutters stepping to 32px at 640px, with
      the content capped at 560px - 592px and 624px here are that cap plus its
      gutters. Above: the page's 1280px container with 24px gutters and 96px of
      vertical air.

      [LOG] The 16px gutter below 640px is 4px tighter than the hero's and the
      marquee's 20px, so the left edge steps in by 4px as you scroll past the
      marquee. That step is in the artboards and is reproduced rather than
      harmonised (RULINGS.md §03/04 ruling 16).

      No background of its own: this is the first band on the raw page surface
      after the hero's card closes.
    */
    <section
      data-section="social-proof"
      className="mx-auto w-full max-w-[592px] px-4 py-[34px] sm-only:max-w-[624px] sm-only:px-8 desk:max-w-[1280px] desk:px-6 desk:py-24"
    >
      <Reveal
        anim="up-blur"
        duration={0.5}
        className="mb-[18px] flex flex-col text-center desk:mx-auto desk:mb-8 desk:max-w-[640px] desk:items-center desk:gap-3"
      >
        {/*
          Neither artboard's eyebrow matches our `.eyebrow` utility - desktop is
          12px/800, mobile 11px/700 - so both ship as literals here.
        */}
        <span className="text-[11px] font-bold tracking-[0.14em] text-eyebrow-mobile uppercase desk:text-[12px] desk:font-extrabold desk:text-eyebrow">
          Built with the landscaping community
        </span>

        {/*
          One `<h2>`, at the same level as the marquee's, so the outline runs
          h1 -> h2 -> h2 with no skip.

          `.display` carries family and weight; `.display-2-mobile` overrides
          only the three properties the mobile artboard voices differently
          (opsz 32, line-height 1.14, tracking -0.005em) and falls away at desk.
          The sizes and desktop metrics are utilities because that is how the
          hero writes the same kind of override.

          `text-balance` is desktop-only: the mobile artboard does not balance.
        */}
        <h2 className="display display-2-mobile mt-[10px] text-[26px] text-ink desk:mt-0 desk:text-[3rem] desk:leading-[1.2] desk:tracking-[-0.008em] desk:text-balance desk:text-pf-ink-900">
          Landscapers &amp; designers who stand behind Confyde.
        </h2>
      </Reveal>

      {/*
        [ADDITION - docs/specs/04-social-proof.md §6 defect 1.] The desktop
        artboard reveals each of the four cards individually, all with the same
        duration and no delay, so they animate in unison. One `<Reveal>` on the
        grid is the same rendered result for a quarter of the observers. The
        mobile artboard has no reveals at all; `Reveal` has no breakpoint fork
        and the entrance system is page-wide rather than per-section, so it runs
        at every width here. Both are logged.

        `auto-fit minmax(220px, 1fr)` is shipped verbatim although it never
        reflows on this page: there are exactly four items and at least four
        tracks fit at every width from 1024px up, so it is always 4 across and
        the card width runs continuously from 232px to 296px.
      */}
      <Reveal
        anim="up-blur"
        duration={0.5}
        className="grid gap-3 [grid-template-columns:repeat(2,minmax(0,1fr))] desk:gap-4 desk:[grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]"
      >
        {LANDSCAPERS.map((landscaper) => (
          <LandscaperCard key={landscaper.name} landscaper={landscaper} />
        ))}
      </Reveal>

    </section>
  );
}
