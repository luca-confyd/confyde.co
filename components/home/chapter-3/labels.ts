import { LANES, SENT_CARDS, WON_JOB } from "@/content/playbook";

/**
 * The desktop analytics stage is one `role="img"` region, so it needs one
 * written sentence carrying what a sighted reader takes from it.
 *
 * WHY NOT READ THE BOARD ITSELF. It is around two hundred words of invented job
 * names, client names, amounts and status lines, which a sighted reader absorbs
 * as texture - "four columns, one card is moving, the totals change" - in about
 * a second. Serialised it is a minute of recital. Worse, the DOM is changing on
 * a 14-second loop and both halves of all three swap pairs are always present:
 * a virtual cursor can land on the landed Closed card while it is at
 * `max-height: 0; opacity: 0`, or on `$15.8k` while it is at `opacity: 0`, and
 * read either as though it were on screen. That is the same argument RULINGS
 * §05 ruling 7 accepted for the before/after phones.
 *
 * WHY NOT SILENCE IT. The board IS the chapter's argument. "Your quotes, in four
 * columns, and one of them just moved to Closed" is information, and
 * `aria-hidden` would lose it - which is why this is `role="img"` and not the
 * hero float stack's treatment.
 *
 * The label describes the t = 0 state plus the one event, because that is what
 * the section argues. It deliberately says nothing about the eight-cell counter
 * strip: those figures contradict the tilted cards above them
 * (docs/specs/10-chapter-3.md D9) and reading a contradiction aloud is worse
 * than omitting both.
 *
 * Everything outside the stage - both eyebrows, both sub-heads, both paragraphs
 * and the whole team leaderboard - stays in the accessibility tree untouched.
 * That is the page-wide rule this chapter completes: animated product-UI
 * depictions collapse to one `role="img"`, static ones stay readable.
 */
export const CH3_LABELS = {
  pipeline:
    `A sales pipeline board with four columns. ${LANES.draft.name} holds two quotes worth ` +
    `${LANES.draft.value}; ${LANES.sent.name} holds two worth ${LANES.sent.value}, one of them ` +
    `${SENT_CARDS[0].status?.toLowerCase()}; ${LANES.negotiating.name} holds two worth ` +
    `${LANES.negotiating.value}; and ${LANES.closed.name} holds ${LANES.closed.count} won jobs. ` +
    `A card for ${WON_JOB.name}, ${WON_JOB.amount}, is being dragged from ` +
    `${LANES.negotiating.name} into ${LANES.closed.name}, and a message reads: Nice one. ` +
    `Tom accepted.`,
} as const;
