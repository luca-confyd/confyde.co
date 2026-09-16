"use client";

import { MoveRight, X } from "lucide-react";
import Image from "next/image";

import { useFloatingBars } from "@/lib/use-floating-bars";
import { NavItem } from "./nav-item";

const BAR = "shadow-overlay flex items-center rounded-xl bg-card";

/**
 * The mid-page quiz teaser. Shown once the reader is a full screen down and
 * there is still more than 1700px of document below the fold.
 */
function TrailerBar({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className={`${BAR} gap-4 p-2.5`}>
      <span className="relative block h-11 w-16 flex-none overflow-hidden rounded-lg">
        <Image src="/images/photo-2.webp" alt="" fill sizes="64px" className="object-cover" />
      </span>

      <span className="flex flex-col gap-0.5 leading-[1.3]">
        {/* A third Fraunces cut, neither the .display default (opsz 40) nor its
            desktop override (wght 420 / SOFT 100 / opsz 10). Bar-specific, so it
            is set here rather than pulled from the type scale. */}
        <span className="font-display text-[16px] whitespace-nowrap text-pf-ink-900 [font-variation-settings:'wght'_600,'SOFT'_60,'opsz'_24]">
          Still quoting on weekends?
        </span>
        {/* Hanken Grotesk, the app's own face: the artboard sets --font-sans
            here and on the CTA below, which resolves through its linked token
            file (RULINGS.md, ruling 9). */}
        <span className="font-ui text-[13.5px] whitespace-nowrap text-pf-ink-700">
          Find out what&rsquo;s slowing you down.
        </span>
      </span>

      {/* 12px on a 40px button, where the CTA bar below uses 8px for the same
          role. Inconsistent within the artboard; both ship as drawn. */}
      <NavItem
        tone="light"
        className="btn-lime inline-flex h-10 flex-none items-center rounded-xl bg-lime-500 px-5 font-ui text-[14px] font-semibold whitespace-nowrap text-forest-900 shadow-[0_8px_20px_-10px_rgb(21_48_31/0.4)]"
      >
        Take the quiz, 2 mins
      </NavItem>

      {/* The artboard draws no hover and a bare 28px target. The hover wash
          matches the nav's own light-state link hover, and the ::before pad
          takes the hit area to 44x44 without moving the glyph. */}
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onDismiss}
        className="relative flex h-7 w-7 flex-none cursor-pointer items-center justify-center rounded-lg border-0 bg-none text-pf-ink-500 transition-colors duration-200 before:absolute before:-inset-2 before:content-[''] hover:bg-pf-ink-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700"
      >
        <X size={15} strokeWidth={2} aria-hidden="true" focusable="false" />
      </button>
    </div>
  );
}

/**
 * The closing signup bar, shown inside the last 1700px of the document.
 *
 * It has no dismiss control of its own. That is the artboard: the trailer always
 * appears first on the way down and its dismissal is sticky, so the reader
 * always had an escape.
 */
function CtaBar() {
  return (
    <div className={`${BAR} gap-3 py-1.5 pr-1.5 pl-4`}>
      <span className="text-[16px] font-semibold text-pf-ink-900">Ready to win more work?</span>
      {/* The artboard declares 8px inline, but its .pf-btn-ink forces 12px with
          !important and wins, so the artboard renders 12px. Ship 12px. */}
      <NavItem
        tone="light"
        className="btn-ink inline-flex h-[34px] items-center gap-2 rounded-xl px-4 text-[14px] font-bold text-pf-ink-100"
      >
        Get started free
        <MoveRight size={16} strokeWidth={2} aria-hidden="true" focusable="false" />
      </NavItem>
    </div>
  );
}

/**
 * The desktop floating bars: one fixed shell at the bottom centre, two mutually
 * exclusive variants, one shared animation wrapper.
 *
 * No `aria-live`: a bar that arrives on scroll must not interrupt a screen
 * reader mid-sentence.
 *
 * The wrapper is `inert` as well as `pointer-events: none` while hidden -
 * without it the CTA and the dismiss button stay in the tab order while
 * invisible.
 */
export function FloatingBars() {
  const { phase, dismiss } = useFloatingBars();
  const hidden = phase === "hidden";

  return (
    <div
      role="complementary"
      aria-label="Promotion"
      className="fixed bottom-5 left-1/2 z-[60] hidden -translate-x-1/2 desk:block"
    >
      <div className="bars-wrapper" data-shown={!hidden} inert={hidden} aria-hidden={hidden}>
        {phase === "cta" ? <CtaBar /> : <TrailerBar onDismiss={dismiss} />}
      </div>
    </div>
  );
}
