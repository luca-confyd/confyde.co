import Image from "next/image";
import { Check, Ruler } from "lucide-react";

import { QUOTE, TAKEOFF, TAKEOFF_CLOCK, TAKEOFF_LINES } from "@/content/home";

import { CH1_LABELS } from "./labels";

/**
 * The plan's own paper tone. A one-off from the artboard with no role in the
 * token system, kept as a commented local constant rather than promoted
 * (RULINGS.md §02 ruling 5, the `#ACAFB1` precedent).
 *
 * It is load-bearing twice over: the frame is painted in it, and so are the two
 * reveal covers - which is the entire reason a cover is invisible until the
 * moment it lifts. If the two ever diverge, two grey rectangles appear on the
 * plan.
 */
const PLAN_PAPER = "#FAFAFA";

/**
 * The two rectangles that sit over the plan's measurement annotations and lift
 * off to reveal them. Every value is a percentage of the aspect box, which is
 * why `aspect-[1467/1072]` below cannot be rounded to 4/3: the plan is
 * `object-contain`, so any other ratio letterboxes it and these four numbers
 * land somewhere else on the drawing.
 */
const COVERS = [
  { animationName: "tk-cover1", left: "70.48%", top: "24.16%", width: "21.40%", height: "10.91%" },
  { animationName: "tk-cover2", left: "60.26%", top: "57.56%", width: "31.63%", height: "12.97%" },
] as const;

/**
 * Panel A's two-pane card: a site plan being measured on the left, the priced
 * lines arriving on the right.
 *
 * THE PAIRING IS THE ARGUMENT. Cover 1 and row 1 share their exact keyframe
 * percentages, and so do cover 2 and row 2 - a measurement appears on the plan
 * at the same instant its priced line appears in the list. If the two ever
 * drift apart the demo stops saying anything.
 *
 * `align-items: start` on the grid is what lets the left pane end above the
 * right pane's footer instead of stretching to match it, which is what makes
 * the left pane read as a tile rather than a column - helped by the one
 * bottom-right radius on its inner corner.
 *
 * FIXED COLUMN WIDTHS, NOT A GRID. The 58px quantity and 66px total columns
 * plus `tabular-nums` are what hold the money right-aligned while the rows
 * arrive one at a time. A real grid would make the four rows move together,
 * which is the opposite of the effect.
 *
 * THE 1150px BRANCH IS LIVE, NOT DEAD. The spec (D4) records the artboard's
 * `@media (max-width:1150px){.tk-grid{grid-template-columns:minmax(0,1fr)}}` as
 * dead code on the grounds that it can only fire between 1024 and 1150px "where
 * the 1000px cap already applies and the composition is unchanged". Measured on
 * the artboard, that is not what happens - the cap governs WIDTH and the query
 * governs TRACKS, and the two are independent:
 *
 *     artboard @1024   grid-template-columns: 848px          panes stacked
 *     artboard @1149   grid-template-columns: 973px          panes stacked
 *     artboard @1151   grid-template-columns: 546px 429px    side by side
 *     artboard @1280   grid-template-columns: 560px 440px    side by side
 *
 * So across 1024-1150px - 127px of our own desktop range - the artboard draws
 * the plan ABOVE the priced lines, not beside them. Shipping the two-column
 * grid flat put the whole card in the wrong composition at the switch width,
 * which the geometry harness caught at 1024. Reproduced here per principle 1.
 *
 * Written as `min-[1151px]:` on a single-column base rather than as a
 * `max-[1150px]:` override, so the two declarations sit in disjoint ranges and
 * neither depends on which order Tailwind emits them in - the same reasoning
 * that put `sm-only` in the page-wide conventions.
 */
export function TakeoffCard() {
  return (
    <div
      role="img"
      aria-label={CH1_LABELS.takeoff}
      className="shadow-border-strong grid w-full [grid-template-columns:minmax(0,1fr)] items-start overflow-hidden rounded-xl bg-white min-[1151px]:[grid-template-columns:minmax(0,1.12fr)_minmax(0,0.88fr)]"
    >
      {/* Left pane: the site-plan canvas. */}
      <div className="relative flex min-w-0 flex-col self-start rounded-br-xl border-r border-b border-hairline bg-well">
        <div className="flex items-center justify-between gap-2.5 border-b border-hairline bg-white px-3.5 py-2.5">
          {/* The icon-to-label gap is the one value the artboard does not write
              - it inlines the Ruler paths directly ahead of the text - so 6px
              is ours, matching the tightest icon pairing elsewhere on the page. */}
          <span className="flex items-center gap-1.5 font-ui text-[11.5px] font-semibold tracking-[0.1em] text-slate-700 uppercase">
            <Ruler aria-hidden="true" size={14} strokeWidth={2} className="shrink-0 text-forest-500" />
            {/* [LOG] Em dash, which docs/brand.md bans outright. Client copy;
                flagged, not edited (RULINGS.md principle 3). Mobile writes the
                same line with a middot and no surname. */}
            Take-off — Henderson, {TAKEOFF.address}
          </span>

          {/*
            Five superimposed readings at the same grid cell, so the chip never
            resizes as the number changes. `.tk-clock` is the hook the
            reduced-motion block needs: without it the only thing distinguishing
            these five spans from the rows is their inline animation-name, and
            selecting on a style attribute does not survive the move to a style
            prop.
          */}
          <span className="inline-grid place-items-center rounded-md bg-forest-900 px-[9px] py-1">
            {TAKEOFF_CLOCK.map((reading, i) => (
              <span
                key={reading}
                className="tk tk-lin tk-clock font-ui text-[12px] font-bold tabular-nums text-white [grid-area:1/1]"
                style={{ animationName: `tk-c${i + 1}` }}
              >
                {reading}
              </span>
            ))}
          </span>
        </div>

        <div className="relative p-4">
          <div
            className="relative overflow-hidden rounded-lg shadow-[0_0_0_1px_var(--color-slate-100)]"
            style={{ background: PLAN_PAPER }}
          >
            <div className="relative aspect-[1467/1072] w-full">
              <Image
                src="/images/takeoff-plan.webp"
                /* Shadowed by the card's own role="img" label; empty rather
                   than descriptive so the two cannot contradict each other. */
                alt=""
                fill
                sizes="560px"
                /* 90 rather than the default 75: this is fine linework on a
                   flat field, where compression artefacts are visible. */
                quality={90}
                className="object-contain"
              />

              {COVERS.map((cover) => (
                <span
                  key={cover.animationName}
                  aria-hidden="true"
                  className="tk tk-cover absolute"
                  style={{
                    animationName: cover.animationName,
                    left: cover.left,
                    top: cover.top,
                    width: cover.width,
                    height: cover.height,
                    background: PLAN_PAPER,
                  }}
                />
              ))}

              {/* The scan band: 16% of the plan's height, transparent at both
                  edges, travelling top to bottom on a linear curve because a
                  scanner that eases is a scanner that looks broken. */}
              <span
                aria-hidden="true"
                className="tk tk-lin tk-scan absolute inset-x-0 top-0 h-[16%] bg-[linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--color-lime-500)_44%,transparent),transparent)]"
                style={{ animationName: "tk-scan" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right pane: the priced lines. No white background here - the card
          already is white, which is why this header strip omits the fill the
          left one carries. */}
      <div className="flex min-w-0 flex-col pb-3.5">
        <div className="flex items-center justify-between gap-2.5 border-b border-hairline px-4 py-2.5">
          <span className="font-ui text-[11.5px] font-semibold tracking-[0.1em] text-slate-700 uppercase">
            Priced from your library
          </span>
        </div>

        <div className="flex flex-1 flex-col px-4 pt-0.5">
          {TAKEOFF_LINES.map((line, i) => (
            <div
              key={line.label}
              className="tk flex items-center gap-2.5 border-t border-t-[color-mix(in_oklab,var(--color-hairline)_40%,transparent)] px-0.5 py-[9px]"
              style={{ animationName: `tk-row${i + 1}` }}
            >
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-ui text-[14px] leading-[1.3] text-charcoal-900">
                  {line.label}
                </span>
                {/*
                  CONTRAST. The artboard sets this sub-line in slate-400, which
                  measures 3.29:1 on white against a 4.5 requirement. Moved one
                  step up the existing ink ramp to slate-500, which measures
                  4.85:1 here - an existing token rather than a fifth corrected
                  one, per RULINGS.md §06.
                */}
                <span className="font-ui text-[11.5px] leading-[1.35] text-slate-500">
                  {line.spec} · {line.supplier}
                  <br />
                  {line.rate}
                </span>
              </span>
              <span className="w-[58px] shrink-0 text-right font-ui text-[13px] tabular-nums text-slate-700">
                {line.qty}
              </span>
              <span className="w-[66px] shrink-0 text-right font-ui-serif text-[14px] font-semibold tabular-nums text-ink">
                {line.amount}
              </span>
            </div>
          ))}
        </div>

        {/*
          CONTRAST. `Cost` and `Your margin · 24%` are slate-500 in the
          artboard, which measures 4.40:1 on the `well` fill even after the
          page-wide correction of that token - still short of 4.5. slate-600
          clears it at 7.38:1 and is an existing token, which RULINGS.md §06
          prefers over minting a fifth corrected tone. The cost of that choice
          is honest: the label/value step in these two rows is now smaller than
          drawn, because slate-600 sits close to the slate-700 figures beside
          it. The hierarchy that carries the block is the third row's serif
          anyway.
        */}
        <div
          className="tk mx-4 mt-3 flex flex-col gap-[9px] rounded-lg bg-well px-3.5 py-[13px]"
          style={{ animationName: "tk-total" }}
        >
          <div className="flex items-baseline justify-between gap-2.5">
            <span className="font-ui text-[13px] text-slate-600">Cost</span>
            <span className="font-ui text-[13.5px] tabular-nums text-slate-700">{TAKEOFF.cost}</span>
          </div>
          <div className="flex items-baseline justify-between gap-2.5">
            <span className="font-ui text-[13px] text-slate-600">Your margin · {QUOTE.margin}</span>
            <span className="font-ui text-[13.5px] tabular-nums text-slate-700">
              {TAKEOFF.margin}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2.5 border-t border-hairline pt-[9px]">
            <span className="font-ui-serif text-[16px] font-semibold text-ink">Quote total</span>
            <span className="font-ui-serif text-[20px] font-semibold tabular-nums text-ink">
              {TAKEOFF.total}
            </span>
          </div>
        </div>

        {/*
          Lime is correct here and is not an exception to the brand rule. This
          is a live/complete-moment marker on an AI surface, one of lime's four
          sanctioned roles; "completed is forest, never lime" governs selected
          and completed states in the app, and this is a marketing depiction of
          a just-finished moment. Measured at 10.27:1 either way.

          `2m 14s` is TAKEOFF.elapsed and the fifth timer chip is the same
          figure with its units stripped. They must always agree.
        */}
        <div
          className="tk mx-4 mt-3 flex items-center gap-[9px] rounded-lg bg-lime-500 px-[13px] py-2.5"
          style={{ animationName: "tk-ready" }}
        >
          <Check aria-hidden="true" size={15} strokeWidth={3.2} className="shrink-0 text-forest-900" />
          <span className="min-w-0 flex-1 font-ui text-[13.5px] font-bold text-forest-900">
            Quote ready
          </span>
          <span className="shrink-0 font-ui text-[12.5px] font-bold tabular-nums text-forest-900">
            {TAKEOFF.elapsed}
          </span>
        </div>
      </div>
    </div>
  );
}
