import { READING } from "@/content/home";

import { OPENS_WORD } from "./labels";
import { ReplayFrame } from "./replay-frame";
import { TimingTable } from "./timing-table";

/**
 * Card 1 - the replay viewport and the section-timing table that explains it.
 *
 * THE INNER ROW WRAPS, AND THAT IS DRAWN. `flex-wrap` is live: the row breaks
 * whenever its width falls below 330 + 14 + 146 = 490px, which happens at
 * viewport < 1244px. Below that the table drops beneath the frame and the frame
 * takes the full column - 489.5px at 1243, 380px at 1024. Measured on the
 * artboard itself, so it is the render (RULINGS.md principle 1), and it is the
 * legible outcome: the frame gets larger, the table sits directly under it and
 * nothing clips.
 *
 * Two consequences QA must not file as bugs: the nine heat blobs are sized as
 * percentages of the frame, so the heatmap coarsens below 1244; and the card
 * gets 149px taller, which stretches card 2's column with it.
 *
 * [LOG] `Watch the replay` is styled as a link and is not one - no href, no
 * handler, zero tab stops. The client declined destinations (RULINGS.md §01).
 */
export function ReplayCard() {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-white">
      <div className="border-b border-hairline bg-card-muted px-5 py-3.5">
        <div className="flex flex-wrap items-center gap-2">
          {/*
            `.display` ON A SOURCE SERIF TITLE IS NOT A MISTAKE - it is the
            artboard's own construction, and all three card headers share it.

            The artboard's title is `<h3 class="pf-h3" style="font-family:
            var(--font-serif); font-weight:600">`. `.pf-h3` sets Fraunces AND
            `font-variation-settings: "wght" 420, "SOFT" 100, "WONK" 0,
            "opsz" 10`; the inline style overrides only the FAMILY. Variation
            settings beat `font-weight` and they inherit, so what actually
            renders is Source Serif 4 at wght 420 and **opsz 10** - a small
            optical size, whose letterforms are wider than the default opsz
            would give at 19px. Measured, that is 19px of extra title width,
            which is exactly what pushed the `Heatmap` badge left in our build.

            `.display`'s >=1024 cut is those same four axes, so wearing it and
            overriding the family with `font-ui-serif` reproduces the artboard
            element for element. Only the desktop cut is ever in play here -
            this subtree is `hidden desk:block`.

            The medallion inherits those axes and overrides the family to
            `font-ui`, again exactly as the artboard does, so the numeral is
            Hanken Grotesk at wght 420 rather than the product serif at 700.
          */}
          <h4 className="display m-0 flex items-center gap-2.5 font-ui-serif text-[19px] font-semibold text-ink">
            <span
              aria-hidden="true"
              className="grid h-[26px] w-[26px] flex-none place-items-center rounded-full bg-lime-500 font-ui text-[12.5px] font-bold text-forest-900"
            >
              1
            </span>
            How Sarah H. read the quote
          </h4>
          <span className="inline-flex items-center rounded-md bg-forest-100 px-[9px] py-[3px] text-[11.5px] font-semibold tracking-[0.05em] text-forest-800 uppercase">
            Heatmap
          </span>
        </div>

        {/* CONTRAST. slate-500 on card-muted measures 3.57:1; slate-600 clears
            it and is an existing token, which RULINGS.md §06 prefers to a new
            corrected tone. `Watch the replay` is forest-700 and already passes
            at 6.45:1 - it is not part of the correction. */}
        <span className="mt-[3px] block text-[12.5px] text-slate-600">
          V2 · {OPENS_WORD} opens over three days · {READING.totalTime} all up ·{" "}
          <span className="font-semibold whitespace-nowrap text-forest-700">Watch the replay</span>
        </span>
      </div>

      <div className="flex flex-col gap-4 px-5 pt-4 pb-[18px]">
        <div className="flex flex-wrap items-start gap-[14px]">
          <ReplayFrame />
          <TimingTable />
        </div>
      </div>
    </div>
  );
}
