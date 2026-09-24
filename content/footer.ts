/**
 * The footer's copy.
 *
 * ONE LINK LIST, BOTH BREAKPOINTS. The artboards drew two: a desktop set of
 * the template's product pages (Features, Pricing, Security, Changelog,
 * Careers, Blog, Help centre) and a mobile set of quoting-software features
 * (Quoting, Proposals, Follow-ups, Client CRM). None of those exist, so both
 * went, and what is left is the same four links at every width.
 *
 * CONTACT HAS NO PAGE YET. It stays, as asked, and renders as the inert
 * <NavItem> every destination-less link on the site uses. Adding `href` is the
 * whole switch once it exists.
 */

export type FooterLink = {
  readonly label: string;
  /** The destination. Absent means the page does not exist yet. */
  readonly href?: string;
};

export type FooterColumn = {
  readonly heading: string;
  readonly links: readonly FooterLink[];
};

/* One blurb for both breakpoints. The artboards wrote two - "Landscape
   businesses" on desktop, "landscapers" on mobile - and that difference was
   preserved while it existed; the replacement copy is the same on both, so two
   constants holding one string would only invite them to drift apart again. */
export const FOOTER_BLURB =
  "Technical expertise for growing businesses. We work out where AI fits, build the systems behind it, and stay accountable for how they run.";

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      // The homepage's case study band: there is no /case-studies index.
      { label: "Case studies", href: "/#case-studies" },
    ],
  },
  { heading: "Support", links: [{ label: "Contact" }, { label: "Privacy", href: "/privacy" }] },
];

/** Both artboards draw the same line; only its size and opacity differ. */
export const FOOTER_COPYRIGHT = "© 2026 Confyde. All rights reserved.";
