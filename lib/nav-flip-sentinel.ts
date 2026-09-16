/**
 * The contract between the hero and the nav.
 *
 * `<NavFlipSentinel>` marks the foot of the hero's dark region with this
 * attribute; both navs observe every element carrying it to decide when to flip.
 *
 * It lives in its own module rather than beside either user because they are on
 * opposite sides of the server/client boundary: a `"use client"` module's
 * exports reach a Server Component as client references, not as values.
 */
export const NAV_FLIP_SENTINEL_ATTR = "data-nav-flip-sentinel";
