import Image from "next/image";
import { Check } from "lucide-react";

import { QUOTE, TAKEOFF, TAKEOFF_CLOCK, TAKEOFF_LINES } from "@/content/home";

import { CH1_LABELS } from "./labels";

/** The plan's paper tone, and the tone of the two covers that hide its
 *  annotations. See the desktop card for why it is a local constant. */
const PLAN_PAPER = "#FAFAFA";

/** Cover 2's width is `31.6%` here against desktop's `31.63%` - a rounding
 *  difference in the artboard, not a redraw. Reproduced as drawn. */
const COVERS = [
  { animationName: "tk-cover1", left: "70.48%", top: "24.16%", width: "21.40%", height: "10.91%" },
  { animationName: "tk-cover2", left: "60.26%", top: "57.56%", width: "31.6%", height: "12.97%" },
] as const;

/**
 * The take-off card below 1024px.
 *
 * Not a narrower copy of the desktop card. The plan runs edge to edge with no
 * 16px frame around it, the header strip is muted where desktop's is white, the
 * four rows drop the unit-rate line and shorten the spec, the totals block is
 * one row rather than three, and the ready bar is a full-bleed footer rather
 * than an inset chip. Every one of those is the mobile artboard's own edit.
 *
 * SAME CHOREOGRAPHY, FOUR DIFFERENT VALUES. Every percentage in the mobile
 * keyframes is identical to its desktop counterpart; what differs is that rows
 * slide 12px rather than 14px, do not restore their transform on the way out,
 * the totals rise 8px rather than 9px, and the ready bar fades with no scale at
 * all. The driver class, the covers, the scan band and the five clock spans are
 * shared with desktop, because those are byte-identical between the artboards
 * once the scan's travel distance is one number on both.
 *
 * Row 1 carries no top border here, where desktop's `.tk-row` puts one on all
 * four - so the first row sits flush under the plan.
 */
export function TakeoffCardMobile() {
  return (
    <div
      role="img"
      aria-label={CH1_LABELS.takeoff}
      className="overflow-hidden rounded-xl bg-white shadow-[0_0_0_1px_var(--color-hairline),0_6px_14px_-6px_rgba(21,48,31,0.14),0_18px_30px_-18px_rgba(21,48,31,0.18)]"
    >
      <div className="flex items-center justify-between gap-2.5 border-b border-hairline bg-card-muted px-3.5 py-2.5">
        {/* A middot and no surname, where desktop writes an em dash and
            "Henderson,". Two fewer problems than the desktop string; both
            ship as drawn. */}
        <span className="text-[10.5px] font-bold tracking-[0.14em] text-slate-700 uppercase">
          Take-off · {TAKEOFF.address}
        </span>

        <span className="inline-grid place-items-center rounded-md bg-forest-900 px-2 py-[3px]">
          {TAKEOFF_CLOCK.map((reading, i) => (
            <span
              key={reading}
              className="tk tk-lin tk-clock font-ui text-[11px] font-bold tabular-nums text-white [grid-area:1/1]"
              style={{ animationName: `tk-c${i + 1}` }}
            >
              {reading}
            </span>
          ))}
        </span>
      </div>

      <div className="relative overflow-hidden" style={{ background: PLAN_PAPER }}>
        <div className="relative aspect-[1467/1072] w-full">
          <Image
            src="/images/takeoff-plan.webp"
            alt=""
            fill
            sizes="(min-width: 640px) 560px, 100vw"
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

          <span
            aria-hidden="true"
            className="tk tk-lin tk-scan absolute inset-x-0 top-0 h-[16%] bg-[linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--color-lime-500)_44%,transparent),transparent)]"
            style={{ animationName: "tk-scan" }}
          />
        </div>
      </div>

      <div className="px-3.5">
        {TAKEOFF_LINES.map((line, i) => (
          <div
            key={line.label}
            className={
              "tk flex items-center gap-2.5 py-[9px]" +
              (i === 0
                ? ""
                : " border-t border-t-[color-mix(in_oklab,var(--color-hairline)_45%,transparent)]")
            }
            style={{ animationName: `mtk-row${i + 1}` }}
          >
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="font-ui text-[13px] text-ink">{line.label}</span>
              {/* Shortened spec and no unit rate - mobile's own edit. The
                  ellipsis is expected on the longer pairs and is what the
                  430px artboard already shows on row 2. */}
              <span className="overflow-hidden font-ui text-[11px] text-ellipsis whitespace-nowrap text-slate-500">
                {line.specShort} · {line.supplier}
              </span>
            </span>
            <span className="flex-none font-ui text-[12px] tabular-nums text-slate-700">
              {line.qty}
            </span>
            {/*
              `.m-h3` is the mobile artboard's Fraunces cut at opsz 24, already
              in styles/base.css as `.marquee-heading-mobile` - named for its
              first call site, but it is the shared `.m-h3` recipe and the
              artboard puts the same class on this figure. Reused rather than
              re-spelled so the two stay one definition.
            */}
            <span className="display marquee-heading-mobile w-[58px] flex-none text-right text-[13px] tabular-nums text-ink">
              {line.amount}
            </span>
          </div>
        ))}
      </div>

      {/* One row, not desktop's three - mobile has no cost/margin breakdown. */}
      <div
        className="tk mx-3.5 flex items-baseline justify-between gap-2.5 border-t border-hairline py-3"
        style={{ animationName: "mtk-total" }}
      >
        <span className="text-[11px] font-bold tracking-[0.1em] text-slate-500 uppercase">
          Quote total · {QUOTE.margin} margin
        </span>
        <span className="display display-2-mobile text-[22px] tabular-nums text-ink">
          {TAKEOFF.total}
        </span>
      </div>

      {/* A full-bleed footer with no radius and no margin, where desktop's is
          an inset 8px chip. Lime is the sanctioned complete-moment marker and
          measures 10.27:1 against the forest type either way. */}
      <div
        className="tk flex items-center gap-[9px] border-t border-hairline bg-lime-500 px-3.5 py-2.5"
        style={{ animationName: "mtk-ready" }}
      >
        <Check aria-hidden="true" size={14} strokeWidth={3.2} className="shrink-0 text-forest-900" />
        <span className="min-w-0 flex-1 font-ui text-[13px] font-bold text-forest-900">
          Quote ready
        </span>
        <span className="flex-none font-ui text-[12px] font-bold tabular-nums text-forest-900">
          {TAKEOFF.elapsed}
        </span>
      </div>
    </div>
  );
}
