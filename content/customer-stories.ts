/**
 * The three customer stories in section 06.
 *
 * Copy is the client's, carried verbatim: the multiplication sign in "10×’d",
 * the ampersand in "Occo Landscapers & Builders", and the em dashes in two of
 * the three blurbs - docs/brand.md bans those, but RULINGS.md principle 3 says
 * we flag copy rather than edit it, so they are logged for the client rather
 * than removed.
 *
 * The one change is typographic, not editorial: the artboard's two straight
 * apostrophes are normalised to curly, per RULINGS.md §02 ruling 10, which is
 * already the page's convention.
 *
 * `studio` is the name set over the photograph; `title` and `blurb` sit below
 * it. The two are not redundant - the studio name is the tile's own label and
 * the title is the article's headline - but the studio name IS repeated inside
 * the title, which is why the photograph's alt text is empty.
 *
 * Photo order is 1, 2, 4 in the artboard: photo-3 belongs to the social-proof
 * band and is deliberately not reused here.
 *
 * `href` is absent on all three. No story pages exist, and the client scoped
 * this build to the homepage (RULINGS.md §01), so every card ships inert.
 * Adding `href` is the whole switch when the articles land.
 */
export type CustomerStory = {
  photo: string;
  studio: string;
  title: string;
  blurb: string;
  href?: string;
};

export const CUSTOMER_STORIES: readonly CustomerStory[] = [
  {
    photo: "/images/photo-1.webp",
    studio: "Occo Landscapers & Builders",
    title: "How Occo Landscapers & Builders 10×’d its quoting with Confyde",
    blurb:
      "From weekend admin to same-day quotes — how a two-person crew started winning bigger jobs.",
  },
  {
    photo: "/images/photo-2.webp",
    studio: "Coastal Gardens",
    title: "How Coastal Gardens cut quoting from 3 hours to 15 minutes",
    blurb: "Same-day quotes, better follow-up, and a win rate that climbed right along with it.",
  },
  {
    photo: "/images/photo-4.webp",
    studio: "BuildRight",
    title: "How BuildRight stopped underquoting for good",
    blurb: "Confyde’s pricing caught the margin leaks — and clients trust the clearer quotes.",
  },
];

/**
 * The photo tile's geometry, as one decision rather than four scattered ones.
 *
 * Every tile is `fill` + `object-cover` in a 200px-tall block whose width is
 * the card width minus the card's 12px of padding on each side, so the `sizes`
 * string below is derived arithmetic and moves with the layout:
 *
 *   >=1280px      355px flat        (1280 - 96 padding) / 3 - 16 gap - 24 padding
 *   1024-1279px   (100vw-96)/3-40   269px at 1024, rising to 355px
 *   >=592px       536px flat        the 560px column cap has bitten
 *   <592px        100vw - 56px      one column, 16px gutters, 12px card padding
 *
 * The 560px cap and the 16/32px gutters are the same pair the social-proof band
 * uses (see content/landscapers.ts), which is why the stacked layout below
 * 1024px lines up with the band above it.
 *
 * Omitting `sizes` under `fill` defaults to `100vw`, which would pull the
 * 2560-3840 candidate for three tiles on a 2x desktop.
 */
export const STORY_TILE = {
  /** Content column cap below 1024px, shared with the social-proof band. */
  columnCap: 560,
  /** Side gutter below 640px, and from 640px up. */
  gutter: 16,
  gutterWide: 32,
  /** The card's own padding, which the photograph sits inside. */
  cardPadding: 12,
  sizes:
    "(min-width: 1280px) 355px, (min-width: 1024px) calc((100vw - 96px) / 3 - 40px), " +
    "(min-width: 592px) 536px, calc(100vw - 56px)",
} as const;
