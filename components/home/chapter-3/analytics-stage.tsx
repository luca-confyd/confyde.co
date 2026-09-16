import { Reveal } from "@/components/primitives/reveal";
import { COUNTER_CELLS } from "@/content/playbook";

import { Board } from "./board";
import { CountUp } from "./count-up";
import { CH3_LABELS } from "./labels";
import { StatCards } from "./stat-cards";

/**
 * The analytics stage: three stat cards tucked behind a browser-chrome card
 * that holds an eight-cell counter strip and the kanban board, with the toast
 * inside the board's padding box.
 *
 * THE WHOLE STAGE IS ONE `role="img"`. See `labels.ts` for why, and for what
 * the label says. The consequence to keep in mind while editing: nothing in
 * here is announced individually, so a heading or a link inside it would be
 * invisible to a screen reader while still adding a tab stop or an outline
 * entry. Nothing in here is focusable, and this chapter adds zero tab stops.
 *
 * THE 132px OF STAGE PADDING is the room the stat stack occupies above the
 * browser card; the browser card is `relative z-10`, so it sits over the bottom
 * of the three cards rather than clearing them.
 *
 * [LOG] TWO TYPEFACES IN ONE MOCKUP. `Analytics`, the `All` chip and all
 * sixteen strings in the counter strip set no `font-family`, so they inherit
 * the page's Nunito Sans, while every other element in the same depiction sets
 * Hanken Grotesk explicitly. Reproduced as rendered (RULINGS principle 1) and
 * flagged: it reads as the same authoring slip RULINGS §03/04 ruling 3
 * escalated, where the client's answer was "the product faces are correct".
 */

/* The three chrome dots. #D9D3C4 has no role in the system - it is a one-off,
   kept as a commented local constant per RULINGS §02 ruling 5. */
const CHROME_DOT = "#D9D3C4";

export function AnalyticsStage() {
  return (
    <div
      role="img"
      aria-label={CH3_LABELS.pipeline}
      className="analytics-stage relative flex w-full flex-col items-center pt-[132px]"
    >
      <StatCards />

      <Reveal
        anim="scale"
        duration={0.5}
        className="shadow-border-strong relative z-10 flex w-full max-w-[1024px] flex-col overflow-hidden rounded-xl bg-card"
      >
        {/* Chrome bar. The artboard's `gap: 12px` here is inert - one child -
            and is dropped, reproducing the render (§02 ruling 3). */}
        <div className="flex items-center border-b border-pf-ink-200 bg-well px-[14px] py-[9px]">
          <span aria-hidden="true" className="flex flex-none gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-[9px] w-[9px] rounded-full"
                style={{ background: CHROME_DOT }}
              />
            ))}
          </span>
        </div>

        {/* Title row. `justify-between` on a single child is inert; dropped. */}
        <div className="flex items-center px-4 py-2.5">
          <span className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-pf-ink-900">Analytics</span>
            <span className="rounded-md bg-pf-overlay-100 px-2 py-0.5 text-[11px] font-semibold text-pf-ink-700">
              All
            </span>
          </span>
        </div>

        {/*
          The counter strip. Cell 1 has no left border; cells 2-8 do, which is
          what draws seven rules and not nine.

          [LOG] Cell 8 is the odd one out twice over: it carries no count where
          the other seven do, and it is the only coloured value in the strip
          (D5). Its `--pf-green-600` measured 3.85:1 on white, so it ships in
          `forest-700` - 8.52:1, and the tone every other completed state in the
          chapter already wears.
        */}
        <div className="grid grid-cols-8 border-t border-pf-ink-200">
          {COUNTER_CELLS.map((cell, i) => (
            <div
              key={cell.label}
              className={`px-3 py-2 ${i === 0 ? "" : "border-l border-pf-ink-200"}`}
            >
              {/* `--pf-ink-500` measured 2.93:1 on white across all eight
                  labels. `slate-500` is the smallest existing token that
                  clears; no new colour is minted for it. */}
              <p className="m-0 text-[10px] text-slate-500">{cell.label}</p>
              <p
                className={`m-0 text-[14px] font-bold ${
                  cell.staticValue ? "text-forest-700" : "text-pf-ink-900"
                }`}
              >
                {cell.staticValue ?? (
                  <CountUp
                    value={cell.count ?? 0}
                    format={cell.format ?? "int"}
                    durationMs={cell.durationMs ?? 900}
                    placeholder={cell.placeholder ?? "0"}
                  />
                )}
              </p>
            </div>
          ))}
        </div>

        <Board />
      </Reveal>
    </div>
  );
}
