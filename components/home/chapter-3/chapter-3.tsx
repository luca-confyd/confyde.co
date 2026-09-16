import { Chapter3Desktop } from "./chapter-3-desktop";
import { Chapter3Mobile } from "./chapter-3-mobile";

/**
 * Section 10, "Playbook" - the third and last chapter.
 *
 * Two compositions, mutually exclusive at 1024px, shipped as siblings like the
 * hero, the marquees and chapters 1 and 2. They cannot be one component: four
 * lanes against four stacked groups, nine board cards against five, a browser
 * card and an eight-cell counter strip mobile does not draw, three stat cards
 * mobile does not draw, and an entire animation system on one side only.
 *
 * The shells carry the breakpoint gate themselves, so `display: none` keeps the
 * other composition out of layout and out of the accessibility tree - which is
 * also what lets the 14s flight in `styles/motion/chapter-3.css` carry exactly
 * one media query, the real one the board draws at 1280px, instead of the
 * accidental one the artboard left open.
 */
export function Chapter3() {
  return (
    <>
      <Chapter3Desktop />
      <Chapter3Mobile />
    </>
  );
}
