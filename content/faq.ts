/**
 * The eleven FAQ entries.
 *
 * Both artboards ask the same eleven questions in the same order, and ten of
 * the eleven answers are byte-identical between them - so this is one list with
 * a per-breakpoint override on the one entry that differs, rather than two.
 *
 * COPY IS THE CLIENT'S (RULINGS.md principle 3). Nothing here is tidied: the
 * exclamation mark in "Excellent news!" stays although docs/brand.md bans them,
 * "AI-powered" keeps its hyphen, and the sentence-as-a-question headings
 * ("My quoting is fine. I just have too much of it.") keep their full stops.
 * There are no apostrophes anywhere in this copy, so the standing curly-quote
 * normalisation has nothing to do here.
 */
export type FaqEntry = {
  question: string;
  /**
   * The answer, split at the artboard's `<br><br>` breaks.
   *
   * Blocks, not paragraphs: the artboards set each answer as ONE `<p>` with
   * hard breaks inside it, and two real `<p>` elements would collapse to a
   * different vertical rhythm. The renderer joins these back with `<br><br>`.
   */
  answer: readonly string[];
  /**
   * The mobile artboard's wording, where it differs. Preserved rather than
   * unified, for the same reason RULINGS.md §02 rulings 12-14 preserve the
   * hero's two CTA labels: the two boards are two moments, and picking a winner
   * is the client's call, not ours.
   */
  answerMobile?: readonly string[];
};

export const FAQ: readonly FaqEntry[] = [
  {
    question: "What is Bramble?",
    // [LOG] The only copy divergence in the section. Desktop capitalises
    // "Landscapers" and ends on a non-breaking space; mobile does neither. Both
    // ship as drawn. The   is the artboard's own trailing `&nbsp;`.
    answer: [
      "A complete AI-powered sales system for landscape businesses. It scopes and prices the work off your own rates, wins you more of the jobs you quote, and gets faster the more you put through it.",
      "Designed specifically for Landscapers who want to build a bigger business, with less admin. ",
    ],
    answerMobile: [
      "A complete AI-powered sales system for landscape businesses. It scopes and prices the work off your own rates, wins you more of the jobs you quote, and gets faster the more you put through it.",
      "Designed specifically for landscapers who want to build a bigger business, with less admin.",
    ],
  },
  {
    question: "Who is it for?",
    answer: [
      "Busy residential landscapers, pool builders, and builders who are drowning in quotes, losing jobs they never followed up, and know they need a proper sales system but do not have a spare month to build one.",
      "If you write a scope of works and price off your own rates, you are in the right place. Whether you quote on your own, run a team, or have an estimator in the seat, Bramble is built for the way you already work.",
    ],
  },
  {
    question: "Will it guess my prices wrong?",
    answer: [
      "No. Bramble does not price from a national cost database. Every line is priced off your own supplier pricelists and your own past quotes, so the number is yours, and you can see which supplier and which rate it came from. You set the margin, and nothing goes to a client until you send it.",
    ],
  },
  {
    question: "How long does it take to set up?",
    answer: [
      "Signing up is instant. Setting up is about 30 minutes: drop in a few old quotes and a supplier pricelist, and Bramble builds your price library from them. Most landscapers send their first quote in the same sitting. If you would rather walk through it with someone, book a demo and we will help you get set up.",
    ],
  },
  {
    question: "Will my trades actually use it?",
    answer: [
      "Your sparkie or plumber gets one message with one requirement and one price field, and answers it in two minutes from their phone. You get the prices back side by side, and every trade is told where the job is at without you chasing.",
    ],
  },
  {
    question: "Can I use Bramble with my team?",
    answer: [
      "Absolutely. Bramble keeps everyone on the same page, so nobody has to ask where a job is at. You can see who is quoting what and who is closing the most, or give one person the job of running Bramble and closing the work while the rest of the crew stays on the tools.",
    ],
  },
  {
    question: "My quoting is fine. I just have too much of it.",
    answer: [
      "Then volume is exactly what Bramble is for. Once it knows your prices, it measures the plan and prices the lines faster than anyone can type them, so the pile clears in an afternoon rather than a weekend. And every one you send tells you what the client read, so you also know which ones to chase.",
    ],
  },
  {
    question: "Is it too expensive for what I do?",
    answer: [
      "It usually pays for itself on the first job. One variation billed instead of eaten, or one client who says yes without asking for a discount, covers the month.",
    ],
  },
  {
    question: "I already have a spreadsheet and a way of doing things.",
    answer: [
      "Excellent news! Upload it straight into Bramble, your spreadsheet becomes your price library on day one, and from then on, every job, price, client and conversation lands in one place as a by-product of quoting. It stays current because the work put it there, not because someone remembered to update it.",
    ],
  },
  {
    question: "Does it work with Xero?",
    answer: [
      "Yes. Milestones are set on the quote and invoiced in Xero as each one falls due. Variations are billed the same way. No re-keying.",
    ],
  },
  {
    question: "What happens to my data?",
    answer: [
      "Your quotes, prices and clients are yours. Bramble learns from your own files to price your own jobs.",
    ],
  },
];
