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

import { caseStudyPath } from "./case-studies";

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

    `caseStudy` IS a control now: Plann's case study exists at
    `/case-studies/plann`, so the chip is a link rather than the text it shipped
    as while there was nowhere to send anyone. `caseStudyHref` is built from
    `caseStudyPath`, so this and the three tiles in content/customer-stories.ts
    share one spelling of the route.
  */
  company: {
    logo: "/images/logo-plann.png",
    name: "Plann",
    meta: "The business behind the exit",
    caseStudy: "View the case study \u2192",
    caseStudyHref: caseStudyPath("plann"),
  },

  /** Desktop only. The mobile stat card carries no label. */
  statLabel: "Plann",

  /*
    THE FIGURES ARE PLANN'S OWN, and they are the same two the case study's
    numbers card carries (content/case-studies.ts). The card sits under Plann's
    logo and a link to that study, so a figure here that the study does not also
    state is a number a reader can catch us on. Keep the labels short: the
    layout sets each at two lines and the pair was evened up once already.
  */
  stats: [
    {
      figure: "5.5×",
      label: "monthly revenue growth, US$55K to US$300K",
    },
    {
      figure: "8 weeks",
      label: "sell-side technical diligence, start to close",
    },
  ],

  /** Identical in both artboards, so one array. */
  ticks: [
    "Built the team around the work",
    "Built the platform to carry the growth",
    "Made the company diligence-proof",
    "Acquired by Linktree, platform and team intact",
  ],

  /*
    DRAWN FROM THE CASE STUDY, not written beside it. The claim and the figure
    are both in content/case-studies.ts under "What changed", and the card above
    links to that study, so the two have to agree.

    The mobile body is the shorter edit the two artboards' pattern asks for
    here: same claim, one clause fewer, because this block sets a third wider on
    desktop than it does on a phone.
  */
  callout: {
    title: "Scaling a business remotely, across multiple time zones.",
    bodyDesktop:
      "Four teams and four managers, fully remote across five time zones. Hiring, " +
      "performance and progression frameworks built from nothing, so the team kept working " +
      "as it grew instead of slowing down.",
    bodyMobile:
      "Four teams and four managers, fully remote across five time zones, with hiring and " +
      "progression frameworks built from nothing.",
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

