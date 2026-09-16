import Image from "next/image";

import { Reveal } from "@/components/primitives/reveal";
import { QUOTE, READING, SCOPE } from "@/content/home";

import { CH1_LABELS, CLIENT_FIRST_NAME } from "./labels";

/**
 * Panel C: the branded proposal the two panels above it produce.
 *
 * ENTERS DIFFERENTLY FROM PANEL B, on purpose - `up-blur` over 0.6s where panel
 * B scales over 0.5s - and sizes differently too: a `min-height` here where
 * panel B fixes a `height`, because this card grows with its five scope rows
 * while panel B's four file rows are a fixed deck.
 *
 * [LOG] THE FIGURES DO NOT RECONCILE. The five scope lines sum to $41,720; the
 * card says $48,200 "inc. GST", and $41,720 plus 10% GST is $45,892. These are
 * the client's numbers and not ours to correct (RULINGS.md principle 3) - but
 * it is worth them knowing, because on a quoting product a proposal whose line
 * items do not add up to its total is the first detail a landscaper would
 * notice, and because the take-off card's arithmetic reconciles exactly, which
 * makes this one look like an oversight rather than a choice.
 *
 * [LOG] The `Total inc. GST -` label ends in a hyphen. Client copy; mobile
 * writes the same label without it.
 */
export function ProposalCard() {
  return (
    <div className="min-h-[384px] w-full">
      <Reveal
        anim="up-blur"
        duration={0.6}
        className="flex min-h-[384px] w-full items-center justify-center font-ui"
      >
        <div
          role="img"
          aria-label={CH1_LABELS.proposalDesktop}
          className="shadow-border-strong flex w-full max-w-[330px] flex-col overflow-hidden rounded-xl bg-white"
        >
          <div className="relative overflow-hidden bg-forest-900 px-3.5 pt-[13px] pb-[15px]">
            <Image src="/images/photo-1.webp" alt="" fill sizes="330px" className="object-cover" />

            {/*
              The one angled gradient in the section, and the reason the
              masthead needed fixing, and the obvious lever is the wrong one.
              24deg runs bottom-left to top-right, so
              the heavy end sits under the address and the light end sits
              exactly where `LIC# 284119C` is.

              CONTRAST. Measured against the composited pixels, the three lines
              nearest the top right failed at the artboard's values -
              `Laurence Landscapes` 2.83:1, `Q-1042 · Coogee` 3.14:1,
              `LIC# 284119C` 3.74:1 - while the two nearest the bottom left
              passed. The last stop moves from 6% to 40%, which is the single
              smallest change that clears all three at once and keeps both the
              diagonal and the photograph. This is not a design change; the
              scrim exists precisely to make this masthead legible and at
              2.83:1 it was underpowered at its own job (RULINGS.md §06).
            */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(24deg,color-mix(in_oklab,var(--color-forest-900)_90%,transparent)_4%,color-mix(in_oklab,var(--color-forest-900)_62%,transparent)_52%,color-mix(in_oklab,var(--color-forest-900)_40%,transparent))]"
            />

            <div className="relative">
              <div className="flex items-center justify-between gap-2.5 border-b border-b-[rgba(255,255,255,0.22)] pb-2.5">
                {/* The only masthead line with no text-shadow. As drawn. */}
                <span className="flex-none font-ui-serif text-[11.5px] leading-none font-semibold tracking-[0.16em] whitespace-nowrap text-white uppercase">
                  {QUOTE.studio}
                </span>
                <span className="text-right text-[11.5px] leading-[1.5] text-cream [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]">
                  {QUOTE.licence}
                </span>
              </div>

              <div className="pt-3">
                <span className="block text-[11.5px] tracking-[0.16em] text-cream uppercase [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
                  {QUOTE.reference} · {QUOTE.suburb}
                </span>
                {/* An 18px blur is a glow rather than a drop shadow: it darkens
                    the photograph immediately around the glyphs, which is what
                    carries this line where the two 3px shadows cannot. */}
                <span className="mt-1 block font-ui-serif text-[24px] leading-[0.98] font-semibold tracking-[-0.01em] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.45)]">
                  {QUOTE.address}
                </span>
                <span className="mt-1 block text-[12px] text-cream [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
                  Prepared for {QUOTE.client}
                </span>
              </div>
            </div>
          </div>

          {/* [LOG] The second of the page's two 1.5px hairlines. Ships as
              drawn (RULINGS.md §01 ruling 8 precedent). */}
          <div className="mx-3.5 mt-3 border-b-[1.5px] border-b-forest-800 pb-[7px] text-[12px] tracking-[0.2em] text-slate-500 uppercase">
            Scope
          </div>

          <ul className="m-0 list-none p-0 pt-2">
            {SCOPE.map((line) => (
              <li
                key={line.label}
                className="flex items-center gap-2.5 border-b border-b-slate-100 px-3.5 py-1.5"
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 flex-none rounded-full"
                  style={{ background: line.dot }}
                />
                <span className="min-w-0 flex-1 overflow-hidden font-ui text-[12.5px] leading-[1.4] text-ellipsis whitespace-nowrap text-slate-700">
                  {line.label}
                </span>
                <span className="flex-none font-ui-serif text-[12.5px] font-semibold tabular-nums text-ink">
                  {line.amount}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex items-baseline justify-end gap-3 px-3.5 pt-2.5 pb-[11px]">
            <span className="text-[12px] tracking-[0.1em] text-slate-500 uppercase">
              Total inc. GST -
            </span>
            <span className="font-ui-serif text-[22px] font-semibold tabular-nums text-ink">
              {QUOTE.total}
            </span>
          </div>

          <div className="flex items-center gap-2 border-t border-hairline bg-well px-3.5 py-2">
            {/*
              A two-layer pip: a solid base dot that never moves, plus a ghost
              that scales out from under it - so when reduced motion hides the
              ghost, a dot remains rather than a hole.

              `.live-pip` is the class the before/after section already declares
              globally, on the same 2.4s clock with the same easing and the same
              reduced-motion rule. The artboard declares its own copy of that
              keyframe twice, byte-identically; the page needs exactly one.

              Lime on a live marker is one of the accent's four sanctioned
              roles, not an exception to the rule.
            */}
            <span
              aria-hidden="true"
              className="relative grid h-1.5 w-1.5 flex-none place-items-center"
            >
              <span className="absolute inset-0 rounded-full bg-lime-500" />
              <span className="live-pip absolute inset-0 rounded-full bg-lime-500" />
            </span>
            {/* CONTRAST. slate-500 measures 4.40:1 on the `well` fill; slate-600
                measures 7.38:1. Same correction as the totals block. */}
            <span className="text-[12px] text-slate-600">
              Sent to {CLIENT_FIRST_NAME} · opened {READING.opens} times
            </span>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
