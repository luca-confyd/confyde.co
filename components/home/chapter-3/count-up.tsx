import { fmt } from "@/lib/format-count";

import type { CountFormat } from "@/content/playbook";

/**
 * One animated figure in the analytics strip.
 *
 * TWO NODES, NOT ONE, AND THIS IS THE POINT. A count-up rewrites its
 * `textContent` on every animation frame: `Pipeline` counts $0K to $312K over
 * 900ms, which at 60fps is 54 distinct strings, almost all of them different
 * because `moneyKwhole` rounds to whole thousands. NVDA and JAWS generally
 * ignore a text mutation in a region with no live semantics, but VoiceOver's
 * virtual cursor can land mid-count and re-announce, and anything polling the
 * accessibility tree sees a value that is wrong 53 times out of 54.
 *
 * So the visible span is `aria-hidden` and the hook mutates only that, while a
 * visually-hidden sibling carries the FINAL formatted value as static text
 * written once at render. The accessible name is correct and constant from
 * first paint, the visible number still animates, and nothing announces twice.
 *
 * NEVER `aria-live`. The artboard does not set it and nothing should add it: it
 * is the single commonest mistake with this pattern and it turns a cosmetic
 * flourish into 54 announcements.
 *
 * In this chapter the whole stage is `role="img"`, so neither span is announced
 * at all - the hidden sibling is belt and braces for the first call site that
 * is not inside an `img` subtree.
 *
 * `tabular-nums` is ours, not the artboard's. The artboard sets it on the three
 * tilted-card figures and not on the strip, so every cell reflows on every frame
 * of the count. `docs/brand.md` reserves tabular numerals for a column of money,
 * but a number changing sixty times a second is the case that rule exists to
 * protect - a functional fix under RULINGS principle 2.
 */
export type CountUpProps = {
  /** The value counted to, and the number the hidden sibling states. */
  value: number;
  format: CountFormat;
  /** Milliseconds. A reveal's `data-duration` is seconds; a count's is not. */
  durationMs: number;
  /**
   * What the cell reads before the count fires. Six cells ship a zero and one
   * ships its own answer - shipped as drawn (docs/specs/10-chapter-3.md D6).
   */
  placeholder: string;
};

export function CountUp({ value, format, durationMs, placeholder }: CountUpProps) {
  return (
    <>
      <span
        aria-hidden="true"
        data-count={value}
        data-format={format}
        data-duration={durationMs}
        className="tabular-nums"
      >
        {placeholder}
      </span>
      <span className="sr-only">{fmt(format, value)}</span>
    </>
  );
}
