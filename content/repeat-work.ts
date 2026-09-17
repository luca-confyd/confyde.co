/**
 * "Unlock the value of AI for your business." - the day-to-day operations
 * panel's copy, its two client lists and the figures on its stat card.
 *
 * TWO LISTS, NOT ONE WITH A SLICE. The artboards draw different compositions:
 * desktop shows five, mobile two. A mobile row that looks like a shortened
 * desktop twin is the client's own edit, and deriving one from the other would
 * quietly repair copy we were told not to touch (docs/brand.md, RULINGS.md
 * principle 3). Same reasoning as `content/before-after.ts`.
 *
 * The rows no longer carry a photograph or an action chip. Both went when the
 * list took the status-circle treatment: a row is now a title, one line of
 * evidence and a circle that resolves from spinner to tick.
 *
 * Apostrophes are U+2019 and the arrow is U+2192, both as drawn.
 */

/**
 * A row in the "Where Confyde comes in" list.
 *
 * `title` is the capability; `detail` is the one line that says what it means
 * in practice. They stay two fields rather than one pre-joined string so the
 * dash between them is the component's typography rather than something baked
 * into content - and so a narrow column can break the line at the dash.
 *
 * The rows used to carry a client and an address as well, back when this list
 * was five named customers Confyde had chased. It is a list of what Confyde
 * DOES now, so there is no client to name and nothing about the row is
 * per-customer.
 */
export type ClientRow = {
  title: string;
  detail: string;
};

export const REPEAT_WORK = {
  eyebrow: "Day-to-day operations",
  heading: "Unlock the value of AI for your business.",
  intro:
    "Confyde can help you identify the use cases that will genuinely improve business " +
    "performance.",

  /*
    The white card's header, and now its only chrome: the "4 of 62 clients"
    count opposite it and the whole footer strip below the list have both gone,
    so the card is a heading and four rows.
  */
  listTitle: "Where Confyde comes in",

  /*
    The case study's subject. The card was "Laurence Landscaping, Byron Bay - 6
    crew" with an LL lettermark - an invented business, and a placeholder for a
    real one. It is Plann, and it draws Plann's own logo.

    THE SUB-LINE IS YOUR OWN COPY, NOT AN INVENTED ONE. It was "Byron Bay - 6
    crew", which was safe to make up about a business that does not exist; the
    equivalent line about a real company is not. So it borrows the line already
    written for Plann in content/customer-stories.ts rather than asserting a
    location or a headcount nobody has checked. Swap it for the real sub-line
    when there is one - it is a placeholder, just not a fabricated one.

    `caseStudy` is TEXT, never a control: no case study page exists
    (RULINGS.md §01), and rendering it as a link or a button would put an inert
    tab stop in the page. Same call the action chips used to make.
  */
  company: {
    logo: "/images/logo-plann.png",
    name: "Plann",
    meta: "The business behind the exit",
    caseStudy: "View the case study \u2192",
  },

  /** Desktop only. The mobile stat card carries no label. */
  statLabel: "Repeat work",

  stats: [
    {
      figure: "38%",
      label: "of jobs won this year were clients you’d worked for before",
    },
    {
      /*
        Shortened from "won back from past clients, without chasing a single
        new lead". At 60 characters it ran to three lines against the first
        label's two, which made the two halves of one claim look like a
        headline and a footnote in a layout that had just been evened up. 46
        characters sets two lines at the same measure.
      */
      figure: "$412k",
      label: "won back from past clients, no new leads chased",
    },
  ],

  /** Identical in both artboards, so one array. */
  ticks: [
    "Nothing spent on ads to win it",
    "No quoting against three others on price",
    "They already know your work, so there is less selling to do",
    "Confyde drafts the quote from the job you did for them",
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

/**
 * ONE LIST, NOT TWO. The desktop and mobile boards used to draw different
 * customers - a different photograph against each name and, for one of them,
 * differently worded copy - so deriving one list from the other would have
 * quietly repaired the client's own edit. None of that survives: these are five
 * capabilities, the same five at both breakpoints, with nothing per-row that
 * could differ. The second array was two hand-maintained copies of one list.
 */
export const CLIENT_ROWS: readonly ClientRow[] = [
  {
    title: "AI agents",
    detail: "Handling the work your team repeats every week",
  },
  {
    title: "Automations",
    detail: "Your existing processes running without anyone driving them",
  },
  {
    title: "Data and integrations",
    detail: "Your systems connected so the answers are already there",
  },
  {
    title: "Engineering delivery",
    detail: "Building the teams and software behind the business",
  },
  {
    /*
      NOTE: this detail is near-identical to the hero's "Technical strategy"
      blurb ("What to build, what to buy, and what to stop paying for
      entirely"). The two sit far apart on the page and say the same thing in
      almost the same words. Left as given; flag if one of them should move.
    */
    title: "Technical strategy",
    detail: "What to build, what to buy, what to stop paying for",
  },
];

