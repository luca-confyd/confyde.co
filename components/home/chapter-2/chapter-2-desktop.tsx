import { ChapterShell } from "@/components/home/chapter/chapter-shell";
import { Reveal } from "@/components/primitives/reveal";

import { CloseDealCard } from "./close-deal-card";
import { GetPaidCard } from "./get-paid-card";
import { ReplayCard } from "./replay-card";

/**
 * Chapter 2 at 1024px and above: the replay card on the left, and "How to close
 * the deal" stacked over "Get paid" on the right.
 *
 * THE ROW NEVER STACKS. `flex-nowrap` is drawn, and both children are
 * `flex-1 flex-basis-0`, so they are exact halves of the panel - 548px each at
 * 1280 and above, where the section's 1280px cap freezes the composition at its
 * authored size. What DOES reflow below 1244 is one level further in, inside
 * card 1 (see ./replay-card.tsx).
 *
 * THE PRODUCT FACES. The whole row is `font-ui` (Hanken Grotesk) with
 * `font-ui-serif` (Source Serif 4) on the card titles and the money, because
 * every card in it is a recreation of the real app UI - which is exactly what
 * those two faces are for (docs/brand.md; RULINGS.md §01 ruling 9, measured and
 * settled). The three marketing elements above the row stay in Fraunces and
 * Nunito Sans.
 *
 * EYEBROW COLOUR. `--color-eyebrow-muted`, not `--color-eyebrow`. The spec asks
 * for the unmuted tone on the ground that it measures 4.59:1 here, but the
 * panel wears `.canvas-botanical`, and RULINGS.md §06 generalises the rule
 * after chapter 1 measured the unmuted tone at 4.40:1 on exactly this surface:
 * an eyebrow takes the muted pair whenever it sits on `card-muted` or on a
 * botanical wash. Chapter 1's three eyebrows on the identical panel already do.
 * Measured on this build's composited pixels, both clear AA; the muted tone is
 * the one with headroom and the one that matches the chapter above.
 *
 * UNRESET PARAGRAPH MARGIN. The artboard never resets `<p>`, so the panel
 * paragraph carries the browser's default `margin-bottom: 1em` - 18px at 18px -
 * and the two-card row below it sits 18px lower than the flex `gap: 24px` alone
 * would put it. Our Tailwind reset removes that, so it is reproduced here as a
 * real value (RULINGS.md §06, principle 1). Card 3's intro paragraph carries an
 * explicit `margin: 0` in the artboard and needs no such treatment.
 */
export function Chapter2Desktop() {
  return (
    <ChapterShell
      dataSection="chapter-2-desktop"
      image="/images/photo-3.webp"
      objectPosition="center 45%"
      sectionClassName="py-24"
      headingMaxWidth={820}
      /*
        THE <span> IS LOAD-BEARING, measured not assumed. The artboard writes
        `<h1 class="pf-h1" style="max-width:820px"><span>...</span></h1>`, and
        the two boxes are NOT the same: the block-level h1 fills its 820px cap
        while the inline span shrink-wraps to its widest line at 769.4px and
        sits 4px higher, because an inline box is measured from the font's
        ascent rather than from the line box. The 820 the prop carries is
        correct - it is the cap that makes the headline wrap to two lines - but
        it is not what the heading renders as. Without the span our heading
        reports 820 x (y+4) against the artboard's 769 x y.
      */
      heading={<span>Win more jobs, without the late-night admin.</span>}
    >
      <div className="relative flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <Reveal
            as="span"
            anim="up-blur"
            duration={0.5}
            className="mb-1 text-[12px] font-extrabold tracking-[0.14em] text-eyebrow-muted uppercase"
          >
            SALES ASSISTANT
          </Reveal>

          <Reveal
            as="h3"
            anim="up-blur"
            delay={0.05}
            duration={0.5}
            className="display display-3 text-pf-ink-900"
          >
            Win the job and the client, not just the quote.
          </Reveal>

          {/* [LOG] The em dash is against `docs/brand.md`'s "No em dashes".
              Client copy, flagged not edited (D19). */}
          <Reveal
            as="p"
            anim="up-blur"
            delay={0.1}
            duration={0.5}
            className="mt-1.5 mb-[18px] max-w-[64ch] text-[18px] text-pf-ink-900"
          >
            Bramble knows the moment a client opens your quote, then hands you a heatmap of what
            they read and a replay of every visit — how long they sat on each section, and what
            they keep coming back to. You’re ready to close the deal.
          </Reveal>
        </div>

        <Reveal
          anim="scale"
          duration={0.5}
          className="flex w-full flex-nowrap items-stretch gap-6 font-ui"
        >
          <ReplayCard />

          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <CloseDealCard />
            <GetPaidCard />
          </div>
        </Reveal>
      </div>
    </ChapterShell>
  );
}
