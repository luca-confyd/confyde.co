import { type CaseStudy, findCaseStudy } from "./case-studies";

/**
 * The about page, `/about`.
 *
 * Copy is taken verbatim from the client's design doc ("About Page.dc.html").
 * The page is the case study template with a different article in it - the same
 * hero, numbers card, rail, quote and closing band - so the record is written to
 * the case study's own shape, minus the fields only a study has (slug, client,
 * card), and rendered by the same components.
 *
 * THE QUOTE IS PLANN'S, NOT THE DESIGN'S. The design drew a stand-in quote
 * credited to "Christy Nguyen"; the page carries Christy Laurence's real
 * testimonial instead, read from the Plann record so the two pages cannot
 * quote her differently.
 *
 * Still to settle before this is public: the figures. "40+", "15 yrs", "70%",
 * "3" and "Founded 2019, Melbourne" are the design's, not yet confirmed.
 */

const plann = findCaseStudy("plann");
if (!plann) throw new Error("content/about.ts quotes the Plann case study, which is missing");

export const ABOUT = {
  eyebrow: "About Confyde",
  title: "Senior technical guidance for the age of AI.",
  lede:
    "The experience of a big consultancy, without the layers in between. A small team " +
    "of engineering and product leaders who embed with growing businesses and stay " +
    "until the work runs without us.",
  meta: [
    { label: "Founded", value: "2019, Melbourne" },
    { label: "What we do", value: "Technical strategy · Engineering delivery · AI · Security" },
    { label: "How we work", value: "Embedded, not advisory" },
  ],
  numbersEyebrow: "Confyde in numbers",
  numbers: {
    note: "Since 2019",
    items: [
      { figure: "40+", label: "businesses we’ve embedded with" },
      { figure: "15 yrs", label: "average leadership experience across the team" },
      { figure: "70%", label: "of clients come back for a second engagement" },
      { figure: "3", label: "client exits supported through diligence" },
    ],
  },
  railPrompt: "Want to see if we’re a fit?",
  sections: [
    {
      id: "why-we-exist",
      heading: "Why we exist",
      blocks: [
        {
          kind: "prose",
          text:
            "Most growing businesses hit the same wall: the product works, but the " +
            "engineering behind it can’t keep pace with the business. The usual answers — " +
            "a strategy deck, a junior agency team, a year-long hiring search — don’t fix " +
            "it fast enough.",
        },
        {
          kind: "prose",
          text:
            "Confyde started as the thing we wished existed when we were running those " +
            "teams ourselves: senior operators who step in, own the problem, and leave " +
            "behind a team that can carry it.",
        },
        {
          kind: "callout",
          eyebrow: "What we believe",
          statement:
            "Advice is cheap. The value is in being accountable for what ships, and for " +
            "what happens after.",
        },
      ],
    },
    {
      id: "how-we-work",
      heading: "How we work",
      blocks: [
        {
          kind: "steps",
          steps: [
            {
              title: "Start with an honest read",
              detail:
                "A short discovery to work out what’s worth doing — and telling you when " +
                "the answer is “not much”.",
            },
            {
              title: "Embed and own it",
              detail:
                "We sit inside your team, in your tools, accountable for delivery rather " +
                "than recommendations.",
            },
            {
              title: "Hand over on purpose",
              detail:
                "Every engagement ends with a team and a system that run without us. " +
                "That’s the measure.",
            },
          ],
        },
      ],
    },
  ],
  quote: plann.quote,
  ctaHeading: "Not sure where to start?",
} satisfies Pick<CaseStudy, "title" | "lede" | "meta" | "numbers" | "sections" | "quote"> & {
  eyebrow: string;
  numbersEyebrow: string;
  railPrompt: string;
  ctaHeading: string;
};
