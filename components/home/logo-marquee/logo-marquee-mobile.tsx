import { MARQUEE_LABEL, MARQUEE_TERMS } from "./terms";

/* 8%/92%, not desktop's 10%/90% - on a 430px column that is a ~34px fade per
   edge against desktop's up to 144px. The mobile artboard declares only the
   unprefixed property; `-webkit-mask-image` is added here for the same reason
   the mobile bottom bar got `-webkit-backdrop-filter` (RULINGS.md §01 ruling 6)
   - older iOS Safari would otherwise show a hard clip. */
const MASK =
  "[-webkit-mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] " +
  "[mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700";

/**
 * The mobile capability marquee, <1024px.
 *
 * A different composition from the desktop strip rather than a reflow of it:
 * different heading copy, 19px instead of 30px, a 28px rhythm instead of 80px,
 * 26s instead of 60s and a softer mask. The term LIST is no longer one of the
 * differences - both breakpoints run the same fourteen now.
 * The two swap wholesale at 1024px with nothing in between.
 *
 * Size, gap and duration are all pinned across 320-1023px on purpose: the
 * track's width is then fixed, so a fixed duration means a fixed px/s at every
 * width in the range. Scaling any one of them would make the strip read faster
 * on a tablet than on a phone (docs/specs/03-logo-marquee.md §4).
 */
export function LogoMarqueeMobile() {
  return (
    <section
      data-section="marquee-mobile"
      className="marquee pt-[26px] pb-[30px] [--marquee-duration:26s] desk:hidden"
    >
      {/*
        `<h2>`, not the artboard's `<h4>` - the mobile outline runs h1 -> h4 ->
        h2 into the social-proof heading below, so the tag is wrong in both
        directions. `.marquee-heading-mobile` holds the exact .m-h3 cut, so the
        size is unchanged (RULINGS.md §03/04 ruling 8).

        The strip itself is full-bleed at every width; only the heading is
        inset. 600px = the 560px content measure plus the hero's own 20px
        gutters, which is what puts this heading's left edge on the hero copy's
        left edge at every width above the artboard's 430px.
      */}
      <h2 className="marquee-heading-mobile mx-auto mb-[14px] max-w-[600px] px-5 text-center text-[17px] text-ink sm:max-w-[624px] sm:px-8">
        Expert guidance to modernise, secure and connect your business
      </h2>

      {/*
        `overflow-x: auto` is the artboard's own second affordance: the strip can
        be dragged. Dragging does not stop the animation, so it is not a pause
        mechanism - but a scroll container with no focusable content is a WCAG
        2.1.1 failure on its own, and `tabindex="0"` plus a name fixes that and
        makes the strip keyboard-pausable in the same move.
      */}
      <div
        tabIndex={0}
        role="group"
        aria-label={MARQUEE_LABEL}
        className={`no-scrollbar overflow-x-auto ${MASK} ${FOCUS_RING}`}
      >
        <div className="marquee-track flex w-max gap-0">
          <MarqueeCopy />
          {/*
            The mobile artboard leaves this duplicate exposed, so a screen
            reader announces all seven terms twice; desktop's already carries
            `aria-hidden`. Fixed here to match (RULINGS.md §03/04 ruling 6).
          */}
          <MarqueeCopy aria-hidden />
        </div>
      </div>
    </section>
  );
}

function MarqueeCopy({ "aria-hidden": ariaHidden }: { "aria-hidden"?: true }) {
  return (
    /* gap-7 / pr-7 = the artboard's 28px, as the trailing-padding form that
       closes the loop. See styles/motion/marquee.css. */
    <span aria-hidden={ariaHidden} className="flex shrink-0 items-center gap-7 pr-7">
      {MARQUEE_TERMS.map((term) => (
        <span key={term} className="marquee-term-mobile text-marquee-term-mobile">
          {term}
        </span>
      ))}
    </span>
  );
}
