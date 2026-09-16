"use client";

import { useEffect, useRef, type RefObject } from "react";

type ScrollProgressOptions = {
  /**
   * Called with `p ∈ [0, 1]` inside a requestAnimationFrame, once per frame at
   * most, and only when the value has actually changed.
   */
  onProgress: (p: number) => void;
  /**
   * Called when the element enters or leaves the observation root. The scroll
   * listener exists only between a `true` and the matching `false`, so this is
   * where a caller puts anything that should not be paid for off screen -
   * `will-change` being the one that matters here.
   */
  onActiveChange?: (active: boolean) => void;
};

/**
 * A continuous scroll position for one pinned element.
 *
 *   p = clamp(−rect.top / (offsetHeight − innerHeight), 0, 1)
 *
 * so `p = 0` the instant the element's top reaches the top of the viewport and
 * `p = 1` the instant its bottom reaches the bottom - which, for a 200vh stage
 * with a `position: sticky` 100vh child, maps one-to-one onto the interval the
 * child is pinned for.
 *
 * WHY A SCROLL LISTENER, when lib/use-reveal.ts and lib/use-nav-theme.ts both
 * replaced the artboard's polling with an IntersectionObserver. Those two
 * consume a THRESHOLD - "has the hero's dark region passed under the nav" is a
 * real edge in the layout, and an observer watches that edge better than
 * arithmetic approximating it. This value is continuous: it is consumed at full
 * precision by eleven chips, five words and a gradient, and there is no
 * threshold anywhere in the composition. Approximating it with a hundred
 * observer thresholds gives a hundred quantised steps and no value at all
 * between two of them during a fast flick, which the chips would visibly
 * stair-step through. It is the wrong instrument.
 *
 * So the observer keeps the job it is good at: deciding whether the listener is
 * attached at all. On the other ~90% of the page this hook costs nothing.
 *
 * (The genuinely observer-shaped answer is CSS `animation-timeline: scroll()`,
 * which runs off the main thread entirely. As of this build it ships in
 * Chromium only, and this is the page's closing CTA, so it cannot be
 * progressively enhanced into existence on two of three engines. Revisit.)
 *
 * Three costs the artboard pays that this does not:
 *
 * - No `setInterval`. The artboard re-ran its whole scroll handler every 60ms
 *   whether or not anything had scrolled.
 * - No read-after-write. Everything is read at the top of one rAF and written
 *   at the bottom, so there is no forced synchronous layout (spec D15).
 * - `offsetHeight` is a layout read, so `total` is recomputed on resize only,
 *   never per tick.
 *
 * Under `prefers-reduced-motion: reduce` the hook does nothing at all - no
 * observer, no listener, no rAF. The resting state is a pure-CSS concern, and
 * it is the same composition the server renders.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  { onProgress, onActiveChange }: ScrollProgressOptions,
): void {
  // Held in refs so a caller can pass inline closures without re-subscribing
  // the observer and the listener on every render.
  const progressRef = useRef(onProgress);
  const activeRef = useRef(onActiveChange);

  // Declared before the subscribing effect so the refs are already current the
  // first time it runs.
  useEffect(() => {
    progressRef.current = onProgress;
    activeRef.current = onActiveChange;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let total = 0;
    let last = -1;
    let frame = 0;
    let attached = false;

    const measure = () => {
      // Guard the degenerate case: a stage shorter than the viewport would
      // divide by zero or go negative, and `p` has no meaning for it.
      total = Math.max(1, el.offsetHeight - window.innerHeight);
    };

    const run = () => {
      frame = 0;
      const top = el.getBoundingClientRect().top; // every read first
      const p = Math.max(0, Math.min(1, -top / total));
      if (p === last) return; // then, only if it changed, the writes
      last = p;
      progressRef.current(p);
    };

    // Coalescing to one rAF turns N scroll events per frame into one write
    // pass, and the unchanged-value return above removes every tick the stage
    // produces while `p` is clamped at 0 or 1 - which is most of them, because
    // a full viewport of pre-roll scrolls past before `p` leaves 0.
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(run);
    };

    const onResize = () => {
      measure();
      last = -1;
      onScroll();
    };

    const attach = () => {
      if (attached) return;
      attached = true;
      measure();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      activeRef.current?.(true);
      run();
    };

    const detach = () => {
      if (!attached) return;
      attached = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      activeRef.current?.(false);
    };

    // A `display: none` element never intersects, so the breakpoint gate is
    // free: below 1024px the stage is hidden, this never fires, and no listener
    // is ever attached. That cannot drift out of step with the CSS the way an
    // explicit media-query check could.
    //
    // The generous rootMargin means the first frame after entry is already
    // correct rather than one frame stale.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) attach();
        else detach();
      },
      { rootMargin: "100% 0px 100% 0px", threshold: 0 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      detach();
    };
  }, [ref]);
}
