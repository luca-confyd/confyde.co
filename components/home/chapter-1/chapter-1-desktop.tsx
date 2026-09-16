import { ChapterShell } from "@/components/home/chapter/chapter-shell";
import { Reveal } from "@/components/primitives/reveal";

import { PriceLibraryCard } from "./price-library-card";
import { ProposalCard } from "./proposal-card";
import { TakeoffCard } from "./takeoff-card";

/**
 * Chapter 1 at 1024px and above: the take-off demo across the top of the
 * panel, then the price library and the proposal card side by side beneath it.
 *
 * EYEBROW COLOUR. All three eyebrows take `--color-eyebrow-muted`, not
 * `--color-eyebrow`. The panel wears `.canvas-botanical`, which multiplies at
 * opacity .5 over its right 420px and drops the surface under the
 * `Premium proposals` eyebrow from #F8F7F2 to a measured #F5F3ED - where
 * `--color-eyebrow` reaches only 4.40:1, exactly the thin-headroom trap
 * RULINGS.md warns about ("anything that composites them through an opacity
 * will fail"). The muted tone was computed against a darker surface still and
 * clears comfortably here. The rule generalises: an eyebrow takes the muted
 * pair whenever it sits on `card-muted` or on a botanical wash, which is what
 * the integrations band established and what this section inherits.
 *
 * THE SPLIT'S 97px GUTTER. The grid is `1fr 1px 1fr` with `gap: 48px`, so the
 * bare 1px column in the middle has 48px on each side and the visual gutter is
 * 97px, not 48. Using a grid track rather than a border is what lets the rule
 * stretch to the taller of the two cells for free.
 */
export function Chapter1Desktop() {
  return (
    <ChapterShell
      dataSection="chapter-1-desktop"
      image="/images/photo-2.webp"
      objectPosition="center 40%"
      sectionClassName="pt-8"
      headingMaxWidth={760}
      /* The two lines are spans, as the artboard writes them. They carry no
         styling - a bare <br> renders identically - but giving each line its own
         element is what lets the geometry harness, which joins the two trees on
         leaf text nodes, actually measure them instead of reporting them absent. */
      heading={
        <>
          <span>Meet Bramble.</span>
          <br />
          <span>Quoting, taken off your plate.</span>
        </>
      }
    >
      {/* Panel A - the take-off demo. */}
      <div className="pb-10">
        <div className="relative flex flex-col items-center gap-3.5">
          <div className="flex flex-col items-center gap-1.5 text-center">
            {/* [LOG] The spaced hyphen is the client's, where every other
                eyebrow on the page uses none. Flagged, not edited. */}
            <Reveal
              as="span"
              anim="up-blur"
              duration={0.5}
              className="mb-1 text-[12px] font-extrabold tracking-[0.14em] text-eyebrow-muted uppercase"
            >
              START HERE - ESTIMATING &amp; QUOTING
            </Reveal>

            <Reveal
              as="h3"
              anim="up-blur"
              delay={0.05}
              duration={0.5}
              className="display display-3 text-pf-ink-900"
            >
              Build a client-ready estimate in minutes, not your nights.
            </Reveal>

            {/*
              [LOG] `then and rewrites it` is ungrammatical, and the mobile
              artboard's version of the same sentence is not - it reads "and
              rewrites it in language ready for your client" and drops "AI". If
              the client fixes this one they will probably want mobile's
              wording. Client copy either way; flagged, not edited.

              The artboard wraps the last sentence in a bold-italic pair whose
              own child cancels both, so it renders as plain body text. The
              rendered result is reproduced and the inert wrapper dropped -
              which also happens to be what docs/brand.md's ban on italics
              wants (RULINGS.md §02 ruling 3).

              The 60ch cap is ~1046px at 18px, wider than the 1000px card below
              it, so it never bites at 1440px - but it is what stops the
              paragraph running the panel's full 1184px at wider windows.
            */}
            <Reveal
              as="p"
              anim="up-blur"
              delay={0.1}
              duration={0.5}
              className="mt-1.5 mb-[18px] max-w-[60ch] text-[18px] text-pf-ink-900"
            >
              Bramble’s AI measures your job off the plan, prices it from your own materials
              &amp; suppliers - then and rewrites it ready for your client.{"\u00A0"}
              <span>You just add your margin.</span>
            </Reveal>
          </div>

          <Reveal
            anim="scale"
            duration={0.5}
            className="mx-auto flex w-full max-w-[1000px] flex-col items-center"
          >
            <TakeoffCard />
          </Reveal>
        </div>
      </div>

      <div className="h-px bg-pf-ink-200" />

      <div className="grid gap-12 [grid-template-columns:1fr_1px_1fr]">
        {/* Panel B - the price library. */}
        <div className="flex min-w-0 flex-col gap-6 pt-12">
          <div className="flex flex-col gap-1.5">
            <Reveal
              as="span"
              anim="up-blur"
              duration={0.5}
              className="mb-1 text-[12px] font-extrabold tracking-[0.14em] text-eyebrow-muted uppercase"
            >
              Your price library
            </Reveal>
            <Reveal
              as="h3"
              anim="up-blur"
              delay={0.05}
              duration={0.5}
              className="display display-3 text-pf-ink-900"
            >
              Bramble learns your real prices.
            </Reveal>
            {/* 14px here against the wide panel's 18px. Two different jobs:
                that one opens the chapter, this one supports a card.

                `mb-[14px]` is a rendered value, not a declared one. The artboard
                never resets `<p>`, so every paragraph in it keeps the browser's
                default `margin-block-end: 1em` - 14px at this font size, 18px at
                the wide panel's. Our reset removes it, which cost the section
                18px of drift through the take-off card and 36px by the proposal
                card's total. Reproduced per call site rather than as a blanket
                `p { margin-bottom: 1em }`, because the artboards' paragraph
                spacing is only accidentally uniform - the mobile board declares
                its own margins explicitly and would fight a blanket rule.
                Same class as the hero's 44px-that-renders-60px CTA row. */}
            <Reveal
              as="p"
              anim="up-blur"
              delay={0.1}
              duration={0.5}
              className="mt-1.5 mb-[14px] max-w-[48ch] text-[14px] text-pf-ink-900"
            >
              Bramble learns your materials, labour rates and margins from your own files, so
              every line is priced on what the job actually costs you. No more finding out at
              the end that you quoted it too cheap.
            </Reveal>
          </div>
          <PriceLibraryCard />
        </div>

        {/* The rule. A bare 1px grid track, so it takes the height of the
            taller cell without anything measuring it. */}
        <div className="bg-pf-ink-200" />

        {/* Panel C - the proposal. */}
        <div className="flex min-w-0 flex-col gap-6 pt-12">
          <div className="flex flex-col gap-1.5">
            <Reveal
              as="span"
              anim="up-blur"
              duration={0.5}
              className="mb-1 text-[12px] font-extrabold tracking-[0.14em] text-eyebrow-muted uppercase"
            >
              Premium proposals
            </Reveal>
            <Reveal
              as="h3"
              anim="up-blur"
              delay={0.05}
              duration={0.5}
              className="display display-3 text-pf-ink-900"
            >
              Beautifully branded proposals, sent in minutes, not days.
            </Reveal>
            {/* See panel B for why the bottom margin is written out. */}
            <Reveal
              as="p"
              anim="up-blur"
              delay={0.1}
              duration={0.5}
              className="mt-1.5 mb-[14px] max-w-[48ch] text-[14px] text-pf-ink-900"
            >
              Choose from a range of branded templates built by sales professionals. Your
              professionally designed quote lands same day while your competitors are still
              promising theirs.
            </Reveal>
          </div>
          <ProposalCard />
        </div>
      </div>
    </ChapterShell>
  );
}
