import Image from "next/image";

import type { ReactNode } from "react";

/**
 * The desktop chapter shell: a 520px photographic banner with the chapter
 * heading on it, and a panel that is pulled up into the banner's bottom third.
 *
 * All three chapters are this same recipe with four parameters swapped - the
 * photograph, its crop, the section's vertical padding and the heading's
 * measure - so it is built once here and chapters 2 and 3 consume it unchanged.
 *
 * THE OVERLAP, WHICH IS THE WHOLE TRICK. The panel wrapper is pulled 300px up
 * into the 520px banner and then pushes its own content back down with 240px of
 * top padding. The net effect is that the panel's visible top edge lands 60px
 * lower than it otherwise would, the banner's bottom 300px is covered, and that
 * 60px difference is the sliver of photograph still showing above the panel
 * card. Change one of the two numbers and you change the sliver; change both
 * and you move the whole panel. The banner's `overflow-visible` plus `z-20`
 * keep the heading painting above the wrapper, and the card's own `z-30` then
 * puts it above both.
 *
 * THE BANNER FRAME'S THREE NUMBERS. The photograph sits in a frame that is 130%
 * of the banner's height, pulled up 20% and then a further 70px, which crops it
 * to its upper third and puts the subject high behind the heading. They are not
 * interchangeable with an `object-position` - the frame is what the mask and
 * the scrim in `.banner-fade` are measured against.
 *
 * COLLAPSED ON THE WAY THROUGH. The artboard nests two identical 1280px boxes
 * here and puts `border-radius: 8px; overflow: hidden` on a section nothing
 * reaches the corners of. One element, no radius, no clip - the rendered result
 * is identical (RULINGS.md §02 ruling 3).
 *
 * HEADING LEVEL. `<h2>`, not the artboard's `<h1>`. Three chapters plus the
 * hero would otherwise give the page four `<h1>`s and then jump straight to
 * `<h3>` for the panel sub-heads. Type size and heading level are independent,
 * which is what `.display-*` is for, so the rendered pixels are unchanged
 * (RULINGS.md §03/04 ruling 8).
 */
export type ChapterShellProps = {
  /** Identifies the band to the comparison harness. e.g. `"chapter-1-desktop"`. */
  dataSection: string;
  /** The banner photograph. Ch1 photo-2, ch2 photo-3, ch3 photo-1. */
  image: string;
  /** The photograph's crop. Ch1 `"center 40%"`, ch2 `"center 45%"`, ch3 `"center 30%"`. */
  objectPosition: string;
  /**
   * The `<section>`'s own vertical padding, as Tailwind classes. Ch1 `"pt-8"`,
   * ch2 `"py-24"`, ch3 `"pb-24"`. Horizontal padding is always zero - the
   * banner and the panel run to the 1280px rail.
   */
  sectionClassName?: string;
  /** The heading's measure in px. 760 for chapter 1, 820 for chapters 2 and 3. */
  headingMaxWidth: number;
  /**
   * The chapter heading's content, without its element. A node rather than a
   * string because chapter 1 breaks its heading across two lines with a hard
   * `<br>` where chapters 2 and 3 are single sentences.
   */
  heading: ReactNode;
  /** The panel's contents. Laid out by the chapter, not by the shell. */
  children: ReactNode;
};

export function ChapterShell({
  dataSection,
  image,
  objectPosition,
  sectionClassName = "",
  headingMaxWidth,
  heading,
  children,
}: ChapterShellProps) {
  return (
    <section
      data-section={dataSection}
      /* The breakpoint gate lives here rather than at the call site: this
         shell IS the >=1024px composition, so a chapter that had to remember
         to hide it would be one keystroke from shipping two chapters at once.
         `display: none` below the breakpoint also keeps the whole banner out
         of layout and out of the accessibility tree. */
      /* px-6 here, not just on the panel below, so the BANNER sits on the
         same 1232px rail as every other band. Without it the banner ran the
         full 1280 while the cards in neighbouring sections stopped at 1232, and
         the chapter read as wider than everything around it. The panel keeps
         its own px-6, which is the gutter the blurred mirror fills. */
      className={`mx-auto hidden w-full max-w-[1280px] px-6 desk:block ${sectionClassName}`}
    >
      <div className="relative z-20 h-[520px] overflow-visible pt-14 pl-14">
        {/*
          `.banner-fade` is two independent things and they are easily confused.
          The MASK dissolves the photograph itself from 50% of the banner's
          height down to nothing at 99%. The `::after` SCRIM is a four-stop
          forest veil that darkens the photograph so the cream heading can sit
          on it - and because the mask applies to this box's own painting, which
          includes `::after`, the veil fades out with the photograph rather than
          drawing a hard edge where the panel begins.
        */}
        <div className="banner-fade absolute inset-0 overflow-hidden rounded-t-xl">
          <div className="absolute inset-x-0 -top-[20%] h-[130%] -translate-y-[70px]">
            <Image
              src={image}
              /* Decorative: the chapter heading is set over it and says what
                 the band is about. */
              alt=""
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              style={{ objectPosition }}
              className="object-cover"
            />
          </div>
        </div>

        <h2
          className="display display-1 relative z-10 text-pf-ink-100"
          style={{ maxWidth: `${headingMaxWidth}px` }}
        >
          {heading}
        </h2>
      </div>

      <div className="relative -mt-[300px] overflow-hidden rounded-b-xl px-6 pt-[240px] pb-12">
        {/*
          A blurred, vertically flipped mirror of the same photograph filling the
          gutter around the panel card, so the bottom of the banner reads as a
          reflection into the top of the gutter rather than as a repeat of the
          same crop. Same `src` as the banner, so the browser serves it from
          cache and this is not a second network request.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
        >
          <div className="absolute inset-x-0 -top-[25%] h-[150%] -scale-y-100 blur-[40px]">
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/*
          `.grid-panel` is the same drafting grid the hero, the footer and the
          day-to-day operations panel wear, in the light colourway: ink
          hairlines at 5% on a 64px cell, full bleed, anchored half a cell off
          the right edge so none sits flush to the panel's own.

          It replaces `.canvas-botanical`, the watercolour wash that used to run
          down the right 420px of this panel. That was a real port detail - the
          wash ships in the design system's effects sheet rather than in either
          artboard's inline <style>, and a port that copied only the artboard's
          own CSS lost it from every chapter panel without anyone noticing
          (docs/specs/06-chapter-1.md D3). It is still in styles/base.css and
          still correct; this panel just no longer asks for it.

          WHICH MOVES THE EYEBROWS' GROUND. See the note on the eyebrow colour
          in chapter-1-desktop.tsx: the muted pair was chosen because the
          watercolour multiplied the surface under the `Premium proposals`
          eyebrow from #FAF8F3 down to #F4F1E9. The grid neither multiplies nor
          darkens - it is hairlines on transparency - so that surface is
          #FAF8F3 again and the constraint is gone. Measured on the two
          surfaces: eyebrow-muted 7.86 -> 8.36:1, eyebrow 5.13 -> 5.46:1. Both
          improve, so the muted pair is kept rather than reverted; changing it
          would be a colour edit nobody asked for.
        */}
        <div className="grid-panel relative z-30 flex flex-col rounded-xl bg-pf-surface-300 p-12">
          {children}
        </div>
      </div>
    </section>
  );
}
