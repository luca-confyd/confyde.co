/**
 * The footer's copy.
 *
 * The two artboards are not two renderings of one list: desktop carries three
 * columns (Product / Company / Support) and mobile carries two (Product /
 * Company) whose link sets overlap only partly - mobile's Product column is the
 * feature names, desktop's is the site's own pages, and mobile folds Support's
 * "Help centre" and "Contact" into Company. The blurb differs too ("Landscape
 * businesses" against "landscapers").
 *
 * Both are transcribed verbatim. We do not edit the client's copy, and merging
 * the two lists would be a content decision, not a port. Flagged for the client.
 */

export type FooterLink = {
  readonly label: string;
  /** The Careers pill. Only one link in either artboard carries one. */
  readonly badge?: string;
};

export type FooterColumn = {
  readonly heading: string;
  readonly links: readonly FooterLink[];
};

export const FOOTER_BLURB_DESKTOP =
  "The AI teammate for Landscape businesses. It scopes the work, wins you more jobs, and gets smarter about how you run things the more you use it.";

export const FOOTER_BLURB_MOBILE =
  "The AI teammate for landscapers. It scopes the work, wins you more jobs, and gets smarter about how you run things the more you use it.";

export const FOOTER_COLUMNS_DESKTOP: readonly FooterColumn[] = [
  { heading: "Product", links: [{ label: "Features" }, { label: "Pricing" }, { label: "Security" }, { label: "Changelog" }] },
  { heading: "Company", links: [{ label: "Careers", badge: "Hiring" }, { label: "About" }, { label: "Blog" }] },
  { heading: "Support", links: [{ label: "Help centre" }, { label: "Contact" }, { label: "Privacy" }] },
];

export const FOOTER_COLUMNS_MOBILE: readonly FooterColumn[] = [
  {
    heading: "Product",
    links: [{ label: "Quoting" }, { label: "Proposals" }, { label: "Follow-ups" }, { label: "Client CRM" }, { label: "Pricing" }],
  },
  {
    heading: "Company",
    links: [{ label: "About" }, { label: "Customers" }, { label: "Help centre" }, { label: "Contact" }],
  },
];

/** Both artboards draw the same line; only its size and opacity differ. */
export const FOOTER_COPYRIGHT = "© 2026 Bramble. All rights reserved.";
