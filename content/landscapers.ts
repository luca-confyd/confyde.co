/**
 * The four landscapers who appear in the social-proof band.
 *
 * The same four names, organisations and photographs recur across the page, so
 * they exist once here rather than being hand-typed per call site - that is how
 * a name drifts. Copy is the client's, carried verbatim: the ampersand in
 * Ollie's organisation, the comma before each city, and Ollie having neither a
 * surname nor a city where the other three have both.
 *
 * Photo order is 1, 3, 2, 4 in both artboards. It is not sequential and it is
 * not a mistake in the transcription.
 */
export const LANDSCAPERS = [
  {
    photo: "/images/photo-1.webp",
    initials: "AR",
    name: "Adam Robinson",
    org: "Adam Robinson Design, Sydney",
  },
  {
    photo: "/images/photo-3.webp",
    initials: "HP",
    name: "Hamish Putt",
    org: "Outfield Studio, Sydney",
  },
  {
    photo: "/images/photo-2.webp",
    initials: "O",
    name: "Ollie",
    org: "Occo Landscapers & Builders",
  },
  {
    photo: "/images/photo-4.webp",
    initials: "DN",
    name: "Dave Nguyen",
    org: "Fig Landscapes, Melbourne",
  },
] as const;

/**
 * The tile geometry, as one decision rather than two.
 *
 * Every tile is `fill` + `object-cover` inside a 4:3 block, so its rendered
 * width IS the grid column width. The `sizes` string below is that width
 * expressed per range, and its `592px` term is derived arithmetic:
 * `columnCap + 2 x gutter` = 560 + 32. If the column cap or the gutter moves,
 * the string moves with it - which is the whole reason they live in one object.
 *
 *   >=1280px      296px flat        (max-w-[1280px] - 48px padding - 3 x 16px gap) / 4
 *   1024-1279px   (100vw - 96px)/4  232px at 1024, rising to 296px
 *   >=592px       274px flat        the 560px column cap has bitten
 *   <592px        (100vw - 44px)/2  2 columns, 16px gutters, 12px gap
 *
 * The largest any of these ever renders is 296px, so at DPR 2 Next serves the
 * 640 candidate against 1402-1536px sources. Omitting `sizes` under `fill`
 * defaults to `100vw`, which would request the 2560-3840 candidate for every
 * tile on a 2x desktop - the single most expensive line in this section.
 */
export const LANDSCAPER_TILE = {
  /** Content column cap below 1024px, per docs/specs/04-social-proof.md §5.
   *  Mirrored in the band's `max-w-[592px] sm:max-w-[624px]` (cap + gutters). */
  columnCap: 560,
  /** Side gutter below 640px, and from 640px up. */
  gutter: 16,
  gutterWide: 32,
  sizes:
    "(min-width: 1280px) 296px, (min-width: 1024px) calc((100vw - 96px) / 4), " +
    "(min-width: 592px) 274px, calc((100vw - 44px) / 2)",
} as const;
