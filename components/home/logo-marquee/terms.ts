/**
 * The capabilities the strip names.
 *
 * ONE LIST, NOT TWO. It used to be two: mobile dropped six of the desktop
 * thirteen and kept the rest in the same relative order, and that was preserved
 * rather than unified because it was the client's own editing in two different
 * moments (RULINGS.md principle 3). The list arrived unified, so there is no
 * second edit to preserve and a second array would just be a copy to keep in
 * sync.
 *
 * Eleven, down from fourteen. Dashboards, Reporting and Data came out; Cloud
 * became Cloud Architecture, Automation became AI Automation, and AI Training
 * became AI Consulting - the strip
 * now names what Confyde is engaged to do rather than the artefacts an
 * engagement happens to produce.
 *
 * The strip is a loop: length changes how often it repeats, not whether it
 * fits, so the same eleven run at both breakpoints.
 *
 * ORDER IS DELIBERATE, and the loop is why. The three AI terms sit at 1, 5 and
 * 9 of eleven, which spaces them 4, 4 and 3 apart - the last gap running through
 * the wrap, where Systems Design hands back to AI Agents. Read as a straight
 * list that spacing is invisible; read as the endless strip it actually is, it
 * is the difference between "AI" surfacing at an even beat and three of them
 * arriving together every 60s. They were adjacent at 1 and 2 before.
 *
 * Shortening the list SLOWS the strip down, which is the opposite of the
 * intuition. The animation translates the track by a fixed -50% over a fixed
 * 60s, and half the track is exactly one copy of the list, so the duration buys
 * a frame-width of travel however wide that frame is. Eleven terms measure
 * 3175px at every desktop width, so the strip now covers 3175px per minute
 * where fourteen covered more. The cycle still takes 60s; it just moves less
 * ground in it. `--marquee-duration` at the call site is the dial if that reads
 * too languid.
 */
export const MARQUEE_TERMS = [
  "AI Agents",
  "Integrations",
  "Web Apps",
  "Mobile Apps",
  "AI Automation",
  "Cloud Architecture",
  "Cyber Security",
  "Technical Strategy",
  "AI Consulting",
  "Software Development",
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
