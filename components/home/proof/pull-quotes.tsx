import { PULL_QUOTES } from "@/content/proof";

import { PullQuote } from "./pull-quote";

/**
 * The two mid-page pull quotes.
 *
 * Two `<section>`s rather than one with two children, as both artboards draw
 * them: they are separate bands with separate bottom spacing, and the second
 * one carries the air that closes the pair. A single section with a gap would
 * render the same thing but would say the two quotes are one unit, which the
 * spacing itself denies.
 *
 * TYPE FAMILIES. The quotations and the attributions are set in the product
 * faces - `--font-ui-serif` and `--font-ui`, i.e. Source Serif 4 and Hanken
 * Grotesk - at both breakpoints. The desktop artboard already does this; the
 * mobile artboard sets the same content in Fraunces and Nunito. That is the
 * §03/04 ruling-3 mismatch again, and the client has since answered it once,
 * in the social-proof band: the desktop artboard is authoritative and the
 * product faces are intended. Following their answer rather than re-asking the
 * same question keeps this band consistent with
 * `components/home/social-proof/`, which shipped on that decision.
 *
 * [LOG] It is a real deviation from the mobile artboard all the same, so the
 * geometry harness will measure a little vertical drift here at 390 and 768 -
 * the same cost the body-face unification already carries (RULINGS.md, "Body
 * face: Nunito vs Nunito Sans"). One-line reversal per call site if the tech
 * lead disagrees.
 */
export function PullQuotes() {
  return (
    <>
      {PULL_QUOTES.map((quote, index) => (
        /*
          Below 1024 the band sits in the page's mobile column: the 560px
          content cap plus its gutters, 16px stepping to 32px at 640px - the
          same pair the social-proof and customer-stories bands use, so all
          four left edges line up. At desk it is the page's 1280px container
          with 24px gutters.

          `sm-only:` and not `sm:`: this element sets `max-w` and `px` at both
          the 640 and the 1024 breakpoint, and Tailwind emits the `desk` block
          first, so a plain `sm:` would win at 1440px.

          The first quote carries only enough air to separate it from the
          second; the second closes the pair. Both artboards draw that
          asymmetry, at their own two scales.
        */
        <section
          key={quote.id}
          data-section={`pull-quote-${quote.id}`}
          className={
            "mx-auto w-full max-w-[592px] px-4 sm-only:max-w-[624px] sm-only:px-8 desk:max-w-[1280px] desk:px-6 " +
            (index === 0 ? "pb-3 desk:pb-4" : "pb-[34px] desk:pb-24")
          }
        >
          <PullQuote quote={quote} />
        </section>
      ))}
    </>
  );
}
