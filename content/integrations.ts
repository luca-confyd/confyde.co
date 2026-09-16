/**
 * The eight partners in the integrations card.
 *
 * Names and sub-labels are the client's, carried verbatim from both artboards -
 * which agree on all sixteen strings, including the ampersands in "Gmail &
 * Outlook" and "Plans & photos".
 *
 * The `disc` hexes are OTHER COMPANIES' brand colours. They are deliberately
 * not tokens: a token is a decision our design system has made, and none of
 * these is ours to change, reuse or darken. Keeping them here as commented
 * literals is the same call RULINGS.md §02 ruling 5 made for `#ACAFB1` - a
 * value with no role in the system stays a local constant.
 *
 * The one exception is Gmail & Outlook. Neither of those products is green; the
 * artboard sets that disc to `#2C5539`, which is Bramble's own `forest-700`, so
 * it IS a token and is written as one. It reads as a deliberate choice - the
 * tile stands for two products at once and has no single brand mark to borrow.
 */
export type Integration = {
  name: string;
  /** The category line under the name. */
  sub: string;
} & (
  | {
      /** A real partner mark, rendered as an image. */
      mark: string;
      disc?: never;
      initials?: never;
    }
  | {
      /** A lettermark disc: type on a coloured circle, never an image. */
      initials: string;
      /** CSS colour for the disc fill. */
      disc: string;
      mark?: never;
    }
);

export const INTEGRATIONS: readonly Integration[] = [
  { name: "Xero", sub: "Accounting", mark: "/images/xero-mark.webp" },
  { name: "MYOB", sub: "Accounting", initials: "M", disc: "#6100A5" },
  { name: "QuickBooks", sub: "Accounting", initials: "Q", disc: "#2CA01C" },
  { name: "Google Calendar", sub: "Site visits", initials: "GC", disc: "#1A73E8" },
  {
    name: "Gmail & Outlook",
    sub: "Client email",
    initials: "G",
    // Bramble's forest-700, not a partner colour - see the note above.
    disc: "var(--color-forest-700)",
  },
  { name: "Stripe", sub: "Card payments", initials: "S", disc: "#635BFF" },
  { name: "Google Drive", sub: "Plans & photos", initials: "GD", disc: "#F9AB00" },
  { name: "WhatsApp", sub: "Client chat", initials: "W", disc: "#25D366" },
];

/**
 * The Xero mark's rendered geometry.
 *
 * It is the only `next/image` on the page that is NOT `fill` + `sizes`. The
 * source is a 160px square and the largest it ever draws is 34px, so the whole
 * requirement is a 1x/2x pair. Passing `sizes` would move Next onto the
 * width-descriptor path, where a non-`vw` value falls back to the full device
 * list and a 2x desktop fetches a 640px candidate for a 34px disc.
 */
export const INTEGRATION_MARK = {
  /** Desktop disc diameter; mobile draws the same mark at 30px. */
  size: 34,
} as const;
