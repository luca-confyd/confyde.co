"use client";

import { useEffect } from "react";

/**
 * Drives the .reveal-* entrance system in styles/motion/reveal.css.
 *
 * Mounted once at the page root. It watches every [data-anim].reveal-idle in the
 * document - including ones added later - and swaps the idle class for the
 * animation class as each crosses into view, once and only once.
 *
 * The artboard did this with a 60ms setInterval plus a MutationObserver that
 * re-scanned the entire tree on any DOM change. Both were workarounds for the
 * canvas editor re-rendering underneath the script; neither is needed here, and
 * an IntersectionObserver does the same job without touching the main thread on
 * every frame of every scroll.
 *
 * rootMargin encodes the artboard's own trigger point: it fired when an element's
 * top passed 90% of the viewport height, i.e. 10% up from the bottom edge.
 */
export function useReveal() {
  useEffect(() => {
    const targets = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-anim].reveal-idle"));

    // Reduced motion: reveal.css already pins these to their resting state, but
    // the idle class has to come off so nothing is left at opacity 0 if the CSS
    // is ever scoped differently.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const el of targets()) el.classList.remove("reveal-idle");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const { anim, delay, duration } = el.dataset;

          if (delay) el.style.setProperty("--reveal-delay", `${delay}s`);
          if (duration) el.style.setProperty("--reveal-duration", `${duration}s`);

          el.classList.remove("reveal-idle");
          el.classList.add(anim === "word" ? "reveal-word" : `reveal-${anim}`);
          observer.unobserve(el);
        }
      },
      { rootMargin: "-10% 0px 80px 0px" },
    );

    for (const el of targets()) observer.observe(el);

    // Sections stream in as the page hydrates, so pick up anything that lands
    // after the first pass. Unlike the artboard's version this only looks at
    // nodes that were actually added, not the whole document.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.matches("[data-anim].reveal-idle")) observer.observe(node);
          for (const el of node.querySelectorAll<HTMLElement>("[data-anim].reveal-idle")) {
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
