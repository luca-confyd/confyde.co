import Image from "next/image";
import { Check } from "lucide-react";

import { Reveal } from "@/components/primitives/reveal";
import {
  CLIENT_ROWS_DESKTOP,
  CLIENT_ROW_AVATAR,
  REPEAT_WORK,
} from "@/content/repeat-work";

/**
 * The repeat-work panel, desktop composition.
 *
 * A botanical canvas panel carrying two cards side by side: Confyde's own
 * "worth a call" list on the left, and the money that list has already made on
 * the right. Mutually exclusive with `repeat-work-mobile.tsx` at 1024px - see
 * `repeat-work.tsx` for why the two are separate compositions rather than one
 * with `desk:` forks.
 *
 * TYPE. Everything inside the two cards is set in the product faces
 * (`--font-ui` / `--font-ui-serif`): the left card is a recreation of the real
 * app's client list, which is exactly the case docs/brand.md carves out for
 * Hanken Grotesk and Source Serif 4. Only the panel's own eyebrow, heading and
 * intro belong to the marketing layer, and those inherit it.
 */
export function RepeatWorkDesktop() {
  return (
    <section
      data-section="repeat-work-desktop"
      className="mx-auto hidden w-full max-w-[1280px] px-6 pb-24 desk:block"
    >
      {/*
        `canvas-botanical` is the watercolour panel down the right margin. It
        is `position: relative` plus an `::after`, and it sets `z-index: 1` on
        its own direct children, so the two cards sit above the wash.

        The shadow is a single soft warm drop, not one of the four layered
        `.shadow-border-*` recipes: this panel is a raised plate on the page
        surface rather than a card, and borrowing a recipe would add the
        hairline the artboard does not draw. rgb(51 56 58) is the body-text warm grey #33383A - shadows tint
     to the text family, not to the raspberry primary.
      */}
      <div className="canvas-botanical rounded-xl bg-pf-surface-300 p-12 shadow-[0_18px_40px_-24px_rgb(51_56_58/0.4)]">
        <div className="flex flex-col items-center gap-1.5 text-center">
          {/*
            `--color-eyebrow`, the accessibility-corrected tone, not the
            artboard's lime-700: lime-700 on this near-white surface measures
            ~2.3:1 where AA needs 4.5:1 at 12px. Same substitution the
            social-proof band makes.
          */}
          <Reveal
            as="span"
            anim="up-blur"
            duration={0.5}
            className="mb-1 text-[12px] font-extrabold tracking-[0.14em] text-eyebrow uppercase"
          >
            {REPEAT_WORK.eyebrow}
          </Reveal>

          {/*
            `<h2>`, at the same level as the marquee, social-proof and
            before-after headings, so the page outline runs h1 -> h2 -> h2 with
            no skip. The artboard writes `<h3 class="pf-h3">`; heading level and
            type size are independent, which is what `.display-3` is for
            (RULINGS.md §03/04 ruling 8). `.display` + `.display-3` reproduce
            `.pf-h3` exactly at every width this subtree renders at.
          */}
          <Reveal
            as="h2"
            anim="up-blur"
            delay={0.05}
            duration={0.5}
            className="display display-3 text-pf-ink-900"
          >
            {REPEAT_WORK.heading}
          </Reveal>

          <Reveal
            as="p"
            anim="up-blur"
            delay={0.1}
            duration={0.5}
            className="mt-1.5 max-w-[64ch] text-[16px] leading-[1.6] text-pf-ink-900"
          >
            {REPEAT_WORK.intro}
          </Reveal>
        </div>

        {/*
          One reveal on the pair, as the artboard draws it - the two cards rise
          together rather than in sequence.

          `1.15fr / minmax(320px, 1fr)` never reflows on this page: the panel is
          at least 880px of content wide at 1024, so the right column's 320px
          floor is always met and the grid is always two across.
        */}
        <Reveal
          anim="scale"
          delay={0.15}
          duration={0.5}
          className="mx-auto mt-7 grid w-full max-w-[1024px] items-stretch gap-5 [grid-template-columns:minmax(0,1.15fr)_minmax(320px,1fr)]"
        >
          {/* `overflow-hidden` is what clips the list's own rows to the card's
              radius.

              `h-full` + `flex-col` stay although the footer strip that used
              `mt-auto` is gone: they are what still stretches this card to the
              dark one's height, so the two columns keep level bottom edges. */}
          <div className="flex h-full flex-col overflow-hidden rounded-xl bg-card">
            {/* One child now the count is gone, so there is nothing left to
                space apart: `justify-between` and the gap would do nothing, and
                `items-baseline` only mattered for aligning the count's smaller
                type against the heading's. */}
            <div className="border-b border-hairline px-5 py-[14px]">
              {/* `<h3>`: this titles the card inside the section the `<h2>`
                  above opens. The artboard writes `<h4>`. */}
              <h3 className="m-0 font-ui-serif text-[19px] font-semibold text-ink">
                {REPEAT_WORK.listTitle}
              </h3>
            </div>

            <ul className="m-0 list-none p-0">
              {CLIENT_ROWS_DESKTOP.map((row) => (
                /* The hairline between rows is slate-100 and NOT the warmer
                   `--color-hairline` the card's own header and footer use.
                   That is the app's own list rule, drawn as drawn. */
                <li
                  key={row.name}
                  className="flex items-center gap-[13px] border-t border-slate-100 px-5 py-3 first:border-t-0"
                >
                  {/* Decorative: the client is named in the text beside it. */}
                  <Image
                    src={row.photo}
                    alt=""
                    width={CLIENT_ROW_AVATAR.intrinsic}
                    height={CLIENT_ROW_AVATAR.intrinsic}
                    sizes={CLIENT_ROW_AVATAR.sizes}
                    className="size-12 flex-none rounded-lg object-cover"
                  />

                  {/* `min-w-0` is load-bearing: without it this flex item will
                      not shrink below its content width and the note wraps the
                      row instead of itself. */}
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex flex-wrap items-baseline gap-2">
                      <span className="font-ui text-[14.5px] font-medium text-charcoal-900">
                        {row.name}
                      </span>
                      <span className="font-ui text-[12.5px] text-slate-500">{row.place}</span>
                    </span>
                    <span className="font-ui text-[13px] leading-[1.4] text-slate-500">
                      {row.note}
                    </span>
                  </span>

                  {/* One child now the status word above the chip is gone, so
                      the column, its end-alignment and its gap have nothing
                      left to arrange. */}
                  <span className="flex-none">
                    {/*
                      Text, never a control: this is a depiction of a button
                      inside a depiction of the app, and rendering it as one
                      would add four inert tab stops to the page. Same call as
                      the before/after phones' green action lines.
                    */}
                    <span className="inline-flex items-center rounded-md bg-well px-[13px] py-1.5 font-ui text-[12.5px] font-semibold whitespace-nowrap text-slate-700 shadow-[0_0_0_1px_var(--color-hairline),0_1px_2px_rgb(51_56_58/0.08)]">
                      {row.action}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

          </div>

          <div className="flex h-full flex-col gap-5 overflow-hidden rounded-xl bg-forest-900 px-[22px] py-6">
            <div>
              <div className="font-ui text-[11.5px] font-semibold tracking-[0.1em] text-forest-200 uppercase">
                {REPEAT_WORK.statLabel}
              </div>

              <div className="mt-[14px] flex flex-wrap items-start gap-x-[22px] gap-y-[18px]">
                {REPEAT_WORK.stats.map((stat, index) => (
                  /*
                    The second stat is the one the panel is arguing for, so it
                    is set half again as large, in lime, and behind a rule. The
                    rule is a left border on the second item rather than a
                    separator element, so it disappears by itself if the two
                    ever wrap onto separate lines.
                  */
                  <div
                    key={stat.figure}
                    className={
                      index === 0
                        ? "min-w-[120px] flex-[1_1_130px]"
                        : "min-w-[135px] flex-[1_1_150px] border-l border-cream/[0.18] pl-[22px]"
                    }
                  >
                    {/*
                      `tabular-nums` on the money figure only - docs/brand.md
                      allows tabular numerals in a column of money, and this is
                      the only figure on the panel that is one.

                      Lime here means forward motion on the page's single
                      loudest number, which is one of the four roles the brand
                      reserves it for.
                    */}
                    <div
                      className={
                        index === 0
                          ? "font-ui-serif text-[30px] leading-none font-semibold text-white"
                          : "font-ui-serif text-[46px] leading-[0.95] font-semibold tracking-[-0.01em] text-lime-500 tabular-nums"
                      }
                    >
                      {stat.figure}
                    </div>
                    <div className="mt-1.5 font-ui text-[13px] leading-[1.4] text-forest-200">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ul className="m-0 flex list-none flex-col gap-[11px] border-t border-cream/[0.18] p-0 pt-[18px]">
              {REPEAT_WORK.ticks.map((tick) => (
                <li
                  key={tick}
                  className="flex items-start gap-2.5 font-ui text-[13.5px] leading-[1.5] text-cream"
                >
                  {/*
                    Lucide `Check`, not the artboard's hand-inlined path - the
                    path data is the same glyph, and Lucide is the only icon
                    system on the page. `currentColor` would inherit cream, so
                    the lime is set on the icon itself, as drawn: a completed
                    tick in lime contradicts docs/brand.md, which reserves lime
                    for forward motion and wants completion in forest. [LOG]
                    These are not completed states, though - they are the
                    argument for doing the thing - so it ships as drawn.
                  */}
                  <Check
                    aria-hidden="true"
                    size={15}
                    strokeWidth={3}
                    className="mt-[3px] flex-none text-lime-500"
                  />
                  {tick}
                </li>
              ))}
            </ul>

            {/* A well inside a dark card: cream at 9% rather than a second
                surface token, because there is no on-forest well tone in the
                system and inventing one would be a brand change. */}
            <div className="mt-auto flex flex-col gap-[9px] rounded-lg bg-cream/[0.09] px-4 pt-4 pb-[17px] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-cream)_14%,transparent)]">
              <span className="font-ui-serif text-[17px] leading-[1.3] font-semibold text-white">
                {REPEAT_WORK.callout.title}
              </span>
              <span className="font-ui text-[13px] leading-[1.5] text-forest-200">
                {REPEAT_WORK.callout.bodyDesktop}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
