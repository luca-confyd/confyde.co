import { Minus, Plus } from "lucide-react";

import { NavItem } from "@/components/chrome/nav-item";
import { Reveal } from "@/components/primitives/reveal";
import { FAQ } from "@/content/faq";

import { AnswerText } from "./answer-text";

/**
 * The exclusive-accordion group name.
 *
 * `name` on `<details>` is what makes opening one item close its siblings, in
 * the browser, with no state to hold. It is the whole of the artboard's
 * single-open behaviour. The value only has to be unique on the page, and the
 * mobile composition deliberately does NOT carry one - see faq-mobile.tsx.
 */
const GROUP = "faq";

/* The artboard voices the question at Fraunces 18px on axes the `.display`
   scale does not carry (wght 460 sits between .display's mobile 600 and its
   desktop 420, opsz 16 between 10 and 40). Rather than bend the shared scale to
   fit - RULINGS.md §03/04 ruling 14 - the three axes ride along as a local
   value, the same way the hero writes its own one-off cuts.

   `leading-[normal]` reproduces the rendered artboard, not its stylesheet. The
   artboard's trigger is a <button>, which the browser gives `line-height:
   normal` and the artboard never resets, so the question sets on a 23px line
   box rather than the page's 1.5 (27px). A <summary> inherits, so without this
   every row is 4px taller and the accordion drifts 44px over eleven items.
   RULINGS.md principle 1: the rendered artboard is the acceptance test. */
const QUESTION =
  "font-display text-[18px] leading-[normal] [font-variation-settings:'wght'_460,'SOFT'_100,'opsz'_16]";

/* No artboard defines a focus style, so docs/brand.md governs: 2px forest at
   2px offset on anything that is not a dark forest surface. This card is
   pf-surface-50. `list-none` plus the webkit marker rule removes the default
   disclosure triangle in every engine. */
const SUMMARY =
  "flex w-full cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-pf-ink-900 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 " +
  "[&::-webkit-details-marker]:hidden";

const ICON = "shrink-0 text-pf-ink-500";

/**
 * Section: FAQ, desktop.
 *
 * Two columns - the heading block and the accordion - at the page's 1280px
 * container with the 48px gutters this band draws (wider than social proof's
 * 24px; as drawn).
 *
 * DISCLOSURE. Native `<details>` / `<summary>`, not a button-and-panel client
 * component. The artboard's script is ~15 lines of JS that reimplement what the
 * element already does, and it reimplements it without `aria-expanded` or
 * `aria-controls` - the ruled defect. Handing the job back to the browser fixes
 * that defect by construction rather than by remembering to: `<summary>` is a
 * disclosure button with its expanded state owned by the same attribute that
 * drives the CSS, so the two cannot drift. It is keyboard-operable, it works
 * before hydration and with JS off, and `name` gives the single-open behaviour
 * for free. The section ships zero client JavaScript.
 */
export function FaqDesktop() {
  return (
    <section
      data-section="faq-desktop"
      className="mx-auto hidden w-full max-w-[1280px] flex-col py-24 desk:flex"
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-[1fr_1.5fr] items-start gap-12 px-12">
        <Reveal anim="up-blur" duration={0.5} className="flex flex-col gap-4">
          {/*
            One `<h2>`, level-matched to the other band headings so the page
            outline stays h1 -> h2 with no skip. `.display` carries family and
            weight; at >=1024 its own cut is already pf-h2's wght 420 / SOFT 100
            / opsz 10, so only size and metrics are written here.
          */}
          <h2 className="display text-[3rem] leading-[1.2] tracking-[-0.008em] text-pf-ink-900">
            Frequently asked questions
          </h2>

          <p className="m-0 text-[16px] leading-[1.6] text-pf-ink-700">
            Confyde delivers AI Strategy, Agentic Workflows and Automation, Software Engineering, and Data and Security Services through a structured approach that combines senior technical expertise with clear governance and accountability.
          </p>

          {/*
            The artboard's `href="#"`. Ships inert per RULINGS.md §01: the
            homepage is the only page in scope and the client declined wiring
            destinations, so this is a keyboard-reachable button that announces
            itself as disabled rather than a link to nowhere. Adding `href` is
            the whole switch when a contact route exists.
          */}
          <p className="m-0 text-[16px] text-slate-500">
            Still curious?{" "}
            <NavItem tone="light" className="text-pf-ink-700 underline">
              Get in touch
            </NavItem>
          </p>
        </Reveal>

        <Reveal
          anim="scale"
          duration={0.5}
          className="shadow-border-default overflow-hidden rounded-xl bg-pf-surface-50"
        >
          {FAQ.map((entry) => (
            /*
              The last item keeps its bottom hairline. The artboard draws it on
              all eleven and the card's `overflow-hidden` renders it as a rule
              across the foot of the card, so it is in the reference frame.
            */
            <details
              key={entry.question}
              name={GROUP}
              className="faq-item group border-b border-pf-ink-200 px-6"
            >
              <summary className={SUMMARY}>
                <span className={QUESTION}>{entry.question}</span>
                {/* Two glyphs swapped by the `open` attribute, matching the
                    artboard's own display toggle. Lucide only, per the brand. */}
                <Plus size={16} strokeWidth={2} aria-hidden="true" className={`${ICON} group-open:hidden`} />
                <Minus size={16} strokeWidth={2} aria-hidden="true" className={`${ICON} hidden group-open:block`} />
              </summary>
              <p className="m-0 pb-5 text-[14px] leading-[1.6] text-pf-ink-700">
                <AnswerText blocks={entry.answer} />
              </p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
