/**
 * "What you get back" - the three-card band that closes the middle of the page.
 *
 * ONE SET OF STRINGS. The shape used to carry a desktop and a mobile variant for
 * two of the fields, because the two artboards drew different words there. The
 * replacement copy is the same on both, so those pairs are gone rather than left
 * holding identical values and inviting a future drift.
 *
 * COPY IS THE CLIENT'S (RULINGS.md principle 3). The arrows are U+2192, which
 * docs/brand.md sanctions as type rather than iconography.
 */

export type GetBackCard = {
  eyebrow: string;
  figure: string;
  lead: string;
  body: string;
};

export const GET_BACK = {
  eyebrow: "What you get back",
  /*
    Two strings, not one with a `<br>`: the desktop artboard breaks this by hand
    and mobile sets it as one run, so where the break falls stays a composition
    decision in the component that draws it.
  */
  headingFirst: "Clarity in the first few weeks.",
  headingSecond: "Hours and savings from there on.",
} as const;

export const GET_BACK_CARDS: readonly GetBackCard[] = [
  {
    eyebrow: "Technical direction",
    figure: "Weeks → days",
    lead: "To know what’s actually worth building",
    body:
      "You get a straight view of where AI fits, what to build, what to buy, and what to stop " +
      "paying for, instead of months of circling the same decision.",
  },
  {
    eyebrow: "AI agents",
    figure: "Hours → minutes",
    lead: "On the work your team repeats every week",
    body:
      "Quotes, reports, data entry, chasing information. The jobs that fill a week start running " +
      "without anyone watching them.",
  },
  {
    eyebrow: "Your data",
    figure: "Five places → one",
    lead: "To get an answer out of your own business",
    body:
      "Your systems connected so your team can find what they need without going through whoever " +
      "happens to know where it lives.",
  },
];
