import { FooterDesktop } from "./footer-desktop";
import { FooterMobile } from "./footer-mobile";

/* -----------------------------------------------------------------------------
   The scrims are gone, and so is the photograph they washed.

   There were two, and they were not two roundings of one value: mobile washed
   #171A1B from 94% to 66% over the whole panel, desktop washed #121516 from 92%
   through 50% at 45% to 15%, because desktop's 660px panel keeps all its text in
   the top third where mobile's is barely taller than its content. Both existed
   to darken a photograph until white text held on it.

   The grid surface is flat and already 15.8:1 under white at every point, so
   there is nothing left for either gradient to do - and the difference between
   them was a fact about the photograph, not about the two layouts.
----------------------------------------------------------------------------- */

/**
 * The site footer: one landmark, two compositions.
 *
 * The background and its rounded top are the only things the two artboards
 * share, so they live here and the two layouts are gated inside. That keeps a
 * single `<footer>` in the accessibility tree at every width, rather than the
 * two-mutually-exclusive-landmarks shape the headers use - the headers have to
 * do that because each carries its own `<nav>` and its own sticky behaviour;
 * this is one box with two fillings.
 *
 * That shared background is now the same `.grid-surface` the heroes take, so
 * the page opens and closes on one surface instead of on two different
 * photographs.
 *
 * Server Component. Nothing here reacts to scroll, hover state or the nav flip.
 */
export function SiteFooter() {
  return (
    <footer className="relative mx-auto flex w-full max-w-[1920px] flex-col overflow-hidden desk:h-[660px]">
      {/* Same box the photograph and its two scrims filled - `inset-0`, `z-0`
          under both layouts - so nothing above it moves. The glow inside the
          surface is thrown from the top edge, which on this panel is where the
          footer's own headings sit; on the hero it lands behind the nav. One
          rule, and it flatters whatever is at the top of the panel it is on.

          `grid-surface-fade-top` because this panel's top edge is a hard seam
          against the cream band above it, and a hairline sitting just under
          that seam reads as a rule drawn under the join rather than as grid. */}
      <div aria-hidden="true" className="grid-surface grid-surface-fade-top absolute inset-0 z-0" />

      <FooterDesktop />
      <FooterMobile />
    </footer>
  );
}
