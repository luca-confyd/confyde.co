import { Reveal } from "@/components/primitives/reveal";
import { INTEGRATIONS } from "@/content/integrations";

import { IntegrationTile } from "./integration-tile";

/**
 * Section 06, integrations.
 *
 * One composition at two scales, like section 04: one component with `desk:`
 * forks rather than two subtrees, so the ten tile records exist once in
 * the DOM rather than twice behind `hidden`.
 *
 * HEADING LEVEL. `<h2>`. This band sits between the chapter 2 and chapter 3
 * banners, both of which are `<h1>`, so an `<h2>` reads as a section of
 * chapter 2 and the outline runs h1 -> h2 with no skip. It also matches the
 * marquee's and social proof's level, which is where the artboard puts it too.
 *
 * COLOUR. This IS one of the lime-700-on-light eyebrow call sites the corrected
 * tokens were made for - unlike section 05's, which is lime-500 on forest and
 * passes at 10.24:1 (RULINGS.md §05 ruling 6). But it is the first one that
 * sits on `card-muted` (#E7E2D8) rather than the canvas or surface-300 the
 * original pair was computed against, and that darker surface eats the
 * headroom: measured on the composited pixels, `--color-eyebrow` reaches only
 * 3.70:1 here and `--color-eyebrow-mobile` 3.91:1, where 11-12px needs 4.5:1.
 * So this section uses `--color-eyebrow-muted` / `--color-eyebrow-muted-mobile`,
 * the same colours darkened again by the smallest step that clears AA on
 * card-muted (4.55:1 and 4.56:1). Any eyebrow on a card-muted panel wants this
 * pair, not the canvas one.
 */
export function Integrations() {
  return (
    /*
      No top padding at either scale - the before/after band above closes with
      its own bottom padding, and both artboards let that be the whole gap.

      Below 1024 the content is capped at 560px, the page-wide measure that
      specs 02 and 04 established; 592px here is that cap plus its two 16px
      gutters. The mobile artboard is a fixed 430px column with no media
      queries, so it does not draw the cap itself - but without one the two
      tile columns reach ~495px each at 1023px, which is wider than the desktop
      grid ever draws a tile and wider than the measure the rest of the page
      holds to. Applied for consistency with the bands either side of it.

      Gutters are a flat 16px below 1024. Section 04 steps its gutter at 640px;
      this artboard does not, so there is no `sm-only:` fork to make here.
    */
    <section
      data-section="integrations"
      className="mx-auto w-full max-w-[592px] px-4 pb-[34px] desk:max-w-[1280px] desk:px-6 desk:pb-24"
    >
      {/*
        The panel. `card-muted` is the one tile tone that sits BELOW the canvas -
        the brand's "reach for it when something should recede, not separate" -
        and it is what makes ten white tiles read as one group rather than
        ten more cards on the page.

        `overflow-hidden` with a 12px radius is what clips the tiles' corners
        against the panel's.

        [ADDITION] The mobile artboard has no reveal here; `Reveal` has no
        breakpoint fork because the entrance system is page-wide rather than
        per-section, so the desktop `scale` entrance runs at every width. Same
        call, and same log, as section 04.
      */}
      <Reveal
        anim="scale"
        duration={0.5}
        className="overflow-hidden rounded-xl bg-card-muted px-4 pt-6 pb-[18px] desk:px-10 desk:py-12"
      >
        <div className="text-center desk:mx-auto desk:mb-8 desk:flex desk:max-w-[640px] desk:flex-col desk:items-center desk:gap-3">
          {/* Neither artboard's eyebrow matches our `.eyebrow` utility - desktop
              is 12px/800, mobile 11px/700 - so both ship as literals, exactly as
              section 04 writes the same pair. */}
          <span className="text-[11px] font-bold tracking-[0.14em] text-eyebrow-muted-mobile uppercase desk:text-[12px] desk:font-extrabold desk:text-eyebrow-muted">
            Plays nicely
          </span>

          {/*
            `.display` carries family and weight; `.display-2-mobile` overrides
            only the three axes the mobile artboard voices differently and falls
            away above 1024, where `.display`'s own desktop cut takes over. The
            sizes and desktop metrics are utilities, which is how the hero and
            section 04 write the same override.

            `text-balance` is desktop-only: the mobile artboard does not balance
            this heading, and at 24px over a 390px measure it does not need to.
          */}
          <h2 className="display display-2-mobile mt-[10px] mb-2 text-[24px] text-ink desk:mt-0 desk:mb-0 desk:text-[3rem] desk:leading-[1.2] desk:tracking-[-0.008em] desk:text-balance desk:text-pf-ink-900">
            We work with what you already have.
          </h2>

          {/* One paragraph now. The two artboards wrote different sentences
              here and both shipped, gated by breakpoint; the replacement copy is
              the same on both, so the split has nothing left to carry. */}
          <p className="m-0 mb-4 max-w-[52ch] text-[14px] leading-[1.55] text-slate-700 desk:mb-0 desk:text-[16px] desk:leading-[1.6] desk:text-pf-ink-700">
            No rip and replace. We build on the systems your business already runs on, so nothing
            has to move.
          </p>
        </div>

        {/*
          `auto-fit minmax(210px, 1fr)` is the desktop artboard's own track
          definition and it does reflow here, unlike section 04's: across a
          1104-1360px content box it gives four tracks from 1024px up and five
          above ~1226px. At ten tiles that is 4+4+2 at the switch width and 5+5
          at 1280px and 1440px - the wide case now fills both rows exactly,
          where eight tiles used to leave a 5+3 row with two gaps in it.
        */}
        <div className="grid gap-[10px] [grid-template-columns:repeat(2,minmax(0,1fr))] desk:gap-3 desk:[grid-template-columns:repeat(auto-fit,minmax(210px,1fr))]">
          {INTEGRATIONS.map((integration) => (
            <IntegrationTile key={integration.name} integration={integration} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
