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
  /* The mobile proposal card carries a one-line project description that the
     desktop one does not draw. It is a fifth fact about the same job, so it
     lives with the other four rather than in the component. */
  description: "Rear garden and pool surround",
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

/**
 * The four priced lines the take-off demo writes into its right pane.
 *
 * The arithmetic reconciles and three other figures depend on it:
 * 48 x 78.40 = 3,763.20; 14 x 96 = 1,344; 18 x 142 = 2,556; 26 x 188 = 4,888.
 * The four sum to TAKEOFF.cost ($12,551); 24% of that is TAKEOFF.margin
 * ($3,012); the two together are TAKEOFF.total ($15,563). Changing a rate or a
 * quantity here silently breaks all three.
 *
 * `spec` and `supplier` are separate fields because the mobile card sets a
 * shortened spec against the same supplier, so the two cannot be pre-joined.
 */
export const TAKEOFF_LINES = [
  {
    label: "Paving",
    spec: "Sawn bluestone 400×400",
    specShort: "Sawn bluestone",
    supplier: "Flagstone Supply",
    rate: "$78.40 / m²",
    qty: "48 m²",
    amount: "$3,763",
  },
  {
    label: "Stepping pavers",
    spec: "Bluestone treads on pebble",
    specShort: "Bluestone treads",
    supplier: "Flagstone Supply",
    rate: "$96.00 / m²",
    qty: "14 m²",
    amount: "$1,344",
  },
  {
    label: "Pool coping",
    spec: "Bullnose limestone",
    specShort: "Bullnose limestone",
    supplier: "Stoneworks Co",
    rate: "$142 / lm",
    qty: "18 lm",
    amount: "$2,556",
  },
  {
    label: "Screen planting",
    spec: "Advanced 200mm",
    specShort: "Advanced 200mm",
    supplier: "Greenline Nursery",
    rate: "$188 / lm",
    qty: "26 lm",
    amount: "$4,888",
  },
] as const;

/**
 * The five readings the take-off timer chip counts through. The last one is
 * TAKEOFF.elapsed with its `m`/`s` stripped, and the "Quote ready" bar prints
 * TAKEOFF.elapsed itself - the two must always agree.
 */
export const TAKEOFF_CLOCK = ["0:04", "0:22", "0:51", "1:28", "2:14"] as const;

/** The four files the price-library demo ingests. */
export const PRICE_FILES = [
  { name: "Laurence_Quote_Mar.pdf", type: "PDF", kind: "pdf" },
  { name: "Flagstone pricelist.xlsx", type: "Excel", kind: "sheet" },
  { name: "Photo of last season’s quote", type: "Photo", kind: "image", src: "/images/photo-1.webp" },
  { name: "Handwritten site notes", type: "Photo", kind: "image", src: "/images/photo-4.webp" },
] as const;
