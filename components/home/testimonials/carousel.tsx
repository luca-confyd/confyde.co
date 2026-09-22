"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
} from "react";

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
  /**
   * Wraps the strip end to end, so paging never runs out of cards. See the
   * note on the mechanism below - it renders a second, hidden copy of
   * `children`, so only pass it where that copy is worth the markup.
   */
  loop?: boolean;
  /**
   * px to open the scroller at, so the strip starts part-way in rather than
   * with a card flush to the left edge. See the note on the effect below -
   * this one write must not be mistaken for the reader taking over.
   */
  initialOffset?: number;
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
 * THE LOOP. With `loop`, the strip has no ends: the last card is followed by
 * the first one and paging back from the first lands on the last. It is done
 * with a hidden second copy of the cards and a rebase by exactly one lap -
 * see `lap`, `page` and the effect that catches drags - rather than with a
 * transform or an index, so the container stays a native snap scroller and the
 * drag, the trackpad, the arrows and the arrow keys all keep working the way
 * they already did.
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
  loop = false,
  initialOffset,
  viewportClassName,
  scrollerClassName,
  scrollerStyle,
  trackClassName,
  children,
}: TestimonialScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollerId = useId();
  /* Raised while the opening offset is being applied, and lowered a frame
     later. The drift yields on the container's first scroll, and without this
     the opening write IS that first scroll - the drift would retire before
     anyone had touched anything. */
  const openingRef = useRef(false);
  /* The hidden second copy of the strip. Measured rather than counted, because
     this component never sees how many cards it was handed. */
  const cloneRef = useRef<HTMLDivElement>(null);

  const pitch = cardPitch(geometry);

  /*
    One lap: the distance after which the strip repeats itself, which is the
    clone's own width plus the gap in front of it - `n * (card + gap)`, an exact
    multiple of the pitch and therefore of the snap interval. Rebasing by it
    lands on an identical snap point in front of identical pixels, which is what
    makes the wrap invisible.

    Read on demand rather than cached: it changes with a resize, and a stale lap
    would rebase onto the wrong card rather than fail visibly.
  */
  const lap = useCallback(() => {
    const clone = cloneRef.current;
    if (!loop || !clone) return 0;
    return clone.getBoundingClientRect().width + geometry.gap;
  }, [loop, geometry.gap]);

  const page = useCallback(
    (direction: -1 | 1) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      /*
        THE REBASE HAPPENS BEFORE THE SCROLL, NOT AFTER IT. If the step would
        carry us out of the first lap, we jump a whole lap in the opposite
        direction first - instantly, onto identical pixels - and only then
        animate the one pitch. So the smooth scroll always lands inside the
        first lap and there is never a jump at the end of a movement, which is
        the thing that makes a looping carousel look broken.

        It also means scrollLeft only leaves the first lap when the reader
        drags it there, which is what lets the scroll listener below tell a
        drag apart from our own animation without a flag.
      */
      const oneLap = lap();
      if (oneLap > 0) {
        const target = scroller.scrollLeft + direction * pitch;
        if (target >= oneLap) scroller.scrollLeft -= oneLap;
        else if (target < 0) scroller.scrollLeft += oneLap;
      }

      scroller.scrollBy({
        left: direction * pitch,
        /* Reduced motion means no smooth scrolling either - the jump is the
           resting behaviour, not a degraded one. */
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    },
    [pitch, lap],
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
        /* With a loop on, `scrollWidth` is the far end of the CLONE, which the
           rebase below would immediately return to the start - End would read
           as Home. The last real card is one pitch short of a lap. */
        scroller.scrollTo({ left: lap() > 0 ? lap() - pitch : scroller.scrollWidth, behavior });
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  /*
    The opening offset.

    `useLayoutEffect` rather than `useEffect` so it lands before the browser
    paints - otherwise the strip is visibly at 0 for a frame and jumps. It is
    also why this runs before the drift effect below attaches its listener.

    `behavior: "instant"` because this is a starting position, not a movement:
    a smooth scroll here would animate the strip sideways on load, which is
    both a motion nobody asked for and a second writer fighting the drift.
  */
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !initialOffset) return;
    openingRef.current = true;
    scroller.scrollTo({ left: initialOffset, behavior: "instant" });
    /* Two frames, not one: the scroll event from the write above is dispatched
       asynchronously, so the flag has to outlive the frame that set it. */
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        openingRef.current = false;
      }),
    );
    return () => cancelAnimationFrame(frame);
  }, [initialOffset]);

  /*
    The wrap for everything we do not drive: a drag, a trackpad swipe, a
    momentum fling. Those can only run the strip FORWARD out of the first lap -
    a native scroll container has no negative scrollLeft - so one test is
    enough, and the backward direction is covered by the arrows and the arrow
    keys, which rebase before they move (see `page`).

    Rebasing mid-scroll rather than on `scrollend` is deliberate: it keeps a
    full lap of runway in front of the reader at all times, so a long fling
    never hits the end of the track. It is invisible because a lap is an exact
    repeat - the same cards sit at the new offset - and it cannot fight our own
    animations, because those never leave the first lap.
  */
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!loop || !scroller) return;

    const rebase = () => {
      const oneLap = lap();
      /* `oneLap > 0` also guards the frame before layout, where the clone has
         no width yet and rebasing would mean scrolling to 0. */
      if (oneLap > 0 && scroller.scrollLeft >= oneLap) scroller.scrollLeft -= oneLap;
    };

    scroller.addEventListener("scroll", rebase, { passive: true });
    return () => scroller.removeEventListener("scroll", rebase);
  }, [loop, lap]);

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
      /* The opening write is not the reader arriving. */
      if (openingRef.current) return;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      track.dataset.drift = "yielded";
      track.style.setProperty("--testi-drift", "0px");
      scroller.removeEventListener("scroll", release);
    };

    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    /* Not `once`: `release` can now decline to act (the opening write), and a
       one-shot listener would be spent on that call and never fire again. It
       removes itself below instead. */
    scroller.addEventListener("scroll", release, { passive: true });

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
            {/*
              THE SECOND LAP. The cards again, so there is always something
              past the last one to scroll onto; `page` and the effect above
              hand the reader back to the first lap once they are inside this
              one. Rendering `children` twice costs nothing beyond the markup -
              they are the same Server Component output, already built.

              `aria-hidden` and `inert` because it is the same six quotes: a
              screen reader would otherwise read the section twice, and `inert`
              keeps the copy out of find-in-page and out of the tab order
              should a card ever grow a link.
            */}
            {loop ? (
              <div
                aria-hidden="true"
                inert
                ref={cloneRef}
                className={`flex ${trackClassName ?? ""}`}
              >
                {children}
              </div>
            ) : null}
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
