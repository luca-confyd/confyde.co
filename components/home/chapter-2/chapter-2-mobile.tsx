import Image from "next/image";

import { ChapterShellMobile } from "@/components/home/chapter/chapter-shell-mobile";
import { NUDGES, READING, READING_SECTIONS } from "@/content/home";

import { NUDGE_ICONS } from "./icons";
import { MiniReplay, MiniTimingList } from "./mini-replay";

/**
 * Chapter 2 below 1024px - a shorter story, on purpose.
 *
 * [LOG] TWO CARDS, NOT THREE. `Get paid`, the Xero pill, the three milestone
 * rows and the footer do not exist below 1024px, and neither does the
 * `SALES ASSISTANT` eyebrow. Porting the desktop card into a `desk:hidden`
 * subtree would be inventing a composition the mobile artboard declines to draw
 * (docs/specs/08-chapter-2.md §6.7). Worth the client knowing that the Xero
 * mention is desktop-only in this chapter - the mobile page does still carry an
 * `Xero app partner` pill in the social-proof band, so the integration is not
 * unrepresented.
 *
 * [LOG] The panel paragraph is DIFFERENT COPY from desktop's, not a truncation,
 * and the card 1 chrome writes numerals and "Sarah" where desktop spells the
 * count out and writes "Sarah H." Both preserved (RULINGS.md §01 ruling 12
 * precedent; D15).
 *
 * THE CARDS CARRY A THREE-LAYER SHADOW where the desktop cards carry none. The
 * §03/04 ruling 13 asymmetry again; reproduced as drawn on both sides.
 *
 * Plain `sm:` is safe in this subtree: the whole thing is `desk:hidden` via the
 * shell, so nothing here also carries a `desk:` value for the same property.
 */

const CARD_SHADOW =
  "shadow-[0_1px_2px_rgba(21,48,31,0.05),0_6px_14px_-6px_rgba(21,48,31,0.14),0_18px_30px_-18px_rgba(21,48,31,0.18)]";

/** Mobile drops the Irrigation row - the one the table marks with a dash. */
const MOBILE_ROWS = READING_SECTIONS.filter((row) => row.short !== null);

export function Chapter2Mobile() {
  return (
    <ChapterShellMobile
      dataSection="chapter-2-mobile"
      image="/images/photo-3.webp"
      heading="Win more jobs, without the late-night admin."
    >
      <h3 className="display marquee-heading-mobile text-[19px] text-ink">
        Win the job and the client, not just the quote.
      </h3>
      <p className="mt-2 mb-4 text-[14.5px] leading-[1.55] text-slate-700">
        Confyde shows you what your client read, and how long they sat on it. You call knowing
        what they care about.
      </p>

      {/* Card 1. `font-ui` on the card root for the same reason the desktop row
          carries it: everything inside is a recreation of the app's own UI. */}
      <div className={`overflow-hidden rounded-xl bg-white font-ui ${CARD_SHADOW}`}>
        <div className="flex items-center gap-2.5 border-b border-hairline bg-card-muted px-4 py-3">
          <span
            aria-hidden="true"
            className="grid h-6 w-6 flex-none place-items-center rounded-full bg-lime-500 text-[11.5px] font-bold text-forest-900"
          >
            1
          </span>
          <span className="min-w-0">
            <h4 className="m-0 font-ui-serif text-[17px] font-semibold text-ink">
              How Sarah read the quote
            </h4>
            {/* CONTRAST. slate-500 on card-muted measures 3.57:1; slate-600 is
                an existing token and clears it (RULINGS.md §06). */}
            <span className="mt-0.5 block overflow-hidden text-[11.5px] text-ellipsis whitespace-nowrap text-slate-600">
              V2 · {READING.opens} opens over 3 days · {READING.totalTime} all up
            </span>
          </span>
        </div>

        <div className="px-4 pt-3.5 pb-4">
          {/* Never wraps - the mini viewport's `min()` width is what keeps the
              two columns side by side down to 320px. */}
          <div className="flex gap-3">
            <MiniReplay />
            <MiniTimingList rows={MOBILE_ROWS} />
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11.5px] text-slate-500">
            Least time
            <span
              aria-hidden="true"
              className="h-[7px] min-w-0 flex-1 rounded-full bg-[linear-gradient(to_right,color-mix(in_oklab,var(--color-umber)_10%,transparent),color-mix(in_oklab,var(--color-umber)_45%,transparent),var(--color-umber))]"
            />
            Most time
          </div>
        </div>
      </div>

      {/* Card 2. Three separate tiles on a well fill, not a divided list, and
          the chip sits BELOW the text in uppercase where desktop's sits to its
          right in sentence case. A different component, built as one. */}
      <div className={`mt-3.5 overflow-hidden rounded-xl bg-white font-ui ${CARD_SHADOW}`}>
        <div className="flex items-center gap-2.5 border-b border-hairline bg-card-muted px-4 py-3">
          <span
            aria-hidden="true"
            className="grid h-6 w-6 flex-none place-items-center rounded-full bg-lime-500 text-[11.5px] font-bold text-forest-900"
          >
            2
          </span>
          <h4 className="m-0 font-ui-serif text-[17px] font-semibold text-ink">
            How to close the deal
          </h4>
        </div>

        <div className="flex flex-col gap-2 p-3">
          {NUDGES.map((nudge) => {
            const Icon = NUDGE_ICONS[nudge.icon];
            return (
              /* `border-radius:10px` is off the 4/6/8/12 scale. Shipped as drawn
                 (RULINGS.md §01 ruling 8 precedent). */
              <div
                key={nudge.title}
                className="flex items-stretch overflow-hidden rounded-[10px] bg-well shadow-[0_0_0_1px_var(--color-hairline)]"
              >
                {/* The thumb steps down at narrow widths so the text column
                    keeps a usable measure: at 320px `Send a bluestone vs granite
                    comparison` at 13.5px/600 sets six lines in 92px and the tile
                    becomes taller than it is wide. The 32px medallion inside
                    does NOT scale - it is a device of the depiction, not a
                    layout element. */}
                <div className="relative w-[clamp(64px,28%,84px)] flex-none overflow-hidden bg-forest-900">
                  <Image src={nudge.photo} alt="" fill sizes="84px" className="object-cover" />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--color-forest-900)_30%,transparent),color-mix(in_oklab,var(--color-forest-900)_70%,transparent))]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 left-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-lime-500"
                  >
                    <Icon size={15} strokeWidth={2.4} className="text-forest-900" />
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-[3px] px-3 py-[11px]">
                  <span className="text-[13.5px] leading-[1.3] font-semibold text-ink">
                    {nudge.title}
                  </span>
                  {/* CONTRAST. slate-500 on `well` measures 4.28:1; slate-600
                      clears it and is an existing token (RULINGS.md §06). */}
                  <span className="text-[12px] leading-[1.45] text-slate-600">
                    {nudge.subMobile}
                  </span>
                  <span className="mt-[3px] inline-flex self-start rounded-md bg-white px-2 py-[3px] text-[10.5px] font-bold tracking-[0.06em] text-forest-700 uppercase shadow-[0_0_0_1px_var(--color-hairline)]">
                    {nudge.chip}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ChapterShellMobile>
  );
}
