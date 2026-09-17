/**
 * The three client stories under "Where we've worked".
 *
 * Copy is the client's, carried verbatim.
 *
 * `studio` is the name set over the photograph; `title` and `blurb` sit below
 * it. Unlike the set this replaced, the client name is NOT repeated inside the
 * title - the titles are claims ("Building the team behind the exit") rather
 * than "How <name> did <thing>". That is a real change to how the tile reads:
 * the name is the label and the title is the promise, so the two now carry
 * different information rather than the same information twice. The
 * photograph's alt text stays empty either way, because the name is set over
 * it in text.
 *
 * PHOTOGRAPHS ARE PLACEHOLDERS. photo-1, photo-2 and photo-4 are the landscape
 * and construction stock the previous stories used, and none of them has
 * anything to do with a social scheduling tool, a link-in-bio platform or a
 * tennis club. They are wrong for this copy and are only here because the tile
 * needs an image to lay out. Replace before this goes anywhere public.
 *
 * Plann's logo was briefly drawn here instead of its photograph. Reverted: one
 * logo tile beside two photo tiles made the row look broken rather than
 * branded. If logos are wanted here it is all three or none. The logo is still
 * on the case study card in content/repeat-work.ts, where it is the only
 * company on the card and has nothing to be inconsistent with.
 *
 * Photo order is 1, 2, 4: photo-3 belongs to the social-proof band and is
 * deliberately not reused here.
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
    studio: "Plann",
    title: "Building the team behind the exit",
    blurb:
      "Engineering leadership, growth strategy, and the hiring that took Plann through to a " +
      "successful exit.",
  },
  {
    photo: "/images/photo-2.webp",
    studio: "Linktree",
    title: "Agents and security at 70m creators",
    blurb:
      "Automated workflows and hardened systems, built to serve a platform of 70 million-plus " +
      "creators.",
  },
  {
    photo: "/images/photo-4.webp",
    studio: "Kensington Tennis Club",
    title: "A club that runs itself",
    blurb:
      "App development and AI built into the day-to-day, driving new revenue and faster service " +
      "for members.",
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
