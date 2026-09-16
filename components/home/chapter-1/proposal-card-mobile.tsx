import Image from "next/image";

import { QUOTE, READING, SCOPE } from "@/content/home";

import { CH1_LABELS, CLIENT_FIRST_NAME, toSentenceCase } from "./labels";

/**
 * The proposal card below 1024px - a materially different card from desktop's,
 * not a narrower version of it.
 *
 * THE HIERARCHY IS INVERTED. Desktop leads with the address and puts the client
 * beneath it; mobile leads with the client and drops the address into the
 * sub-line. Mobile also carries a project description that appears nowhere on
 * desktop, and drops the licence number and the quote reference entirely. The
 * masthead is a 190px photographic band with a bottom-up scrim rather than
 * desktop's 24deg diagonal, so the type sits in the dark end by construction
 * and none of desktop's masthead contrast problem exists here.
 *
 * [LOG] FOUR SCOPE ROWS, NOT FIVE. Mobile omits `Irrigation` / $5,320 entirely,
 * which takes the visible sum from $41,720 to $36,400 against the same $48,200
 * total, and sets the four labels it keeps in sentence case where desktop uses
 * Title Case. Both ship as drawn; both are the client's to reconcile.
 *
 * THE `Accept quote` PILL IS A PICTURE OF A BUTTON. It sits inside a
 * `role="img"` region and there is nothing for it to do, so it is a `<span>`:
 * not focusable, not announced as a control the reader can press and have
 * nothing happen.
 */
export function ProposalCardMobile() {
  return (
    <div
      role="img"
      aria-label={CH1_LABELS.proposalMobile}
      className="relative overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(21,48,31,0.06),0_10px_24px_-12px_rgba(21,48,31,0.22),0_24px_40px_-24px_rgba(21,48,31,0.26)]"
    >
      {/* 190px fixed. It is a photographic band with type anchored 16px from
          its bottom edge; a proportional height would drift the type relative
          to the subject at every width. */}
      <div className="relative h-[190px] overflow-hidden">
        <Image
          src="/images/photo-2.webp"
          alt=""
          fill
          sizes="(min-width: 640px) 560px, 100vw"
          className="object-cover"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--color-forest-900)_92%,transparent)_0%,color-mix(in_oklab,var(--color-forest-900)_40%,transparent)_55%,transparent_100%)]"
        />
        <div className="absolute right-[18px] bottom-4 left-[18px] flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-[0.12em] text-[color-mix(in_oklab,#fff_72%,transparent)] uppercase">
            Prepared for
          </span>
          <span className="display display-2-mobile text-[24px] leading-[1.1] tracking-[-0.01em] text-white">
            {QUOTE.client}
          </span>
          <span className="text-[12px] text-[color-mix(in_oklab,#fff_78%,transparent)]">
            {QUOTE.address}, {QUOTE.suburb} · {QUOTE.description}
          </span>
        </div>
      </div>

      <div className="px-[18px] pt-[18px] pb-1.5">
        <span className="block text-[10.5px] font-bold tracking-[0.12em] text-slate-500 uppercase">
          Scope of works
        </span>
        {/* A paragraph desktop does not have. Preserved as its own edit. */}
        <p className="mt-2 mb-1.5 text-[13px] leading-[1.55] text-slate-700">
          A private poolside garden. Bluestone terraces step down to soft lawn, screened for
          shade and seclusion.
        </p>
      </div>

      <ul className="m-0 list-none px-[18px] pt-0 pb-1">
        {SCOPE.slice(0, 4).map((line, i) => (
          <li
            key={line.label}
            className={
              "flex items-baseline gap-3 py-2.5" +
              (i === 0
                ? ""
                : " border-t border-t-[color-mix(in_oklab,var(--color-hairline)_60%,transparent)]")
            }
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 flex-none rounded-full"
              style={{ background: line.dot }}
            />
            <span className="min-w-0 flex-1 overflow-hidden font-ui text-[12.5px] leading-[1.4] text-ellipsis whitespace-nowrap text-slate-700">
              {toSentenceCase(line.label)}
            </span>
            <span className="flex-none font-ui-serif text-[12.5px] font-semibold tabular-nums text-ink">
              {line.amount}
            </span>
          </li>
        ))}
      </ul>

      {/* No trailing hyphen here, unlike desktop's `Total inc. GST -`. */}
      <div className="mx-[18px] mt-2 flex items-baseline justify-between gap-3 border-t border-hairline pt-3.5 pb-4">
        <span className="text-[11px] font-bold tracking-[0.1em] text-slate-500 uppercase">
          Total inc. GST
        </span>
        <span className="display display-2-mobile text-[24px] tracking-[-0.01em] tabular-nums text-ink">
          {QUOTE.total}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-hairline bg-well px-[18px] py-[11px]">
        <span className="flex items-center gap-2">
          {/* A static dot. Mobile has no live-pip animation at all. */}
          <span aria-hidden="true" className="h-1.5 w-1.5 flex-none rounded-full bg-lime-500" />
          {/* CONTRAST. slate-500 measures 4.40:1 on `well`; slate-600 measures
              7.38:1. Same correction as the desktop footer. */}
          <span className="text-[12px] text-slate-600">
            Sent to {CLIENT_FIRST_NAME} · opened {READING.opens} times
          </span>
        </span>
        <span className="inline-flex h-[30px] flex-none items-center rounded-lg bg-lime-500 px-3 text-[12px] font-bold text-forest-900">
          Accept quote
        </span>
      </div>
    </div>
  );
}
