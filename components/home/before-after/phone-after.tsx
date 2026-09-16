import Image from "next/image";

import { CALM_CARDS, COPY, PHONE_LABELS } from "@/content/before-after";

import { PHONE_ICONS } from "./icons";

/*
  The morning wash, exactly as drawn: forest at 82% running to near-cream by
  22% of the screen's height. The section's one real contrast correction is on
  the greeting below rather than on this gradient - see there for why.
*/
const MORNING_WASH =
  "bg-[linear-gradient(to_bottom,rgba(21,48,31,0.82)_0%,rgba(243,240,230,0.97)_22%,#F3F0E6_100%)]";

/*
  The greeting, and the section's worst contrast failure.

  The artboard sets this line in white 14px serif, and it sits at about 11% of
  the screen's height - the middle of the wash above, which composites its
  background to roughly #ABB1A5. White on that measures 2.20:1 against a 4.5:1
  requirement, sampled off the rendered pixels rather than computed.

  docs/specs/05-before-after.md preferred to keep the text white and deepen the
  gradient instead, moving the light stop from 22% to 38%. Measured, that
  reaches 4.46:1 and still fails, and pushing it far enough to clear with any
  headroom takes the stop past 50%, which turns more than half the morning
  phone dark and puts the top three calm cards in a night band. That is no
  longer the smaller change; it is a redesign of the composition's whole point.

  Recolouring the line to `--color-ink` at the drawn stop measures 6.34:1 at
  the worst pixel in its box and 5.48:1 at the median, changes one property,
  and leaves the gradient untouched. It is also what the MOBILE artboard
  already draws - ink on cream - so the two breakpoints agree on the greeting
  the same way they agree on `31 unread`. [LOG] with both numbers.
*/
const GREETING_TONE = "text-ink";

/**
 * The right phone: 7:05 am, and a short list.
 *
 * Same frame as the left phone character for character, and the same
 * `role="img"` treatment. The screen is cream rather than forest and the wash
 * runs dark-to-light rather than light-to-dark, which is the whole visual
 * argument: one device, two mornings.
 */
export function PhoneAfter() {
  return (
    <div
      role="img"
      aria-label={PHONE_LABELS.after}
      className="relative aspect-[9/18.5] w-full max-w-[280px] rounded-[34px] bg-[#10160F] p-[9px] shadow-[0_30px_60px_-30px_rgba(21,48,31,0.7),0_0_0_1px_rgba(255,255,255,0.06)_inset]"
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[26px] bg-canvas">
        {/* White at 16% over a cream screen, so the notch is all but invisible
            on this side. As drawn - the two phones are the same phone. */}
        <span
          aria-hidden="true"
          className="absolute top-2 left-1/2 z-[3] h-[5px] w-[62px] -translate-x-1/2 rounded-full bg-white/[0.16]"
        />

        <div className="absolute inset-0">
          <Image
            src="/images/photo-1.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 262px, 1px"
            className="object-cover opacity-[0.3]"
          />
        </div>
        <span aria-hidden="true" className={`absolute inset-0 ${MORNING_WASH}`} />

        <div className="relative flex items-center justify-between gap-2 px-4 pt-[22px] pb-[10px]">
          <span className="font-ui text-[11px] font-semibold text-white/[0.86]">{COPY.clockAfter}</span>

          <span className="calm-badge inline-flex items-center gap-1.5 rounded-full bg-white/20 px-[10px] py-[3px] font-ui text-[10.5px] font-bold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.28)_inset] [-webkit-backdrop-filter:blur(8px)] [backdrop-filter:blur(8px)]">
            {/* Two identical dots stacked: the base never moves, the pulse ring
                on top expands to 2.6x and fades on its own 2.4s clock, so it
                never lines up with the 16s loop. */}
            <span aria-hidden="true" className="relative grid h-1.5 w-1.5 flex-none place-items-center">
              <span className="absolute inset-0 rounded-full bg-lime-500" />
              <span className="live-pip absolute inset-0 rounded-full bg-lime-500" />
            </span>
            {COPY.badge}
          </span>
        </div>

        <div className="relative px-[14px] pb-[6px]">
          <span className={`font-ui-serif text-[14px] font-semibold ${GREETING_TONE}`}>{COPY.greeting}</span>
        </div>

        {/*
          No mask, no `justify-content`: the five cards sit top-aligned on a real
          6px gap, which leaves visible empty space at the foot of the screen.
          That emptiness is the point, against the left phone's overflowing pile.
        */}
        <div className="relative flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden px-3 pt-[2px] pb-3">
          {CALM_CARDS.map((card, i) => {
            const Icon = PHONE_ICONS[card.icon];
            return (
              <div
                key={card.title}
                /* 10px is off the radius scale, like the frame's 34px. As drawn. */
                className="calm-card flex gap-[9px] rounded-[10px] bg-white px-[9px] py-2 shadow-[0_5px_14px_-10px_rgba(21,48,31,0.4)]"
                /* Positive delays, 900ms apart. Each card therefore runs its own
                   16s timeline rather than a phase of a shared one, so at least
                   three are always on screen and the two phones never blank
                   together. */
                style={{ animationDelay: `${0.4 + i * 0.9}s` }}
              >
                <span
                  aria-hidden="true"
                  className="grid h-[23px] w-[23px] flex-none place-items-center rounded-md bg-lime-500"
                >
                  <Icon size={14} strokeWidth={2.4} className="text-forest-900" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <span className="font-ui text-[12px] leading-[1.25] font-semibold text-ink">{card.title}</span>
                  <span className="font-ui text-[11px] leading-[1.35] text-slate-500">{card.sub}</span>
                  {/* Text, not a control. Five inert buttons inside a picture of
                      a phone would be five tab stops that go nowhere. */}
                  <span className="mt-px font-ui text-[10.5px] font-bold text-forest-700">{card.action}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
