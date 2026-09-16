/**
 * The trades the strip names.
 *
 * Two lists, not one with a slice. Mobile drops six of the desktop thirteen -
 * `Pools & Water`, `Turf & Gardens`, `Planting & Softscapes`, `Fencing`,
 * `Carpentry`, `Nursery` - and keeps the remaining seven in the same relative
 * order. That is the client's editing, in two different moments, and it is
 * preserved rather than unified (RULINGS.md principle 3).
 *
 * The ampersands are literal `&`; the artboards write them as `&amp;` only
 * because they are HTML source.
 */
export const MARQUEE_TERMS_DESKTOP = [
  "Hardscapes",
  "Paving & Stone",
  "Retaining Walls",
  "Decking",
  "Outdoor Kitchens",
  "Pools & Water",
  "Irrigation",
  "Lighting",
  "Turf & Gardens",
  "Planting & Softscapes",
  "Fencing",
  "Carpentry",
  "Nursery",
] as const;

export const MARQUEE_TERMS_MOBILE = [
  "Hardscapes",
  "Paving & Stone",
  "Retaining Walls",
  "Decking",
  "Outdoor Kitchens",
  "Irrigation",
  "Lighting",
] as const;

/**
 * The accessible name for the strip, shared by both breakpoints.
 *
 * The clipper is a `tabindex="0"` group rather than fourteen loose spans: it is
 * what makes the strip keyboard-pausable (WCAG 2.2.2) and, on mobile, what
 * makes its `overflow-x: auto` container keyboard-scrollable (WCAG 2.1.1).
 * Neither artboard draws this; it is an addition, logged as one.
 */
export const MARQUEE_LABEL = "Trades Bramble covers";
