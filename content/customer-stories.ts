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
 * THE TILES NOW CARRY EACH CLIENT'S OWN SCREEN. They were photo-1, photo-2 and
 * photo-4 - landscape and construction stock with nothing to do with a social
 * scheduling tool, a link-in-bio platform or a tennis club - and they are now
 * the same three screenshots the case studies draw in their articles, so the
 * tile and the page it opens show the same thing.
 *
 * WHAT THAT COSTS. These are 16:9 captures in a tile that is far taller than it
 * is wide, so `object-cover` crops hard to the centre and the dark veil above
 * sits over what survives. That is fine for a wash of colour and a recognisable
 * shape; it is not a legible screenshot. If these should read as screens rather
 * than as texture, they want their own crops at the tile's own proportion.
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
 * THE WORDS ARE THE STUDY'S OWN. `studio`, `title`, `blurb` and `href` are all
 * read from that case study's record in content/case-studies.ts, so a tile and
 * the page it opens cannot say different things - which they had already begun
 * to do. Only `photo` is set here, because a tile crops far taller than the
 * article's 16:9 figure and may one day want its own crop.
 */
import { CASE_STUDIES, caseStudyPath } from "./case-studies";

export type CustomerStory = {
  photo: string;
  studio: string;
  title: string;
  blurb: string;
  href?: string;
};

/** The tile's own artwork, by slug. Everything else comes from the study. */
const TILE_PHOTOS: Record<string, string> = {
  plann: "/images/plann-screen.png",
  linktree: "/images/linktree-screen.png",
  "kensington-tennis-club": "/images/ktc-screen.png",
};

export const CUSTOMER_STORIES: readonly CustomerStory[] = CASE_STUDIES.map((study) => ({
  photo: TILE_PHOTOS[study.slug],
  studio: study.client,
  href: caseStudyPath(study.slug),
  title: study.card.title,
  blurb: study.card.blurb,
}));

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
