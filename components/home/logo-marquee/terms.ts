/**
 * The capabilities the strip names.
 *
 * ONE LIST, NOT TWO. It used to be two: mobile dropped six of the desktop
 * thirteen and kept the rest in the same relative order, and that was preserved
 * rather than unified because it was the client's own editing in two different
 * moments (RULINGS.md principle 3). These fourteen arrived as a single list, so
 * there is no second edit to preserve and a second array would just be a copy
 * to keep in sync.
 *
 * The strip is a loop: length changes how often it repeats, not whether it
 * fits, so the same fourteen run at both breakpoints.
 */
export const MARQUEE_TERMS = [
  "AI Agents",
  "Automation",
  "Integrations",
  "Dashboards",
  "Reporting",
  "Web Apps",
  "Mobile Apps",
  "Cloud",
  "Cyber Security",
  "Data",
  "Technical Strategy",
  "Software Development",
  "AI Training",
  "Systems Design",
] as const;

/**
 * The accessible name for the strip, shared by both breakpoints.
 *
 * "Trades Confyde covers" until the strip listed trades. It lists capabilities
 * now, and the name has to say what the group actually contains.
 *
 * The clipper is a `tabindex="0"` group rather than fourteen loose spans: it is
 * what makes the strip keyboard-pausable (WCAG 2.2.2) and, on mobile, what
 * makes its `overflow-x: auto` container keyboard-scrollable (WCAG 2.1.1).
 * Neither artboard draws this; it is an addition, logged as one.
 */
export const MARQUEE_LABEL = "What Confyde covers";
