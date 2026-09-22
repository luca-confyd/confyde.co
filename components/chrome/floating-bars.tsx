"use client";

import { BOOKING_URL } from "@/lib/booking";
import { useFloatingBars } from "@/lib/use-floating-bars";
import { NavItem } from "./nav-item";

/* WHITE, not `bg-card`, and the difference is no longer cosmetic. The old
   palette set `--color-card` to #FFFFFF under a stated rule - "white = a thing
   you read or act on, beige = the space between things" - and this bar is as
   much a thing to act on as anything on the page. The cream-and-petrol palette
   redefined that token to #F1EEE6, which is the same value as `pf-surface-500`,
   the hero panel and the marquee band; the bar went beige with it and started
   reading as the page surface floating on top of itself.

   Pinned here rather than fixed in the token, because `bg-card` has eighteen
   other call sites that DO want the warm surface. This is the one that wanted
   the original rule. */
const BAR = "shadow-overlay flex items-center rounded-xl bg-white";

/**
 * The mid-page quiz teaser. Shown once the reader is a full screen down and
 * there is still more than 1700px of document below the fold.
 */
function TrailerBar() {
  return (
    <div className={`${BAR} gap-4 p-2.5`}>
      <span className="flex flex-col gap-0.5 leading-[1.3]">
        {/* A third Fraunces cut, neither the .display default (opsz 40) nor its
            desktop override (wght 420 / SOFT 100 / opsz 10). Bar-specific, so it
            is set here rather than pulled from the type scale. */}
        <span className="font-display text-[16px] whitespace-nowrap text-pf-ink-900 [font-variation-settings:'wght'_600,'SOFT'_60,'opsz'_24]">
          Not sure where to start?
        </span>
        {/* Hanken Grotesk, the app's own face: the artboard sets --font-sans
            here and on the CTA below, which resolves through its linked token
            file (RULINGS.md, ruling 9). */}
        <span className="font-ui text-[13.5px] whitespace-nowrap text-pf-ink-700">
          Get a straight answer for your business.
        </span>
      </span>

      <NavItem
        href={BOOKING_URL}
        tone="light"
        className="btn-lime inline-flex h-10 flex-none items-center rounded-xl bg-lime-500 px-5 font-ui text-[14px] font-semibold whitespace-nowrap text-white shadow-[0_8px_20px_-10px_rgb(51_56_58/0.4)]"
      >
        Book a discovery call
      </NavItem>

    </div>
  );
}

/**
 * The desktop floating bars: one fixed shell at the bottom centre, two mutually
 * exclusive variants, one shared animation wrapper.
 *
 * No `aria-live`: a bar that arrives on scroll must not interrupt a screen
 * reader mid-sentence.
 *
 * The wrapper is `inert` as well as `pointer-events: none` while hidden -
 * without it the CTA stays in the tab order while
 * invisible.
 */
export function FloatingBars() {
  const { phase } = useFloatingBars();
  const hidden = phase === "hidden";

  return (
    <div
      role="complementary"
      aria-label="Promotion"
      className="fixed bottom-5 left-1/2 z-[60] hidden -translate-x-1/2 desk:block"
    >
      <div className="bars-wrapper" data-shown={!hidden} inert={hidden} aria-hidden={hidden}>
        <TrailerBar />
      </div>
    </div>
  );
}
