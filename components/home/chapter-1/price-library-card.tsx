import Image from "next/image";
import { Check, File, Table, Upload } from "lucide-react";

import type { CSSProperties } from "react";

import { Reveal } from "@/components/primitives/reveal";
import { PRICE_FILES, TAKEOFF } from "@/content/home";

import { CH1_LABELS } from "./labels";

/**
 * The per-file entrance parameters. `--dx` alternates sign so the four files
 * arrive from alternating sides, `--dr` alternates with it and varies 6-9deg so
 * they do not look stamped, and `--dy` is a constant 14px on all four - they
 * come from slightly BELOW the deck, not above it. The 0.5s delays are what
 * turn four identical flights into a cascade.
 *
 * Mobile sets `--dx` only; see the mobile card.
 */
const FLIGHT = [
  { dx: "96px", dr: "8deg" },
  { dx: "-96px", dr: "-7deg" },
  { dx: "96px", dr: "6deg" },
  { dx: "-96px", dr: "-9deg" },
] as const;

/**
 * Panel B: four files flying into a drop zone and being read into a price
 * library.
 *
 * TWO CLASSES NAMED FOR BEHAVIOUR THEY DO NOT HAVE, renamed here. The
 * artboard's `.pf-drop-pct` shows the file's TYPE and never a percentage, and
 * its `.pf-drop-countUp` never counts - `248` is static and its keyframe is a
 * pure fade. They ship as `.file-type` and `.ingest-count` so nobody reads the
 * name and adds a counter (docs/specs/06-chapter-1.md D11).
 *
 * THE SCRIM GETS DARKER DOWNWARDS, which is the reverse of the usual and is
 * deliberate: the file rows are at the bottom and they are near-white cards
 * that need a dark field behind them.
 *
 * THE BAR ANIMATES `width`, NOT `transform`. It is a 4px pill on four elements,
 * so the layout cost is nothing, and a `scaleX` would distort its round caps -
 * which are the only thing making it read as a progress bar at that size.
 *
 * [LOG] The label leads the bar. The type chip crossfades to "Read" between
 * 30% and 38% of the loop while the bar does not fill until 34%, so each file
 * says it has been read 480ms before it finishes reading. Drawn that way;
 * reproduced as drawn (D21).
 */
export function PriceLibraryCard() {
  return (
    <div className="h-[384px] w-full">
      <Reveal
        anim="scale"
        duration={0.5}
        className="flex h-full w-full flex-col items-center font-ui"
      >
        <div
          role="img"
          aria-label={CH1_LABELS.priceLibrary}
          className="shadow-border-strong relative flex min-h-0 w-full max-w-[360px] flex-1 flex-col overflow-hidden rounded-xl bg-forest-900"
        >
          <Image
            src="/images/photo-2.webp"
            alt=""
            fill
            sizes="360px"
            className="object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--color-forest-900)_74%,transparent)_0%,color-mix(in_oklab,var(--color-forest-900)_84%,transparent)_55%,color-mix(in_oklab,var(--color-forest-900)_94%,transparent)_100%)]"
          />

          <div className="relative flex min-h-0 flex-1 flex-col">
            <div className="flex min-h-0 flex-1 flex-col p-3.5">
              {/*
                The drop zone. Its base border and fill below are the NEUTRAL
                end of its own keyframe, which is what lets reduced motion stop
                the animation and need nothing else - the lime flash at the top
                of the loop is the only thing the animation adds.

                [LOG] An 8px radius on an upload zone, where docs/brand.md asks
                for 12, and a 1.5px dashed hairline off the 1/2px scale. Both
                ship as drawn (RULINGS.md §01 ruling 8 precedent).
              */}
              <div className="ingest-zone flex items-center justify-center gap-[9px] rounded-lg border-[1.5px] border-dashed border-[color-mix(in_oklab,var(--color-cream)_42%,transparent)] bg-[color-mix(in_oklab,var(--color-forest-900)_22%,transparent)] px-3 py-3.5 backdrop-blur-[6px]">
                <Upload aria-hidden="true" size={17} strokeWidth={2} className="text-lime-500" />
                <span className="font-ui text-[13px] font-semibold text-white">
                  Old quotes, Excel pricelists, photos of notes, supplier emails.
                </span>
              </div>

              <div className="flex min-h-0 flex-1 flex-col justify-center gap-2 pt-[18px] pb-0.5">
                {PRICE_FILES.map((file, i) => {
                  const delay = `${i * 0.5}s`;
                  return (
                    <div
                      key={file.name}
                      className="ingest-item flex items-center gap-[11px] rounded-lg bg-[rgba(255,255,255,0.95)] px-[11px] py-[9px] shadow-[0_8px_20px_-12px_rgba(21,48,31,0.5)]"
                      style={{
                        animationDelay: delay,
                        "--dx": FLIGHT[i].dx,
                        "--dy": "14px",
                        "--dr": FLIGHT[i].dr,
                      } as CSSProperties}
                    >
                      <FileTile file={file} />

                      <span className="flex min-w-0 flex-1 flex-col gap-[5px]">
                        <span className="flex min-w-0 items-baseline justify-between gap-2.5">
                          <span className="min-w-0 overflow-hidden text-[13px] font-medium text-ellipsis whitespace-nowrap text-ink">
                            {file.name}
                          </span>

                          {/*
                            Type and status are superimposed at one grid cell so
                            the swap causes no layout shift.

                            CONTRAST. The type chip is slate-500 in the
                            artboard, which measures 4.40:1 on this card's
                            near-white fill - it is the 5% of forest showing
                            through `rgba(255,255,255,.95)` that pushes it
                            under, since the same tone on plain white passes.
                            slate-600 measures 7.44:1 and is an existing token.
                            The tick stays forest-700: completed is forest,
                            never lime.
                          */}
                          <span className="relative inline-grid flex-none">
                            <span
                              className="file-type text-[11.5px] text-slate-600 [grid-area:1/1]"
                              style={{ animationDelay: delay }}
                            >
                              {file.type}
                            </span>
                            <span
                              className="file-read inline-flex items-center gap-1 text-[11.5px] font-semibold text-forest-700 [grid-area:1/1]"
                              style={{ animationDelay: delay }}
                            >
                              <Check aria-hidden="true" size={12} strokeWidth={3.2} />
                              Read
                            </span>
                          </span>
                        </span>

                        <span className="block h-1 w-full rounded-full bg-slate-100">
                          <span
                            className="ingest-fill block h-full w-0 rounded-full bg-lime-500"
                            style={{ animationDelay: delay }}
                          />
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="ingest-done relative flex items-center gap-2.5 border-t border-t-[rgba(232,228,210,0.16)] bg-[color-mix(in_oklab,var(--color-forest-900)_88%,transparent)] px-3.5 py-3">
              <span
                aria-hidden="true"
                className="ingest-tick grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-lime-500"
              >
                <Check size={13} strokeWidth={3.5} className="text-forest-900" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-px">
                <span className="font-ui-serif text-[15px] leading-[1.2] font-semibold whitespace-nowrap text-white">
                  Ready to quote
                </span>
                <span className="ingest-count text-[11.5px] leading-[1.3] text-forest-300">
                  {TAKEOFF.materialsLearned} materials learned
                </span>
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/**
 * The 36px icon tile. Rows 1-2 are a Lucide glyph on a 15% tint of its own
 * colour; rows 3-4 are a cropped photograph on the muted card tone, because a
 * photograph of a quote is what the file actually is.
 *
 * `--color-rust` and `--color-forest-700` are the file-type tones the app's own
 * document list uses; neither is a partner or brand colour.
 */
function FileTile({ file }: { file: (typeof PRICE_FILES)[number] }) {
  if (file.kind === "image") {
    return (
      <span className="relative grid h-9 w-9 flex-none place-items-center overflow-hidden rounded-md bg-card-muted">
        <Image src={file.src} alt="" fill sizes="36px" className="object-cover" />
      </span>
    );
  }

  if (file.kind === "sheet") {
    return (
      <span className="grid h-9 w-9 flex-none place-items-center rounded-md bg-[color-mix(in_oklab,var(--color-forest-500)_15%,#fff)]">
        <Table aria-hidden="true" size={17} strokeWidth={2} className="text-forest-700" />
      </span>
    );
  }

  return (
    <span className="grid h-9 w-9 flex-none place-items-center rounded-md bg-[color-mix(in_oklab,var(--color-rust)_15%,#fff)]">
      <File aria-hidden="true" size={17} strokeWidth={2} className="text-rust" />
    </span>
  );
}
