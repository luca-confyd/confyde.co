/**
 * The two mid-page pull quotes.
 *
 * Testimonials from named people, drawn as a pair of forest panels between the
 * repeat-work story and the testimonial carousel. They are their own record
 * rather than entries in `content/landscapers.ts`: Hamish appears in both, but
 * his organisation line reads "Outfield Studio, Sydney NSW" here against
 * "Outfield Studio, Sydney" in the social-proof band, and Sam Whitfield is not
 * in that four at all. Merging them would mean silently choosing one of the
 * client's two spellings.
 *
 * Apostrophes are U+2019 throughout (RULINGS.md §02 ruling 10).
 *
 * [LOG] The desktop artboard wraps the FIRST quote - and only the first - in
 * straight double quotes; the mobile artboard wraps neither, and neither board
 * wraps the second. The marks are dropped here so the two quotes and the two
 * breakpoints agree: a `<blockquote>` already says the text is quoted, and
 * shipping decorative quote marks on one of four renders is the kind of
 * difference that reads as a transcription slip. Tech lead to rule.
 */

export type PullQuote = {
  /** Slug for the React key and the `data-section` hook. */
  id: string;
  quote: string;
  name: string;
  org: string;
  photo: string;
  /**
   * The mobile artboard sets the second quote a half-step smaller than the
   * first - 19px against 20px - because it is four times as long. Desktop sets
   * both at 24px. Carried per record rather than inferred from length.
   */
  mobileSize: string;
};

export const PULL_QUOTES: readonly PullQuote[] = [
  {
    id: "hamish-putt",
    quote: "I used to guess who was worth chasing. Now I open the board and it’s already sorted.",
    name: "Hamish Putt",
    org: "Outfield Studio, Sydney NSW",
    photo: "/images/photo-3.webp",
    mobileSize: "text-[20px]",
  },
  {
    id: "sam-whitfield",
    quote:
      "I’m not a computer person. Bramble just gets it. I can see at a glance where every quote " +
      "is at, and it tells me who to call. Beats the spreadsheet and the notepad I had going before.",
    name: "Sam Whitfield",
    org: "Owner, Coastal Gardens Co.",
    photo: "/images/photo-4.webp",
    mobileSize: "text-[19px]",
  },
];

/**
 * The avatar geometry, as one decision rather than two.
 *
 * Both renders are a fixed square - 44px below 1024, 104px at and above it - so
 * `sizes` is a straight two-term switch rather than anything derived from the
 * viewport. Without it Next would fall back to a 1x/2x pair generated from the
 * `width` prop, which serves the 104px source to a 44px slot on every phone.
 */
export const PULL_QUOTE_AVATAR = {
  intrinsic: 104,
  sizes: "(min-width: 1024px) 104px, 44px",
} as const;
