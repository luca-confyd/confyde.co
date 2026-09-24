import type { CaseStudy } from "@/content/case-studies";

/**
 * The numbers card, pulled up over the foot of the hero.
 *
 * The overlap is the design's: `margin-top:-116px` against 170px of hero
 * padding. Here it is a negative top margin against <CaseStudyHero>'s `pb-44`,
 * and it only runs at desk - stacked on a phone the card sits under the band
 * on its own, because a four-column figure row becomes a two-column one and
 * there is no room to overlap into.
 *
 * FOUR FIGURES, TWO ROWS ON A PHONE. The dividers are left borders on every
 * item but the first in its row, which is why they are written as `border-l` on
 * the odd/even selectors rather than as elements: a divider element between
 * wrapped grid items lands in the wrong place as soon as the row count changes.
 */
export function CaseStudyNumbers({
  eyebrow = "The numbers",
  wordFigures = false,
  study,
}: {
  eyebrow?: string;
  /**
   * Set when the figures are short phrases ("AI in production") rather than
   * numbers. The number-sized type cannot fit a long word in a quarter-width
   * column, so these drop to a heading size: 20px, 28px at desk.
   */
  wordFigures?: boolean;
  study: Pick<CaseStudy, "numbers">;
}) {
  /* No figures, no card. The hero's `pb-44` is what this overlaps into, so a
     study without one simply leaves that padding as the band's own foot. */
  const numbers = study.numbers;
  if (!numbers) return null;

  return (
    <section
      data-section="case-study-numbers"
      className="relative z-10 -mt-24 px-4 sm-only:px-8 desk:-mt-[116px] desk:px-0"
    >
      <div className="mx-auto w-full max-w-[1232px] desk:px-6">
        <div className="shadow-border-strong rounded-xl bg-pf-surface-50 px-6 py-7 desk:px-10 desk:py-9">
          <div className="flex flex-col gap-2 border-b border-hairline pb-5 desk:flex-row desk:items-baseline desk:justify-between desk:gap-6">
            <span className="text-[11px] font-extrabold tracking-[0.16em] text-eyebrow uppercase">
              {eyebrow}
            </span>
            {numbers.note ? (
              <span className="text-[14px] text-slate-600">{numbers.note}</span>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-7 pt-7 desk:grid-cols-4 desk:gap-x-9">
            {numbers.items.map((item, index) => (
              <div
                key={item.label}
                className={
                  "flex flex-col gap-2.5" +
                  /* Every item but the first in its row takes the rule: the
                     second column at both breakpoints, plus the third and
                     fourth once the row is four wide. */
                  (index % 2 === 1 ? " border-l border-hairline pl-6" : "") +
                  (index === 2 ? " desk:border-l desk:border-hairline desk:pl-9" : "") +
                  (index % 2 === 1 ? " desk:pl-9" : "")
                }
              >
                {/* The design's 46px Bitter. `.display-2` is the page's
                    equivalent slot (3rem at desk) and `tabular-nums` holds the
                    figures on one baseline grid across the row. */}
                <span
                  className={
                    wordFigures
                      ? "display text-[20px] leading-[1.2] text-pf-ink-900 desk:text-[28px]"
                      : "display display-2 tabular-nums text-pf-ink-900"
                  }
                >
                  {item.figure}
                </span>
                <span className="text-[15px] leading-[1.45] text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
