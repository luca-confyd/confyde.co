/**
 * The case studies, and the shape the page template renders.
 *
 * WHAT IS REAL AND WHAT IS NOT. The Plann and Linktree records carry copy and
 * figures supplied by the client about their own work. KENSINGTON IS STILL A
 * STUB, written to the same shape so the template has three real routes to
 * render; every figure and sentence in it is a PLACEHOLDER.
 *
 * Still to settle before this is public:
 *
 *   1. BOTH QUOTES. Plann's is Christy Laurence's, supplied. Linktree's is
 *      still "Stub quote / Client name", attributed to a real company.
 *   2. LINKTREE IS A CURRENT EMPLOYER and that record names internal figures.
 *      Worth clearing with whoever owns comms there before it ships.
 *   3. PHOTOGRAPHY. Only Plann has a `figure` with a `src`; the other two draw
 *      the hatched placeholder, as the design does, rather than borrowing the
 *      homepage's landscape stock (see the note in content/customer-stories.ts
 *      - that stock is already wrong there).
 *
 * WHY THE BODY IS A BLOCK LIST. The design draws one article: three headings,
 * some paragraphs, a callout, a numbered list and an image. Typing that shape
 * into the template would make every future case study the same article. So a
 * section is a heading plus an ordered list of blocks, the template switches on
 * the block type, and the "On this page" rail is derived from the sections
 * rather than maintained beside them - which is also why `id` lives here: it is
 * both the anchor and the rail's href.
 */

/** A paragraph of body copy. */
export type ProseBlock = { kind: "prose"; text: string };

/**
 * The tinted panel the design labels "Where Confyde came in": an eyebrow over
 * one serif sentence. One sentence, not a paragraph - it is a summary, and the
 * design's type size only works at that length.
 */
export type CalloutBlock = { kind: "callout"; eyebrow: string; statement: string };

/** The numbered rows under "What we did". Numbering is the index, not content. */
export type StepsBlock = {
  kind: "steps";
  steps: readonly { title: string; detail: string }[];
};

/**
 * Artwork, or the slot where it belongs.
 *
 * With no `src` this is a placeholder and `caption` is what the hatched box
 * prints - "product / team photo · 16:9" in the design - so it describes what
 * belongs there rather than captioning an image. With a `src` the image is
 * drawn in the same 16:9 frame and `caption` becomes its alt text, which is why
 * a real figure's caption is written as a description of the picture rather
 * than as a brief for one.
 */
export type FigureBlock = { kind: "figure"; caption: string; src?: string };

/**
 * A serif headline inside a section, set between the section heading and the
 * prose - "No kickbacks, no lock-in, no rebuild by default." on the about page.
 */
export type StatementBlock = { kind: "statement"; text: string };

/**
 * A bulleted list of bold lead-ins and their sentences, under an optional
 * subheading. Unlike a section, the subheading is not in the "On this page"
 * rail: it is part of the section it sits in.
 */
export type PointsBlock = {
  kind: "points";
  heading?: string;
  points: readonly { lead: string; text: string }[];
};

export type CaseStudyBlock =
  | ProseBlock
  | CalloutBlock
  | StepsBlock
  | FigureBlock
  | StatementBlock
  | PointsBlock;

export type CaseStudySection = {
  /** The anchor, and the rail's href. Kebab-case, unique within the study. */
  id: string;
  heading: string;
  blocks: readonly CaseStudyBlock[];
};

export type CaseStudy = {
  /** The URL segment. `/case-studies/<slug>`. */
  slug: string;
  /** The company. Set in the eyebrow as "Case study / <client>". */
  client: string;
  title: string;
  lede: string;
  /** The hero's right-hand column: industry, services, engagement. */
  meta: readonly { label: string; value: string }[];
  /**
   * The four-figure card that overlaps the foot of the hero. Optional: a study
   * with nothing measured yet omits the card rather than drawing stand-in
   * figures beside real client names.
   */
  numbers?: {
    /**
     * The line opposite the eyebrow - when the figures were measured. Optional:
     * a study with no such qualifier omits it and the eyebrow sits alone on the
     * row, rather than carrying a line of filler across from it.
     */
    note?: string;
    items: readonly { figure: string; label: string }[];
  };
  sections: readonly CaseStudySection[];
  quote: {
    text: string;
    /**
     * Two letters for the plate. Derived would be wrong for one-word names.
     * Still required with a `portrait` set: it is what the plate falls back to
     * for a study with no headshot, and the two should not drift apart if one
     * is later removed.
     */
    initials: string;
    /** A headshot for the plate, where one exists. Square: it is drawn at 44px. */
    portrait?: string;
    name: string;
    role: string;
  };
  /** The card in "More of where we've worked" on the other two studies. */
  card: { title: string; blurb: string };
};

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    slug: "plann",
    client: "Plann",
    title: "Building the team behind the exit.",
    lede:
      "Engineering leadership, growth strategy and the hiring that took Plann from a " +
      "founder-led product to an acquired business, without stalling the roadmap.",
    meta: [
      { label: "Industry", value: "Marketing technology" },
      { label: "Services", value: "Technical strategy · Engineering delivery · Hiring" },
      { label: "Role", value: "Chief Technology Officer, in-house, 2018–2024" },
    ],
    numbers: {
      items: [
        { figure: "3 → 20", label: "Engineers, across four teams in five countries" },
        { figure: "5.5×", label: "Monthly revenue growth, US$55K to US$300K" },
        { figure: "8 weeks", label: "Sell-side technical due diligence, start to close" },
        { figure: "3M", label: "Registered users, 160+ countries" },
      ],
    },
    sections: [
      {
        id: "the-problem",
        heading: "The problem",
        blocks: [
          {
            kind: "prose",
            text:
              "Plann had product-market fit and three engineers. The product was selling in 160 " +
              "countries, but every release depended on a couple of people, the roadmap was a " +
              "list of intentions rather than commitments, and the infrastructure bill climbed " +
              "with every new signup.",
          },
          {
            kind: "prose",
            text:
              "The founders did not need another strategy document. They needed someone " +
              "accountable for engineering while the business kept selling.",
          },
          {
            kind: "callout",
            eyebrow: "Where we came in",
            statement:
              "Chief Technology Officer, on the executive team, reporting to the CEO, owning " +
              "the engineering budget, the hiring, and the answer to “can we build that.”",
          },
        ],
      },
      {
        id: "what-we-did",
        heading: "What we did",
        blocks: [
          {
            kind: "steps",
            steps: [
              {
                title: "Built the team around the work",
                detail:
                  "Three engineers to twenty, across four teams and five countries, inside a " +
                  "50-person company, with four managers reporting in. Hiring, performance and " +
                  "progression frameworks built from nothing, so the team kept working as it " +
                  "grew instead of slowing down.",
              },
              {
                title: "Built the platform to carry the growth",
                detail:
                  "Architected on AWS from the ground up to serve three million registered " +
                  "users. Kept the mobile app in-house rather than outsourcing it, and cut two " +
                  "planned features to land it inside one quarter. That was the call that got " +
                  "it shipped.",
              },
              {
                title: "Made the company diligence-proof",
                detail:
                  "Security, cost and ownership documented to the standard an acquirer’s " +
                  "technical team actually asks for. Ran the annual Meta data protection " +
                  "assessment the business’s API access depended on, year after year.",
              },
            ],
          },
          {
            kind: "figure",
            src: "/images/plann-screen.png",
            caption:
              "The Plann marketing site, badged “by Linktree”: “Plann’s social " +
              "media management tools, trusted by 3M global brands”, over a row of " +
              "customer accounts and their follower counts.",
          },
        ],
      },
      {
        id: "what-changed",
        heading: "What changed",
        blocks: [
          {
            kind: "prose",
            text:
              "Revenue went from US$55K to US$300K a month. A new link-in-bio product added " +
              "8% to annual revenue. Releases stopped being events, and on-call stopped " +
              "landing on the founders.",
          },
          {
            kind: "prose",
            text:
              "When the acquisition conversation started, the technical answers were already " +
              "written down. Sell-side due diligence closed in eight weeks. Linktree acquired " +
              "the business in August 2024, platform and team intact, and kept the team on to " +
              "run the integration.",
          },
        ],
      },
    ],
    quote: {
      text:
        "Confyde helped us automate processes we didn’t even realise were costing us hours " +
        "each week. In the first month alone we reduced admin time by 35% and improved " +
        "customer response times significantly.",
      initials: "CL",
      portrait: "/images/christy-laurence.jpeg",
      name: "Christy Laurence",
      role: "Founder, Plann",
    },
    card: {
      title: "Building the team behind the exit",
      blurb:
        "Engineering leadership, growth strategy and hiring, from founder-led product to " +
        "acquired business.",
    },
  },

  {
    slug: "linktree",
    client: "Linktree",
    title: "AI that survives 70 million users.",
    lede:
      "Taking AI features from demo to production at scale: evaluation before release, " +
      "humans accountable for the output, and a growth curve the business could rely on.",
    meta: [
      { label: "Industry", value: "Creator platform" },
      {
        label: "Focus",
        value: "AI product delivery · Evaluation and guardrails · Engineering practice",
      },
      { label: "Role", value: "Head of Grow Engineering" },
    ],
    numbers: {
      items: [
        { figure: "80%", label: "Fewer P1 incidents during the integration" },
        { figure: "Weekly", label: "Release cadence, with evaluation in front" },
        { figure: "~25%", label: "Less delivery time on medium-sized work" },
        { figure: "Zero", label: "Downtime on the platform migration" },
      ],
    },
    sections: [
      {
        id: "the-problem",
        heading: "The problem",
        blocks: [
          {
            kind: "prose",
            text:
              "Everyone can build an AI demo. Very few can put one in front of millions of " +
              "users and stand behind what it says.",
          },
          {
            kind: "prose",
            text:
              "The gap is not the model. It is everything around it: knowing whether a change " +
              "made the feature better or worse, catching the bad answer before a customer " +
              "sees it, and being able to ship weekly without holding your breath each time.",
          },
          {
            kind: "callout",
            eyebrow: "Where we came in",
            statement:
              "Head of Grow Engineering, accountable for the AI features the business grows " +
              "on and for the practice that puts them in front of users safely.",
          },
        ],
      },
      {
        id: "what-we-did",
        heading: "What we did",
        blocks: [
          {
            kind: "steps",
            steps: [
              {
                title: "Made AI features testable before release",
                detail:
                  "An evaluation framework, so every AI feature is measured against real cases " +
                  "before it ships rather than judged by whoever tried it last. The team can " +
                  "answer “is this version better?” with evidence instead of opinion.",
              },
              {
                title: "Scaled an agentic product to half a million users",
                detail:
                  "Two teams, led through their managers, took agentic AI insights and " +
                  "peer-to-peer messaging from twenty thousand to five hundred thousand " +
                  "monthly active users in three months, and kept it reliable enough to leave " +
                  "running.",
              },
              {
                title: "Put AI inside how the team works, not just the product",
                detail:
                  "Implementation moved to AI tooling with engineers owning problem " +
                  "definition, review and verification. Delivery time on medium-sized work " +
                  "dropped by roughly a quarter. The judgement stayed with people; the typing " +
                  "did not.",
              },
            ],
          },
          {
            kind: "figure",
            src: "/images/linktree-screen.png",
            caption:
              "The Linktree home page: “A link in bio built for you”, with a claim of " +
              "70M+ people using it, beside a photograph of the creator Zay Dante next to a " +
              "phone showing his own Linktree.",
          },
        ],
      },
      {
        id: "what-changed",
        heading: "What changed",
        blocks: [
          {
            kind: "prose",
            text:
              "Two companies became one platform and customers did not notice. An entire user " +
              "base migrated with zero downtime, with unified billing and login behind it. The " +
              "AI features that drove growth went out on a weekly cadence with evaluation in " +
              "front of them.",
          },
          {
            kind: "callout",
            eyebrow: "What this means for you",
            statement:
              "AI in production is an engineering discipline problem wearing a machine " +
              "learning costume. The teams that win are the ones who can tell whether last " +
              "week’s change helped.",
          },
        ],
      },
    ],
    quote: {
      /*
        HIS WORDS, CUT NOT REWRITTEN. The source is a farewell message rather
        than a testimonial, so the edit is a truncation at a sentence boundary
        and nothing else: no tightening, no reordering, no words added. What is
        dropped is the second half, which is about what he hoped came next and
        reads as a goodbye rather than as a reference.

        It is still a private message repurposed in public. Worth his sign-off
        before this ships, and his own wording if he would rather write one.
      */
      text:
        "The Plann and Linktree teams have been extremely fortunate to have such a smart and " +
        "genuinely caring leader at the helm. I’ll miss our open and candid weekly chats.",
      initials: "WL",
      portrait: "/images/wayne-lincoln.jpeg",
      name: "Wayne Lincoln",
      role: "Engineering Manager, Linktree",
    },
    card: {
      title: "AI that survives 70 million users",
      blurb:
        "Evaluation before release, humans accountable for the output, and growth the " +
        "business could rely on.",
    },
  },

  {
    slug: "kensington-tennis-club",
    client: "Kensington Tennis Club",
    title: "A members’ club that runs itself.",
    lede:
      "An app and website rebuilt around how the club actually makes money: bookings, " +
      "coaching, membership and retail in one system, with the technical decisions handled " +
      "so the club does not have to think about them.",
    meta: [
      { label: "Industry", value: "Sport and membership" },
      {
        label: "Services",
        value: "Product rebuild · Commerce and payments · Ongoing technical advisory",
      },
      { label: "Engagement", value: "Embedded, ongoing" },
    ],
    /*
      NO NUMBERS CARD. The other two studies open on four measured figures; this
      one has none yet. The card is omitted rather than filled with stand-ins,
      because a page whose whole argument is "the club sells in more places and
      does less work per sale" is exactly the page a made-up figure would
      discredit. One real number - shop revenue in the first quarter, or growth
      in bookings since launch - and it comes back.
    */
    sections: [
      {
        id: "the-problem",
        heading: "The problem",
        blocks: [
          {
            kind: "prose",
            text:
              "A club’s revenue rarely sits in one place. Court bookings here, coaching " +
              "there, membership somewhere else, and anything sold at the club counted by " +
              "hand.",
          },
          {
            kind: "prose",
            text:
              "Kensington Tennis Club had members using an app and a website that did not talk " +
              "to each other, and no single view of who a member was or what they had paid " +
              "for. Every new way to take money meant another system to run, and the technical " +
              "questions underneath it, from payments to app store rules to who owns the " +
              "customer data, had nobody to answer them.",
          },
          {
            kind: "callout",
            eyebrow: "Where we came in",
            statement:
              "The club’s technical answer: the product rebuild, the payment and " +
              "compliance decisions, and someone accountable for the next one.",
          },
        ],
      },
      {
        id: "what-we-did",
        heading: "What we did",
        blocks: [
          {
            kind: "steps",
            steps: [
              {
                title: "Rebuilt the app and website as one product",
                detail:
                  "A native iOS app and a modern website sharing the same data, so a member is " +
                  "the same person whether they book a court on their phone or buy a racquet " +
                  "on their laptop.",
              },
              {
                title: "Monetised every touchpoint",
                detail:
                  "Bookings, coaching, membership and a full retail shop, each set up to take " +
                  "payment cleanly, with a consignment model so the club can sell other " +
                  "people’s stock without holding the stock itself. New revenue lines that " +
                  "do not add admin.",
              },
              {
                title: "Made the payment and compliance decisions once, properly",
                detail:
                  "Payments consolidated onto a single platform instead of stitched together. " +
                  "App Store rules understood in advance rather than discovered at rejection, " +
                  "which is the difference between shipping on schedule and losing a month.",
              },
              {
                title: "Stayed on as the technical answer",
                detail:
                  "Ongoing guidance on strategy, security and where AI genuinely helps, so the " +
                  "club has someone accountable for the technical side without hiring for it.",
              },
            ],
          },
          {
            kind: "figure",
            src: "/images/ktc-screen.png",
            caption:
              "The Kensington Tennis Club site: “A modern members’ club, here for every " +
              "player” over a photograph of a player at the net, with Memberships, Coaching, " +
              "Club and Shop in the nav and a Book Court button.",
          },
        ],
      },
      {
        id: "what-changed",
        heading: "What changed",
        blocks: [
          {
            kind: "prose",
            text:
              "The club sells in more places than it used to, and does less work per sale. " +
              "Members deal with one club rather than four systems. When a new idea comes up, " +
              "a new product line or a new way to charge for coaching, the answer is a " +
              "decision rather than a project.",
          },
          {
            kind: "callout",
            eyebrow: "What this means for you",
            statement:
              "Most small organisations do not need a technology strategy. They need someone " +
              "who will make the twenty unglamorous decisions correctly, in order, and be " +
              "around when the next one lands.",
          },
        ],
      },
    ],
    quote: {
      text:
        "We used to run the club across four different systems and count the shop takings by " +
        "hand. Now it’s one app, one website, and I can see everything in one place.",
      initials: "JS",
      portrait: "/images/jonathan-smith.jpeg",
      name: "Jonathan Smith",
      role: "Owner, Kensington Tennis Club",
    },
    card: {
      title: "A members’ club that runs itself",
      blurb:
        "Bookings, coaching, membership and retail in one system, with the technical " +
        "decisions handled.",
    },
  },
];

/** The route for a study, so no call site spells the path out. */
export function caseStudyPath(slug: string): string {
  return `/case-studies/${slug}`;
}

export function findCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((study) => study.slug === slug);
}

/**
 * The image a card for this study shows: its article's first figure that has
 * one, or nothing if the study is still drawing hatched slots.
 *
 * DERIVED RATHER THAN A `cover` FIELD. A second path to the same file is a
 * second place to update it, and a card showing a picture the article does not
 * is the kind of drift nobody notices. If a study ever wants a cover that is
 * NOT its article's figure, that is the point to add the field.
 */
export function caseStudyCover(study: CaseStudy): string | undefined {
  for (const section of study.sections) {
    for (const block of section.blocks) {
      if (block.kind === "figure" && block.src) return block.src;
    }
  }
  return undefined;
}

/** The other studies, in their own order - the "more of where we've worked" row. */
export function otherCaseStudies(slug: string): readonly CaseStudy[] {
  return CASE_STUDIES.filter((study) => study.slug !== slug);
}
