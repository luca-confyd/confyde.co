/**
 * The five FAQ entries.
 *
 * COPY IS THE CLIENT'S (RULINGS.md principle 3). Nothing here is tidied - the
 * contractions, the sentence-as-a-question headings and the direct second person
 * are all theirs. Apostrophes are normalised to curly, which is the standing
 * typographic convention and not a copy edit.
 */
export type FaqEntry = {
  question: string;
  /**
   * The answer, as blocks rather than paragraphs.
   *
   * The artboard sets each answer as ONE `<p>` with hard breaks inside it, and
   * two real `<p>` elements would collapse to a different vertical rhythm. The
   * renderer joins these back with `<br><br>`. Every current answer is a single
   * block; the array shape stays because the renderer and the artboard both
   * assume it.
   */
  answer: readonly string[];
  /**
   * The mobile wording, where it differs. Unused at present - the five answers
   * are the same on both breakpoints - but kept because the renderer reads it
   * and the artboard's own copy diverged per breakpoint in three other places.
   */
  answerMobile?: readonly string[];
};

export const FAQ: readonly FaqEntry[] = [
  {
    question: "How do you work with us? Is this a project or ongoing?",
    answer: [
      "Both. Some clients bring us a defined piece of work: an AI system to build, an integration to sort out, a technical review before a funding round. Others keep us on a regular basis, a day or two a month, as the senior technical voice they don’t have in-house. We’ll tell you which one your situation actually needs.",
    ],
  },
  {
    question: "How do you charge?",
    answer: [
      "Project work is quoted upfront against a fixed scope, so you know the number before we start. Ongoing support is a monthly retainer based on the days you need. No long tie-ins.",
    ],
  },
  {
    question: "Do you build it yourselves, or do we still need developers?",
    answer: [
      "We build. If you already have a development team, we work alongside them and give them direction. If you don’t, we handle it end to end. The answer depends on what you’ve already got, and we’ll be straight with you about whether hiring is the better option.",
    ],
  },
  {
    question: "We don’t really know what we need. Is that a problem?",
    answer: [
      "No, that’s usually the starting point. Most clients come to us knowing something isn’t working or that they should be doing more with AI, without knowing what that means in practice. Working that out is the first part of the job.",
    ],
  },
  {
    question: "What happens once you’re gone?",
    answer: [
      "You own everything we build. We document it, hand it over properly, and make sure someone on your side knows how it runs. If you’d rather we stayed on to maintain it, we can, but that should be your choice and not because you’re stuck.",
    ],
  },
];
