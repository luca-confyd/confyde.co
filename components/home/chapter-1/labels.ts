import { QUOTE, READING, SCOPE, TAKEOFF } from "@/content/home";

/**
 * The product depictions in this chapter are `role="img"` regions, so each
 * needs one written sentence that carries what a sighted reader takes from it.
 *
 * WHY NOT READ THE CARDS THEMSELVES. The price-library card is four file rows
 * of invented data, of which a sighted reader absorbs the SHAPE in under a
 * second and none of the specifics - and its type chip and its "Read" chip are
 * superimposed siblings where `opacity` is not `visibility`, so both stay in
 * the accessibility tree and every file would be announced twice.
 *
 * WHY NOT SILENCE THEM. These cards are the chapter's claim, and it is only
 * credible because the reader can see files being read and lines being priced.
 * One sentence restores that.
 *
 * Everything outside those regions - the eyebrow, three sub-heads, three
 * paragraphs, the tab strip, the whole case the section makes - is announced
 * normally.
 *
 * The strings are BUILT from `content/home.ts` rather than typed out, for the
 * same reason the cards are: $15,563 is the sum of four priced lines that are
 * themselves the product of four rates and four quantities, and a label that
 * restates it independently is a fifth place for it to drift.
 * (docs/specs/06-chapter-1.md §8.1; RULINGS.md §05 ruling 7 precedent.)
 */

const COUNT_WORDS = ["no", "one", "two", "three", "four", "five"] as const;

/** "Four", "Five" - the scope-row count differs between the two breakpoints. */
function countWord(n: number): string {
  const word = COUNT_WORDS[n] ?? String(n);
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export const CH1_LABELS = {
  priceLibrary:
    `Four files being read into a price library: a PDF quote, an Excel pricelist and two ` +
    `photographs. All four are marked Read, and the footer says ` +
    `${TAKEOFF.materialsLearned} materials learned.`,

  proposalDesktop:
    `A branded proposal for ${QUOTE.client} at ${QUOTE.address}, ${QUOTE.suburb}. ` +
    `${countWord(SCOPE.length)} scope lines with a total of ${QUOTE.total} including GST, ` +
    `marked as sent and opened ${READING.opens} times.`,

  /* Mobile draws four scope rows, not five - it omits Irrigation entirely - so
     its label counts what its card actually shows rather than what SCOPE holds. */
  proposalMobile:
    `A branded proposal prepared for ${QUOTE.client}, ${QUOTE.address}, ${QUOTE.suburb}. ` +
    `${countWord(SCOPE.length - 1)} scope lines with a total of ${QUOTE.total} including GST, ` +
    `marked as sent and opened ${READING.opens} times.`,
} as const;

/**
 * Mobile sets the scope labels in sentence case where desktop sets them in
 * Title Case. Derived rather than retyped, so the five strings still live in
 * exactly one place: first word as authored, everything after it lowered, and
 * the ampersand left alone.
 */
export function toSentenceCase(label: string): string {
  return label
    .split(" ")
    .map((word, i) => (i === 0 || word === "&" ? word : word.toLowerCase()))
    .join(" ");
}

/** "Sarah", from "Sarah Henderson". Both footers greet the client by first name. */
export const CLIENT_FIRST_NAME = QUOTE.client.split(" ")[0];
