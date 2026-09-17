import { ChevronDown } from "lucide-react";

import { FAQ } from "@/content/faq";

import { AnswerText } from "./answer-text";

/* Same focus rule as desktop - 2px forest at 2px offset, from docs/brand.md,
   because neither artboard draws one.

   `leading-[normal]`, as on the desktop question, reproduces the rendered
   artboard rather than its stylesheet: the mobile board sets no root
   line-height at all, so its rows sit on the UA default, where our own base
   layer sets 1.5 page-wide. Left to inherit, every row is 3px taller and the
   card runs 33px long over eleven items. */
const SUMMARY =
  "flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-[15px] leading-[normal] font-bold text-ink " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 " +
  "[&::-webkit-details-marker]:hidden";

/**
 * Section: FAQ, mobile.
 *
 * A separate composition rather than `desk:` forks on one, because the two
 * boards differ in BEHAVIOUR as well as layout and the difference is carried by
 * an attribute, which no media query can reach: desktop is an exclusive
 * accordion (`name`) that starts fully closed, mobile is eleven independent
 * disclosures with the first one open. That is how the artboards draw them and
 * both ship as drawn. It is also the split the hero, the marquee and the
 * before/after band already use.
 *
 * The mobile board additionally drops the "Still curious? Get in touch" line
 * that desktop carries. Preserved, not unified.
 */
export function FaqMobile() {
  return (
    <section data-section="faq-mobile" className="px-4 pb-9 desk:hidden">
      {/*
        `.display` carries family and weight, `.display-2-mobile` overrides only
        the three properties the mobile board voices differently (opsz 32,
        line-height 1.14, tracking -0.005em) - the same pairing social proof
        uses for the same `.m-h2`.
      */}
      <h2 className="display display-2-mobile mb-4 text-[26px] text-ink">
        Frequently asked questions
      </h2>

      <p className="mb-5 text-[14.5px] leading-[1.6] text-slate-700">
        Confyde delivers AI Strategy, Agentic Workflows and Automation, Software Engineering, and Data and Security Services through a structured approach that combines senior technical expertise with clear governance and accountability.
      </p>

      {/*
        The artboard's own three-layer warm shadow. It is NOT `.shadow-card-mobile`
        - that recipe is this one's first two layers without the wide
        `0 18px 30px -18px` spread - and it is none of the four
        `.shadow-border-*` stacks either, which all lead with a hairline this
        card does not draw. Written as a local value rather than invented as a
        token, the same call RULINGS.md §02 ruling 5 made for `#ACAFB1`.
        rgb(21 48 31) is forest-900.

        [FOR THE TECH LEAD] If a second band turns out to want the same stack it
        belongs in styles/base.css next to `.shadow-card-mobile`; one call site
        did not justify reaching into a file another engineer owns.
      */}
      <div className="overflow-hidden rounded-xl bg-card shadow-[0_1px_2px_rgb(21_48_31/0.05),0_6px_14px_-6px_rgb(21_48_31/0.14),0_18px_30px_-18px_rgb(21_48_31/0.18)]">
        {FAQ.map((entry, index) => (
          /* No `name`: these are independent, exactly as the board draws them.
             The first opens on load and can be closed again. */
          <details
            key={entry.question}
            open={index === 0}
            className="faq-item group border-b border-hairline"
          >
            <summary className={SUMMARY}>
              {entry.question}
              <ChevronDown size={18} strokeWidth={2} aria-hidden="true" className="faq-chevron shrink-0" />
            </summary>
            <p className="m-0 px-4 pb-4 text-[14px] leading-[1.6] text-slate-700">
              <AnswerText blocks={entry.answerMobile ?? entry.answer} />
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
