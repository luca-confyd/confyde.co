import { Sprout } from "lucide-react";

import {
  CALM_CARDS_MOBILE,
  COPY,
  NOTIFICATIONS_MOBILE,
  PHONE_LABELS,
  UNREAD_COUNTS,
  UNREAD_REST_INDEX,
} from "@/content/before-after";

import { PHONE_ICONS } from "./icons";

/* The same one-off warm sand as the desktop pill, and the same reason for
   keeping it a literal: it has no role in the colour system to name. */
const PILL_LABEL_TONE = "#E9C9A6";

const PILL = "inline-flex items-center self-center rounded-full py-[5px]";
const PILL_LABEL = "text-[10.5px] font-extrabold tracking-[0.12em] uppercase";

/*
  The same two corrected alphas the desktop phone carries, for the same reason.

  docs/specs/05-before-after.md only measured the desktop composition, but the
  mobile card draws the identical rgba(255,255,255,.42) channel label and
  rgba(255,255,255,.5) timestamp on a background that composites to within a
  couple of values of desktop's - the wash and the photograph are absent here,
  which if anything makes it slightly darker. Both were re-measured on the
  rendered mobile pixels at 430px and both cleared at these values. Leaving
  mobile at the drawn alphas would have shipped the same AA failure at the
  breakpoint where the text is 0.5px smaller.
*/
const TIME_TONE = "text-white/[0.53]";
const CHANNEL_TONE = "text-white/[0.55]";

const NOTIFICATION_CARD =
  "flex gap-[9px] rounded-[10px] bg-white/10 px-[10px] py-[9px] shadow-[0_0_0_1px_rgba(255,255,255,0.09)_inset] [-webkit-backdrop-filter:blur(10px)] [backdrop-filter:blur(10px)]";

const CALM_CARD =
  "flex gap-[9px] rounded-[10px] bg-white px-[10px] py-[9px] shadow-[0_5px_14px_-10px_rgba(21,48,31,0.4)]";

/* The frame, shared by both phones character for character. No aspect-ratio
   here, unlike desktop: these phones are as tall as their three cards plus
   their caption. */
const FRAME =
  "mx-auto w-[min(100%,300px)] rounded-[34px] bg-[#10160F] p-2 shadow-[0_26px_50px_-28px_rgba(21,48,31,0.7),0_0_0_1px_rgba(255,255,255,0.06)_inset]";

/* 27px where desktop draws 26px on an identical 34px frame with identical
   padding. One of the two is a typo; both ship as drawn and both are logged. */
const SCREEN = "relative overflow-hidden rounded-[27px]";

const NOTCH =
  "absolute top-2 left-1/2 z-[3] h-[5px] w-[58px] -translate-x-1/2 rounded-full bg-white/[0.16]";

/**
 * Section 05, <1024px.
 *
 * A different composition, not a reflow: two phones stacked vertically with
 * three rows each, no photographs, no gradient washes, captions moved INSIDE
 * the screens, and no animation at all. Mobile is a single still frame of the
 * story desktop tells over sixteen seconds.
 *
 * That still frame is the same one the desktop reduced-motion state pins to -
 * `31 unread`, every card open - so the two breakpoints agree rather than
 * disagreeing about what the section is arguing.
 */
export function BeforeAfterMobile() {
  return (
    <section data-section="before-after-mobile" className="px-4 pb-[34px] desk:hidden sm:px-8">
      <div className="overflow-hidden rounded-xl bg-forest-900 px-4 pt-7 pb-6 min-[560px]:px-6">
        {/* The artboard is a fixed 430px column. The 560px cap is the page's,
            and it is what stops the 14.5px paragraph running to 90 characters
            on a tablet - a measure the design never proposes. */}
        <div className="mx-auto w-full max-w-[560px]">
          {/* Left-aligned here, centred on desktop. Also lime-500 on forest, so
              `--color-eyebrow-mobile` does NOT apply: that token corrects the
              #7E9A2B eyebrow on light surfaces, and this one is already at
              10.24:1. */}
          <div className="text-[11px] font-bold tracking-[0.14em] text-lime-500 uppercase">{COPY.eyebrow}</div>

          {/*
            The artboard breaks this line with a hard `<br>` tuned for its 430px
            measure. At 320px that leaves "Bramble's running the office."
            running ~288px against a 256px column - a three-line shape with an
            orphan - and at 560px it wastes half a line. `text-balance`
            reproduces the artboard's own two-line break at 430px and does the
            right thing at both ends. The text nodes are identical, so this is a
            rendering fix rather than a copy edit (RULINGS.md §05 ruling 9).

            6.05vw is exactly 26.0px at 430px, the artboard value; it holds at
            26px above and clamps to 22px at 320px.
          */}
          <h2 className="display display-2-mobile mt-[10px] mb-2 text-[clamp(22px,6.05vw,26px)] text-white text-balance">
            {COPY.heading}
          </h2>

          {/* [LOG] Mobile drops desktop's closing ", so the job moves forward
              while you sleep." Both are the client's; neither is harmonised. */}
          <p className="mb-5 text-[14.5px] leading-[1.55] text-forest-200">{COPY.bodyMobile}</p>

          <div className="flex flex-col gap-3">
            <span
              className={`${PILL} bg-[color-mix(in_oklab,var(--color-rust)_22%,transparent)] px-[14px] shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-rust)_45%,transparent)_inset]`}
            >
              <span className={PILL_LABEL} style={{ color: PILL_LABEL_TONE }}>
                {COPY.pillBefore}
              </span>
            </span>

            {/* Same `role="img"` treatment as desktop. Three cards is less
                fiction than ten, but it is still fiction, and the caption
                inside the screen is carried by the label instead. */}
            <div role="img" aria-label={PHONE_LABELS.before} className={FRAME}>
              <div className={`${SCREEN} bg-[#101A14]`}>
                <span aria-hidden="true" className={NOTCH} />
                <div className="px-3 pt-[26px] pb-[14px]">
                  <div className="flex items-center justify-between gap-2 px-[2px] pb-[10px]">
                    <span className="text-[11px] font-semibold text-white/60">{COPY.clockBefore}</span>
                    {/* One count, static. The peak, and the same frame the
                        desktop reduced-motion state rests on. */}
                    <span className="inline-flex items-center rounded-full bg-rust px-[9px] py-[3px] text-[10.5px] font-bold text-white">
                      {UNREAD_COUNTS[UNREAD_REST_INDEX]}
                    </span>
                  </div>

                  <div className="flex flex-col gap-[7px]">
                    {NOTIFICATIONS_MOBILE.map((item) => {
                      const Icon = PHONE_ICONS[item.icon];
                      return (
                        <div key={item.sender} className={NOTIFICATION_CARD}>
                          <span
                            aria-hidden="true"
                            className="grid h-6 w-6 flex-none place-items-center rounded-md"
                            style={{ background: item.tile }}
                          >
                            <Icon size={13} strokeWidth={2.2} className="text-white" />
                          </span>
                          <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                            <span className="flex min-w-0 items-baseline justify-between gap-2">
                              <span className="min-w-0 truncate text-[12.5px] font-semibold text-white">
                                {item.sender}
                              </span>
                              <span className={`flex-none text-[10.5px] ${TIME_TONE}`}>{item.time}</span>
                            </span>
                            <span className="text-[11.5px] leading-[1.4] text-white/[0.76]">{item.message}</span>
                            {/* 9.5px here against desktop's 10px. As drawn. */}
                            <span
                              className={`mt-px text-[9.5px] font-bold tracking-[0.06em] uppercase ${CHANNEL_TONE}`}
                            >
                              {item.channel}
                            </span>
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Wholly different copy from the desktop caption, and shorter. */}
                  <p className="mx-[2px] mt-3 text-[12px] leading-[1.45] text-white/[0.55]">
                    {COPY.captionBeforeMobile}
                  </p>
                </div>
              </div>
            </div>

            <span className={`${PILL} gap-[7px] bg-lime-500 pr-[14px] pl-[11px]`}>
              <Sprout size={13} strokeWidth={2.2} aria-hidden="true" className="flex-none text-forest-900" />
              <span className={`${PILL_LABEL} text-forest-900`}>{COPY.pillAfter}</span>
            </span>

            <div role="img" aria-label={PHONE_LABELS.after} className={FRAME}>
              <div className={`${SCREEN} bg-canvas`}>
                <span aria-hidden="true" className={NOTCH} />
                <div className="px-3 pt-[26px] pb-[14px]">
                  <div className="flex items-center justify-between gap-2 px-[2px] pb-1">
                    {/* Ink, not white: there is no dark band on this side to
                        sit on, which is also why the greeting below has none of
                        the desktop greeting's contrast problem.

                        slate-600, not the artboard's slate-500. This line and
                        the caption below are the only two places in the section
                        where a muted ink sits directly on the cream SCREEN
                        rather than on a white card; slate-500 measures 4.71:1
                        on white and 4.13:1 on canvas, so the card versions pass
                        and these two fail. One step down the existing ramp
                        clears it at 7.13:1 without introducing a colour the
                        system does not already have. */}
                    <span className="text-[11px] font-semibold text-slate-600">{COPY.clockAfter}</span>
                    {/* A solid forest pill with a plain lime dot - not
                        desktop's white glass badge, and no pulse ring. */}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-900 px-[10px] py-[3px] text-[10.5px] font-bold text-white">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lime-500" />
                      {COPY.badge}
                    </span>
                  </div>

                  {/* Fraunces at 15px here; desktop sets the same line in Source
                      Serif 4 at 14px. Both as drawn. */}
                  <p className="mx-[2px] mb-[10px] font-display text-[15px] font-semibold text-ink">
                    {COPY.greeting}
                  </p>

                  {/* The caption is a child of the card list on this side and a
                      sibling of it on the left phone. That asymmetry is in the
                      artboard and it is what puts a 7px gap above this one. */}
                  <div className="flex flex-col gap-[7px]">
                    {CALM_CARDS_MOBILE.map((card) => {
                      const Icon = PHONE_ICONS[card.icon];
                      return (
                        <div key={card.title} className={CALM_CARD}>
                          <span
                            aria-hidden="true"
                            className="grid h-[23px] w-[23px] flex-none place-items-center rounded-md bg-lime-500"
                          >
                            <Icon size={13} strokeWidth={2.4} className="text-forest-900" />
                          </span>
                          {/* Two children, not three: mobile draws no action
                              label on any of the three cards. */}
                          <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                            <span className="text-[12px] leading-[1.25] font-semibold text-ink">{card.title}</span>
                            <span className="text-[11px] leading-[1.35] text-slate-500">{card.sub}</span>
                          </span>
                        </div>
                      );
                    })}

                    {/* slate-600 for the same reason as the clock above. */}
                    <p className="mx-[2px] mt-3 text-[12px] leading-[1.45] text-slate-600">
                      {COPY.captionAfterMobile}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
