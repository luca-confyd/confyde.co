import Image from "next/image";

import { NOTIFICATIONS, PHONE_LABELS, COPY, UNREAD_COUNTS, UNREAD_REST_INDEX } from "@/content/before-after";

import { PHONE_ICONS } from "./icons";

/*
  The one measured contrast correction on this phone's card text.

  docs/specs/05-before-after.md §8.3 measured the artboard's notification times
  at 4.49:1 and its channel labels at 3.61:1 against the composited card
  background, both against a 4.5:1 requirement. These two alphas are the
  smallest steps that clear it, verified by sampling the rendered pixels at the
  bottom of the feed - the worse of the two ends, because the forest wash
  lightens as it descends. Written as constants so the two values that were
  measured together cannot drift apart at ten call sites each.
*/
const TIME_TONE = "text-white/[0.53]"; // was .5
const CHANNEL_TONE = "text-white/[0.55]"; // was .42

/**
 * The left phone: 12:06 am, and everything anyone wants from you.
 *
 * `role="img"` collapses the whole subtree, because ten notifications is about
 * 120 words of invented names and timestamps that a sighted reader takes in as
 * texture in under a second and a screen reader would recite for 45 seconds
 * before reaching the caption that carries the argument. Worse, the feed is on
 * a 16s loop, so a virtual cursor would otherwise land on cards sitting at
 * `max-height: 0` and read them as though they were on screen.
 * (RULINGS.md §05 ruling 7.)
 */
export function PhoneBefore() {
  return (
    /* 34px and 26px are off the 4/6/8/12 radius scale docs/brand.md sets. They
       ship as drawn and are logged: this is a depiction of a device, not a UI
       surface, and rounding it to 12px would stop it reading as a phone. */
    <div
      role="img"
      aria-label={PHONE_LABELS.before}
      className="relative aspect-[9/18.5] w-full max-w-[280px] rounded-[34px] bg-[#10160F] p-[9px] shadow-[0_30px_60px_-30px_rgba(21,48,31,0.7),0_0_0_1px_rgba(255,255,255,0.06)_inset]"
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[26px] bg-[#101A14]">
        <span
          aria-hidden="true"
          className="absolute top-2 left-1/2 z-[3] h-[5px] w-[62px] -translate-x-1/2 rounded-full bg-white/[0.16]"
        />

        {/*
          The photograph is texture, not image: 22% of it, under a forest wash
          that is opaque at the top and 86% at the bottom, nets a 3-22%
          contribution to the rendered pixel. It is what stops the screen
          reading as flat paint.
        */}
        <div className="absolute inset-0">
          <Image
            src="/images/photo-3.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 262px, 1px"
            className="object-cover opacity-[0.22]"
          />
        </div>
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_bottom,#101A14_0%,rgba(16,26,20,0.86)_100%)]"
        />

        {/* Status bar. Everything from here down is `relative` so it sits above
            the photograph and the wash. */}
        <div className="relative flex items-center justify-between gap-2 px-4 pt-[22px] pb-[10px]">
          {/* [LOG] The clock reads 12:06 am while seven of the ten
              notifications below it are timestamped later, up to 1:02 am. The
              phone is behind its own feed. Client's content, shipped as drawn. */}
          <span className="font-ui text-[11px] font-semibold text-white/60">{COPY.clockBefore}</span>

          {/*
            All five counts are stacked in one grid cell, so the pill is always
            as wide as the widest of them and never resizes as the number
            changes. That is intentional.
          */}
          <span className="ping-buzz inline-grid place-items-center rounded-full bg-rust px-[9px] py-[3px]">
            {UNREAD_COUNTS.map((count, i) => (
              <span
                key={count}
                className="unread ping-lin font-ui text-[10.5px] font-bold whitespace-nowrap text-white [grid-area:1/1]"
                style={{ animationName: `bb-unread-${i + 1}` }}
                data-rest={i === UNREAD_REST_INDEX ? "true" : undefined}
              >
                {count}
              </span>
            ))}
          </span>
        </div>

        {/*
          `justify-end` is what makes the choreography read: the stack is
          bottom-anchored, so each card lands at the bottom and pushes the
          column up and out through the masked top edge. At full extension ten
          cards (~780px) sit in a ~493px box and four are clipped above the
          mask - that is the pile-up, not an overflow bug.
        */}
        <div className="relative flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-3 pt-[6px] pb-[10px] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,#000_14%,#000_100%)] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_14%,#000_100%)]">
          {NOTIFICATIONS.map((item, i) => {
            const Icon = PHONE_ICONS[item.icon];
            return (
              /* Two animated elements per card, not one: the wrapper opens the
                 box (max-height, margin and the slide) and the inner card takes
                 the sideways shudder, because a single element cannot run two
                 transforms on different curves. */
              <div
                key={item.sender}
                className="ping-item flex-none overflow-hidden"
                style={{ animationName: `bb-ping-in-${i + 1}` }}
              >
                <div
                  className="ping-card flex gap-[10px] rounded-xl bg-white/10 px-[11px] py-[10px] shadow-[0_0_0_1px_rgba(255,255,255,0.09)_inset] [-webkit-backdrop-filter:blur(10px)] [backdrop-filter:blur(10px)]"
                  style={{ animationName: `bb-ping-jolt-${i + 1}` }}
                >
                  <span
                    aria-hidden="true"
                    className="relative grid h-[26px] w-[26px] flex-none place-items-center rounded-[7px]"
                    style={{ background: item.tile }}
                  >
                    {/* The halo. Its inline opacity is the resting value the
                        reduced-motion block keeps; the keyframes own it while
                        the loop runs. */}
                    <span
                      className="ping-ring ping-lin absolute -inset-[3px] rounded-[9px] border-[1.5px] opacity-0"
                      style={{ animationName: `bb-ping-ring-${i + 1}`, borderColor: item.tile }}
                    />
                    <Icon size={14} strokeWidth={2.2} className="text-white" />
                  </span>

                  <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                    <span className="flex min-w-0 items-baseline justify-between gap-2">
                      {/* `min-w-0` plus the truncation is what lets the longest
                          sender - "Trent — Voltaic Electrical" - give way to the
                          timestamp rather than push it out of the card. */}
                      <span className="min-w-0 truncate font-ui text-[12.5px] font-semibold text-white">
                        {item.sender}
                      </span>
                      <span className={`flex-none font-ui text-[10.5px] ${TIME_TONE}`}>{item.time}</span>
                    </span>
                    <span className="font-ui text-[11.5px] leading-[1.4] text-white/[0.76]">{item.message}</span>
                    <span
                      className={`mt-px font-ui text-[10px] font-bold tracking-[0.06em] uppercase ${CHANNEL_TONE}`}
                    >
                      {item.channel}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
