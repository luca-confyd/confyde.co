import { QUOTE } from "./home";

/**
 * "The easiest job to win is the one you’ve already done." - the repeat-work
 * panel's copy, its two client lists and the figures on its stat card.
 *
 * TWO LISTS, NOT ONE WITH A SLICE. The artboards draw different compositions:
 * desktop shows four clients with a relationship note, a status word and an
 * action chip; mobile shows two, with no chips, a different photograph against
 * each name and - for Leah - a differently worded note. A mobile row that looks
 * like a shortened desktop twin is the client's own edit, and deriving one from
 * the other would quietly repair copy we were told not to touch
 * (docs/brand.md, RULINGS.md principle 3). Same reasoning as
 * `content/before-after.ts`.
 *
 * Sarah Henderson and 14 Beach Rd come from `QUOTE`, not from a second typing:
 * she is the client whose quote the hero, the take-off demo and the proposal
 * card all draw, and this row is the same relationship a year later.
 *
 * Apostrophes are U+2019 and the arrow is U+2192, both as drawn.
 */

/** A row in the "Worth a call this month" list. */
export type ClientRow = {
  name: string;
  /** The address or suburb that disambiguates the name. */
  place: string;
  /** Why Bramble surfaced them. */
  note: string;
  /** The status word on the right of the row. */
  status: string;
  /**
   * The action Bramble suggests. Text, never a control: it is a depiction of a
   * button inside a depiction of the app, and rendering it as one would add
   * four inert tab stops. Absent on mobile, where the artboard draws none.
   */
  action?: string;
  photo: string;
};

/**
 * How many clients Bramble is said to be watching. Written three times in the
 * desktop panel - the header count, the footer sentence and the footer link -
 * so it is one constant; three hand-typed numbers are how a number drifts.
 */
export const CLIENT_COUNT = 62;

export const REPEAT_WORK = {
  eyebrow: "Customer CRM with smart reminders",
  heading: "The easiest job to win is the one you’ve already done.",
  intro:
    "Bramble remembers every past client and what you built for them, then nudges you before " +
    "they go looking for someone else.",

  /** The white card's header. Desktop names the noun, mobile does not. */
  listTitle: "Worth a call this month",
  countDesktop: `4 of ${CLIENT_COUNT} clients`,
  countMobile: `4 of ${CLIENT_COUNT}`,

  /** Desktop only - the mobile card ends at the last row. */
  footerNote: `Bramble checks all ${CLIENT_COUNT} every month and tells you who is worth a call.`,
  footerLink: `See all ${CLIENT_COUNT} →`,

  /** Desktop only. The mobile stat card carries no label. */
  statLabel: "Repeat work",

  stats: [
    {
      figure: "38%",
      label: "of jobs won this year were clients you’d worked for before",
    },
    {
      figure: "$412k",
      label: "won back from past clients, without chasing a single new lead",
    },
  ],

  /** Identical in both artboards, so one array. */
  ticks: [
    "Nothing spent on ads to win it",
    "No quoting against three others on price",
    "They already know your work, so there is less selling to do",
    "Bramble drafts the quote from the job you did for them",
  ],

  callout: {
    title: "Every client, every job, every note. In one place.",
    /*
      [LOG] The mobile artboard drops "and keep up to date" from the end of the
      second clause. Preserved as two strings rather than unified - the client's
      copy, their call (RULINGS.md §02 rulings 12-14).
    */
    bodyDesktop:
      "No spreadsheet, no shoebox of business cards, no separate CRM to pay for and keep up " +
      "to date. It fills itself in as you quote.",
    bodyMobile:
      "No spreadsheet, no shoebox of business cards, no separate CRM to pay for. It fills " +
      "itself in as you quote.",
  },
} as const;

export const CLIENT_ROWS_DESKTOP: readonly ClientRow[] = [
  {
    name: QUOTE.client,
    place: QUOTE.address,
    note: "Wanted a fire pit and lighting at handover.",
    status: "5 months",
    action: "Call",
    photo: "/images/photo-1.webp",
  },
  {
    name: "Tom Ridgeway",
    place: "112 Ridgeway Ave",
    note: "Lower terrace quoted as stage two, after winter.",
    status: "Stage two due",
    action: "Draft quote",
    photo: "/images/photo-2.webp",
  },
  {
    name: "Leah Cortez",
    place: "Wattle Grove",
    note: "Second summer on the turf. Due a maintenance visit.",
    status: "Seasonal",
    action: "Send offer",
    photo: "/images/photo-3.webp",
  },
  {
    name: "Jo Harcourt",
    place: "Harcourt St terrace",
    note: "Happy client, never asked for a review.",
    status: "Won in June",
    action: "Ask for review",
    photo: "/images/photo-4.webp",
  },
];

/*
  [LOG] The mobile artboard puts photo-2 against Leah and photo-1 against Jo,
  where desktop uses photo-3 and photo-4 for the same two people. Both are
  carried as drawn rather than unified: the photographs are stock faces reused
  across the page with no name attached to any of them, so neither assignment is
  more correct, and reproducing the render is the acceptance test
  (RULINGS.md principle 1). Worth the tech lead's eye all the same.
*/
export const CLIENT_ROWS_MOBILE: readonly ClientRow[] = [
  {
    name: "Leah Cortez",
    place: "Wattle Grove",
    note: "Turf and irrigation going into their second summer.",
    status: "Seasonal",
    photo: "/images/photo-2.webp",
  },
  {
    name: "Jo Harcourt",
    place: "Harcourt St terrace",
    note: "Happy client, never asked for a review.",
    status: "Won in June",
    photo: "/images/photo-1.webp",
  },
];

/**
 * The row avatar geometry.
 *
 * A fixed square at both breakpoints - 40px below 1024, 48px at and above it -
 * so `sizes` is a two-term switch. The intrinsic width is the larger of the
 * two; without `sizes` Next would generate a 1x/2x pair from it and hand the
 * 48px source to every 40px phone slot.
 */
export const CLIENT_ROW_AVATAR = {
  intrinsic: 48,
  sizes: "(min-width: 1024px) 48px, 40px",
} as const;
