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
 * (#E6E0CC), the recessed tile tone, where desktop draws `pf-surface-300`
 * (#F8F7F2), the page surface. Both ship as drawn, and the difference matters
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
      className="mx-auto mb-[30px] w-full max-w-[592px] px-4 desk:hidden sm:max-w-[624px] sm:px-8"
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
          {/* Top-heavy forest veil: the heading sits at the top of the band, so
              the dark end goes there and the photograph opens up beneath it. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--color-forest-900)_92%,transparent)_0%,color-mix(in_oklab,var(--color-forest-900)_74%,transparent)_42%,color-mix(in_oklab,var(--color-forest-900)_46%,transparent)_100%)]"
          />
          <h2 className="display display-2-mobile relative text-[clamp(22px,6.51vw,28px)] text-white">
            {heading}
          </h2>
        </div>

        <div className="canvas-botanical bg-card-muted px-4 pt-[22px] pb-6 min-[560px]:px-6">
          {children}
        </div>
      </div>
    </section>
  );
}
