import Image from "next/image";

import type { ReactNode } from "react";

/**
 * The mobile chapter shell, below 1024px.
 *
 * Materially simpler than its desktop counterpart and deliberately so: no
 * `.banner-fade` mask, no negative-margin overlap and no blurred mirror. Two
 * stacked boxes inside one 12px clipper - a photographic banner carrying the
 * heading, and a botanical panel carrying the chapter's sub-blocks.
 *
 * THE PANEL SURFACE IS NOT THE DESKTOP ONE. Mobile draws `card-muted`
 * (#E7E2D8), the recessed tile tone, where desktop draws `pf-surface-300`
 * (#FAF8F3), the page surface. Both ship as drawn, and the difference matters
 * for contrast: the botanical wash multiplies over a surface two steps darker
 * here, so anything set on this panel is measured against `card-muted`, never
 * against the desktop numbers.
 *
 * FLUID BEHAVIOUR (320-1023px). The mobile artboard is a fixed 430px column
 * with no media queries, so the range either side of it is ours to define
 * (docs/specs/06-chapter-1.md §7):
 *
 *  - the outer gutter is 16px, stepping to 32px at 640px, matching every other
 *    band below the breakpoint;
 *  - the content is capped at 560px, the page-wide measure, so the body
 *    paragraphs do not run 90 characters at 700px;
 *  - the panel's horizontal padding steps 16px -> 24px at 560px, the width at
 *    which the panel stops being narrower than the cap;
 *  - the heading is `clamp(22px, 6.51vw, 28px)`, where 6.51vw is exactly 28px
 *    at the artboard's own 430px.
 *
 * The banner's own 26/18/22px insets never scale. It is a photographic band
 * whose crop is tuned to them, and scaling them moves the subject relative to
 * the type.
 *
 * Plain `sm:` is safe throughout: this whole subtree is `desk:hidden`, so
 * nothing here also carries a `desk:` value for the same property and the
 * variant-ordering trap the page-wide conventions warn about cannot bite.
 */
export type ChapterShellMobileProps = {
  /** Identifies the band to the comparison harness. e.g. `"chapter-1-mobile"`. */
  dataSection: string;
  /** The banner photograph. */
  image: string;
  /**
   * The chapter heading. A plain string here, unlike desktop: the mobile
   * artboard runs chapter 1's two sentences together on one line where desktop
   * breaks them with a hard `<br>`.
   */
  heading: string;
  /** The panel's contents. */
  children: ReactNode;
};

export function ChapterShellMobile({
  dataSection,
  image,
  heading,
  children,
}: ChapterShellMobileProps) {
  return (
    <section
      data-section={dataSection}
      /*
        The gutter is a margin, not padding, because that is how the mobile
        artboard writes it - its section box excludes the gutter. The rendered
        pixels are identical either way, but the box edge is what the geometry
        harness measures from, so padding made every node in every chapter read
        16px out against a section origin that was not the artboard's.
      */
      className="mx-4 mb-[30px] max-w-[560px] desk:hidden sm:mx-8 sm:max-w-[560px] min-[592px]:mx-auto"
    >
      <div className="overflow-hidden rounded-xl">
        <div className="relative px-[18px] pt-[26px] pb-[22px]">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 640px) 560px, 100vw"
            className="object-cover"
          />
          {/* Top-heavy veil: the heading sits at the top of the band, so the
              dark end goes there and the photograph opens up beneath it. A
              neutral dark rather than the brand petrol - it washes a
              photograph, and tinting it would turn the image into a swatch. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(23_26_27/0.92)_0%,rgb(23_26_27/0.74)_42%,rgb(23_26_27/0.46)_100%)]"
          />
          <h2 className="display display-2-mobile relative text-[clamp(22px,6.51vw,28px)] text-white">
            {heading}
          </h2>
        </div>

        <div className="grid-panel bg-card-muted px-4 pt-[22px] pb-6 min-[560px]:px-6">
          {children}
        </div>
      </div>
    </section>
  );
}
