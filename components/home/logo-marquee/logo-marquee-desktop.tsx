import { MARQUEE_LABEL, MARQUEE_TERMS_DESKTOP } from "./terms";

/* The edge fade, 10% in from each side. Both the prefixed and unprefixed
   properties, as the artboard declares them - older iOS Safari only knows the
   prefixed one, and this is the element that would otherwise hard-clip.

   It sits on the clipper, which is 100% of the 1440px band, so each fade is up
   to 144px - far softer than mobile's 8%/92% on a phone column. */
const MASK =
  "[-webkit-mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)] " +
  "[mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]";

/* Forest on a light surface, per docs/brand.md - neither artboard defines a
   focus style anywhere. The ring's outermost 10% of each end falls under the
   mask gradient above, because the focusable element is by necessity the masked
   one; the remaining 80% is at full opacity. */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700";

/**
 * The desktop trades marquee, >=1024px.
 *
 * [DEVIATION - docs/specs/03-logo-marquee.md §1.] In the artboard this section
 * is the second and last child of the hero's `shadow-border-strong` card, so
 * the card's bottom hairline runs BELOW the strip. This build composes it as a
 * sibling in app/page.tsx instead, because components/home/hero/ is out of
 * scope for this change, and carries `bg-pf-surface-500` itself so the surface
 * tone still matches. The visible consequence is that the card's hairline and
 * shadow land above the strip rather than below it. Moving the element inside
 * `<section className="shadow-border-strong ...">` in hero-desktop.tsx is the
 * whole fix and this component needs no change to make it.
 */
export function LogoMarqueeDesktop() {
  return (
    <div data-section="marquee-desktop" className="hidden w-full bg-pf-surface-500 desk:block">
      {/*
        `.marquee` is the pause scope. The artboard puts its `.pf-marquee` class
        on both this section and the clipper and writes the rule as
        `.pf-marquee:hover .pf-marquee-track`, so hovering anywhere in the
        band - heading and padding included - pauses the strip. That is the
        rendered behaviour and it ships as drawn.

        The artboard also sets `overflow: hidden` here. It is inert: the clipper
        below does the clipping, so this one produces no pixels and is dropped
        (RULINGS.md principle 1's corollary).

        1440px, deliberately wider than the 1280px content container every other
        band uses - the strip is meant to run past the page's measure.
      */}
      <section className="marquee mx-auto flex w-full max-w-[1440px] flex-col items-center gap-5 pt-8 pb-6 [--marquee-duration:60s]">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-4">
          {/*
            `<h2>`, not the artboard's `<h4>`. The artboard skips straight from
            the hero's `<h1>` to `<h4>` here, which is a WCAG 1.3.1 failure and
            an artefact of a visual tool: the class does the visual work and the
            tag does none of it. `.display-4` keeps the size identical, so the
            fix is semantics-only (RULINGS.md §03/04 ruling 8).

            `.display` at >=1024 already computes to .pf-h4's exact axes -
            wght 420, SOFT 100, WONK 0, opsz 10 - so no override is needed.
          */}
          <h2 className="display display-4 text-center text-pf-ink-900">
            Engineering leadership for ambitious businesses. Plan it, build it, keep it running.
          </h2>
        </div>

        {/*
          The clipper. `tabindex="0"` plus an accessible name is what makes the
          strip pausable without a mouse; see styles/motion/marquee.css for why
          there is no visible pause control.
        */}
        <div
          tabIndex={0}
          role="group"
          aria-label={MARQUEE_LABEL}
          className={`relative w-full overflow-hidden ${MASK} ${FOCUS_RING}`}
        >
          {/* `gap-0` on the track and `pr-20` on each copy, not `gap-20` here:
              that is what closes the loop. See styles/motion/marquee.css. */}
          <div className="marquee-track flex w-max gap-0 will-change-transform">
            <MarqueeCopy />
            {/*
              The duplicate is what the -50% translation reads as "the same
              frame again", so it must stay byte-identical to the copy above -
              not reordered, not shortened, not de-duplicated. It contributes
              nothing to the accessibility tree, so each term is announced once.
            */}
            <MarqueeCopy aria-hidden />
          </div>
        </div>
      </section>
    </div>
  );
}

function MarqueeCopy({ "aria-hidden": ariaHidden }: { "aria-hidden"?: true }) {
  return (
    <div
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-20 pr-20"
    >
      {MARQUEE_TERMS_DESKTOP.map((term) => (
        <span key={term} className="marquee-term text-marquee-term">
          {term}
        </span>
      ))}
    </div>
  );
}
