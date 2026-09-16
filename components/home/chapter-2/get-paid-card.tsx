import Image from "next/image";

import { MILESTONES } from "@/content/home";
import { Check } from "lucide-react";

/**
 * Card 3, "Get paid" - the milestone schedule and the Xero pill. Desktop only:
 * the mobile chapter ends after card 2 and does not draw this card at any width
 * (docs/specs/08-chapter-2.md §6.7).
 *
 * [LOG] THE COMPLETED MARKER IS LIME. `docs/brand.md`: "Selected or completed is
 * forest, never lime... No lime completed checks." It is in the render, so it
 * ships as drawn under RULINGS.md principle 1 - the same class as the hero's
 * lime keyline (§02 ruling 2) - and is flagged for the client.
 *
 * [LOG] The three amounts sum to $62,800 against QUOTE.total's $48,200, and
 * `Deposit in` is styled as an action and reads as an unfinished sentence.
 * Client data and client copy; flagged, not fixed (D12, D16).
 */
export function GetPaidCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline bg-card-muted px-5 py-3.5">
        {/* `.display` + `font-ui-serif` + `font-ui` on the medallion: the
            artboard's own construction, explained in full in ./replay-card.tsx. */}
        <h4 className="display m-0 flex items-center gap-2.5 font-ui-serif text-[19px] font-semibold text-ink">
          <span
            aria-hidden="true"
            className="grid h-[26px] w-[26px] flex-none place-items-center rounded-full bg-lime-500 font-ui text-[12.5px] font-bold text-forest-900"
          >
            3
          </span>
          Get paid
        </h4>

        {/* The asymmetric 3/11/3/4 padding is correct: it optically centres the
            18px mark inside the pill. `alt=""` rather than the artboard's
            `alt="Xero"` - the text beside it already says Xero, and this is the
            one image in the section whose alt would otherwise double up. */}
        <span className="inline-flex items-center gap-[7px] rounded-full bg-well py-[3px] pr-[11px] pl-1 shadow-[0_0_0_1px_var(--color-hairline)]">
          <Image
            src="/images/xero-mark.webp"
            alt=""
            width={18}
            height={18}
            className="h-[18px] w-[18px] flex-none rounded-full"
          />
          <span className="text-[11.5px] font-bold text-slate-700">Syncs with Xero</span>
        </span>
      </div>

      <p className="m-0 px-5 pt-3.5 pb-1 text-[13.5px] leading-normal text-slate-700">
        Set milestones or take a deposit the moment they accept.
      </p>

      <div className="bg-white">
        {MILESTONES.map((milestone, i) => (
          <div
            key={milestone.title}
            className={
              "flex items-center gap-[11px] px-5 py-[11px]" +
              (i === 0 ? "" : " border-t border-t-slate-100")
            }
          >
            {milestone.done ? (
              <span
                aria-hidden="true"
                className="grid h-6 w-6 flex-none place-items-center rounded-full bg-lime-500"
              >
                <Check size={13} strokeWidth={3.2} className="text-forest-900" />
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="grid h-6 w-6 flex-none place-items-center rounded-full bg-well shadow-[0_0_0_1px_var(--color-hairline)]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              </span>
            )}

            <span className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="text-[14px] font-medium text-charcoal-900">{milestone.title}</span>
              <span className="text-[12px] text-slate-500">{milestone.sub}</span>
            </span>
            <span className="flex-none font-ui-serif text-[14.5px] font-semibold tabular-nums text-ink">
              {milestone.amount}
            </span>
          </div>
        ))}

        <div className="flex items-center justify-between gap-2.5 border-t border-hairline bg-well px-5 py-2.5">
          {/* CONTRAST. slate-500 on `well` measures 4.28:1; slate-600 clears it
              and is an existing token (RULINGS.md §06). */}
          <span className="text-[12px] leading-[1.45] text-slate-600">
            Milestones set on the quote, invoiced in Xero as they fall due.
          </span>
          <span className="flex-none text-[12px] font-semibold whitespace-nowrap text-forest-700">
            Deposit in
          </span>
        </div>
      </div>
    </div>
  );
}
