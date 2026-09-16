import { Check } from "lucide-react";

import { Reveal } from "@/components/primitives/reveal";

/**
 * Two accreditation claims.
 *
 * [LOG] These are claims of membership, not decoration, and they should be
 * links to the association listing and the Xero app page the moment the client
 * supplies URLs. They stay as text for now for the same reason every CTA on the
 * page is inert (RULINGS.md §01), but unlike a CTA an unverifiable accreditation
 * claim is a trust question rather than a navigation one.
 */
const PILLS = ["Australian Landscape Association member", "Xero app partner"] as const;

export function AccreditationPills() {
  return (
    /* A stacked column below 1024 and a wrapping row above it - a real
       structural difference between the artboards, and the better answer at
       both scales: side by side the first label is nearly three times the width
       of the second, so a row reads unbalanced at every width where it fits. */
    <Reveal
      anim="up-blur"
      delay={0.1}
      duration={0.5}
      className="mt-[14px] flex flex-col items-center gap-2 desk:mt-5 desk:flex-row desk:flex-wrap desk:justify-center desk:gap-[10px]"
    >
      {PILLS.map((label) => (
        /* A single-layer hairline, not one of the `.shadow-border-*` recipes -
           those all carry a multi-layer blur stack this does not have. The
           artboard's `var(--color-border, #DFD8C8)` is undeclared, so only the
           fallback renders, and it is exactly `--color-hairline`.

           Asymmetric padding, tighter on the badge side, so the circle
           optically centres against the text's side bearing. */
        <span
          key={label}
          className="inline-flex items-center gap-2 rounded-full bg-card py-2 pr-[14px] pl-2 shadow-[0_0_0_1px_var(--color-hairline)] desk:gap-[9px] desk:py-[9px] desk:pr-[18px] desk:pl-[10px]"
        >
          {/* `flex-none` is not in the artboard. It has no effect at any width
              the artboard draws, and it stops the circle squashing into an oval
              at 320px, where the first label wraps to three lines. */}
          <span
            aria-hidden="true"
            className="grid size-[22px] flex-none place-items-center rounded-full bg-lime-100 text-forest-800 desk:size-[26px]"
          >
            {/*
              The artboard inlines `M20 6 9 17l-5-5` on a 24x24 box, which IS
              Lucide `Check`, so there is no icon substitution to make here.

              Two elements because size and stroke-width are props, not classes,
              and the two artboards differ on both: 11px/2.8 against 13px/2.6.
              That is deliberate optical compensation - a smaller glyph needs a
              proportionally heavier stroke - and is not unified.
            */}
            <Check size={11} strokeWidth={2.8} className="desk:hidden" />
            <Check size={13} strokeWidth={2.6} className="hidden desk:block" />
          </span>

          {/* Product serif at both breakpoints, per the client's font decision
              recorded at the end of RULINGS.md. Desktop keeps `nowrap`; mobile
              lets the first label wrap, as drawn. */}
          <span className="font-ui-serif text-[13.5px] font-semibold text-ink desk:text-[15.5px] desk:whitespace-nowrap">
            {label}
          </span>
        </span>
      ))}
    </Reveal>
  );
}
