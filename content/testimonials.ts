/**
 * The testimonials carousel's records.
 *
 * FOUR REAL PEOPLE. The six invented landscaping quotes the artboards shipped
 * with ("Occo Landscapers", "Coastal Gardens", "BuildRight" and the rest) are
 * gone; what is left is named clients and colleagues who said these things.
 *
 * TWO OF THEM ARE FAREWELL MESSAGES, cut rather than rewritten. Wayne
 * Lincoln's and Toni McHenry's were written to a departing colleague, not to a
 * website, so the edit is a truncation at a sentence boundary and nothing else:
 * no tightening, no reordering, no words added. Both want the speaker's
 * sign-off before this ships.
 *
 * TWO ARRAYS, NOT ONE WITH A SLICE. Mobile carries the same four people with
 * shorter quotes: that board sets a third narrower and its longest card was
 * about 110 characters, where these run to 165 unabridged. Each mobile string
 * is a truncation of its desktop twin at a sentence or clause boundary.
 *
 * Apostrophes are U+2019 throughout.
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
  /**
   * Decorative - the name is rendered immediately beside it. Still required
   * with a `portrait` set: it is the plate a card without a headshot draws, and
   * leaving it in place means removing the photograph cannot leave a hole.
   */
  initials: string;
  /**
   * A headshot for the plate, where one exists. Square: the desktop card draws
   * it at 40px with a 12px corner and the mobile card at 32px as a circle, both
   * the shapes their tone fills already take.
   */
  portrait?: string;
  name: string;
  role: string;
  tone: AvatarTone;
};

/** The desktop carousel, >=1024px. */
export const TESTIMONIALS_DESKTOP: readonly Testimonial[] = [
  {
    org: "Plann",
    quote:
      "“Confyde helped us automate processes we didn’t even realise were costing us hours each week. In the first month alone we reduced admin time by 35% and improved customer response times significantly.”",
    initials: "CL",
    portrait: "/images/christy-laurence.jpeg",
    name: "Christy Laurence",
    role: "Founder",
    tone: "forest-800",
  },
  {
    org: "Linktree",
    quote:
      "“The Plann and Linktree teams have been extremely fortunate to have such a smart and genuinely caring leader at the helm. I’ll miss our open and candid weekly chats.”",
    initials: "WL",
    portrait: "/images/wayne-lincoln.jpeg",
    name: "Wayne Lincoln",
    role: "Engineering Manager",
    tone: "forest-900",
  },
  {
    org: "Kensington Tennis Club",
    quote:
      "“We used to run the club across four different systems and count the shop takings by hand. Now it’s one app, one website, and I can see everything in one place.”",
    initials: "JS",
    portrait: "/images/jonathan-smith.jpeg",
    name: "Jonathan Smith",
    role: "Owner",
    tone: "forest-700",
  },
  {
    org: "Linktree",
    quote:
      "“What a wild ride. Am so going to miss your calm and caring vibe and your voice of reason in our Plann chaos.”",
    initials: "TM",
    portrait: "/images/toni-mchenry.jpeg",
    name: "Toni McHenry",
    role: "Head of Business Marketing",
    tone: "forest-800",
  },
];

/** The mobile scroller, <1024px. The same four, cut shorter. */
export const TESTIMONIALS_MOBILE: readonly Testimonial[] = [
  {
    org: "Plann",
    quote:
      "“Confyde helped us automate processes we didn’t even realise were costing us hours each week. In the first month alone we reduced admin time by 35%.”",
    initials: "CL",
    portrait: "/images/christy-laurence.jpeg",
    name: "Christy Laurence",
    role: "Founder",
    tone: "forest-800",
  },
  {
    org: "Linktree",
    quote:
      "“The Plann and Linktree teams have been extremely fortunate to have such a smart and genuinely caring leader at the helm.”",
    initials: "WL",
    portrait: "/images/wayne-lincoln.jpeg",
    name: "Wayne Lincoln",
    role: "Engineering Manager",
    tone: "forest-900",
  },
  {
    org: "Kensington Tennis Club",
    quote:
      "“We used to run the club across four different systems. Now it’s one app, one website, and I can see everything in one place.”",
    initials: "JS",
    portrait: "/images/jonathan-smith.jpeg",
    name: "Jonathan Smith",
    role: "Owner",
    tone: "forest-700",
  },
  {
    org: "Linktree",
    quote:
      "“Am so going to miss your calm and caring vibe and your voice of reason in our Plann chaos.”",
    initials: "TM",
    portrait: "/images/toni-mchenry.jpeg",
    name: "Toni McHenry",
    role: "Head of Business Marketing",
    tone: "forest-800",
  },
];
