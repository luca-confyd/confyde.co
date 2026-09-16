import Image from "next/image";
import { Check, File, Table, Upload } from "lucide-react";

import type { CSSProperties } from "react";

import { PRICE_FILES, TAKEOFF } from "@/content/home";

import { CH1_LABELS } from "./labels";

/**
 * The price-library card below 1024px.
 *
 * ONLY `--dx` IS SET, and it is the one motion value in this section that
 * scales with the viewport: `clamp(56px, 22.3vw, 96px)` is exactly the
 * artboard's 96px at 430px and 71px at 320px. A 96px fly-in on a 256px card
 * starts the file most of a card-width outside the frame, where the parent's
 * `overflow: hidden` clips it and the entrance reads as a fade rather than a
 * flight. Confining the change to a custom property is what keeps the keyframe
 * itself untouched.
 *
 * NO `--dr`. The mobile artboard's fly keyframe has no `rotate()` at all - on a
 * narrow card the rotation read as wobble. Our shared keyframe expresses that
 * as the `0deg` fallback rather than as a second keyframe block, which is the
 * same rendered result with one definition instead of two.
 *
 * The scrim is two stops where desktop's is three, the padded area is 12px
 * where desktop's is 14, the tiles are 32px where desktop's are 36, and the
 * drop-zone label drops "supplier emails" and its full stop. All the mobile
 * artboard's own edits; all preserved.
 */
export function PriceLibraryCardMobile() {
  return (
    <div
      role="img"
      aria-label={CH1_LABELS.priceLibrary}
      className="relative overflow-hidden rounded-xl bg-forest-900"
    >
      <Image
        src="/images/photo-2.webp"
        alt=""
        fill
        sizes="(min-width: 640px) 560px, 100vw"
        className="object-cover"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--color-forest-900)_74%,transparent),color-mix(in_oklab,var(--color-forest-900)_92%,transparent))]"
      />

      <div className="relative flex flex-col">
        <div className="flex flex-col p-3">
          <div className="ingest-zone flex items-center justify-center gap-[9px] rounded-lg border-[1.5px] border-dashed border-[color-mix(in_oklab,var(--color-cream)_42%,transparent)] bg-[color-mix(in_oklab,var(--color-forest-900)_22%,transparent)] px-2.5 py-3 backdrop-blur-[6px]">
            <Upload aria-hidden="true" size={15} strokeWidth={2} className="shrink-0 text-lime-500" />
            <span className="text-center font-ui text-[12.5px] font-semibold text-white">
              Old quotes, Excel pricelists, photos of notes
            </span>
          </div>

          <div className="flex flex-col gap-[7px] pt-4 pb-0.5">
            {PRICE_FILES.map((file, i) => {
              const delay = `${i * 0.5}s`;
              return (
                <div
                  key={file.name}
                  className="ingest-item flex items-center gap-2.5 rounded-lg bg-[rgba(255,255,255,0.95)] px-2.5 py-2 shadow-[0_8px_20px_-12px_rgba(21,48,31,0.5)]"
                  style={
                    {
                      animationDelay: delay,
                      /* A leading minus is not valid in front of clamp(), so
                         the alternating sign is a calc() rather than a string
                         prefix. */
                      "--dx":
                        i % 2 === 0
                          ? "clamp(56px, 22.3vw, 96px)"
                          : "calc(-1 * clamp(56px, 22.3vw, 96px))",
                    } as CSSProperties
                  }
                >
                  <FileTileMobile file={file} />

                  <span className="flex min-w-0 flex-1 flex-col gap-[5px]">
                    <span className="flex min-w-0 items-baseline justify-between gap-2.5">
                      <span className="min-w-0 overflow-hidden font-ui text-[12.5px] font-medium text-ellipsis whitespace-nowrap text-ink">
                        {file.name}
                      </span>
                      <span className="relative inline-grid flex-none">
                        {/* Same contrast correction as desktop: slate-600 on
                            the near-white card, where slate-500 reaches only
                            4.40:1 through the 5% of forest showing through. */}
                        <span
                          className="file-type font-ui text-[11px] text-slate-600 [grid-area:1/1]"
                          style={{ animationDelay: delay }}
                        >
                          {file.type}
                        </span>
                        <span
                          className="file-read inline-flex items-center gap-[3px] font-ui text-[11px] font-semibold text-forest-700 [grid-area:1/1]"
                          style={{ animationDelay: delay }}
                        >
                          <Check aria-hidden="true" size={11} strokeWidth={3.2} />
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

        <div className="ingest-done relative flex items-center gap-2.5 border-t border-t-[rgba(232,228,210,0.16)] bg-[color-mix(in_oklab,var(--color-forest-900)_88%,transparent)] px-3 py-[11px]">
          <span
            aria-hidden="true"
            className="ingest-tick grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-lime-500"
          >
            <Check size={12} strokeWidth={3.5} className="text-forest-900" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-px">
            <span className="font-ui-serif text-[14.5px] leading-[1.2] font-semibold whitespace-nowrap text-white">
              Ready to quote
            </span>
            <span className="ingest-count font-ui text-[11px] leading-[1.3] text-forest-300">
              {TAKEOFF.materialsLearned} materials learned
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

/** 32px here against desktop's 36px; otherwise the same three tile treatments. */
function FileTileMobile({ file }: { file: (typeof PRICE_FILES)[number] }) {
  if (file.kind === "image") {
    return (
      <span className="relative grid h-8 w-8 flex-none place-items-center overflow-hidden rounded-md bg-card-muted">
        <Image src={file.src} alt="" fill sizes="32px" className="object-cover" />
      </span>
    );
  }

  if (file.kind === "sheet") {
    return (
      <span className="grid h-8 w-8 flex-none place-items-center rounded-md bg-[color-mix(in_oklab,var(--color-forest-500)_15%,#fff)]">
        <Table aria-hidden="true" size={17} strokeWidth={2} className="text-forest-700" />
      </span>
    );
  }

  return (
    <span className="grid h-8 w-8 flex-none place-items-center rounded-md bg-[color-mix(in_oklab,var(--color-rust)_15%,#fff)]">
      <File aria-hidden="true" size={17} strokeWidth={2} className="text-rust" />
    </span>
  );
}
