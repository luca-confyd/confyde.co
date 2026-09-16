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

/**
 * The Excavation group, and the six-row scope the replay document scrolls.
 *
 * WHY THIS IS NOT JUST `SCOPE`. Chapter 2's desktop document draws SIX groups
 * and they sum to exactly QUOTE.total ($48,200). `SCOPE` above is five and sums
 * to $41,720 - the shortfall RULINGS.md §06 rules is the client's to reconcile
 * and ours to ship as drawn, because the chapter-1 proposal card draws exactly
 * those five. Extending `SCOPE` itself would silently add a sixth row to that
 * card and break a ruled composition, so the sixth group is declared here and
 * the six-row list is composed from it. One list, two consumers, no retyping:
 * chapter 2 desktop reads SCOPE_FULL, chapter 2 mobile reads SCOPE.
 */
export const SCOPE_EXCAVATION = {
  label: "Excavation & Earthworks",
  amount: "$6,480",
  dot: "var(--color-cat-excavation)",
} as const;

export const SCOPE_FULL = [SCOPE[0], SCOPE_EXCAVATION, ...SCOPE.slice(1)] as const;

/**
 * The thirteen line items behind the six group headers, keyed by group label.
 *
 * [LOG] Four of the six do not sum to their own header - $4,200 against $7,100,
 * $7,920 against $7,176, $14,880 against $7,215, $9,400 against $8,626. Only
 * Excavation and Irrigation reconcile. The client's numbers, flagged not fixed
 * (docs/specs/08-chapter-2.md D12).
 */
export const SCOPE_LINES: Record<string, readonly { label: string; qty: string; amount: string }[]> =
  {
    "Demolition & Site Clearing": [
      { label: "Remove concrete driveway", qty: "96 m²", amount: "$5,760" },
      { label: "Strip old planting beds", qty: "1 lot", amount: "$1,340" },
    ],
    "Excavation & Earthworks": [
      { label: "Bulk excavation to level", qty: "48 m³", amount: "$3,840" },
      { label: "Cart away spoil", qty: "36 t", amount: "$2,640" },
    ],
    "Retaining & Structures": [
      { label: "Treated pine retaining", qty: "18 lm", amount: "$5,616" },
      { label: "Bluestone steps, sawn tread", qty: "4 no.", amount: "$1,560" },
    ],
    "Paving & Stonework": [
      { label: "Sawn bluestone, laid to pattern", qty: "48 m²", amount: "$3,763" },
      { label: "Stepping pavers on pebble", qty: "14 m²", amount: "$1,344" },
      { label: "Compacted base and mortar bed", qty: "62 m²", amount: "$2,108" },
    ],
    "Turf, Soil & Planting": [
      { label: "Sir Walter instant turf", qty: "84 m²", amount: "$3,738" },
      { label: "Advanced screen planting", qty: "26 lm", amount: "$4,888" },
    ],
    Irrigation: [
      { label: "Dripline to garden beds", qty: "1 lot", amount: "$3,180" },
      { label: "Controller and solenoids", qty: "1 lot", amount: "$2,140" },
    ],
  };

/**
 * The mobile replay document shortens and sentence-cases four of the five group
 * labels it draws. Not derivable from the desktop strings - "Turf, Soil &
 * Planting" becomes "Turf & planting" - so both spellings ship, keyed off the
 * desktop label so the two lists cannot drift apart.
 */
export const SCOPE_LABELS_SHORT: Record<string, string> = {
  "Demolition & Site Clearing": "Demolition & clearing",
  "Retaining & Structures": "Retaining & structures",
  "Paving & Stonework": "Paving & stonework",
  "Turf, Soil & Planting": "Turf & planting",
  Irrigation: "Irrigation",
};

/**
 * The section-timing table beside the replay. Desktop prints five rows and
 * mobile four (it drops Irrigation), and mobile shortens every label to one
 * word, so each row carries both spellings.
 *
 * [LOG] The four timed rows sum to 5m 02s against READING.totalTime's
 * "5m 16s all up", and rows 1 and 2 share one swatch tone despite different
 * times (docs/specs/08-chapter-2.md D11/D12).
 */
export const READING_SECTIONS = [
  { label: READING.longestSection, short: "Paving", time: READING.longestTime, rank: 0 },
  { label: "Totals & acceptance", short: "Totals", time: "1m 12s", rank: 1 },
  { label: "Retaining & Structures", short: "Retaining", time: "48s", rank: 2 },
  { label: "Scope of works", short: "Scope", time: "22s", rank: 3 },
  /* Drawn on desktop only, and with an em dash for "no time at all" - which is
     also the row the second heat blob sits on. D13. */
  { label: "Irrigation", short: null, time: "—", rank: 4 },
] as const;

/**
 * Card 2's three suggested next steps. Row 1 is composed from READING; row 3's
 * sentence is a reworded version of READING.bestTimeToCall and is copy, so it
 * is written out and its chip kept in step by hand.
 */
export const NUDGES = [
  {
    photo: "/images/photo-1.webp",
    icon: "phone",
    title: "Call Sarah about the paving",
    sub: `Four visits, ${READING.longestTime} on the paving. Talk about the spec, not the price.`,
    subMobile: `Four visits, ${READING.longestTime} on the paving. Talk about the spec, not the price.`,
    chip: "Call",
  },
  {
    photo: "/images/photo-2.webp",
    icon: "layers",
    title: "Send a bluestone vs granite comparison",
    sub: "The price difference on your own rates, in one page.",
    /* Different copy from desktop's, not a truncation. Both ship. */
    subMobile: "Bluestone against granite, with the price difference on your own rates.",
    chip: "Send",
  },
  {
    photo: "/images/photo-3.webp",
    icon: "clock",
    title: "Best time to reach her",
    sub: "All four opens were after dinner. Ring weeknights, after 8pm.",
    subMobile: "All four opens were after dinner. Ring weeknights, after 8pm.",
    chip: "After 8pm",
  },
] as const;

/**
 * Card 3's three milestones. Desktop only - the mobile chapter ends after
 * card 2.
 *
 * [LOG] They sum to $62,800 against QUOTE.total's $48,200, and the three
 * percentages are 100% of the larger figure. The client's numbers (D12).
 */
export const MILESTONES = [
  { title: "Deposit, 20%", sub: "Paid on acceptance", amount: "$12,560", done: true },
  { title: "On start, 40%", sub: "Invoice raises itself Monday", amount: "$25,120", done: false },
  { title: "On handover, 40%", sub: "Plus any variations billed", amount: "$25,120", done: false },
] as const;
