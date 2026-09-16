import { QUOTE, READING, SCOPE, SCOPE_FULL } from "@/content/home";

/**
 * The two replay frames are `role="img"` regions, so each needs one written
 * sentence carrying what a sighted reader takes from it.
 *
 * WHY THE FRAME COLLAPSES AND NOTHING ELSE DOES. Inside the frame is roughly
 * ninety words of invented line items, quantities and dollar figures, plus a
 * scroll position and a scrub percentage that change eleven times in every
 * twenty seconds. Announced, that is a minute of numbers with no argument in
 * it and a live region nobody could use. A sighted reader takes the same thing
 * in as texture in under a second.
 *
 * WHAT STAYS READABLE IS THE EVIDENCE. The chrome bar above the frame, the
 * entire section-timing table beside it, the legend, and cards 2 and 3 are all
 * announced normally. A reader who gets only those hears the whole argument:
 * the client opened it four times for five minutes sixteen, spent two minutes
 * forty on the paving, and here are three things to do about it. The timing
 * table deliberately sits OUTSIDE the region - it is the evidence, not the
 * depiction, and it is where every figure the section claims actually lives.
 *
 * (docs/specs/08-chapter-2.md §8.1; RULINGS.md §05 ruling 7 precedent.)
 */

const ORDINALS = ["", "first", "second", "third", "fourth", "fifth"] as const;

const COUNT_WORDS = ["no", "one", "two", "three", "four", "five", "six"] as const;

/** "&" reads as "and" to some screen readers and as nothing to others. */
function spoken(label: string): string {
  return label.replace(" & ", " and ");
}

/**
 * "four", for card 1's sub-line. Desktop spells the open count out and mobile
 * writes the numeral; both read READING.opens so the two cannot disagree about
 * how many visits there were (D15).
 */
export const OPENS_WORD: string = COUNT_WORDS[READING.opens] ?? String(READING.opens);

export const CH2_LABELS = {
  desktop:
    `A replay of ${QUOTE.client}’s ${ORDINALS[READING.opens] ?? READING.opens} visit to quote ` +
    `${QUOTE.reference}. The proposal scrolls through its ${COUNT_WORDS[SCOPE_FULL.length]} scope ` +
    `groups and pauses on ${spoken(READING.longestSection)}, which is marked with the hottest ` +
    `patch on the heatmap.`,

  /* Mobile draws five flat rows rather than six accordion groups, and names the
     client the way the rest of the mobile composition does - "Sarah", not
     "Sarah Henderson" - so its label counts and speaks what its own card
     shows. */
  mobile:
    `A replay of ${QUOTE.client.split(" ")[0]}’s visit to the quote. The proposal scrolls through ` +
    `its ${COUNT_WORDS[SCOPE.length]} scope groups and pauses on Paving and stonework, the row ` +
    `marked hottest on the heatmap.`,
} as const;
