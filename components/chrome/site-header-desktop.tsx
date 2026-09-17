import { ChevronDown } from "lucide-react";

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
    <DesktopNavHeader /* 1232/48, not the artboard's 1320/16: the nav floats over the page and
         reads as part of it, so its edges want to sit on the same rail every
         content band uses rather than 16px further out. */
      className="group fixed top-5 left-1/2 z-50 hidden w-[1232px] max-w-[calc(100%-48px)] -translate-x-1/2 desk:block">
      <nav aria-label="Main" className="flex items-center gap-3">
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

      </nav>
    </DesktopNavHeader>
  );
}
