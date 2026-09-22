import { ChapterShell } from "@/components/home/chapter/chapter-shell";
import { Reveal } from "@/components/primitives/reveal";

// import { DiscoveryTabs } from "./discovery-tabs";

/**
 * Chapter 1 at 1024px and above: the discovery tabs across the top of the
 * panel, then two panels of copy side by side beneath it.
 *
 * THE TWO PRODUCT CARDS ARE GONE. Panels B and C used to close on a price
 * library being built from files and a branded quote for Sarah Henderson, and
 * both panels now make a different case, so the depictions were removed rather
 * than left illustrating a claim the words no longer make. The components
 * (price-library-card.tsx, proposal-card.tsx), their figures in
 * content/home.ts and their labels in labels.ts all still exist and are now
 * unused here.
 *
 * EYEBROW COLOUR. All three eyebrows take `--color-eyebrow-muted`, not
 * `--color-eyebrow`, and the reason they were chosen has since gone away.
 *
 * The panel used to wear `.canvas-botanical`, which multiplied at opacity .5
 * over its right 420px and dropped the surface under the `Premium proposals`
 * eyebrow from #FAF8F3 to a measured #F4F1E9 - the thin-headroom trap
 * RULINGS.md warns about ("anything that composites them through an opacity
 * will fail"). The panel now wears `.grid-panel`, which composites nothing:
 * the surface is #FAF8F3 across the whole card and `--color-eyebrow` would
 * clear AA on it at 5.46:1.
 *
 * The muted pair stays anyway. It measures 8.36:1 on the new surface against
 * 7.86 on the old, so the change only gave it headroom, and swapping three
 * eyebrows back to the brighter tone is a colour decision rather than a
 * correction. Worth knowing the constraint is lifted if anyone wants them
 * brighter.
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
      image="/images/studio-plans.webp"
      objectPosition="center 40%"
      /* pb-24 is ours, not the artboard's. Chapter 1 drew no bottom padding
         because chapter 2 followed it with its own pt-24, and integrations -
         which follows now - deliberately has no top padding at all, taking the
         gap from whatever precedes it. Removing chapter 2 left those two zeroes
         adjacent and collapsed the gap to nothing. */
      sectionClassName="pt-8 pb-24"
      headingMaxWidth={760}
      /* The two lines are spans, as the artboard writes them. They carry no
         styling - a bare <br> renders identically - but giving each line its own
         element is what lets the geometry harness, which joins the two trees on
         leaf text nodes, actually measure them instead of reporting them absent. */
      heading={
        <>
          <span>Everyone’s telling you to use AI.</span>
          <br />
          <span>Fewer people can tell you what for.</span>
        </>
      }
    >
      {/* Panel A - the discovery-call intro.

          `pb-2`, not the `pb-10` it carried while the tab strip was here: that
          40px was the air under a card, and with the card commented out it was
          40px under a paragraph, which read as a hole. The two panels below
          come up to meet it. */}
      <div className="pb-2">
        <div className="relative flex flex-col items-center gap-3.5">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Reveal
              as="span"
              anim="up-blur"
              duration={0.5}
              className="mb-1 text-[12px] font-extrabold tracking-[0.14em] text-eyebrow-muted uppercase"
            >
              START HERE / DISCOVERY CALL
            </Reveal>

            <Reveal
              as="h3"
              anim="up-blur"
              delay={0.05}
              duration={0.5}
              className="display display-3 text-pf-ink-900"
            >
              Thirty minutes to work out what’s worth doing.
            </Reveal>

            {/*
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
              We walk through your operations, your team and your roadmap, then map the handful of
              changes that would actually move the needle: AI where it earns its place, plus the
              software and technical decisions underneath it.
            </Reveal>
          </div>

          {/* The discovery tab strip, COMMENTED OUT rather than deleted: three
              tabs (Map your operations / Brief your team / Shape the roadmap)
              over one line of copy. The component, its content and its mobile
              call site are all untouched, so restoring it is uncommenting this
              block and its import. */}
          {/* <Reveal
            anim="scale"
            duration={0.5}
            className="mx-auto flex w-full max-w-[1000px] flex-col items-center"
          >
            <DiscoveryTabs />
          </Reveal> */}
        </div>
      </div>

      {/* The take-off/split separator, now UNPAINTED. The track stays so the
          vertical rhythm below it does not move by a pixel; only the colour is
          gone.

          It was `bg-pf-ink-200`, which sits 14 levels below the panel surface
          where the grid's own hairline sits 10 - so with the grid behind it the
          panel carried two weights of rule and this was the heavier one. Worse,
          its position comes from the height of the content above it rather than
          from any fixed measure, so unlike the column divider it cannot be
          phased onto the grid: it will always land wherever the take-off block
          happens to end, cutting whichever row it lands in.

          The grid does this job now. Restore the class if the grid ever comes
          off this panel - the separator is in the artboard and it is only
          redundant while there is ruling behind it. */}
      <div className="h-px" />

      <div className="grid gap-12 [grid-template-columns:1fr_1px_1fr]">
        {/* Panel B - how we work. */}
        <div className="flex min-w-0 flex-col gap-6 pt-8">
          <div className="flex flex-col gap-1.5">
            <Reveal
              as="span"
              anim="up-blur"
              duration={0.5}
              className="mb-1 text-[12px] font-extrabold tracking-[0.14em] text-eyebrow-muted uppercase"
            >
              How we work
            </Reveal>
            <Reveal
              as="h3"
              anim="up-blur"
              delay={0.05}
              duration={0.5}
              className="display display-3 text-pf-ink-900"
            >
              Agency expertise, without the
              <br />
              agency price tag.
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
              We work alongside you a day or two a week, and we scale up when a project
              needs it. You get the senior thinking and the judgement calls a good agency
              brings, without paying for one full time. Same people, same standard, a
              fraction of the cost.
            </Reveal>
          </div>
        </div>

        {/* The column rule, also unpainted, and for the same reason as the
            separator above: it was the heavier of the panel's two hairline
            weights. This one DOES sit on the grid - the split is centred and
            the grid is phased to put a line on the centre axis - so the grid
            draws it, at the grid's own weight, and painting it again here only
            made one column line darker than every other.

            The track itself stays: it is what gives the split its 97px visual
            gutter and what lets the rule take the height of the taller cell
            without anything measuring it. */}
        <div />

        {/* Panel C - the plan. */}
        <div className="flex min-w-0 flex-col gap-6 pt-8">
          <div className="flex flex-col gap-1.5">
            <Reveal
              as="span"
              anim="up-blur"
              duration={0.5}
              className="mb-1 text-[12px] font-extrabold tracking-[0.14em] text-eyebrow-muted uppercase"
            >
              A clear plan
            </Reveal>
            <Reveal
              as="h3"
              anim="up-blur"
              delay={0.05}
              duration={0.5}
              className="display display-3 text-pf-ink-900"
            >
              It all starts with a
              <br />
              well-defined strategy.
            </Reveal>
            {/* See panel B for why the bottom margin is written out. */}
            <Reveal
              as="p"
              anim="up-blur"
              delay={0.1}
              duration={0.5}
              className="mt-1.5 mb-[14px] max-w-[48ch] text-[14px] text-pf-ink-900"
            >
              We start by defining what is actually holding you back. Those become goals
              you can put a number against, then jobs with a name and a date on each. No
              vague promises, just what is done, what is next, and what it changed.
            </Reveal>
          </div>
        </div>
      </div>
    </ChapterShell>
  );
}
