import { ArrowRight } from "lucide-react";

import { HeroCategoriesMobile } from "./hero-categories";

import { NavFlipSentinel } from "@/components/chrome/nav-flip-sentinel";
import { NavItem } from "@/components/chrome/nav-item";

/* The mobile scrim is gone, and so is the photograph it was cut for. It ran
   92/76/34 against the desktop scrim's 88/74/34 because the mobile copy block
   sat lower in a taller frame and the dark end had to reach further up. With a
   flat surface there is no gradient of brightness left to chase, and the two
   heroes share one background for the first time - see styles/grid-surface.css.

   The 56px seam goes with it. The photograph started below the nav rather than
   at the top of the stage, leaving a strip where the translucent nav sat over
   flat colour instead of over the image; that shipped as drawn under RULINGS.md
   §02 ruling 11. The grid has no such offset - it fills the stage - so the seam
   the ruling covered no longer exists to be ruled on. */

const CTA = "flex h-[52px] items-center justify-center gap-2.5 rounded-xl text-[16.5px] font-bold";

/**
 * The mobile hero, <1024px.
 *
 * A different composition from the desktop hero rather than a reflow of it:
 * different body copy, a different second CTA, no float cards, no stat strip and
 * no reveals. The two swap wholesale at 1024px with nothing in between. The
 * BACKGROUND is the one thing they now share; it used to be the clearest
 * difference between them.
 *
 * The artboard is a fixed 430px column with no media queries of its own.
 * Everything that has to behave across 320-1023px - the column cap, the side
 * padding step and the headline clamp - is a designer decision recorded in
 * docs/specs/02-hero.md §7, commented at each site below. The fourth, the
 * photograph's framing, went with the photograph.
 */
export function HeroMobile() {
  return (
    <section data-section="hero-mobile" className="relative overflow-hidden pb-5 desk:hidden">
      {/*
        The stage runs up behind the sticky nav so the background starts at the
        very top of the screen: the negative margin cancels the nav's height and
        the top padding puts it back, plus 40px of air. Both are expressed
        against one value, because the nav's 64px is the thing that moves - it is
        12px + a 40px control row + 12px in components/chrome/site-header-mobile.

        This is also where the grid's glow is thrown from, so running the stage
        up behind the nav is what puts the nav capsule in the brightest part of
        it rather than on a hard top edge.

        `min-height` takes the artboard's 620px as a floor and grows with a tall
        tablet. It kept the photograph's proportions before; now it is simply how
        much grid the hero is worth on a short screen.
      */}
      <div className="grid-surface relative [--nav-h:64px] mt-[calc(-1*var(--nav-h))] min-h-[max(620px,78svh)] px-5 pt-[calc(var(--nav-h)+40px)] pb-5 sm:px-8">
        {/*
          Bottom-aligned inside a 512px floor. That used to be about sitting on
          the darkest part of the scrim; with a flat surface it is about sitting
          clear of the glow at the top, which is the only part of the background
          with any brightness left in it. Above 560px it centres rather than
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

            Second sentence in petrol: the same knowing exception the desktop
            headline carries (RULINGS.md §02 ruling 1), as one span rather than
            per-word, because mobile has no reveals. forest-500 rather than the
            lime-500 it was, for the contrast reason set out on the desktop
            headline - the grid base is dark petrol, so the accent had to move a
            step up the ramp to stay legible on it.
          */}
          <h1 className="display mt-3 text-[clamp(30px,8.84vw,38px)] leading-[1.06] tracking-[-0.01em] text-white">
            {"Clear technical direction "}
            <span className="text-forest-500">for scaling businesses.</span>
          </h1>

          {/* Not the desktop paragraph re-cut - a different, shorter piece of
              copy. It is the same string as the site's metadata.description. */}
          <p className="mt-4 text-[15.5px] leading-[1.55] text-white">
            Confyde is a technical consultancy for businesses that need expertise in AI, software
            engineering, and strategy. We help plan where AI fits, build agents and automations that
            take on real work, maintain the software behind them, and connect your data so your people
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
