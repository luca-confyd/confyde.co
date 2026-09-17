/**
 * The testimonials carousel's records.
 *
 * Two arrays, not one with a slice. The mobile artboard shows three of the
 * desktop six, and for the three it keeps it also shortens two of the quotes
 * and one of the organisation names ("Occo Landscapers" against "Occo
 * Landscapers & Builders"). That is the client editing the same quote twice for
 * two measures, so both sides are carried verbatim rather than derived - a
 * mobile string that looks like a truncation of its desktop twin would be
 * silently re-edited the moment the desktop one changed (RULINGS.md principle
 * 3).
 *
 * Apostrophes are U+2019 throughout; the desktop board writes them straight and
 * the mobile board curly, for the same words. Normalising is typographic, not a
 * copy edit (RULINGS.md §02 ruling 10). The quotation marks and the em dashes
 * are the artboards' own characters and are untouched - docs/brand.md bans em
 * dashes in Confyde's voice, but this is a customer speaking.
 */

/**
 * The avatar tile's fill. The three tones are the artboards' own and they track
 * the person, not the position: Dave Nguyen is forest-700 and Tom Reeves
 * forest-900 on both boards although they sit at different indices. Named
 * rather than a Tailwind class so `content/` stays free of markup.
 */
export type AvatarTone = "forest-800" | "forest-700" | "forest-900";

export type Testimonial = {
  org: string;
  quote: string;
  /** Decorative - the name is rendered immediately beside it. */
  initials: string;
  name: string;
  role: string;
  tone: AvatarTone;
};

/** The desktop carousel, >=1024px. Six cards, in the artboard's order. */
export const TESTIMONIALS_DESKTOP: readonly Testimonial[] = [
  {
    org: "Occo Landscapers & Builders",
    quote:
      "“Confyde scaled our quoting more than 10×. It’s not about doing more quotes — it’s getting them out the same day, every time.”",
    initials: "DN",
    name: "Dave Nguyen",
    role: "Owner",
    tone: "forest-700",
  },
  {
    org: "Coastal Gardens",
    quote:
      "“We needed to follow up without nagging, and build real relationships with clients. Confyde does that at scale.”",
    initials: "SW",
    name: "Sam Whitfield",
    role: "Owner",
    tone: "forest-800",
  },
  {
    org: "BuildRight",
    quote:
      "“Clients trust a clear quote. Confyde turns our numbers into something they actually understand — every time.”",
    initials: "PS",
    name: "Priya Shah",
    role: "Estimator",
    tone: "forest-900",
  },
  {
    org: "Elm & Oak",
    quote:
      "“I was sceptical of AI. Confyde’s pricing is genuinely strong — it finds line items I’d have missed and flags where I’m underquoting.”",
    initials: "TR",
    name: "Tom Reeves",
    role: "Owner",
    tone: "forest-700",
  },
  {
    org: "Harbour Pools",
    quote:
      "“Confyde feels like a teammate. I describe the job and it fleshes out scope, materials and margin in minutes — work that used to eat my evenings.”",
    initials: "JL",
    name: "Jess Lam",
    role: "Director",
    tone: "forest-800",
  },
  {
    org: "GreenScape",
    quote:
      "“Before Confyde, chasing quotes and invoices was chaos. Now it’s all in one place and I can see exactly what’s working.”",
    initials: "AM",
    name: "Alex Morgan",
    role: "Owner",
    tone: "forest-900",
  },
];

/** The mobile scroller, <1024px. Three cards, and not the first three. */
export const TESTIMONIALS_MOBILE: readonly Testimonial[] = [
  {
    org: "Occo Landscapers",
    quote:
      "“Confyde scaled our quoting more than 10×. It’s getting them out the same day, every time.”",
    initials: "DN",
    name: "Dave Nguyen",
    role: "Owner",
    tone: "forest-700",
  },
  {
    org: "Coastal Gardens",
    quote:
      "“We needed to follow up without nagging, and build real relationships with clients. Confyde does that at scale.”",
    initials: "SW",
    name: "Sam Whitfield",
    role: "Owner",
    tone: "forest-800",
  },
  {
    org: "Elm & Oak",
    quote:
      "“I was sceptical of AI. Confyde’s pricing is genuinely strong — it flags where I’m underquoting.”",
    initials: "TR",
    name: "Tom Reeves",
    role: "Owner",
    tone: "forest-900",
  },
];
