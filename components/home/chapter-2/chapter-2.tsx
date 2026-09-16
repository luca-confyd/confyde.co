import { Chapter2Desktop } from "./chapter-2-desktop";
import { Chapter2Mobile } from "./chapter-2-mobile";

/**
 * Section 08, "Sales assistant" - the second of the three chapters.
 *
 * Two compositions, mutually exclusive at 1024px. They cannot be one component:
 * six accordion groups against zero, thirteen line items against none, three
 * cards against two, a 339px document viewport against a 148px one, a five-row
 * timing table against a four-row one, a forest colour ramp against an umber
 * one, and two entirely separate animation systems on two different clocks -
 * 20 seconds against 14.
 *
 * The two shells carry the `hidden desk:block` / `desk:hidden` gate themselves,
 * so `display: none` keeps exactly one of them in layout and in the
 * accessibility tree at any width. That is also why the two clocks in
 * `styles/motion/chapter-2.css` share one file with no media query.
 */
export function Chapter2() {
  return (
    <>
      <Chapter2Desktop />
      <Chapter2Mobile />
    </>
  );
}
