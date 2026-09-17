/**
 * Chapter 3's figures - the analytics strip, the kanban board and the team
 * leaderboard, at both breakpoints.
 *
 * Everything the chapter states more than once lives here, for the same reason
 * `content/home.ts` exists: the two breakpoints draw the same board with
 * different card shells, and the desktop board states `$62,800` in four places
 * (the Negotiating card, the landed Closed card, the lane total arithmetic and
 * the `role="img"` label). Typed out per call site they drift.
 *
 * The three facts this chapter shares with the rest of the page - the Beach Rd
 * address, its client and its total - are imported from `content/home.ts`
 * rather than retyped. This is the fourth band on the page to show that quote.
 *
 * WHAT IS DELIBERATELY INCONSISTENT. The client's own figures contradict each
 * other and we ship them as drawn (docs/specs/10-chapter-3.md D9/D10):
 *   - the tilted cards say 62% win rate / 18 quotes / 31% margin, the counter
 *     strip says 42 quotes / 35 won / 83% win rate / 22% margin;
 *   - the toast says `12 this month`, the Closed count says 6 -> 7 and the
 *     leaderboard sums to 25;
 *   - `Avg job $300K` x 42 quotes does not reconcile with `Pipeline $312K`, and
 *     `Deposits $780K` is more than twice the whole pipeline.
 * The lane totals DO reconcile, and that arithmetic is load-bearing:
 * 18,400 + 11,250 = 29,650 -> $29.7k; 48,200 + 33,900 = 82,100 -> $82.1k;
 * 62,800 + 15,800 = 78,600 -> $78.6k, and 78.6 - 62.8 = 15.8, which is what the
 * flight's count swap shows. Changing an amount breaks a lane header.
 */

import { QUOTE } from "@/content/home";

/* -------------------------------------------------------------------------
   The eight-cell counter strip. Desktop only.
   ------------------------------------------------------------------------- */

/** The formats `fmt()` understands. Only three are reachable from this chapter. */
export type CountFormat =
  | "int"
  | "percent0"
  | "percent"
  | "thousands1"
  | "millions2"
  | "money1"
  | "moneyKwhole"
  | "dollars"
  | "kwhole"
  | "mwhole";

export type CounterCell = {
  label: string;
  /**
   * The value counted to. `null` is cell 8, which the artboard ships with no
   * `data-count` at all - it is a static `$0` and it is the only coloured value
   * in the strip (D5). Both flagged, both shipped as drawn.
   */
  count: number | null;
  format?: CountFormat;
  /**
   * Milliseconds. `data-duration` on a count is ms where `data-duration` on a
   * reveal is seconds - the same attribute name, two units, which is why the
   * hook's prop is `durationMs` (D6).
   */
  durationMs?: number;
  /**
   * The text painted before the count fires. Six cells ship a zero; cell 3
   * ships its FINAL value, so one cell reads `83%` before the strip is ever in
   * view (D6 in the spec's numbering). Shipped as drawn - "correcting" it to
   * `0%` would change what a first-paint screenshot shows.
   */
  placeholder?: string;
  /** Cell 8 only: a static value with no count behind it. */
  staticValue?: string;
};

export const COUNTER_CELLS: readonly CounterCell[] = [
  { label: "Quotes", count: 42, format: "int", durationMs: 900, placeholder: "0" },
  { label: "Won", count: 35, format: "int", durationMs: 900, placeholder: "0" },
  { label: "Win rate", count: 83, format: "percent0", durationMs: 900, placeholder: "83%" },
  { label: "Pipeline", count: 312000, format: "moneyKwhole", durationMs: 900, placeholder: "$0K" },
  { label: "Avg job", count: 300000, format: "moneyKwhole", durationMs: 900, placeholder: "$0K" },
  { label: "Deposits", count: 780000, format: "moneyKwhole", durationMs: 900, placeholder: "$0K" },
  { label: "Margin", count: 22, format: "percent0", durationMs: 900, placeholder: "0%" },
  { label: "Overdue", count: null, staticValue: "$0" },
] as const;

/* -------------------------------------------------------------------------
   The three tilted stat cards. Desktop only.
   ------------------------------------------------------------------------- */

export const STAT_CARDS = {
  winRate: { label: "Win rate", figure: "62%" },
  quotesSent: { label: "Quotes sent", figure: "18", delta: "▲ this month" },
  margin: { label: "Margin", figure: "31%", sub: "across 18 jobs" },
} as const;

/* -------------------------------------------------------------------------
   The desktop board: four lanes, nine cards.
   ------------------------------------------------------------------------- */

export type BoardCard = {
  name: string;
  client: string;
  amount: string;
  /** Absent on the flying card, which is the only card with no status line. */
  status?: string;
  /** The two Sent cards are the chapter's only rust text: a quote going cold. */
  statusTone?: "slate" | "rust";
  photo: string;
};

export const DRAFT_CARDS: readonly BoardCard[] = [
  {
    name: "Ferndale rear garden",
    client: "Priya Raman",
    amount: "$18,400",
    status: "Take-off done, prices to go on",
    photo: "/images/photo-1.webp",
  },
  {
    name: "Boyd St courtyard",
    client: "Dan Boyd",
    amount: "$11,250",
    status: "Started Tuesday",
    photo: "/images/photo-3.webp",
  },
] as const;

export const SENT_CARDS: readonly BoardCard[] = [
  {
    name: QUOTE.address,
    client: QUOTE.client,
    amount: QUOTE.total,
    status: "Opened 4 times, no reply in 6 days",
    statusTone: "rust",
    photo: "/images/photo-2.webp",
  },
  {
    name: "Wattle Grove frontage",
    client: "Leah Cortez",
    amount: "$33,900",
    status: "Never opened. Sent 9 days ago",
    statusTone: "rust",
    photo: "/images/photo-4.webp",
  },
] as const;

/**
 * The flying card. It is the only board card with no status line and no
 * divider, which is not decoration: it is what keeps it inside the 150px
 * `max-height` the slot and land keyframes are written against (D27). Any copy
 * change that adds a line here, or wraps the name, clips.
 */
export const WON_JOB = {
  name: "112 Ridgeway Ave",
  client: "Tom Ridgeway",
  amount: "$62,800",
  photo: "/images/photo-2.webp",
} as const;

export const NEGOTIATING_CARDS: readonly BoardCard[] = [
  {
    name: "Harcourt St terrace",
    client: "Jo Harcourt",
    amount: "$15,800",
    status: "Waiting on the stone spec",
    photo: "/images/photo-1.webp",
  },
] as const;

/**
 * The Closed lane's second card - the same job as calm card 3 in section 05,
 * spelt differently in each: `Mosman retaining + steps` here against
 * `Mosman retaining and steps` in `content/before-after.ts`, and `Ana Silva`
 * here against `Ana` there. One job, two spellings, two sections (D16).
 */
export const SETTLED_JOB = {
  name: "Mosman retaining + steps",
  client: "Ana Silva",
  amount: "$21,400",
  photo: "/images/photo-3.webp",
} as const;

/** Lane headers. The counts and totals that swap mid-flight carry both values. */
export const LANES = {
  draft: { name: "Draft", count: "2", value: "$29.7k" },
  sent: { name: "Sent", count: "2", value: "$82.1k" },
  negotiating: {
    name: "Negotiating",
    count: "2",
    countAfter: "1",
    value: "$78.6k",
    valueAfter: "$15.8k",
  },
  closed: {
    name: "Closed",
    count: "6",
    countAfter: "7",
    blurb: "Won jobs land here. Confyde reminds you to go back for repeat business.",
    link: "See all closed →",
  },
} as const;

/** The board's one piece of running copy, and the one apostrophe in it. */
export const TOAST_MESSAGE = "Nice one. Tom accepted. That’s 12 this month.";

export const VIEW_QUOTE = "View quote →";

/* -------------------------------------------------------------------------
   The mobile board: four stacked groups, five cards.
   ------------------------------------------------------------------------- */

export type MobileBoardCard = {
  name: string;
  meta: string;
  metaTone: "slate" | "forest" | "rust";
  amount: string;
  photo: string;
};

/**
 * Mobile is not a reflow of the desktop board and its numbers are not the same
 * ones. `Drafts` is plural and holds three quotes worth $74.2k where desktop's
 * `Draft` holds two worth $29.7k (D19); the Closed group carries a $412k total
 * desktop's has none of; amounts are `$62.8k` where desktop writes `$62,800`;
 * every meta line uses ` · ` where desktop uses a comma or a full stop; and the
 * Beach Rd quote is `Opened 4 times · after 8pm` in FOREST here against
 * `Opened 4 times, no reply in 6 days` in RUST on desktop - the same fact read
 * as good news on one breakpoint and a warning on the other (D20). All drawn,
 * all preserved, all flagged.
 */
export const MOBILE_GROUPS: readonly {
  name: string;
  count: string;
  value: string;
  cards: readonly MobileBoardCard[];
}[] = [
  {
    name: "Drafts",
    count: "3",
    value: "$74.2k",
    cards: [
      {
        name: "Ferndale rear garden",
        meta: "Ferndale · Priya Raman",
        metaTone: "slate",
        amount: "$28.4k",
        photo: "/images/photo-1.webp",
      },
    ],
  },
  {
    name: "Sent",
    count: "2",
    value: "$82.1k",
    cards: [
      {
        name: `${QUOTE.address}, ${QUOTE.suburb}`,
        meta: "Opened 4 times · after 8pm",
        metaTone: "forest",
        amount: "$62.8k",
        photo: "/images/photo-2.webp",
      },
      {
        name: "Wattle Grove frontage",
        meta: "Never opened · 9 days",
        metaTone: "rust",
        amount: "$19.3k",
        photo: "/images/photo-4.webp",
      },
    ],
  },
  {
    name: "Negotiating",
    count: "2",
    value: "$78.6k",
    cards: [
      {
        name: `${WON_JOB.name}, Bronte`,
        meta: "Asked about the paving",
        metaTone: "forest",
        amount: "$62.8k",
        photo: "/images/photo-2.webp",
      },
    ],
  },
  {
    name: "Closed",
    count: "6",
    value: "$412k",
    cards: [
      {
        name: SETTLED_JOB.name,
        meta: "Won · deposit in",
        metaTone: "forest",
        amount: "$21.4k",
        photo: "/images/photo-3.webp",
      },
    ],
  },
] as const;

/* -------------------------------------------------------------------------
   The team leaderboard. Identical at both breakpoints apart from Marco's job.
   ------------------------------------------------------------------------- */

/**
 * `bar` does not encode `record` - row 1 is a full bar against `9 of 12` (75%),
 * and rows 2-4 run 74/52/31 against 64/56/40. It tracks revenue rank instead
 * (D17). Shipped as drawn: the real number is stated in text beside the bar, so
 * nothing is misread, but the bar means something other than what it sits next
 * to. The track is `aria-hidden` for exactly that reason.
 *
 * `job` differs by breakpoint for Marco alone: `Wattle Grove pool surround` on
 * desktop, `Wattle Grove pool` on mobile, and the Sent lane calls the same
 * street `Wattle Grove frontage` - three strings for one job (D18).
 */
export const LEADERBOARD: readonly {
  name: string;
  job: string;
  jobMobile?: string;
  bar: string;
  record: string;
  total: string;
  photo: string;
}[] = [
  {
    name: "Dave",
    job: "Ferndale rear garden",
    bar: "100%",
    record: "9 of 12 won",
    total: "$182k",
    photo: "/images/photo-1.webp",
  },
  {
    name: "Suz",
    job: "Harcourt St terrace",
    bar: "74%",
    record: "7 of 11 won",
    total: "$134k",
    photo: "/images/photo-2.webp",
  },
  {
    name: "Marco",
    job: "Wattle Grove pool surround",
    jobMobile: "Wattle Grove pool",
    bar: "52%",
    record: "5 of 9 won",
    total: "$94k",
    photo: "/images/photo-3.webp",
  },
  {
    name: "Sam",
    job: "Vaucluse courtyard",
    bar: "31%",
    record: "4 of 10 won",
    total: "$56k",
    photo: "/images/photo-4.webp",
  },
] as const;

export const LEADERBOARD_TITLE = "Jobs won this month";
export const LEADERBOARD_FOOTER = "Updated as quotes are accepted. No one has to report in.";
