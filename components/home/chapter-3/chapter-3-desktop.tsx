import { ChapterShell } from "@/components/home/chapter/chapter-shell";
import { Reveal } from "@/components/primitives/reveal";

import { AnalyticsStage } from "./analytics-stage";
import { CountUpRuntime } from "./count-up-runtime";
import { Leaderboard } from "./leaderboard";

/**
 * Chapter 3 at 1024px and above: the sales pipeline over the top of the panel,
 * a rule, and the team leaderboard beneath it. Two bands, one panel - the
 * leaderboard is the last child of the same `.canvas-botanical` card, not a
 * section of its own.
 *
 * EYEBROW COLOUR. Both eyebrows take `--color-eyebrow`, not the muted pair
 * chapter 1 needed. The panel wears the same botanical wash, but the wash is
 * 420px wide and anchored to the panel's right edge, and both of these eyebrows
 * sit well left of it - the pipeline eyebrow is centred in a 1120px column and
 * the leaderboard's is in the left half of a centred 1024px grid. Measured on
 * the composited pixels rather than assumed: both read #F8F7F2 behind them.
 *
 * WHY THE COUNT RUNTIME IS MOUNTED HERE. It is the one client leaf in the
 * chapter, and it belongs in the desktop subtree because the strip only exists
 * here. Below 1024px this whole section is `display: none`, so its
 * IntersectionObserver never fires - which is exactly the behaviour the
 * artboard describes, where no width under 1024 counts anything.
 */
export function Chapter3Desktop() {
  return (
    <ChapterShell
      dataSection="chapter-3-desktop"
      image="/images/photo-1.webp"
      objectPosition="center 30%"
      sectionClassName="pb-24"
      headingMaxWidth={820}
      /* The artboard puts the heading's one text node inside a `<span>`
         (docs/specs/10-chapter-3.md §1). Kept, because an inline box and a
         block box are not the same box: as a bare string the text measures the
         full 820px measure and sits 4px higher than the artboard's. */
      heading={<span>Build a quoting &amp; sales system that gets sharper every job.</span>}
    >
      <CountUpRuntime />

      {/*
        The 80px of bottom padding belongs to the whole panel, not to band A.
        In the artboard the divider and the leaderboard live inside this same
        wrapper, so the 80px falls BELOW the leaderboard and the divider sits
        32px under the stage. Measured against the artboard at 1280px: with the
        padding around band A alone, the entire leaderboard band rides 80px low.
      */}
      <div className="pb-20">
        {/* Band A - the sales pipeline. */}
        <div className="relative flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Reveal
              as="span"
              anim="up-blur"
              duration={0.5}
              className="mb-1 text-[12px] font-extrabold tracking-[0.14em] text-eyebrow uppercase"
            >
              {/* Capitals as the artboard authors them. The two eyebrows in this
                  chapter are inconsistent in the source - this one is typed in
                  caps, the leaderboard's in sentence case, and both are
                  uppercased again in CSS (D14). Matching the raw text keeps the
                  string readable to anything that ignores `text-transform`. */}
              YOUR SALES PIPELINE
            </Reveal>

            <Reveal
              as="h3"
              anim="up-blur"
              delay={0.05}
              duration={0.5}
              className="display display-3 text-pf-ink-900"
            >
              Know where every quote stands, and what to do next.
            </Reveal>

            {/* `mb-[18px]` is a rendered value, not a declared one. The artboard
                never resets `<p>`, so this paragraph carries the browser's
                default `margin-block-end: 1em` - 18px at 18px - and the stage
                below it sits that much lower than the declared 24px gap alone
                would put it. Measured on the artboard at 1280px. Reproduced per
                call site rather than as a blanket rule, because the artboards'
                paragraph spacing is only accidentally uniform. */}
            <Reveal
              as="p"
              anim="up-blur"
              delay={0.1}
              duration={0.5}
              className="mt-1.5 mb-[18px] max-w-[64ch] text-[18px] text-pf-ink-900"
            >
              No lost spreadsheets, no digging through emails. Everything in one place: a
              birdseye view of your entire business, whether you run it on your own or with a
              team.
            </Reveal>
          </div>

          <AnalyticsStage />
        </div>

        {/* The artboard's own 10% ink mix rather than `pf-ink-200`: it is a
            lighter rule than the one chapter 1 draws, and both are as drawn. */}
        <div className="mt-8 h-px bg-[color-mix(in_oklab,var(--color-pf-ink-900)_10%,transparent)]" />

        {/* Band B - the team leaderboard. */}
        <div className="mt-8">
          <Leaderboard />
        </div>
      </div>
    </ChapterShell>
  );
}
