import { ArrowRight } from "lucide-react";

import { HeroCategoriesMobile } from "./hero-categories";
import Image from "next/image";

import { NavFlipSentinel } from "@/components/chrome/nav-flip-sentinel";
import { NavItem } from "@/components/chrome/nav-item";

/* Four stops like the desktop scrim but not the same four: 92/76/34 at
   0/34/72/96 against desktop's 88/74/34 at 0/32/66/92. The mobile copy block is
   taller relative to its stage and sits lower in it, so the dark end has to
   start higher and reach further. The two are not shared for that reason.

   Neutral #171A1B, matching desktop: this washes a photograph, so it is not
   tinted with the brand colour. See the note on the desktop SCRIM. */
const SCRIM =
  "absolute inset-0 bg-[linear-gradient(to_top,rgb(23_26_27/0.92)_0%,rgb(23_26_27/0.76)_34%,rgb(23_26_27/0.34)_72%,transparent_96%)]";

const CTA = "flex h-[52px] items-center justify-center gap-2.5 rounded-xl text-[16.5px] font-bold";

/**
 * The mobile hero, <1024px.
 *
 * A different composition from the desktop hero rather than a reflow of it:
 * different photograph, different body copy, a different second CTA, no float
 * cards, no stat strip, no vignette and no reveals. The two swap wholesale at
 * 1024px with nothing in between.
 *
 * The artboard is a fixed 430px column with no media queries of its own.
 * Everything that has to behave across 320-1023px - the column cap, the side
 * padding step, the headline clamp and the photograph's framing - is a designer
 * decision recorded in docs/specs/02-hero.md §7, commented at each site below.
 */
export function HeroMobile() {
  return (
    <section data-section="hero-mobile" className="relative overflow-hidden pb-5 desk:hidden">
      {/*
        The stage runs up behind the sticky nav so the photograph starts at the
        very top of the screen: the negative margin cancels the nav's height and
        the top padding puts it back, plus 40px of air. Both are expressed
        against one value, because the nav's 64px is the thing that moves - it is
        12px + a 40px control row + 12px in components/chrome/site-header-mobile.

        `min-height` takes the artboard's 620px as a floor and grows with a tall
        tablet so the photograph keeps its proportions.
      */}
      <div className="relative [--nav-h:64px] mt-[calc(-1*var(--nav-h))] min-h-[max(620px,78svh)] bg-forest-900 px-5 pt-[calc(var(--nav-h)+40px)] pb-5 sm:px-8">
        {/*
          The photograph starts 56px down rather than at the top, leaving an 8px
          strip where the 64px nav's translucent surface sits over flat
          forest-900 instead of over the image. That seam is in the artboard's
          own render and ships as drawn (RULINGS.md §02 ruling 11).

          It is wrapped rather than offset directly because `fill` sets its own
          inset: 0 inline, which a class cannot override.
        */}
        <span aria-hidden="true" className="absolute inset-x-0 top-14 bottom-0 block">
          <Image
            src="/images/hero-mobile-shower.webp"
            alt=""
            fill
            /* The mobile LCP element. `priority` is deprecated in Next 16, so
               its two effects are set directly. */
            loading="eager"
            fetchPriority="high"
            quality={90}
            /* Both heroes are in the DOM at every width; the inactive one is
               told it renders at 1px so the browser fetches the smallest
               candidate for it rather than a full-width plate. */
            sizes="(min-width: 1024px) 1px, 100vw"
            /* 58% keeps the subject clear of the copy block in a narrow frame.
               In a wider one that same offset pushes her off-centre, so it
               returns to the middle once there is room. */
            className="object-cover [object-position:58%_0%] sm:[object-position:50%_0%]"
          />
        </span>
        <span aria-hidden="true" className={SCRIM} />

        {/*
          Bottom-aligned inside a 512px floor, so the copy always sits on the
          darkest part of the scrim. Above 560px it centres rather than
          stretching - a 15.5px paragraph running the full width of a tablet is
          ~140 characters a line.
        */}
        <div className="relative mx-auto flex min-h-[512px] w-full max-w-[560px] flex-col justify-end">
          {/*
            `.display` alone, without `.display-1`: its default axes ARE the
            mobile cut - wght 600, SOFT 60, opsz 40 - where the desktop headline
            takes the class's >=1024px override of wght 420, SOFT 100, opsz 10.
            Heavier, less soft and at a much larger optical size, because at 38px
            it is competing with a photograph rather than dominating one. The
            1.06 line height is part of the same decision.

            The clamp lands on exactly 38px at the artboard's 430px and holds
            there; it only gives way below ~340px.

            Second sentence in lime: the same knowing exception the desktop
            headline carries (RULINGS.md §02 ruling 1), as one span rather than
            per-word, because mobile has no reveals.
          */}
          <h1 className="display mt-3 text-[clamp(30px,8.84vw,38px)] leading-[1.06] tracking-[-0.01em] text-white [text-shadow:0_2px_18px_rgb(0_0_0/0.45)]">
            {"Clear technical direction "}
            <span className="text-lime-500">for scaling businesses.</span>
          </h1>

          {/* Not the desktop paragraph re-cut - a different, shorter piece of
              copy. It is the same string as the site's metadata.description. */}
          <p className="mt-4 text-[15.5px] leading-[1.55] text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]">
            Confyde is a technical consultancy for businesses that need expertise in AI, software
            engineering, and strategy. We help plan where AI fits, build agents and automations that
            take on real work, fix the software behind them, and connect your data so your people
            and customers get better answers.
          </p>

          {/* One action, full width - the primary thing to do on a phone. */}
          <NavItem
            tone="dark"
            className={`btn-lime ${CTA} mt-[22px] bg-lime-500 text-white shadow-[0_8px_20px_-10px_rgb(51_56_58/0.5)]`}
          >
            Book a discovery call
            <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" focusable="false" />
          </NavItem>

          <HeroCategoriesMobile />
        </div>

        {/* The mobile nav's flip observes this. It goes on the dark stage, not
            on the <section>, whose 20px of beige bottom padding is what made the
            artboard's own flip 20px late. */}
        <NavFlipSentinel />
      </div>
    </section>
  );
}
