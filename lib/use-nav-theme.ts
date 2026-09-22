"use client";

import { usePathname } from "next/navigation";
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
 *
 * A ROUTE CHANGE IS TWO SEPARATE PROBLEMS, and both are in this hook.
 *
 * The header lives in app/layout.tsx, so it stays mounted across a client-side
 * navigation while the page under it is replaced.
 *
 *   1. THE OBSERVER. Queried once on mount, it went on watching the OLD page's
 *      sentinel - which React had just detached, and a detached element stops
 *      intersecting, so the callback fired and the set emptied - while the NEW
 *      page's sentinel was never observed at all. The nav stayed light over
 *      the next hero's dark pixels until a reload remounted the hook.
 *      `pathname` in the dependency list is what re-runs the query against the
 *      page that is on screen.
 *
 *   2. THE FIRST FRAME. Fixing the observer does not fix the flash of white,
 *      because the theme is STATE and the state arriving at the new page is
 *      whatever the last one left - `light`, if the reader had scrolled the
 *      homepage past its hero. An IntersectionObserver never delivers
 *      synchronously: observing schedules the first callback, so the new page
 *      paints at least one frame before the observer can say "dark". That
 *      frame is the white nav over a dark hero.
 *
 *      So the reset happens DURING RENDER, not in an effect - an effect runs
 *      after paint, which is exactly the frame being fixed. React's own
 *      adjust-state-on-prop-change pattern: notice the path changed, set the
 *      theme back to the server's own starting value, and React re-renders
 *      before committing anything to the screen. The observer then confirms or
 *      corrects it a frame later, as it always did.
 *
 *      `dark` is the right reset because a client navigation lands at the top
 *      of the new document and every page on this site opens on a dark hero.
 *      A page that does not would flash the other way - a dark nav over a
 *      cream first frame - and would need its own starting value rather than
 *      this constant.
 */
function useSentinelNavTheme(navBottomEdge: number): NavTheme {
  const [theme, setTheme] = useState<NavTheme>("dark");
  const pathname = usePathname();

  /* The render-time reset. `renderedPath` is the route this hook last produced
     a theme for; when it no longer matches, the page under the nav has changed
     and the theme from the previous one is stale. Setting state during render
     is the supported way to do this - React discards the in-progress render and
     re-runs the component immediately, with nothing painted in between. */
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setTheme("dark");
  }

  useEffect(() => {
    const sentinels = document.querySelectorAll(`[${NAV_FLIP_SENTINEL_ATTR}]`);

    // No hero on the page: stay dark, which is what both artboards fall back to.
    //
    // "Stay", not "set": writing the state here is a synchronous setState in an
    // effect body, which react-hooks/set-state-in-effect rejects. It only
    // matters for a page with NO sentinel navigated to from one that had it -
    // that page would keep the previous route's theme - and every page on the
    // site renders a hero, so the case does not exist yet. A sentinel-less page
    // is what would need this solving, and observing a fallback target is the
    // way to do it rather than a bare write.
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
  }, [navBottomEdge, pathname]);

  return theme;
}

export function useDesktopNavTheme(): NavTheme {
  return useSentinelNavTheme(DESKTOP_NAV_BOTTOM_EDGE);
}

export function useMobileNavTheme(): NavTheme {
  return useSentinelNavTheme(MOBILE_NAV_BOTTOM_EDGE);
}
