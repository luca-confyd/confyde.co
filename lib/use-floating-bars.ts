"use client";

import { useCallback, useEffect, useState } from "react";

type BarPhase = "hidden" | "trailer";

/**
 * Drives the desktop floating bars.
 *
 * Every input here is viewport- or document-relative (`scrollY`, `innerHeight`,
 * `scrollHeight`), so this is a scroll listener rather than an
 * IntersectionObserver - there is no element to observe. It is the page's only
 * scroll listener; the nav flip is element-relative and uses an observer
 * instead.
 *
 * The artboard re-ran this on a 60ms `setInterval` so that `scrollHeight` growth
 * (images loading, sections streaming in) could not leave the phase stale. A
 * ResizeObserver on the document element does that exactly, and only when the
 * page actually changes height.
 */
export function useFloatingBars(): { phase: BarPhase; dismiss: () => void } {
  const [phase, setPhase] = useState<BarPhase>("hidden");

  // Sticky and global: once dismissed, every later phase is forced to hidden, so
  // dismissing the trailer also suppresses the CTA bar. Memory only - it resets
  // on reload, and the artboard deliberately stores nothing.
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      // Note this is `< vh`, where the nav's old threshold was `< vh - 80`: the
      // bar is meant to arrive 80px after the nav flips, and the two comparisons
      // stay separate.
      if (y < vh) setPhase("hidden");
      else setPhase("trailer");
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    const resize = new ResizeObserver(schedule);
    resize.observe(document.documentElement);

    read();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const dismiss = useCallback(() => setDismissed(true), []);

  return { phase: dismissed ? "hidden" : phase, dismiss };
}
