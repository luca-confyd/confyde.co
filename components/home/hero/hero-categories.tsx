import { Reveal } from "@/components/primitives/reveal";

/**
 * The four things Confyde does, under the hero.
 *
 * These replaced four vanity figures, and the change matters structurally: a
 * figure is two or three words and a category is a sentence, so nothing here can
 * assume one line any more. The subgrid below is what makes that safe.
 *
 * The four blurbs are held to within three characters of each other - 62 to 65 -
 * which is what keeps them setting the same number of lines across the row. They
 * ran 45 to 56 before and the short one visibly under-filled its column. Worth
 * checking the count if any of them is rewritten.
 */
export const CATEGORIES = [
  {
    title: "Agentic workflows",
    blurb: "Payments, inventory and data. The everyday work, made AI-native.",
    delay: 0.6,
  },
  {
    title: "AI automations",
    blurb: "Your existing processes, running on their own without supervision.",
    delay: 0.68,
  },
  {
    title: "Cyber security",
    blurb: "The systems you rely on, made secure, monitored and dependable.",
    delay: 0.76,
  },
  {
    title: "Technical strategy",
    blurb: "What to build, what to buy, and what to stop paying for entirely.",
    delay: 0.84,
  },
] as const;

/*
 * Fraunces at a heavier weight and a much larger optical size than the H1 above
 * it (wght 500 / opsz 40 against the headline's 420 / 10). That is deliberate:
 * at 24px the title needs the sturdier cut a large optical size gives it, where
 * the 76px headline needs the open one. A static Fraunces cut cannot express
 * either, which is why the family is loaded as a variable font.
 *
 * No `white-space: nowrap`. The artboard could assume it because every cell held
 * a short numeral; these are words, and "Agentic workflows" has no business
 * being unbreakable in a 252px column.
 */
const TITLE =
  "display block text-[24px] leading-[1.1] text-pf-ink-100 " +
  "[font-variation-settings:'wght'_500,'SOFT'_100,'opsz'_40] hero-short:text-[21px]";

const BLURB = "mt-1.5 block text-[12.5px] leading-[1.4] text-white";

/* Cell 1 is flush left and cell 4 flush right, so the strip fills its 1120px
   column exactly; the dividers sit in the 28px gutters between them. */
const CELL = "grid row-span-2 grid-rows-[subgrid] content-start pt-[22px] hero-short:pt-4";

export function HeroCategories() {
  return (
    /*
     * Two rows declared once on the parent; each cell spans both and adopts them
     * with `subgrid`. That is what keeps all four titles on one baseline and all
     * four blurbs on the next however tall any one of them gets - and with
     * sentences rather than figures, they now genuinely differ. Flexbox cannot
     * do this: it would align the cells, not their insides.
     */
    <div className="grid grid-cols-4 grid-rows-[auto_auto] border-t border-white/15">
      {CATEGORIES.map((category, index) => (
        <Reveal
          key={category.title}
          anim="up-blur"
          delay={category.delay}
          duration={0.5}
          className={[
            CELL,
            index === 0 ? "" : "border-l border-white/15 pl-7",
            index === CATEGORIES.length - 1 ? "" : "pr-7",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className={TITLE}>{category.title}</span>
          <span className={BLURB}>{category.blurb}</span>
        </Reveal>
      ))}
    </div>
  );
}

/**
 * The same four, stacked, for the mobile hero.
 *
 * An addition: the mobile artboard draws no strip at all, because the four
 * figures it replaced were decoration a phone could lose. These are service
 * lines - the clearest statement on the page of what Confyde sells - so dropping
 * them below 1024px would drop real content rather than trim ornament.
 */
export function HeroCategoriesMobile() {
  return (
    <ul className="mt-7 flex flex-col gap-4 border-t border-white/15 pt-5">
      {CATEGORIES.map((category) => (
        <li key={category.title}>
          <span className="display block text-[19px] leading-[1.15] text-white [font-variation-settings:'wght'_600,'SOFT'_60,'opsz'_24]">
            {category.title}
          </span>
          <span className="mt-1 block text-[13.5px] leading-[1.45] text-white">
            {category.blurb}
          </span>
        </li>
      ))}
    </ul>
  );
}
