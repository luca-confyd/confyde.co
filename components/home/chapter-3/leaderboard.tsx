import Image from "next/image";
import { Trophy } from "lucide-react";

import { Reveal } from "@/components/primitives/reveal";
import { LEADERBOARD, LEADERBOARD_FOOTER, LEADERBOARD_TITLE } from "@/content/playbook";

/**
 * The team leaderboard band - still the last child of the same panel, not a
 * section of its own.
 *
 * IT STAYS FULLY READABLE. This is the other half of the rule the analytics
 * stage sets: four rows, four names, four real numbers, no fiction and no
 * contradiction, and nothing in it animates, so nothing can be read at the
 * wrong moment. `Jobs won this month` is a heading and the rows are its list,
 * which is exactly what a screen-reader user wants from "everyone knows where
 * the jobs are at". The `<ul>` stays a `<ul>`.
 *
 * The progress bar is a second encoding of `9 of 12 won`, which is already text
 * beside it, so the track is `aria-hidden` and the text carries the number.
 * That is also the honest thing to do given the bar does not encode that number
 * (docs/specs/10-chapter-3.md D17).
 *
 * NO SHADOW AND NO BORDER on the card, as drawn: white on `pf-surface-300` is
 * the value step, and docs/brand.md makes that the whole elevation story. The
 * mobile artboard draws a hairline plus two shadow layers for the same card;
 * both ship as drawn, as RULINGS §03/04 ruling 13 settled.
 */
export function Leaderboard() {
  return (
    <div className="mx-auto grid max-w-[1024px] grid-cols-2 items-center gap-10">
      <div className="flex flex-col gap-1.5">
        {/* Stored sentence case and uppercased in CSS. `text-transform` does not
            change the accessible name, so a string typed in capitals is read as
            capitals by screen readers that spell out all-caps text. */}
        <Reveal
          as="span"
          anim="up-blur"
          duration={0.5}
          className="mb-1 text-[12px] font-extrabold tracking-[0.14em] text-eyebrow uppercase"
        >
          One source of truth
        </Reveal>
        <Reveal
          as="h3"
          anim="up-blur"
          delay={0.05}
          duration={0.5}
          className="display display-3 text-pf-ink-900"
        >
          Everyone knows where the jobs are at.
        </Reveal>
        {/* `mb-4` is a rendered value, not a declared one: the artboard never
            resets `<p>`, so this paragraph keeps the browser's default
            `margin-block-end: 1em` - 16px at 16px - and the grid centres the
            column against a box that includes it. Measured on the artboard at
            1280px. Same trap as chapter 1's take-off card. */}
        <Reveal
          as="p"
          anim="up-blur"
          delay={0.1}
          duration={0.5}
          className="mt-1.5 mb-4 max-w-[56ch] text-[16px] leading-[1.6] text-pf-ink-900"
        >
          The whole team sees the same board in real time, so the catch-up calls are reduced.
          You can see who is quoting what, who is closing it, and reward team members bringing
          in the work.
        </Reveal>
      </div>

      <Reveal
        anim="scale"
        delay={0.15}
        duration={0.5}
        className="flex flex-col overflow-hidden rounded-xl bg-card"
      >
        {/* `justify-between` and `gap` are inert on a one-child header; dropped
            and the render reproduced. `Trophy` is the one serif element in this
            band and it states no status, which is what docs/brand.md allows. */}
        <div className="flex items-baseline border-b border-hairline px-5 py-3.5">
          <h4 className="m-0 flex items-center gap-[9px] font-ui-serif text-[19px] font-semibold text-ink">
            <Trophy
              aria-hidden="true"
              className="h-[18px] w-[18px] flex-none text-forest-500"
              strokeWidth={2}
            />
            {LEADERBOARD_TITLE}
          </h4>
        </div>

        <ul className="m-0 list-none p-0">
          {LEADERBOARD.map((row, i) => (
            <li
              key={row.name}
              className={`flex items-center gap-[13px] px-5 py-3 ${
                i === 0 ? "" : "border-t border-slate-100"
              }`}
            >
              <Image
                src={row.photo}
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 flex-none rounded-md object-cover"
              />
              <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                <span className="flex min-w-0 items-baseline gap-2">
                  <span className="font-ui text-[14.5px] font-medium text-charcoal-900">
                    {row.name}
                  </span>
                  <span className="min-w-0 truncate font-ui text-[12.5px] text-slate-500">
                    {row.job}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="block h-[5px] w-full flex-1 rounded-full bg-slate-100"
                  >
                    <span
                      className="block h-full rounded-full bg-forest-500"
                      style={{ width: row.bar }}
                    />
                  </span>
                  <span className="flex-none font-ui text-[11.5px] whitespace-nowrap text-slate-500 tabular-nums">
                    {row.record}
                  </span>
                </span>
              </span>
              <span className="w-14 flex-none text-right font-ui-serif text-[14px] font-semibold text-ink tabular-nums">
                {row.total}
              </span>
            </li>
          ))}
        </ul>

        {/* `slate-500` measured 4.40:1 on the well - the same 0.1-under failure
            chapter 1 hit. `slate-600` is the existing token that clears it. */}
        <div className="border-t border-hairline bg-well px-5 py-2.5 font-ui text-[12px] text-slate-600">
          {LEADERBOARD_FOOTER}
        </div>
      </Reveal>
    </div>
  );
}
