import { NavItem } from "@/components/chrome/nav-item";
import { CTA_CHIPS_MOBILE } from "@/content/cta-stage";

import { CtaChipStatic } from "./cta-chip";

/* The mobile hero's own CTA pair, re-worn. 52px, 12px radius, 16.5px/700,
   stacked full width with 10px between them - so the band's buttons are the
   same object the reader already met at the top of the page. Full width also
   solves the desktop's fixed 288px for free: 288 plus two 16px gutters
   overflows a 320px viewport. */
const CTA = "flex h-[52px] items-center justify-center rounded-xl text-[16.5px] font-bold";

/**
 * [ADDITION, NOT A PORT] The CTA band below 1024px.
 *
 * The mobile artboard has no CTA stage: no chips, no field, and none of this
 * section's five strings appear in it. There is nothing to port, so §8 of the
 * spec is a designer decision in full and this is the build of it.
 *
 * A 200vh pinned scrub is the wrong instrument on a phone regardless. It fights
 * the browser's own URL-bar collapse, it spends two screens of scrolling on one
 * sentence, and `position: sticky` over a `100vh` child with a dynamic viewport
 * is the commonest source of jank on mobile Safari. But the section carries a
 * real headline and two real CTAs, and below 1024 the page would otherwise run
 * customer stories -> testimonials -> FAQ with no mid-page conversion surface at
 * all, the three inline CTA bands having been cut mid-build. Losing it would be
 * a content regression, not a simplification.
 *
 * So: a static band. No pin, no scrub, no progress value, and zero JavaScript at
 * any width below 1024. What is deliberately lost is the pin, the scrub, the
 * word reveal, the chip spread, the drift, the growing field and eight of the
 * eleven company names. What survives is the headline, the line, both CTAs and
 * the section's colour identity - the whole of the argument and none of the
 * choreography, which is the right trade on a phone.
 *
 * Geometry is the mobile artboard's standard band: 16px side gutters, 34px
 * below, a 12px-radius white panel. White because docs/brand.md is explicit
 * that white is a thing you read or act on, and a CTA is a thing you act on. No
 * shadow and no border - cards carry neither; the value step is the elevation.
 */
export function CtaBandMobile() {
  return (
    <section data-section="cta-band-mobile" className="px-4 pb-[34px] desk:hidden">
      {/*
        The field survives, statically: the panel carries the p = 1 gradient
        scaled to itself rather than to the viewport, and is never touched
        again. It is the one declaration that makes the two breakpoints read as
        the same section rather than two unrelated CTAs. No mask - the panel has
        a 12px radius and clips, so there is no seam to dissolve.
      */}
      <div className="cta-band-mobile relative flex flex-col gap-3 overflow-hidden rounded-xl bg-card px-4 pt-7 pb-6 text-center">
        {/*
          One string with a real space, both sentences at full opacity - there
          is no scrub here to reveal the second one. `balance` rather than a
          hard <br>, the same call RULINGS.md §05 ruling 9 made for the mobile
          before/after headline and for the same 320px-orphan reason.

          26px is the mobile artboard's own section-heading size, which is what
          every other mobile <h2> on this page uses.
        */}
        <h2 className="display display-2-mobile text-[26px] text-pf-ink-900 [text-wrap:balance]">
          The best landscapers aren’t quoting at midnight. They’ve got Confyde doing it.
        </h2>

        {/* The desktop copy verbatim, em dash included. There is no mobile
            wording to preserve, so this is a port of copy rather than an
            invention and §02 ruling 12's "preserve both" does not apply. */}
        <p className="m-0 text-[14.5px] leading-[1.55] text-pf-ink-900">
          Scope, price and send a quote in minutes — not late-night hours.
        </p>

        {/* Both inert, same as desktop, same 2px forest ring on a light surface. */}
        <div className="flex flex-col gap-2.5">
          <NavItem
            tone="light"
            className={`btn-lime ${CTA} bg-lime-500 text-forest-900 shadow-[0_8px_20px_-10px_rgb(21_48_31/0.5)]`}
          >
            Get started for free
          </NavItem>
          <NavItem tone="light" className={`shadow-border-strong ${CTA} bg-card text-pf-ink-900`}>
            Talk to our team
          </NavItem>
        </div>

        {/*
          Three chips, not eleven and not zero. They are the only thing in the
          band that says "other landscapers already do this"; eleven wrapped
          pills on a 288px measure would be five rows of noise under the button
          the band exists to get pressed. `aria-hidden` once on the row, for the
          same reason the desktop layer is hidden.
        */}
        <div aria-hidden="true" className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {CTA_CHIPS_MOBILE.map((chip) => (
            <CtaChipStatic key={chip.name} chip={chip} />
          ))}
        </div>
      </div>
    </section>
  );
}
