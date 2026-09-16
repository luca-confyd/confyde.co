import { Reveal } from "@/components/primitives/reveal";

/**
 * The four claims under the hero.
 *
 * Unlike the float cards above them these are real content, not decoration, so
 * the strip is not `aria-hidden` and each cell reads as "4+ hrs → 30 mins, to
 * build a client-ready quote". The arrow is U+2192, which the brand doc
 * sanctions as type rather than iconography; screen readers announce it as
 * "right arrow", which reads correctly here.
 */
const STATS = [
  { figure: "4+ hrs → 30 mins", label: "to build a client-ready quote", delay: 0.6 },
  { figure: "1 in 3", label: "more jobs won", delay: 0.68 },
  { figure: "12 hrs", label: "back every month, each", delay: 0.76 },
  { figure: "30 mins", label: "to start setting up new AI systems", delay: 0.84 },
];

/*
 * Fraunces at a heavier weight and a much larger optical size than the H1 above
 * it (wght 500 / opsz 40 against the headline's 420 / 10). That is deliberate:
 * at 24px the figure needs the sturdier cut a large optical size gives it, where
 * the 76px headline needs the open one. A static Fraunces cut cannot express
 * either, which is why the family is loaded as a variable font.
 */
const FIGURE =
  "display block text-[24px] leading-[1.1] whitespace-nowrap text-pf-ink-100 " +
  "[font-variation-settings:'wght'_500,'SOFT'_100,'opsz'_40] hero-short:text-[21px]";

/*
 * The artboard also sets `white-space: nowrap` on the labels. Dropped, per
 * RULINGS.md §02 ruling 4: at 1024px the widest label clears its cell by under
 * 15px, so one copy edit, one font-fallback flash or one user font-size bump
 * overflows the strip. The subgrid below is what makes wrapping safe - a label
 * that takes two lines still shares its top edge with the other three.
 */
const LABEL = "mt-1.5 block text-[12.5px] leading-[1.4] text-white/60";

/* Cell 1 is flush left and cell 4 flush right, so the strip fills its 1120px
   column exactly; the dividers sit in the 28px gutters between them. */
const CELL = "grid row-span-2 grid-rows-[subgrid] content-start pt-[22px] hero-short:pt-4";

export function StatStrip() {
  return (
    /*
     * Two rows declared once on the parent; each cell spans both and adopts them
     * with `subgrid`. That is what puts all four figures on one baseline and all
     * four labels on the next, however tall any one of them gets. Flexbox cannot
     * do this - it would align the cells, not their insides.
     */
    <div className="grid grid-cols-4 grid-rows-[auto_auto] border-t border-white/15">
      {STATS.map((stat, index) => (
        <Reveal
          key={stat.figure}
          anim="up-blur"
          delay={stat.delay}
          duration={0.5}
          className={[
            CELL,
            index === 0 ? "" : "border-l border-white/15 pl-7",
            index === STATS.length - 1 ? "" : "pr-7",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className={FIGURE}>{stat.figure}</span>
          <span className={LABEL}>{stat.label}</span>
        </Reveal>
      ))}
    </div>
  );
}
