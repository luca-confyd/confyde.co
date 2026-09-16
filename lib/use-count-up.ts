"use client";

import { useEffect } from "react";

import { fmt } from "@/lib/format-count";

/**
 * Drives the animated figures in chapter 3's analytics strip.
 *
 * Written to the same shape as `use-reveal.ts`, and for the same reason: the
 * artboard ran this off a 60ms `setInterval` that re-measured every counter's
 * bounding box on every tick, plus a whole-tree MutationObserver. Both were
 * workarounds for the canvas editor re-rendering underneath the script. An
 * IntersectionObserver does the same job without touching the main thread on
 * every frame of every scroll.
 *
 * THE THRESHOLD IS NOT THE REVEAL SYSTEM'S, DELIBERATELY. The artboard fired a
 * count when the element's top passed 85% of the viewport height
 * (`r.top < vh*0.85 && r.bottom > 0`) and fired a reveal at 90% with an 80px
 * bottom extension. Two different numbers in the source; both are kept.
 * `r.bottom > 0` is what IntersectionObserver gives for free, so only the top
 * term needs a rootMargin.
 *
 * MILLISECONDS, NOT SECONDS. `data-duration` on a count is ms and
 * `data-duration` on a reveal is seconds - the same attribute name carrying two
 * units in the same document. Everything here says `durationMs` so the unit
 * cannot be lost in a refactor.
 */

/** The formatted final value, which is also the reduced-motion resting value. */
function finalText(el: HTMLElement): string {
  const { count, format, prefix, suffix } = el.dataset;
  return `${prefix ?? ""}${fmt(format ?? "int", Number.parseFloat(count ?? "0"))}${suffix ?? ""}`;
}

export function useCountUp() {
  useEffect(() => {
    const targets = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-count]:not([data-counted])"));

    const settle = (el: HTMLElement) => {
      el.dataset.counted = "true";
      el.textContent = finalText(el);
    };

    // Reduced motion, first and short-circuiting, exactly as the artboard's own
    // runCount() did: the element is painted at its final formatted value with
    // no animation and no timer. One text mutation, before paint. That is both
    // the accessible resting state and what the harness screenshots, and it is
    // also where the live count ends up, so the two agree.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const el of targets()) settle(el);
      return;
    }

    const run = (el: HTMLElement) => {
      el.dataset.counted = "true";
      const value = Number.parseFloat(el.dataset.count ?? "0");
      const kind = el.dataset.format ?? "int";
      const durationMs = Number.parseInt(el.dataset.duration ?? "900", 10);
      const prefix = el.dataset.prefix ?? "";
      const suffix = el.dataset.suffix ?? "";

      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / durationMs, 1);
        // Cubic ease-out on the VALUE, not on a transform, so the number is
        // already 87.5% of target at the halfway point - Pipeline reads $273K
        // at 450ms, not $156K. A linear ramp of the same duration counts
        // visibly slower and is the usual way this gets ported wrong.
        el.textContent = prefix + fmt(kind, value * (1 - Math.pow(1 - t, 3))) + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          // Each figure counts once and only once, however many times it
          // crosses the viewport afterwards.
          if (el.dataset.counted) continue;
          run(el);
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );

    for (const el of targets()) observer.observe(el);

    // Sections stream in as the page hydrates. Only added nodes are examined,
    // never the whole document.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.matches("[data-count]:not([data-counted])")) observer.observe(node);
          for (const el of node.querySelectorAll<HTMLElement>(
            "[data-count]:not([data-counted])",
          )) {
            observer.observe(el);
          }
        }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);
}
