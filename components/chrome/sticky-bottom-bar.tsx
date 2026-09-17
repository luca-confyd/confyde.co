import { ArrowRight } from "lucide-react";

import { NavItem } from "./nav-item";

/**
 * The mobile sticky bottom bar, <1024px.
 *
 * `sticky`, not `fixed`, and the last child of the page: it stays in normal flow
 * and so reserves its own height at the end of the document, which is what stops
 * it covering the footer's last line. `fixed` would look identical while
 * scrolling and would need a compensating `padding-bottom` on the page.
 *
 * It is visible from first paint - no reveal, no dismiss.
 *
 * The blurred surface spans the viewport while the CTA inside caps at the
 * artboard's own 430px column, so at 1023px it stays a button rather than
 * becoming a ~975px slab.
 */
export function StickyBottomBar() {
  return (
    <div
      // A landmark so the bar's content is not orphaned outside every region -
      // the desktop bars carry the same. No aria-live: it is present from first
      // paint and never announces itself.
      role="complementary"
      aria-label="Get started"
      className={
        "sticky bottom-0 z-[70] border-t border-hairline px-4 pt-[11px] pb-[calc(14px+env(safe-area-inset-bottom))] md:px-6 desk:hidden " +
        "bg-[color-mix(in_oklab,var(--color-card)_95%,transparent)] " +
        // The artboard omits the -webkit- twin here while including it on the
        // nav; without it iOS Safari renders a flat 95% white and no blur.
        // Tailwind emits both.
        "supports-[(backdrop-filter:blur(1px))_or_(-webkit-backdrop-filter:blur(1px))]:backdrop-blur-[14px] " +
        "not-supports-[((backdrop-filter:blur(1px))_or_(-webkit-backdrop-filter:blur(1px)))]:bg-card"
      }
    >
      <div className="mx-auto flex w-full max-w-[430px] flex-col gap-[7px]">
        <NavItem
          tone="light"
          className="btn-lime flex h-[50px] items-center justify-center gap-[9px] rounded-xl bg-lime-500 text-[16px] font-bold text-white shadow-[0_8px_20px_-12px_rgb(51_56_58/0.5)]"
        >
          Try Confyde free
          {/* Heavier than any other stroke on the page, and a different arrow
              from the desktop bars' move-right. Both are deliberate. */}
          <ArrowRight size={17} strokeWidth={2.4} aria-hidden="true" focusable="false" />
        </NavItem>

        {/* The mobile hero's version of this line carries a leading asterisk and
            this one does not. Not normalised - it is the client's copy. */}
        <span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11.5px] text-slate-500">
          <span>90 seconds. No card.</span>
        </span>
      </div>
    </div>
  );
}
