/**
 * The integrations row.
 *
 * Names and sub-labels are the client's, carried verbatim.
 *
 * WHY THIS FILE HOLDS AN `id` AND NOT A COLOUR. It used to carry each
 * partner's brand hex so a tile could draw a lettermark disc - an initial set
 * on that company's colour, standing in for a mark we did not have. The marks
 * now exist (components/home/integrations/brand-marks.tsx), so the disc, the
 * initials and the eight foreign hexes are all gone. What is left here is
 * content: a name, a category, and an `id` that selects the mark. Colour is the
 * mark's own business, which is the right place for it - none of those hexes
 * was ever ours to token, reuse or darken.
 *
 * ORDER. The client's, and it is not alphabetical: the two suites that most
 * businesses already live in come first, then the money, then the rest. The
 * `custom` tile is last and is deliberately not a company - see below.
 */
export type IntegrationId =
  | "microsoft"
  | "google"
  | "xero"
  | "quickbooks"
  | "stripe"
  | "hubspot"
  | "slack"
  | "shopify"
  | "whatsapp"
  | "custom";

export type Integration = {
  id: IntegrationId;
  name: string;
  /** The category line under the name. */
  sub: string;
};

export const INTEGRATIONS: readonly Integration[] = [
  { id: "microsoft", name: "Microsoft 365", sub: "Email, files, Teams" },
  { id: "google", name: "Google Workspace", sub: "Email, Drive, Sheets" },
  { id: "xero", name: "Xero", sub: "Accounting" },
  { id: "quickbooks", name: "QuickBooks", sub: "Accounting" },
  { id: "stripe", name: "Stripe", sub: "Payments" },
  { id: "hubspot", name: "HubSpot", sub: "CRM" },
  { id: "slack", name: "Slack", sub: "Team chat" },
  { id: "shopify", name: "Shopify", sub: "E-commerce" },
  { id: "whatsapp", name: "WhatsApp", sub: "Client chat" },
  /*
    Not a company, and the tile it draws is visibly ours rather than a tenth
    logo: the row exists to say "we work with what you already have", and a
    closed list of nine says the opposite the moment someone runs something
    that is not on it. Last in the order because it is the catch-all, and it
    reads as one - "...and whatever else" only works at the end.
  */
  { id: "custom", name: "Something else", sub: "We'll work with it" },
];

/** Disc diameter: 30px below 1024, 34px above. */
export const INTEGRATION_MARK = {
  size: 34,
} as const;
