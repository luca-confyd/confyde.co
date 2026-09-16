import Image from "next/image";

import { NUDGES } from "@/content/home";

import { NUDGE_ICONS } from "./icons";

/**
 * Card 2, "How to close the deal" - three suggested next steps, each a 104px
 * photographic thumb with a lime medallion over it and a chip on the right.
 *
 * ZERO TAB STOPS. All three chips are `<span>`s with no handler, exactly as the
 * artboard draws them. The client declined destinations for this build
 * (RULINGS.md §01), so a chip that became a <button> would announce itself as a
 * control and then do nothing when pressed.
 *
 * The three glyphs come from `lucide-react` rather than from the artboard's
 * hand-inlined path data - see ./icons.ts.
 */
export function CloseDealCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white">
      <div className="flex items-baseline justify-between gap-3 border-b border-hairline bg-card-muted px-5 py-3.5">
        {/* <h4>, not the artboard's <h3>: the chapter banner is the page's h2
            and the panel heading its h3, so all three card titles sit a level
            below (RULINGS.md §03/04 ruling 8 - fix the semantics, keep the
            visual). */}
        {/* `.display` + `font-ui-serif` + `font-ui` on the medallion: the
            artboard's own construction, explained in full in ./replay-card.tsx. */}
        <h4 className="display m-0 flex items-center gap-2.5 font-ui-serif text-[19px] font-semibold text-ink">
          <span
            aria-hidden="true"
            className="grid h-[26px] w-[26px] flex-none place-items-center rounded-full bg-lime-500 font-ui text-[12.5px] font-bold text-forest-900"
          >
            2
          </span>
          How to close the deal
        </h4>
        {/* CONTRAST. slate-500 on card-muted measures 3.57:1; slate-600 clears
            it and is an existing token (RULINGS.md §06). */}
        <span className="text-[12.5px] text-slate-600">3 suggested</span>
      </div>

      <ul className="m-0 list-none p-0">
        {NUDGES.map((nudge, i) => {
          const Icon = NUDGE_ICONS[nudge.icon];
          return (
            <li
              key={nudge.title}
              className={"flex items-stretch" + (i === 0 ? "" : " border-t border-t-slate-100")}
            >
              <span className="relative w-[104px] flex-none overflow-hidden bg-forest-900">
                <Image
                  src={nudge.photo}
                  alt=""
                  fill
                  sizes="104px"
                  className="object-cover"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--color-forest-900)_26%,transparent),color-mix(in_oklab,var(--color-forest-900)_68%,transparent))]"
                />
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-lime-500"
                >
                  <Icon size={17} strokeWidth={2.3} className="text-forest-900" />
                </span>
              </span>

              <span className="flex min-w-0 flex-1 items-center gap-3 px-5 py-3.5">
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-[14.5px] font-medium text-charcoal-900">{nudge.title}</span>
                  <span className="text-[12.5px] leading-[1.45] text-slate-500">{nudge.sub}</span>
                </span>
                <span className="inline-flex flex-none items-center rounded-md bg-well px-[13px] py-1.5 text-[12.5px] font-semibold whitespace-nowrap text-slate-700 shadow-[0_0_0_1px_var(--color-hairline),0_1px_2px_rgba(21,48,31,0.08)]">
                  {nudge.chip}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
