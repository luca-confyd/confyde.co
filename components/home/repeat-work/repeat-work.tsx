import { RepeatWorkDesktop } from "./repeat-work-desktop";
import { RepeatWorkMobile } from "./repeat-work-mobile";

/**
 * The repeat-work panel.
 *
 * Two compositions, mutually exclusive at 1024px, shipped as siblings like the
 * hero, the marquee and the before/after phones. They are not one layout that
 * reflows: the list is four clients on desktop and two on mobile, with
 * different notes and different photographs against the two names they share;
 * the desktop list carries an action chip per row and a footer strip that
 * mobile draws neither of; and the stat card moves from beside the list to
 * below it and drops its "Repeat work" label on the way. Forking the layout
 * would mean rendering both lists into one DOM and hiding one - six client
 * rows where the page needs four.
 *
 * `hidden` / `desk:hidden` is `display: none`, so only one of the two is ever
 * in the accessibility tree and only one set of avatars is ever laid out.
 */
export function RepeatWork() {
  return (
    <>
      <RepeatWorkDesktop />
      <RepeatWorkMobile />
    </>
  );
}
