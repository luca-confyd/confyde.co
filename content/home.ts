/**
 * Every figure the homepage repeats.
 *
 * The page tells one continuous story - the same quote, the same client, the
 * same margin - across the hero, the take-off demo, the proposal card, the
 * replay heatmap and the kanban board. In the artboards those numbers are typed
 * out at each call site, so they can drift. Here they cannot.
 */

export const QUOTE = {
  reference: "Q-1042",
  client: "Sarah Henderson",
  address: "14 Beach Rd",
  suburb: "Coogee",
  studio: "Laurence Landscapes",
  licence: "LIC# 284119C",
  total: "$48,200",
  margin: "24%",
} as const;

/** Scope lines, with the category dot colours from the app's own taxonomy. */
export const SCOPE = [
  { label: "Demolition & Site Clearing", amount: "$4,200", dot: "var(--color-cat-demolition)" },
  { label: "Retaining & Structures", amount: "$7,920", dot: "var(--color-cat-retaining)" },
  { label: "Paving & Stonework", amount: "$14,880", dot: "var(--color-cat-paving)" },
  { label: "Turf, Soil & Planting", amount: "$9,400", dot: "var(--color-cat-planting)" },
  { label: "Irrigation", amount: "$5,320", dot: "var(--color-cat-irrigation)" },
] as const;

/** How the client read the quote. Drives the replay, the heatmap and the nudges. */
export const READING = {
  opens: 4,
  totalTime: "5m 16s",
  longestSection: "Paving & Stonework",
  longestTime: "2m 40s",
  bestTimeToCall: "Weeknights, after 8pm",
} as const;

export const TAKEOFF = {
  address: "14 Ridge St",
  cost: "$12,551",
  margin: "$3,012",
  total: "$15,563",
  elapsed: "2m 14s",
  materialsLearned: 248,
} as const;
