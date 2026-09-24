import { type CaseStudy, findCaseStudy } from "./case-studies";

/**
 * The about page, `/about`.
 *
 * Layout from the client's design doc ("About Page.dc.html"); copy from
 * "Confyde — About page content and site fixes", verbatim. The page is the case
 * study template with a different article in it - the same hero, numbers card,
 * rail, quote and closing band - so the record is written to the case study's
 * own shape, minus the fields only a study has (slug, client, card), and
 * rendered by the same components.
 *
 * THE QUOTE IS PLANN'S. The design drew a stand-in quote credited to "Christy
 * Nguyen"; the page carries Christy Laurence's real testimonial instead, read
 * from the Plann record so the two pages cannot quote her differently.
 *
 * Still to settle before this is public:
 *
 *   1. "WHAT WE DON'T DO". The brief says to confirm each claim in it is true
 *      - no vendor commission, no reselling, no rebuild by default, and saying
 *      so when a hire would serve better - before publishing.
 *   2. THE COMPANY NUMBER. The brief has it as a stub, so the line prints
 *      without one until `company.number` is set.
 */

const plann = findCaseStudy("plann");
if (!plann) throw new Error("content/about.ts quotes the Plann case study, which is missing");

export const ABOUT = {
  eyebrow: "About Confyde",
  title: "The technical person on your side of the table.",
  lede:
    "Not sure what AI means for your business, worried you’re falling behind, or " +
    "unconvinced your team is building the right things? We give you a straight answer " +
    "on where you stand and what to do next, then help you do it.",
  meta: [
    { label: "Founded", value: "2024, London" },
    { label: "Who leads your work", value: "A senior operator, on every engagement" },
    { label: "What we do", value: "Technical strategy · AI · Software delivery" },
    { label: "How we work", value: "In writing, in plain English, accountable for the outcome" },
  ],
  numbersEyebrow: "Where our experience comes from",
  numbers: {
    items: [
      { figure: "12+ yrs", label: "leading engineering in travel, SaaS and AI" },
      {
        figure: "Startup to exit",
        label: "so we know what your business needs now, and what it’ll need next",
      },
      { figure: "Budget & team", label: "owned end to end: the hiring, the spend and the results" },
      {
        figure: "AI in production",
        label: "not pilots or demos, but live products real customers use every day",
      },
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
            "Most owners make their biggest technology decisions with nobody on their side " +
            "of the table. The vendor wants the sale, the agency wants the build, and the " +
            "team is too close to it to say no.",
        },
        {
          kind: "prose",
          text:
            "Confyde is who you’d want in the room: people who’ve run engineering inside a " +
            "growing business, sat on the selling side of an acquisition, and shipped AI to " +
            "real users. We tell you what to build, what to buy and what to stop paying " +
            "for, and then we stay accountable for how it goes.",
        },
        {
          kind: "callout",
          eyebrow: "What we believe",
          statement:
            "Advice is cheap. The value is in being accountable for what ships, and for " +
            "what happens after.",
        },
        {
          kind: "points",
          heading: "What that means for you",
          points: [
            {
              lead: "If someone will look closely at your business:",
              text:
                "We’ve been on the selling side of technical due diligence, so we know what " +
                "a buyer, investor or auditor asks, and we build to that standard from day one.",
            },
            {
              lead: "If you’re being told to use AI:",
              text:
                "We’ve put AI in front of hundreds of thousands of users with testing in " +
                "front of it, so we can tell you what will hold up and what’s a demo.",
            },
            {
              lead: "If you’re not a tech company:",
              text:
                "Kensington Tennis Club went from four systems to one app and one website, " +
                "and we’re still their technical answer today.",
            },
            {
              lead: "If you don’t speak the language:",
              text:
                "everything comes in writing, in plain English, with a recommendation rather " +
                "than a menu of options.",
            },
          ],
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
                "A short, paid review of the decision in front of you, delivered in writing " +
                "within a week. Sometimes the answer is “don’t do it”, and that’s worth " +
                "knowing before you spend.",
            },
            {
              title: "Embed and own it",
              detail:
                "A day or two a week inside your business, in your tools, accountable for " +
                "delivery rather than recommendations.",
            },
            {
              title: "Hand over on purpose",
              detail:
                "You own everything we build, it’s documented, and someone on your side " +
                "knows how it runs. Staying on should be your choice, not because you’re stuck.",
            },
          ],
        },
      ],
    },
    {
      id: "what-we-dont-do",
      heading: "What we don’t do",
      blocks: [
        { kind: "statement", text: "No kickbacks, no lock-in, no rebuild by default." },
        {
          kind: "prose",
          text:
            "We don’t take commission from software vendors, we don’t resell the tools we " +
            "recommend, and we don’t start from “tear it down.” If hiring someone would " +
            "serve you better than hiring us, we’ll say so.",
        },
      ],
    },
  ],
  /** The small print under the article. `number` is unset until supplied. */
  company: {
    name: "Confyd Ltd, trading as Confyde.",
    registered: "Registered in England and Wales",
    number: undefined,
    city: "London.",
  },
  quote: plann.quote,
  ctaHeading: "Got a decision on the table?",
  ctaBody: "Thirty minutes to work out whether it’s the right one.",
} satisfies Pick<CaseStudy, "title" | "lede" | "meta" | "numbers" | "sections" | "quote"> & {
  eyebrow: string;
  numbersEyebrow: string;
  railPrompt: string;
  ctaHeading: string;
  ctaBody: string;
  company: { name: string; registered: string; number?: string; city: string };
};
