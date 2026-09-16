"use client";

import { useEffect, useState } from "react";

import { NAV_FLIP_SENTINEL_ATTR } from "./nav-flip-sentinel";

/** `dark` = the nav is over the hero's dark region; `light` = it is over the page. */
type NavTheme = "dark" | "light";

/**
 * Desktop nav bottom edge, measured: the pill is 3px padding + a 22.5px 15/600
 * line + 5px link padding, top and bottom = 38.5px, offset 20px from the top of
 * the viewport = 58.5px. Rounded up so the flip never lands a subpixel early.
 */
const DESKTOP_NAV_BOTTOM_EDGE = 59;

/**
 * Mobile nav height, measured: 12px padding + a 40px control row + 12px = 64px.
 * The same 64 appears in the hero's `margin-top: -64px`; they move together.
 */
const MOBILE_NAV_BOTTOM_EDGE = 64;

/**
 * Flips the nav when the hero's dark region stops passing under the nav's own
 * bottom edge.
 *
 * Both artboards instead compared numbers that only approximate that boundary -
 * desktop `scrollY < innerHeight - 80`, mobile the hero *section* rect including
 * its 20px of beige bottom padding. Measured on the artboard at 1280x900,
 * desktop flips 78.5px late, which is 78.5px of scroll with a white wordmark and
 * white links sitting on the cream marquee band (RULINGS.md, ruling 10). This
 * observes the boundary itself, so it also survives a change of viewport height,
 * hero height or nav height - none of which the arithmetic did.
 *
 * A negative top `rootMargin` pulls the observation root's top edge down to the
 * nav's bottom edge: the sentinel intersects that root for exactly as long as it
 * is still below the nav.
 */
function useSentinelNavTheme(navBottomEdge: number): NavTheme {
  const [theme, setTheme] = useState<NavTheme>("dark");

  useEffect(() => {
    const sentinels = document.querySelectorAll(`[${NAV_FLIP_SENTINEL_ATTR}]`);

    // No hero on the page: stay dark, which is what both artboards fall back to.
    if (sentinels.length === 0) return;

    // The desktop and mobile heroes are separate compositions, so more than one
    // sentinel can exist with only one of them laid out. A display:none element
    // never intersects, so "any sentinel still below the nav" ignores the hidden
    // one for free - which a single-target observer would not.
    const below = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) below.add(entry.target);
          else below.delete(entry.target);
        }
        setTheme(below.size > 0 ? "dark" : "light");
      },
      { rootMargin: `-${navBottomEdge}px 0px 0px 0px`, threshold: 0 },
    );

    // Observing fires the callback once, so a browser-restored scroll position
    // resolves itself without a manual first run.
    for (const sentinel of sentinels) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [navBottomEdge]);

  return theme;
}

export function useDesktopNavTheme(): NavTheme {
  return useSentinelNavTheme(DESKTOP_NAV_BOTTOM_EDGE);
}

export function useMobileNavTheme(): NavTheme {
  return useSentinelNavTheme(MOBILE_NAV_BOTTOM_EDGE);
}
