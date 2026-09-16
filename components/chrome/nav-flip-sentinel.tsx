import { NAV_FLIP_SENTINEL_ATTR } from "@/lib/nav-flip-sentinel";

/**
 * Marks the foot of the hero's dark region for the nav flip.
 *
 * Contract for the hero section: render this as the last child of the element
 * whose dark pixels end where the nav should stop being dark-styled, and give
 * that element `position: relative`. This absolutely positions itself onto that
 * bottom edge, so it takes no layout space and cannot shift the hero.
 *
 * It is 1px rather than 0px on purpose: a zero-area target is the one case where
 * IntersectionObserver's intersection rect is empty, and browsers have not been
 * consistent about whether that still counts as intersecting.
 *
 * Both navs observe every element carrying this attribute, so a page with a
 * separate desktop and mobile hero renders one in each and neither hook needs to
 * know which is laid out.
 */
export function NavFlipSentinel() {
  return (
    <div
      /* Spread rather than written out, so the attribute and the selector the
         hook queries can never drift apart. */
      {...{ [NAV_FLIP_SENTINEL_ATTR]: "" }}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
    />
  );
}
