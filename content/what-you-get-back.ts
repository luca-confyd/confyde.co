/**
 * "What you get back" - the three-card band that closes the middle of the page.
 *
 * ONE ARRAY, TWO EYEBROWS. The two artboards draw the same three cards with the
 * same figures, leads and bodies; only two strings differ, and both are the
 * client's own edit rather than a reflow:
 *
 *   card 1 eyebrow   desktop "AI SOFTWARE"      mobile "Quoting"
 *   card 3 figure    desktop "Prompt payments"  mobile "Prompt invoices"
 *
 * [LOG] Both are preserved per breakpoint rather than unified (RULINGS.md §02
 * rulings 12-14: two different moments, not ours to reconcile). The first pair
 * is the odder one - "AI SOFTWARE" is also the only eyebrow on the page typed
 * in capitals in the source rather than uppercased in CSS, and it names a
 * product category where its two neighbours name a job the reader does. Worth
 * asking the client about.
 */

export type GetBackCard = {
  eyebrowDesktop: string;
  eyebrowMobile: string;
  figureDesktop: string;
  figureMobile: string;
  lead: string;
  body: string;
};

export const GET_BACK = {
  eyebrow: "What you get back",
  /*
    The desktop artboard breaks this by hand after "first." and balances what is
    left; mobile sets it as one run. Carried as two strings so the break stays a
    composition decision in the component that draws it, not a `<br>` buried in
    a content module.
  */
  headingFirst: "The hours come back first.",
  headingSecond: "The wins, jobs, and profit follow.",
} as const;

export const GET_BACK_CARDS: readonly GetBackCard[] = [
  {
    eyebrowDesktop: "AI SOFTWARE",
    eyebrowMobile: "Quoting",
    figureDesktop: "4 hrs → 30 mins",
    figureMobile: "4 hrs → 30 mins",
    lead: "To build a client-ready estimate",
    body:
      "Take-off, pricing and scope arrive pre-filled. And because Bramble learns how you quote, " +
      "it gets faster and sharper every job you send.",
  },
  {
    eyebrowDesktop: "Client communication",
    eyebrowMobile: "Client communication",
    figureDesktop: "1 in 3",
    figureMobile: "1 in 3",
    lead: "More jobs won after you send",
    body: "Bramble tells you who opened it, what they read and when to call. Fewer quotes go quiet.",
  },
  {
    eyebrowDesktop: "Managing jobs",
    eyebrowMobile: "Managing jobs",
    figureDesktop: "Prompt payments",
    figureMobile: "Prompt invoices",
    lead: "Every variation and invoice, billed on time",
    body:
      "Extra work gets priced and approved as it happens, and the invoice goes out the day the " +
      "job is done.",
  },
];
