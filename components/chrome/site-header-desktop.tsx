import { ChevronDown, MoveRight } from "lucide-react";

import { NavItem } from "./nav-item";
import { DesktopNavHeader } from "./nav-theme-header";
import { Wordmark } from "./wordmark";

/*
 * The two pills carry the whole surface; the header element itself has no
 * padding, background, border or shadow.
 *
 * The glass recipe is gated on `@supports` rather than layered under a fallback
 * because the two are mutually exclusive: with no backdrop-filter, a 10%-white
 * gradient over a photograph does not hold `--color-pf-ink-100` text, so that
 * branch raises it to a flat 14% wash instead of blurring.
 */
const PILL =
  "flex items-center rounded-xl py-[3px] pr-1.5 pl-[5px] transition-[background,box-shadow] duration-300 " +
  "group-data-[nav-state=dark]:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07),inset_0_1px_1px_rgb(255_255_255/0.04),0_2px_8px_rgb(0_0_0/0.1)] " +
  "group-data-[nav-state=dark]:supports-[(backdrop-filter:blur(1px))_or_(-webkit-backdrop-filter:blur(1px))]:bg-linear-to-b " +
  "group-data-[nav-state=dark]:supports-[(backdrop-filter:blur(1px))_or_(-webkit-backdrop-filter:blur(1px))]:from-white/10 " +
  "group-data-[nav-state=dark]:supports-[(backdrop-filter:blur(1px))_or_(-webkit-backdrop-filter:blur(1px))]:to-white/5 " +
  "group-data-[nav-state=dark]:supports-[(backdrop-filter:blur(1px))_or_(-webkit-backdrop-filter:blur(1px))]:backdrop-blur-[12px] " +
  "group-data-[nav-state=dark]:not-supports-[((backdrop-filter:blur(1px))_or_(-webkit-backdrop-filter:blur(1px)))]:bg-white/14 " +
  "group-data-[nav-state=light]:bg-none group-data-[nav-state=light]:bg-card " +
  "group-data-[nav-state=light]:shadow-[0_0_0_1px_var(--color-pf-ink-200),0_3px_8px_-3px_color-mix(in_oklch,var(--color-pf-ink-900)_8%,transparent)]";

/*
 * The artboard sets this inline as 30%-white in both states, which is invisible
 * on the white pill. It flips to the hairline token on light, on the same .3s as
 * the pill under it.
 */
const DIVIDER =
  "h-4 w-px transition-colors duration-300 " +
  "group-data-[nav-state=dark]:bg-white/30 group-data-[nav-state=light]:bg-hairline";

/* `.on-light`'s hover is `--color-pf-ink-100` as a *background*: the brand's pale
   warm hover wash on white, not a text colour. */
const NAV_LINK =
  "flex items-center rounded-md py-[5px] text-[15px] font-semibold transition-[color,background] duration-200 " +
  "group-data-[nav-state=dark]:text-pf-ink-100 group-data-[nav-state=dark]:hover:bg-white/8 " +
  "group-data-[nav-state=light]:text-pf-ink-900 group-data-[nav-state=light]:hover:bg-pf-ink-100";

/*
 * The signup button is the one element that swaps component across the flip:
 * glass on dark, ink on light. Only the fill moves - radius, size, padding and
 * type are identical in both states, matching the brand's "press is colour
 * only".
 *
 * It does not reach for `.btn-glass` / `.btn-ink` because the swap is per-state
 * and those are plain classes. Reproducing them here costs nothing: the inline
 * shadow below outranks both classes' shadows in the artboard, so the only
 * rendered difference between the two components on this button is the fill and
 * its hover.
 */
const SIGNUP =
  "inline-flex h-[30px] items-center justify-center gap-2 rounded-xl bg-bottom bg-no-repeat px-4 " +
  "text-[14px] font-bold whitespace-nowrap text-pf-ink-100 " +
  "shadow-[0_6px_16px_-8px_rgb(0_0_0/0.4)] " +
  "transition-[background-color,background-size,box-shadow] duration-200 " +
  "group-data-[nav-state=dark]:bg-none group-data-[nav-state=dark]:bg-white/8 group-data-[nav-state=dark]:hover:bg-white/12 " +
  "group-data-[nav-state=light]:bg-pf-ink-700 group-data-[nav-state=light]:bg-linear-to-t " +
  "group-data-[nav-state=light]:from-pf-ink-800 group-data-[nav-state=light]:to-pf-ink-700 " +
  "group-data-[nav-state=light]:bg-size-[100%_100%] group-data-[nav-state=light]:hover:bg-size-[100%_50%]";

/**
 * The floating capsule header, >=1024px.
 *
 * `hidden desk:block` is the whole mutual exclusion with the mobile header:
 * `display: none` takes the other one out of the accessibility tree, so the page
 * never exposes two `Main` navigation landmarks and neither needs `aria-hidden`.
 *
 * Every destination but the wordmark is inert - see `<NavItem>`. The homepage is
 * the only page in scope.
 */
export function SiteHeaderDesktop() {
  return (
    <DesktopNavHeader className="group fixed top-5 left-1/2 z-50 hidden w-[1320px] max-w-[calc(100%-16px)] -translate-x-1/2 desk:block">
      <nav aria-label="Main" className="flex items-center justify-between gap-3">
        {/* Left pill: brand + sections. 5px left / 6px right padding is the
            artboard's own asymmetry, not a typo. */}
        <div className={`${PILL} gap-2`}>
          <NavItem href="/" aria-label="Confyde home" className="flex h-[30px] items-center px-2">
            {/* The pill cross-fades over .3s but the wordmark's colour snaps -
                the artboard only transitions the pill. */}
            <Wordmark className="group-data-[nav-state=dark]:text-white group-data-[nav-state=light]:text-charcoal-900" />
          </NavItem>

          <span aria-hidden="true" className={DIVIDER} />

          <span className="flex gap-2.5">
            <NavItem className={`${NAV_LINK} gap-1.5 px-3.5`}>
              Product
              <ChevronDown size={14} strokeWidth={2} aria-hidden="true" focusable="false" />
            </NavItem>
            <NavItem className={`${NAV_LINK} gap-1.5 px-3.5`}>
              Customers
              <ChevronDown size={14} strokeWidth={2} aria-hidden="true" focusable="false" />
            </NavItem>
            <NavItem className={`${NAV_LINK} px-3.5`}>Pricing</NavItem>
          </span>
        </div>

        {/* Right pill: same box, 4px gap rather than 8px. */}
        <div className={`${PILL} gap-1`}>
          <NavItem className={`${NAV_LINK} px-3 whitespace-nowrap`}>Book a Demo</NavItem>

          <span aria-hidden="true" className={DIVIDER} />

          <NavItem className={`${NAV_LINK} gap-1.5 px-3`}>
            Login
            <ChevronDown size={14} strokeWidth={2} aria-hidden="true" focusable="false" />
          </NavItem>

          <NavItem className={SIGNUP}>
            Get started
            <MoveRight size={16} strokeWidth={2} aria-hidden="true" focusable="false" />
          </NavItem>
        </div>
      </nav>
    </DesktopNavHeader>
  );
}
