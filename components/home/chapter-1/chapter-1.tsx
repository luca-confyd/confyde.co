import { Chapter1Desktop } from "./chapter-1-desktop";
import { Chapter1Mobile } from "./chapter-1-mobile";

/**
 * Section 06, "Meet Confyde" - the first of the three chapters.
 *
 * Two compositions, mutually exclusive at 1024px, shipped as siblings like the
 * hero, the marquee and the before/after phones. The two artboards are not one
 * layout at two scales: they order their three sub-blocks differently, draw
 * different cards, write different paragraphs and sit on different panel
 * surfaces. The two shells carry the `hidden desk:block` / `desk:hidden` gate
 * themselves, so a chapter cannot forget it; `display: none` means only one of
 * them is ever laid out or in the accessibility tree - which is also why the
 * animation systems in `styles/motion/chapter-1.css` need no breakpoint of
 * their own.
 */
export function Chapter1() {
  return (
    <>
      <Chapter1Desktop />
      <Chapter1Mobile />
    </>
  );
}
