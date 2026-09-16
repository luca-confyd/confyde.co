import { QUOTE, READING, SCOPE, TAKEOFF, TAKEOFF_LINES } from "@/content/home";

/**
 * The four product depictions in this chapter are `role="img"` regions, so each
 * needs one written sentence that carries what a sighted reader takes from it.
 *
 * WHY NOT READ THE CARDS THEMSELVES. The take-off card alone is four labels,
 * four specs, four supplier names, four unit rates, four quantities, four
 * totals, five superimposed timestamps and a three-row totals block - roughly
 * ninety tokens of invented data, of which a sighted reader absorbs the SHAPE
 * in under a second and none of the specifics. Read aloud it is a minute of
 * numbers with no argument in it. The price-library card is worse: its type
 * chip and its "Read" chip are superimposed siblings and `opacity` is not
 * `visibility`, so both stay in the accessibility tree and every file would be
 * announced twice.
 *
 * WHY NOT SILENCE THEM. These cards are the chapter's claim. "Bramble measures
 * the job off the plan and prices it from your own suppliers" is only credible
 * because the reader can see a plan being measured and lines being priced. One
 * sentence restores that.
 *
 * Everything outside the four regions - three eyebrows, three sub-heads, three
 * paragraphs, the whole case the section makes - is announced normally.
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

/** "paving, stepping pavers, pool coping and screen planting" */
function spokenList(items: readonly string[]): string {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** "2m 14s" reads as two letters to a screen reader; spell it out. */
const SPOKEN_ELAPSED = TAKEOFF.elapsed.replace(/(\d+)m/, "$1 minutes").replace(/(\d+)s/, "$1 seconds");

const TAKEOFF_ITEMS = spokenList(TAKEOFF_LINES.map((line) => line.label.toLowerCase()));

export const CH1_LABELS = {
  takeoff:
    `A take-off in progress: Bramble measures a site plan and prices ` +
    `${countWord(TAKEOFF_LINES.length).toLowerCase()} lines — ${TAKEOFF_ITEMS} — to a quote ` +
    `total of ${TAKEOFF.total} in ${SPOKEN_ELAPSED}.`,

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
