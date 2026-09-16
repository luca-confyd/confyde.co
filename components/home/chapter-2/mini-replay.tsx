import Image from "next/image";

import { QUOTE, SCOPE, SCOPE_LABELS_SHORT } from "@/content/home";

import { CH2_LABELS } from "./labels";

/**
 * The mobile replay: a 148 x 191px mini viewport on a 14-second clock.
 *
 * NOT A SCALED DESKTOP FRAME. There is no accordion, no line items, no
 * "Replay / visit 4 of 4 / 2:14" line and none of the nine forest blobs. The
 * document simply scrolls - four plateaus in three moves - and dwells longest
 * on the Paving row, which is the mobile expression of the same "2m 40s". The
 * chrome strip is BELOW the clip here where desktop puts its chrome above and
 * its scrub below.
 *
 * `width: min(148px, 52%)` is the one real fluid decision below 430px, and it
 * is forced. At 430px the card's content box is 334px, so 52% is 173.7px and
 * `min()` yields the drawn 148px exactly. At 320px the content box is 224px and
 * 52% yields 116.5px, which leaves the timing list 95.5px. Without the step the
 * list gets 64px - 37px of usable text after a 9px swatch and two 9px gaps -
 * and "2m 40s" alone measures ~40px, so every row would ellipsis its label AND
 * clip its time. The times are the entire argument of the card.
 *
 * It is safe because the viewport's internals are width-invariant: the five
 * rows are single-line with `text-overflow: ellipsis`, the header is a fixed
 * 52px and the accept button a fixed 18px, so the 280px track and the 172px
 * clip do not move and `-18 / -44 / -68px` still land where they were authored.
 * The blobs and the cursor are percentages of the box and scale with it.
 *
 * [LOG] The track is 280px in a 172px clip but the scroll only reaches -68px,
 * so the bottom 40px - the `Total inc. GST` row and the `Accept this quote`
 * button - is drawn and never seen at any point in the cycle (D5).
 */

/** Mobile ramps the UMBER data tone where desktop ramps forest. Two colour
    systems for the same chart; both ship as drawn, and it is mobile's that
    `docs/brand.md` endorses - "Umber is a data tone only" (D18). */
const MOBILE_SWATCHES = [
  "var(--color-umber)",
  "color-mix(in oklab,var(--color-umber) 55%,transparent)",
  "color-mix(in oklab,var(--color-umber) 30%,transparent)",
  "color-mix(in oklab,var(--color-umber) 12%,transparent)",
];

/* Mobile's blobs share none of desktop's numbers - a tighter blur, a wider box,
   a stronger inner stop and a weaker mid stop - so they are written out rather
   than shared with the desktop recipe. The weaker B gradient is why the rows
   under it still measure above 7:1 where the desktop equivalents collapse. */
const M_HEAT_A =
  "radial-gradient(ellipse at center,rgba(110,65,25,0.6),rgba(110,65,25,0.2) 55%,transparent 80%)";
const M_HEAT_B =
  "radial-gradient(ellipse at center,rgba(110,65,25,0.44),rgba(110,65,25,0.2) 55%,transparent 80%)";

export function MiniReplay() {
  return (
    <div
      role="img"
      aria-label={CH2_LABELS.mobile}
      /*
        `leading-[normal]` is load-bearing, not styling. The MOBILE artboard
        declares no page line-height at all, so every undeclared line box in it
        is `normal`, where our `styles/base.css` sets the body to 1.5. Inside
        this box that difference is not cosmetic: it made the track measure
        290.75px against the artboard's 280px, and `m-doc`'s -18 / -44 / -68px
        plateaus are authored against the 280px version. Pinned back to
        `normal` the track measures 277px - the residual 3px is the Hanken
        Grotesk / Nunito metric difference that the product-face decision
        implies, and it is well inside the 105px of scroll headroom.

        [LOG] The 1.5-vs-normal difference is page-wide below 1024 and is not
        this section's to change; it is scoped here because this is the one
        place where a line box feeds an animation offset.
      */
      className="relative w-[min(148px,52%)] flex-none overflow-hidden rounded-md bg-white leading-[normal] shadow-[0_0_0_1px_var(--color-hairline)]"
    >
      <div className="relative h-[172px] overflow-hidden">
        <div className="m-doc-track absolute inset-x-0 top-0">
          {/* photo-2 here, where the desktop document uses photo-1; and the
              masthead keeps only the client name - no reference, no address. */}
          <div className="relative h-[52px] overflow-hidden bg-forest-900">
            <Image
              src="/images/photo-2.webp"
              alt=""
              fill
              sizes="148px"
              className="object-cover opacity-70"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--color-forest-900)_92%,transparent),transparent)]"
            />
            <span className="absolute bottom-1.5 left-2 font-ui-serif text-[11px] font-semibold text-white">
              {QUOTE.client}
            </span>
          </div>

          <div className="px-2 pt-[7px] pb-2">
            <span className="block text-[11px] font-bold tracking-[0.1em] text-slate-500 uppercase">
              Scope of works
            </span>

            {SCOPE.map((group, i) => {
              const heat =
                group.label === "Paving & Stonework"
                  ? "a"
                  : group.label === "Irrigation"
                    ? "b"
                    : null;

              return (
                <div
                  key={group.label}
                  className={
                    "flex items-center gap-1 py-1.5" +
                    (heat ? " relative" : "") +
                    /* [LOG] #EEF0EC is an un-tokened one-off; `--color-slate-100`
                       (#E5E8E5) is the token the same divider uses on desktop.
                       Kept as drawn, as a commented local constant
                       (RULINGS.md §02 ruling 5 precedent). D20. */
                    (i === 0 ? "" : " border-t border-t-[#EEF0EC]")
                  }
                >
                  {heat ? (
                    <span
                      aria-hidden="true"
                      className={`m-heat m-heat-${heat} pointer-events-none absolute top-[-2px] left-[-6%] z-[1] h-[calc(100%+4px)] w-[112%] rounded-full blur-[4px]`}
                      style={{ background: heat === "a" ? M_HEAT_A : M_HEAT_B }}
                    />
                  ) : null}
                  <span
                    aria-hidden="true"
                    className="h-1 w-1 flex-none rounded-full"
                    style={{ background: group.dot }}
                  />
                  <span className="min-w-0 flex-1 overflow-hidden text-[9.5px] text-ellipsis whitespace-nowrap text-slate-700">
                    {SCOPE_LABELS_SHORT[group.label] ?? group.label}
                  </span>
                  <span className="flex-none font-ui-serif text-[9.5px] font-semibold text-ink">
                    {group.amount}
                  </span>
                </div>
              );
            })}

            {/* [LOG] The five rows above sum to $41,720 under a printed
                $48,200 - mobile omits Excavation entirely (D12). */}
            <div className="mt-1.5 flex items-baseline justify-between border-t border-hairline pt-1.5">
              <span className="text-[11px] font-bold tracking-[0.1em] text-slate-500 uppercase">
                Total inc. GST
              </span>
              <span className="font-ui-serif text-[12px] font-semibold text-ink">
                {QUOTE.total}
              </span>
            </div>
            <div className="mt-[7px] grid h-[18px] place-items-center rounded-[3px] bg-lime-500 text-[8.5px] font-bold text-forest-900">
              Accept this quote
            </div>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="m-cursor absolute h-[9px] w-[9px] rounded-full bg-[color-mix(in_oklab,var(--color-forest-900)_40%,transparent)] shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-forest-900)_10%,transparent)]"
          style={{ left: "58%", top: "52%" }}
        />
      </div>

      {/* The 19px chrome strip, below the clip. */}
      <div className="flex items-center gap-[5px] border-t border-hairline bg-well px-[7px] py-[5px]">
        <span aria-hidden="true" className="m-rec h-1 w-1 flex-none rounded-full bg-rust" />
        <span className="relative h-[3px] min-w-0 flex-1 rounded-full bg-card-muted">
          <span className="m-scrub absolute inset-y-0 left-0 w-0 rounded-full bg-forest-700" />
        </span>
        {/* [LOG] 6px, below any legibility floor - and inside the `role="img"`
            depiction, so nothing is lost by it. If the client wants it fixed,
            8px is the largest bump the 19px strip height survives (D4). */}
        <span className="text-[6px] text-slate-600">5:16</span>
      </div>
    </div>
  );
}

/**
 * The mobile timing list: four rows, no Irrigation, one-word labels. Row 4 has
 * no bottom hairline where desktop's last row does - the opposite of desktop,
 * and drawn that way on both sides.
 */
export function MiniTimingList({
  rows,
}: {
  rows: readonly { short: string | null; time: string }[];
}) {
  return (
    <div className="min-w-0 flex-1">
      {rows.map((row, i) => (
        <div
          key={row.short ?? i}
          className={
            "flex items-center gap-[9px] py-[7px]" +
            (i === rows.length - 1
              ? ""
              : " border-b border-b-[color-mix(in_oklab,var(--color-hairline)_45%,transparent)]")
          }
        >
          <span
            aria-hidden="true"
            className="h-[9px] w-[9px] flex-none rounded-[2px]"
            style={{ background: MOBILE_SWATCHES[i] }}
          />
          <span
            className={
              "min-w-0 flex-1 overflow-hidden text-[13px] text-ellipsis whitespace-nowrap text-slate-700" +
              (i === 0 ? " font-semibold" : "")
            }
          >
            {row.short}
          </span>
          <span
            className={"text-[12.5px] " + (i === 0 ? "text-slate-700" : "text-slate-500")}
          >
            {row.time}
          </span>
        </div>
      ))}
    </div>
  );
}
