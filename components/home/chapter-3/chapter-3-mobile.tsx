import Image from "next/image";
import { Trophy } from "lucide-react";

import { ChapterShellMobile } from "@/components/home/chapter/chapter-shell-mobile";
import {
  LEADERBOARD,
  LEADERBOARD_FOOTER,
  LEADERBOARD_TITLE,
  MOBILE_GROUPS,
} from "@/content/playbook";

/**
 * Chapter 3 below 1024px. A different composition, not a reflow.
 *
 * TWO SECTIONS, NOT ONE PANEL. The board sits in the chapter shell; the
 * leaderboard is a separate section with its own white card on the page canvas.
 * That is how the mobile artboard draws it, and it is why this file renders a
 * fragment rather than one `<section>`.
 *
 * WHAT MOBILE DOES NOT HAVE: the three tilted stat cards, the browser chrome,
 * the eight-cell counter strip, the seven count-ups, the 14-second flight, the
 * shine, the toast, the grab badge, the swapping lane totals, `View quote →`,
 * `See all closed →`, the Lucide `User` on every card and the Closed lane's
 * blurb. Nothing here animates and nothing here counts. It is a single still
 * frame of the same story - which is precisely why the desktop reduced-motion
 * resting state is pinned to t = 0: that is the frame this board draws.
 *
 * IT STAYS READABLE. The desktop board collapses to one `role="img"` because it
 * is changing on a loop and both halves of three swap pairs are always in the
 * DOM. None of that is true here, so the mobile board is the other half of the
 * rule: four groups with headings, five cards, all announced normally.
 *
 * [LOG] THE NUMBERS AND THE COPY ARE NOT DESKTOP'S. `Drafts` is plural and
 * holds three quotes worth $74.2k against desktop's two worth $29.7k; the
 * Closed group carries a $412k total desktop's has none of and a forest dot
 * where desktop's is slate; the four group tones are four different tones; the
 * groups carry a hairline desktop's lanes do not; the paragraph under the
 * sub-head is a third of desktop's length; the leaderboard paragraph is
 * rewritten rather than trimmed; the eyebrow gains ` - TEAM TOOLS`; and the
 * Beach Rd quote reads as good news here and as a warning there. All preserved
 * per the RULINGS §02 rulings 12-14 precedent. See docs/specs/10-chapter-3.md
 * D14, D18, D19, D20.
 */

/* The mobile group ramp - four tones, none of them desktop's four. Two are
   tokens; the other two are one-offs kept as commented constants (§02 ruling 5).
   The Closed tone is written as the artboard writes it, a 10% forest tint of
   card-muted, rather than as the #CFCDB9 it resolves to. */
const GROUP_TONES = [
  "var(--color-well)",
  "#EFEDE0",
  "var(--color-card-muted)",
  "color-mix(in oklab, var(--color-forest-900) 10%, var(--color-card-muted))",
];

const GROUP_DOTS = [
  "var(--color-slate-300)",
  "var(--color-forest-500)",
  "var(--color-lime-500)",
  "var(--color-forest-900)",
];

const META_TONE = {
  slate: "text-slate-500",
  forest: "text-forest-700",
  rust: "text-rust",
} as const;

export function Chapter3Mobile() {
  return (
    <>
      <ChapterShellMobile
        dataSection="chapter-3-mobile"
        image="/images/photo-1.webp"
        heading="Build a quoting & sales system that gets sharper every job."
      >
        <h3 className="display marquee-heading-mobile text-[19px] text-ink">
          Know where every quote stands, and what to do next.
        </h3>
        <p className="mt-2 mb-4 text-[14.5px] leading-[1.55] text-slate-700">
          Every job in one place, whether you run it on your own or with a team.
        </p>

        {/*
          `leading-[normal]`, not the page's 1.5. The MOBILE artboard leaves
          `line-height: normal` on its body where the desktop one sets 1.5, and
          `styles/base.css` carries the desktop value page-wide. Every line in
          this board takes its leading from that inheritance - group names,
          counts, totals, card names, metas and amounts all declare none - so at
          1.5 each group grows about 5px and the board accumulates 19px of drift
          against the artboard by the last card. Measured at 430px. Restored
          here rather than page-wide: base.css is shared, and the two paragraphs
          above declare their own 1.55 either way.
        */}
        <div className="flex flex-col gap-2 leading-[normal]">
          {MOBILE_GROUPS.map((group, i) => (
            <div
              key={group.name}
              /* 10px is off the 4/6/8/12 radius scale, as is the 8px card
                 inside it stepping down from a 10px parent. Both as drawn. */
              className="flex flex-col gap-[7px] rounded-[10px] p-2.5 shadow-[0_0_0_1px_var(--color-hairline)]"
              style={{ background: GROUP_TONES[i] }}
            >
              <div className="flex items-baseline gap-[7px] px-0.5 pb-0.5">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 flex-none self-center rounded-full"
                  style={{ background: GROUP_DOTS[i] }}
                />
                {/* An `<h4>` under the band's `<h3>`, where the artboard writes
                    a bare `<span>`. The four groups are worth navigating to and
                    this keeps the outline unbroken; the type is unchanged. */}
                <h4 className="m-0 text-[11px] font-bold tracking-[0.1em] text-ink uppercase">
                  {group.name}
                </h4>
                {/* slate-400 measured 2.05-2.98:1 across the four group tones.
                    slate-600 clears all four (5.06-7.38). */}
                <span className="text-[11.5px] text-slate-600">{group.count}</span>
                <span className="ml-auto text-[12.5px] font-semibold text-slate-700">
                  {group.value}
                </span>
              </div>

              {group.cards.map((card) => (
                <div
                  key={card.name}
                  className="flex items-center gap-2.5 rounded-lg bg-card px-2.5 py-[9px]"
                >
                  <Image
                    src={card.photo}
                    alt=""
                    width={34}
                    height={34}
                    className="h-[34px] w-[34px] flex-none rounded-md object-cover"
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-px">
                    <span className="truncate text-[13px] font-semibold text-ink">
                      {card.name}
                    </span>
                    <span className={`truncate text-[11.5px] ${META_TONE[card.metaTone]}`}>
                      {card.meta}
                    </span>
                  </span>
                  {/* The amount is set in Fraunces here and in the product sans
                      on desktop - the artboards' own split, reproduced. */}
                  <span className="display marquee-heading-mobile flex-none text-[13px] text-ink">
                    {card.amount}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </ChapterShellMobile>

      <section
        data-section="chapter-3-leaderboard-mobile"
        className="mx-auto w-full max-w-[592px] px-4 pb-[34px] desk:hidden sm:max-w-[624px] sm:px-8"
      >
        <div className="overflow-hidden rounded-xl bg-card px-4 pt-[22px] pb-5 leading-[normal]">
          {/* [LOG] The separator is a hyphen-minus and the ` - TEAM TOOLS`
              suffix has no desktop counterpart. Client copy; flagged, not
              edited. docs/brand.md bans em dashes, so an en dash is the only
              correction available to them. */}
          <div className="text-[11px] font-bold tracking-[0.14em] text-eyebrow-mobile uppercase">
            ONE SOURCE OF TRUTH - TEAM TOOLS
          </div>
          {/* `<h3>`, not the artboard's `<h2>`: the same string is a band
              sub-head at both breakpoints and desktop writes `<h3>`. The size
              is carried by `.display-*`, so the pixels are unchanged.
              `text-wrap: balance` is insurance at 320px, where this sets to
              three lines with one word on the last. */}
          <h3 className="display display-2-mobile mt-2.5 mb-2 text-[clamp(20px,5.58vw,24px)] text-balance text-ink">
            Everyone knows where the jobs are at.
          </h3>
          <p className="mb-4 text-[14.5px] leading-[1.55] text-slate-700">
            Everyone sees the same board, so the catch-up calls stop. See who is quoting, who is
            closing, and reward the people bringing in the work.
          </p>

          {/* A hairline plus two warm shadow layers, where the desktop card has
              neither. None of the four `.shadow-border-*` recipes matches it,
              and it is one call site, so it is spelt here rather than minted as
              a fifth recipe. Same asymmetry as RULINGS §03/04 ruling 13. */}
          <div className="overflow-hidden rounded-xl bg-card shadow-[0_0_0_1px_var(--color-hairline),0_6px_14px_-6px_rgb(21_48_31_/_0.14),0_18px_30px_-18px_rgb(21_48_31_/_0.18)]">
            <div className="border-b border-hairline px-3.5 py-3">
              <h4 className="display marquee-heading-mobile m-0 flex items-center gap-2 text-[16px] text-ink">
                <Trophy
                  aria-hidden="true"
                  className="h-[17px] w-[17px] flex-none text-forest-500"
                  strokeWidth={2}
                />
                {LEADERBOARD_TITLE}
              </h4>
            </div>

            <ul className="m-0 list-none p-0">
              {LEADERBOARD.map((row, i) => (
                <li
                  key={row.name}
                  className={`flex items-center gap-[11px] px-3.5 py-[11px] ${
                    i === 0 ? "" : "border-t border-slate-100"
                  }`}
                >
                  <Image
                    src={row.photo}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 flex-none rounded-md object-cover"
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                    <span className="flex min-w-0 items-baseline gap-[7px]">
                      <span className="text-[14px] font-semibold text-ink">{row.name}</span>
                      <span className="min-w-0 truncate text-[12px] text-slate-500">
                        {row.jobMobile ?? row.job}
                      </span>
                    </span>
                    <span className="flex items-center gap-[7px]">
                      <span
                        aria-hidden="true"
                        className="block h-[5px] flex-1 rounded-full bg-slate-100"
                      >
                        <span
                          className="block h-full rounded-full bg-forest-500"
                          style={{ width: row.bar }}
                        />
                      </span>
                      <span className="flex-none text-[11px] whitespace-nowrap text-slate-500">
                        {row.record}
                      </span>
                    </span>
                  </span>
                  <span className="display marquee-heading-mobile w-12 flex-none text-right text-[13.5px] text-ink">
                    {row.total}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-hairline bg-well px-3.5 py-2.5 text-[12px] text-slate-600">
              {LEADERBOARD_FOOTER}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
