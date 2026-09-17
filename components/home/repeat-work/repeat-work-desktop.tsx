import Image from "next/image";
import { Check } from "lucide-react";

import { Reveal } from "@/components/primitives/reveal";
import { CLIENT_ROWS_DESKTOP, REPEAT_WORK } from "@/content/repeat-work";

import { StatusCircle } from "./status-circle";

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

            {/*
                `flex-1` + rows that grow. The card is stretched to the dark
                card's height, and with a fixed row height that surplus all
                collected under the last row as dead space - about 145px of it
                once the company header made the dark card taller again. Letting
                the five rows share it instead spreads the same space between
                them, so the list fills its card and the two columns read as a
                pair rather than as one full card beside one half-empty one.
              */}
            <ul className="m-0 flex flex-1 list-none flex-col p-0">
              {CLIENT_ROWS_DESKTOP.map((row, index) => (
                /* The hairline between rows is slate-100 and NOT the warmer
                   `--color-hairline` the card's own header uses. That is the
                   app's own list rule, drawn as drawn. */
                <li
                  key={row.title}
                  className="flex flex-1 items-center gap-4 border-t border-slate-100 px-5 py-[15px] first:border-t-0"
                >
                  {/* `min-w-0` is load-bearing: without it this flex item will
                      not shrink below its content width and the detail line
                      wraps the row instead of itself. */}
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="font-ui text-[15px] font-medium text-charcoal-900">
                      {row.title}
                    </span>
                    {/*
                      One line, three fields. The middle dot separates what
                      Confyde did from who it was for; the comma inside the
                      second half is the client's own address. Both live here
                      rather than in the content file so the punctuation stays a
                      typographic decision.
                    */}
                    <span className="font-ui text-[13px] leading-[1.4] text-slate-500">
                      {row.detail} &middot; {row.client}, {row.place}
                    </span>
                  </span>

                  <StatusCircle index={index} />
                </li>
              ))}
            </ul>

          </div>

          <div className="flex h-full flex-col gap-5 overflow-hidden rounded-xl bg-forest-900 px-[22px] py-6">
            {/*
              The case study header, above a rule. The tile holds the client's
              own logo rather than a lettermark or a photograph: a face would
              read as one of the clients in the list opposite, and initials are
              what you draw when you do not have the logo.

              No plate behind it. This logo is already a filled rounded square
              with its own background, so a white tile under it would just be a
              second, brighter square framing the first. It draws at the tile
              size directly and brings its own shape.
            */}
            <div className="flex items-center gap-3.5 border-b border-cream/[0.18] pb-5">
              <span className="relative size-12 flex-none overflow-hidden rounded-lg">
                <Image
                  src={REPEAT_WORK.company.logo}
                  /* Decorative: the company is named immediately beside it. */
                  alt=""
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </span>

              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-ui text-[15.5px] font-semibold text-white">
                  {REPEAT_WORK.company.name}
                </span>
                <span className="font-ui text-[13px] text-forest-200">
                  {REPEAT_WORK.company.meta}
                </span>
              </span>

              {/*
                Text, never a control: no case study page exists (RULINGS.md
                §01), and rendering this as a link or a button would put an
                inert tab stop in the page. Same call the row action chips made
                before them.
              */}
              <span className="inline-flex flex-none items-center rounded-lg bg-cream/[0.12] px-[15px] py-2 font-ui text-[13.5px] font-semibold whitespace-nowrap text-white">
                {REPEAT_WORK.company.caseStudy}
              </span>
            </div>

            <div>
              <div className="font-ui text-[11.5px] font-semibold tracking-[0.1em] text-forest-200 uppercase">
                {REPEAT_WORK.statLabel}
              </div>

              {/*
                A two-track grid, not a wrapping flex row. The two stats used to
                carry different flex bases (130px and 150px) with different
                min-widths, so the tracks never came out the same width and the
                first stat sat in a visibly wider column than its own text - the
                "big gap on the left". Equal tracks are the whole fix, and they
                also mean the divider lands centred between the two rather than
                wherever the flex algorithm left it.
              */}
              <div className="mt-[14px] grid grid-cols-2 items-start gap-x-[22px]">
                {REPEAT_WORK.stats.map((stat, index) => (
                  /*
                    The rule is a left border on the second item rather than a
                    separator element, so there is nothing to keep in sync with
                    the track count.
                  */
                  <div
                    key={stat.figure}
                    className={index === 0 ? "" : "border-l border-cream/[0.18] pl-[22px]"}
                  >
                    {/*
                      ONE SIZE AND ONE COLOUR FOR BOTH FIGURES. The second was
                      set half again as large (46px against 30px) and in
                      lime-500, back when lime was the accent and meant forward
                      motion. Retiring the accent turned lime-500 into the
                      petrol primary, which put a dark figure on a dark petrol
                      panel: $412k measured 2.01:1 against forest-900, where
                      even large text needs 3.0. White is 11.65:1.

                      So the emphasis had to move somewhere, and evening the two
                      up is what the panel wanted anyway - they are two halves of
                      one claim, not a headline and a footnote.

                      `tabular-nums` stays on the money figure only:
                      docs/brand.md allows tabular numerals in a column of
                      money, and this is the only figure on the panel that is
                      one.
                    */}
                    <div
                      className={
                        index === 0
                          ? "font-ui-serif text-[36px] leading-[1.05] font-semibold text-white"
                          : "font-ui-serif text-[36px] leading-[1.05] font-semibold tracking-[-0.01em] text-white tabular-nums"
                      }
                    >
                      {stat.figure}
                    </div>
                    <div className="mt-2 font-ui text-[13px] leading-[1.4] text-forest-200">
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
                  className="flex items-start gap-2.5 font-ui text-[13.5px] leading-[1.5] text-forest-200"
                >
                  {/*
                    Lucide `Check`, not the artboard's hand-inlined path - the
                    path data is the same glyph, and Lucide is the only icon
                    system on the page.

                    WHITE TICK, PALE PETROL TEXT. The tick used to be lime-500
                    against cream text. Retiring the accent turned lime-500
                    into the petrol primary, which put a dark tick on a dark
                    petrol card at 2.01:1, where a non-text graphic needs 3.0.
                    The line is now forest-200 - the pale petrol the rest of
                    this card's secondary text uses, at 8.19:1 - and the tick
                    is white, at 11.65:1, so it stays the brightest thing in
                    the bullet and the eye still reads down the column of
                    ticks first.

                    That also retires the [LOG] this block used to carry, about
                    a lime tick contradicting docs/brand.md's reservation of
                    lime for forward motion. There is no lime left to argue
                    about.
                  */}
                  <Check aria-hidden="true" size={15} strokeWidth={3} className="mt-[3px] flex-none text-white" />
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
