"use client";

import { useCallback, useRef, type ReactNode } from "react";

import { useScrollProgress } from "@/lib/use-scroll-progress";

/** `p` at which the last chip finishes fading, so the blur filters can go. */
const CHIPS_SETTLED_AT = 0.18;

/**
 * The only part of the CTA stage that runs on the client.
 *
 * It renders the outer `<section>` and writes exactly two things to it: one
 * registered custom property, `--p`, and one attribute. Everything inside
 * arrives already rendered from the server, and every scrubbed value - eleven
 * chip transforms, eleven opacities, five word opacities, the two-lobe gradient
 * - is a `calc()` in styles/motion/cta-stage.css derived from `--p`. The same
 * split as components/chrome/nav-theme-header.tsx, for the same reason.
 *
 * That is the whole performance argument. The artboard wrote 72 inline styles
 * per tick, eleven of them percentage insets that force layout on eleven
 * absolutely-positioned boxes, plus a ~300-character `background-image` string
 * rebuilt and reparsed for a 1.3-megapixel repaint. This writes one number and
 * lets the compositor do the compositing.
 *
 * Three attributes, all of which default to absent so that the server render,
 * the no-JavaScript render and the reduced-motion render are one composition:
 *
 * - `data-scrub="on"` means "JS is driving `--p`". The CSS gates the departure
 *   drift and the entry blur behind it, so with it absent the stage rests at
 *   the settled frame with no drift and no `blur(0px)` render surfaces.
 * - `data-chips-settled="true"` from `p ≥ 0.18` releases eleven blur surfaces
 *   for the remaining 82% of the stage. `filter: blur(0px)` still allocates one.
 * - `data-active="true"` while the stage is anywhere near the viewport, which
 *   is the only time `will-change` is worth paying for. The artboard's
 *   unconditional `will-change` pinned eleven composited layers for the whole
 *   lifetime of the page, including while the section was 6000px away.
 */
export function CtaScrubStage({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  const onProgress = useCallback((p: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--p", String(p));
    // Compared against the current value so the attribute is written on the two
    // frames that cross the boundary and on no others.
    const settled = p >= CHIPS_SETTLED_AT ? "true" : "false";
    if (el.dataset.chipsSettled !== settled) el.dataset.chipsSettled = settled;
  }, []);

  const onActiveChange = useCallback((active: boolean) => {
    const el = ref.current;
    if (!el) return;
    if (active) {
      el.dataset.scrub = "on";
      el.dataset.active = "true";
    } else {
      // `data-scrub` stays once engaged. Removing it would snap the stage back
      // to its settled frame the moment it leaves, which is a change nobody can
      // see - it is off screen - but which would then have to be undone on the
      // way back in. `data-active` is the one that has a cost to remove.
      delete el.dataset.active;
    }
  }, []);

  useScrollProgress(ref, { onProgress, onActiveChange });

  return (
    <section ref={ref} data-section="cta-stage" className={className}>
      {children}
    </section>
  );
}
