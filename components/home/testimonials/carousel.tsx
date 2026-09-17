"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { type KeyboardEvent, type ReactNode, useCallback, useEffect, useId, useRef } from "react";

import { Reveal } from "@/components/primitives/reveal";

import { type CardGeometry, cardPitch, cardVars } from "./geometry";

/* The drift's two endpoints. The artboard travels 160px left from a +40px
   start, which takes the track 120px PAST its lead-in and clips the first card's
   left corners flat against the section's overflow - the cards read as "some
   rounded, some square" depending where you have scrolled to.
   Travelling 40px instead means the drift settles exactly onto the content rail
   rather than through it: the first card starts 40px right of the rail and lands
   on it, and no card is ever clipped. */
const DRIFT_FROM = 40;
const DRIFT_TRAVEL = 40;

/* Forest on a light surface, per docs/brand.md - the artboard draws no focus
   style anywhere. */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700";

/* 40px square, 12px radius, white, on the strong overlay shadow. The hover tint
   is the artboard's; the 150ms is docs/brand.md's colour transition, which the
   artboard omits here although its otherwise-identical `.pf-optcard` has it. */
const ARROW =
  "flex size-10 cursor-pointer items-center justify-center rounded-xl border-0 bg-card " +
  "text-pf-ink-700 shadow-border-strong transition-colors duration-150 hover:bg-pf-overlay-50 " +
  FOCUS_RING;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type TestimonialScrollerProps = {
  /** Names the scroll region, which is focusable and therefore needs one. */
  label: string;
  geometry: CardGeometry;
  /** The prev/next pair below the strip. Desktop only, as drawn. */
  arrows?: boolean;
  /** Scroll-linked horizontal drift on the track. Desktop only, as drawn. */
  drift?: boolean;
  viewportClassName?: string;
  scrollerClassName?: string;
  scrollerStyle?: React.CSSProperties;
  trackClassName?: string;
  /** The cards. Server-rendered and passed through - see the note below. */
  children: ReactNode;
};

/**
 * The interactive shell around the testimonial cards.
 *
 * THE CLIENT BOUNDARY. This is the only file in the section that ships to the
 * browser. The cards themselves are Server Components handed in as `children`,
 * the way `app/page.tsx` hands the marquee to the hero - so six quotes, six
 * attributions and thirty blurred blobs stay out of the bundle and out of
 * hydration, and this leaf only ever owns two refs and three event listeners.
 *
 * THE ARROW STEP. The artboard scrolls `480 + 24` per click against a 404px
 * card pitch, so every click overshoots by 100px and mandatory snap yanks it
 * back. Ruled a defect. The step is `cardPitch()` - one snap point - and it is
 * derived from the same numbers the cards are sized from, so the two cannot
 * drift apart again. See geometry.ts.
 *
 * THE DRIFT. The artboard re-applies `translateX` to `#pf-testi-track` on every
 * scroll tick, and that element IS the horizontal scroll container: the
 * decoration and the user are writing to the same box, so a drag mid-section
 * gets pulled sideways under the finger. Ruled a defect, and fixed twice over:
 *
 *   1. The transform moves to an inner track INSIDE the scroll container. A
 *      transform is not layout, so it cannot touch `scrollLeft`, `scrollWidth`
 *      or where a drag lands - the decoration and the scroll position stop
 *      sharing a channel at all.
 *   2. It yields. The first scroll of the container - a drag, a trackpad
 *      swipe, an arrow click, an arrow key - retires the window listener for
 *      good and eases the track back to its resting frame. Once someone is
 *      driving, nothing is animating behind them.
 *
 * Under `prefers-reduced-motion: reduce` the listener is never attached and
 * styles/motion/testimonials.css pins the transform off regardless, so a
 * preference flipped mid-session still lands on the resting frame.
 */
export function TestimonialScroller({
  label,
  geometry,
  arrows = false,
  drift = false,
  viewportClassName,
  scrollerClassName,
  scrollerStyle,
  trackClassName,
  children,
}: TestimonialScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollerId = useId();

  const pitch = cardPitch(geometry);

  const page = useCallback(
    (direction: -1 | 1) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      scroller.scrollBy({
        left: direction * pitch,
        /* Reduced motion means no smooth scrolling either - the jump is the
           resting behaviour, not a degraded one. */
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    },
    [pitch],
  );

  /*
    Arrow keys, Home and End, handled rather than left to the browser.

    A `scroll-snap-type: x mandatory` container does not page with the keyboard
    on its own: the browser's arrow-key step is ~40px, snap immediately drags
    that back to the nearest snap point, and the strip reads as frozen. Stepping
    by a full pitch lands exactly on the next snap point, so the keyboard gets
    the same movement the buttons do.

    Only these four keys are claimed. Tab and Shift+Tab are untouched, so focus
    enters the region and leaves it again normally - no trap.
  */
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";

    switch (event.key) {
      case "ArrowRight":
        page(1);
        break;
      case "ArrowLeft":
        page(-1);
        break;
      case "Home":
        scroller.scrollTo({ left: 0, behavior });
        break;
      case "End":
        scroller.scrollTo({ left: scroller.scrollWidth, behavior });
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  useEffect(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!drift || !scroller || !track || prefersReducedMotion()) return;

    /* The drift is measured against the whole band - heading, strip and arrows -
       because that is the box the artboard measures, and it is what makes the
       travel finish as the section leaves rather than as the strip does. Found
       through the section's own hook rather than passed in, so the `<section>`
       stays a Server Component. */
    const section = scroller.closest<HTMLElement>("[data-section]");
    if (!section) return;

    let frame = 0;

    const read = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const rect = section.getBoundingClientRect();
      const progress = Math.min(Math.max((viewport - rect.top) / (viewport + rect.height), 0), 1);
      track.style.setProperty(
        "--testi-drift",
        `${(DRIFT_FROM - DRIFT_TRAVEL * progress).toFixed(1)}px`,
      );
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    /* The yield. One-way and permanent for the life of the mount: a decoration
       that resumed the moment you stopped touching it would be the same fight
       with a delay in it. `data-drift` is what gives the return trip its
       easing - see styles/motion/testimonials.css. */
    const release = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      track.dataset.drift = "yielded";
      track.style.setProperty("--testi-drift", "0px");
    };

    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    scroller.addEventListener("scroll", release, { passive: true, once: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      scroller.removeEventListener("scroll", release);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [drift]);

  return (
    <>
      <div className={viewportClassName}>
        {/*
          `tabIndex={0}` plus a name: a scroll container with no focusable
          content is unreachable by keyboard, which is a WCAG 2.1.1 failure on
          its own and is why the artboard's strip could only be dragged.
        */}
        <div
          ref={scrollerRef}
          id={scrollerId}
          tabIndex={0}
          role="group"
          aria-label={label}
          onKeyDown={onKeyDown}
          style={{ ...cardVars(geometry), ...scrollerStyle }}
          className={`no-scrollbar snap-x snap-mandatory overflow-x-auto ${FOCUS_RING} ${scrollerClassName ?? ""}`}
        >
          <div ref={trackRef} className={`testi-drift flex w-max ${trackClassName ?? ""}`}>
            {children}
          </div>
        </div>
      </div>

      {arrows ? (
        <Reveal
          anim="up-blur"
          delay={0.2}
          duration={0.4}
          className="mt-8 flex justify-center gap-2"
        >
          {/* The artboard's own names. `aria-controls` is an addition: the
              buttons sit outside the region they drive, so without it the
              relationship is only visual. */}
          <button
            type="button"
            aria-label="Previous"
            aria-controls={scrollerId}
            className={ARROW}
            onClick={() => page(-1)}
          >
            {/* The artboard inlines `m15 18-6-6 6-6`, which is Lucide
                `ChevronLeft` - no icon substitution to make. */}
            <ChevronLeft size={16} strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Next"
            aria-controls={scrollerId}
            className={ARROW}
            onClick={() => page(1)}
          >
            <ChevronRight size={16} strokeWidth={2} />
          </button>
        </Reveal>
      ) : null}
    </>
  );
}
