import Image from "next/image";

import { QUOTE, SCOPE_FULL, SCOPE_LINES } from "@/content/home";

import { CH2_LABELS } from "./labels";

/**
 * The 339 x 409.75px replay viewport: a recording of the client reading the
 * quote, with the heatmap painted over it.
 *
 * THE BOX IS WIDTH-INVARIANT ABOVE 1244px AND HEIGHT-INVARIANT EVERYWHERE, and
 * that is what makes the whole 20-second system in `styles/motion/chapter-2.css`
 * safe to author in hard pixels. Measured at 1440, 1243 and 1024: the document
 * track is 483.25px closed and 553.75px with the Paving group open at every one
 * of them, because every row in it is single-line with `text-overflow: ellipsis`
 * and nothing reflows. The clip is a fixed 352px, so `-179px` - the deepest the
 * scroll ever travels - sits comfortably inside the 201.75px of headroom.
 *
 * FOUR LAYERS, AND THE LAST ONE IS NOT INSIDE THE OTHERS. The chrome bar, the
 * document clip and the scrub bar stack normally. The nine forest blobs are
 * SIBLINGS of all three, positioned against the frame and clipped by its
 * `overflow-hidden`, which is why they multiply over the chrome bar and the top
 * of the scrub bar as well as over the document. They are static: they never
 * animate, they do not scroll with the document, and they do not respond to
 * `prefers-reduced-motion` because there is nothing to stop.
 *
 * [LOG] That gives the card two heatmap systems with different attachment - the
 * two umber blobs are inside the track and scroll with their rows, the nine
 * forest ones are outside it and do not. Conceptually wrong for a heatmap, and
 * it is exactly what makes the frame read as a live density overlay rather than
 * as two lozenges. Shipped as drawn (docs/specs/08-chapter-2.md D6).
 *
 * ONE `role="img"`. See ./labels.ts for why everything inside this box collapses
 * to a single sentence and everything outside it stays readable.
 */

/**
 * The nine static blobs, in paint order - which is load-bearing. 3, 4 and 7 are
 * the forest-900 ones and they have to land ON TOP of 2, 5 and 8, so the DOM
 * order below is the composition rather than a list.
 *
 * The sizes are percentages of the frame, not pixels, so the heatmap coarsens
 * with the frame below 1244px where the timing table drops beneath it and the
 * frame goes full width (blob 3 measures 61.0px at 1280 and 88.1px at 1243).
 * That is the artboard's own behaviour and keeping the percentages is what
 * reproduces it.
 */
const FOREST_BLOBS = [
  { left: "30%", top: "27%", width: "11.5%", color: "var(--color-forest-300)", opacity: 0.25 },
  { left: "47%", top: "38%", width: "13.0%", color: "var(--color-forest-500)", opacity: 0.55 },
  { left: "52%", top: "47%", width: "18.0%", color: "var(--color-forest-900)", opacity: 0.8 },
  { left: "43%", top: "50%", width: "16.0%", color: "var(--color-forest-900)", opacity: 0.8 },
  { left: "61%", top: "45%", width: "14.0%", color: "var(--color-forest-500)", opacity: 0.55 },
  { left: "49%", top: "60%", width: "12.0%", color: "var(--color-forest-300)", opacity: 0.25 },
  { left: "66%", top: "77%", width: "17.0%", color: "var(--color-forest-900)", opacity: 0.8 },
  { left: "55%", top: "80%", width: "14.0%", color: "var(--color-forest-500)", opacity: 0.55 },
  { left: "50%", top: "88%", width: "12.5%", color: "var(--color-forest-300)", opacity: 0.25 },
];

/** The two hot rows, and the only thing that differs between their two spans. */
const HEAT_GRADIENT =
  "radial-gradient(ellipse at center,rgba(110,65,25,0.58),rgba(110,65,25,0.24) 55%,transparent 80%)";

export function ReplayFrame() {
  return (
    <div
      role="img"
      aria-label={CH2_LABELS.desktop}
      className="relative flex min-w-[300px] flex-[1_1_330px] flex-col overflow-hidden rounded-md bg-white shadow-[0_0_0_1px_var(--color-hairline)]"
    >
      {/* The 26px chrome bar. */}
      <div className="flex items-center gap-[7px] border-b border-hairline bg-well px-2.5 py-[7px]">
        <span aria-hidden="true" className="rec-pip h-1.5 w-1.5 flex-none rounded-full bg-rust" />
        <span className="text-[9.5px] font-semibold tracking-[0.08em] text-slate-700 uppercase">
          Replay
        </span>
        {/*
          CONTRAST. The artboard sets these two in slate-500, which measures
          4.28:1 on the `well` fill. slate-600 is an existing token and clears
          it, which RULINGS.md §06 prefers over minting a new corrected tone -
          the same call chapter 1 made for the take-off card's totals block.

          [LOG] `2:14` is the length of visit 4 and is a literal. Its string
          happens to match TAKEOFF.elapsed and it must NOT be wired to it - a
          coincidence between two unrelated durations (D14). The scrub beneath
          it is labelled with the four-visit total instead, so the frame reads
          "visit 4, 2:14" above a 5:16 scrubber.
        */}
        <span className="text-[9.5px] text-slate-600">visit 4 of 4</span>
        <span className="ml-auto text-[9.5px] tabular-nums text-slate-600">2:14</span>
      </div>

      {/* The 352px document clip. The cursor lives in here, not in the frame,
          so its percentages resolve against 352px of height rather than the
          frame's 409.75. */}
      <div className="relative h-[352px] overflow-hidden">
        <div className="doc-track absolute inset-x-0 top-0">
          {/* The proposal's own masthead. */}
          <div className="relative h-[150px] overflow-hidden bg-forest-900">
            <Image
              src="/images/photo-1.webp"
              alt=""
              fill
              sizes="(min-width: 1244px) 339px, 50vw"
              className="object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(24deg,color-mix(in_oklab,var(--color-forest-900)_90%,transparent)_4%,color-mix(in_oklab,var(--color-forest-900)_42%,transparent)_52%,color-mix(in_oklab,var(--color-forest-900)_6%,transparent))]"
            />
            <div className="relative px-4 py-3.5">
              <div className="text-[11.5px] tracking-[0.16em] text-cream uppercase">
                {QUOTE.reference} · {QUOTE.suburb}
              </div>
              <div className="mt-[3px] font-ui-serif text-[22px] leading-none font-semibold text-white">
                {QUOTE.address}
              </div>
              <div className="mt-[3px] text-[11.5px] text-cream">Prepared for {QUOTE.client}</div>
            </div>
          </div>

          <div className="px-4 py-3.5">
            <div className="border-b-[1.5px] border-b-forest-800 pb-[5px] text-[11.5px] tracking-[0.2em] text-slate-500 uppercase">
              Scope of works
            </div>

            <div className="pt-1">
              {SCOPE_FULL.map((group, i) => {
                /* The two umber blobs mark Paving and Irrigation, and they sit
                   INSIDE the track so they travel with their rows. Their
                   wrappers are the only two that are positioned. */
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
                      (heat ? "relative " : "") +
                      (i === 0 ? "" : "border-t border-t-slate-100")
                    }
                  >
                    {heat ? (
                      <span
                        aria-hidden="true"
                        /* z-index 1 puts the blob OVER the row's text, which is
                           what produces the contrast collapse the section
                           escalates. Moving it behind buys nothing - the
                           measurements were sampled with the glyphs hidden, so
                           they already ARE the z-behind case - and it would
                           change the render.

                           [LOG] A is `calc(100% + 12px)` against B's
                           `calc(100% + 10px)` on the same `top:-6px`: a 2px
                           asymmetry on two otherwise identical elements (D10). */
                        className={`heat heat-${heat} pointer-events-none absolute top-[-6px] left-[-4%] z-[1] w-[108%] rounded-full blur-[6px]`}
                        style={{
                          height: heat === "a" ? "calc(100% + 12px)" : "calc(100% + 10px)",
                          background: HEAT_GRADIENT,
                        }}
                      />
                    ) : null}

                    {/* `border-radius:3px` is off the 4/6/8/12 scale. Shipped as
                        drawn (RULINGS.md §01 ruling 8 precedent). */}
                    <div
                      className="acc-head -mx-1 flex items-center gap-[5px] rounded-[3px] px-1 py-[7px]"
                      style={{ animationName: `bb-hd${i + 1}` }}
                      data-rest={heat === "a" ? "true" : undefined}
                    >
                      <span
                        aria-hidden="true"
                        className="h-[5px] w-[5px] flex-none rounded-full"
                        style={{ background: group.dot }}
                      />
                      <span className="min-w-0 flex-1 overflow-hidden text-[12.5px] text-ellipsis whitespace-nowrap text-slate-700">
                        {group.label}
                      </span>
                      <span className="flex-none font-ui-serif text-[12.5px] font-semibold text-ink">
                        {group.amount}
                      </span>
                    </div>

                    <div
                      className="acc overflow-hidden"
                      style={{ animationName: `bb-acc${i + 1}` }}
                      data-rest={heat === "a" ? "true" : undefined}
                    >
                      {SCOPE_LINES[group.label]?.map((line) => (
                        <div
                          key={line.label}
                          className="flex items-baseline gap-[5px] py-[3px] pl-3.5"
                        >
                          <span className="min-w-0 flex-1 overflow-hidden text-[11.5px] leading-normal text-ellipsis whitespace-nowrap text-slate-500">
                            {line.label}
                          </span>
                          {/*
                            CONTRAST. The quantity column is slate-400 in the
                            artboard and measures 3.29:1 on white before any
                            overlay - that half of the failure is not arguable.
                            Stepped up to slate-500, the chapter-1 take-off card's
                            own correction for the same pair. The honest cost is
                            that the column now matches the label beside it
                            instead of sitting a step lighter than it.
                          */}
                          <span className="flex-none text-[11px] text-slate-500">{line.qty}</span>
                          <span className="flex-none text-[11.5px] tabular-nums text-slate-500">
                            {line.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* [LOG] The total is the one money figure in the document with no
                tabular-nums, where every smaller one has it (D13). */}
            <div className="mt-2.5 flex items-baseline justify-end gap-[7px] border-t border-hairline pt-[9px]">
              <span className="text-[11.5px] tracking-[0.1em] text-slate-500 uppercase">
                Total inc. GST
              </span>
              <span className="font-ui-serif text-[17px] font-semibold text-ink">{QUOTE.total}</span>
            </div>

            {/* A picture of a button inside a `role="img"` region: nothing for
                it to do, so it stays a <div> and adds no tab stop. Lime is
                legitimate here - it is the one primary action on the depicted
                screen. */}
            <div className="mt-[11px] grid h-5 place-items-center rounded-sm bg-lime-500 text-[12.5px] font-semibold text-forest-900">
              Accept this quote
            </div>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="replay-cursor absolute h-[13px] w-[13px] rounded-full bg-[color-mix(in_oklab,var(--color-forest-900)_34%,transparent)] shadow-[0_0_0_5px_color-mix(in_oklab,var(--color-forest-900)_8%,transparent)]"
          /* The inline pair is the artboard's fallback and is NOT on the
             keyframe path; the motion file pins the resting cursor to its 56%
             keyframe instead. Kept because it is what the element measures at
             before the animation's first frame lands. */
          style={{ left: "56%", top: "42%" }}
        />
      </div>

      {/* The scrub bar. Labelled with the four-visit total, not this visit's
          2:14 - see the chrome bar note above. */}
      <div className="flex items-center gap-2 border-t border-hairline bg-well px-2.5 py-[7px]">
        <span className="relative h-1 min-w-0 flex-1 rounded-full bg-card-muted">
          <span className="replay-scrub absolute inset-y-0 left-0 w-0 rounded-full bg-forest-700" />
        </span>
        <span className="text-[9px] tabular-nums text-slate-600">5:16</span>
      </div>

      {FOREST_BLOBS.map((blob, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full blur-[10px] mix-blend-multiply"
          style={{
            left: blob.left,
            top: blob.top,
            width: blob.width,
            background: blob.color,
            opacity: blob.opacity,
          }}
        />
      ))}
    </div>
  );
}
