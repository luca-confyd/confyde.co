/**
 * The eleven chips of the pinned CTA stage, in DOM order.
 *
 * The index is load-bearing: `fadeAt = 0.06 + i × 0.012` is what staggers the
 * eleven fades, and re-ordering this array would re-order the effect.
 *
 * `top` / `x` are the chips' AUTHORED resting positions, in percent of the chip
 * container. They are written to `top` and to `left` or `right` once, as static
 * inline styles, and never touched again - the artboard's per-tick inset writes
 * are what forced layout eleven times a frame (spec §6.1).
 *
 * `dx0` / `dy0` carry the artboard's pull-toward-centre as an OFFSET from the
 * resting position rather than a second position, so it can live in the
 * transform the chip already has:
 *
 *   artboard:  top₀ = 50 − (50 − top) × 0.35      x₀ = 50 − (50 − x) × 0.40
 *   therefore: dy0  = top₀ − top = 0.65 × (50 − top)
 *              dx0  = x₀   − x   = 0.60 × (50 − x)
 *
 * and the chip translates `d·(1 − k)` container-percent, which is zero at the
 * settle point. `dx0` is negated on right-side chips because their inset is
 * measured from the right edge, so a larger inset moves the chip left.
 *
 * Copy is the client's, carried verbatim: the literal ampersands and the full
 * stop in "Bluestone Co." No apostrophes appear in any of the eleven names.
 */
export type CtaChip = {
  /** Resting inset from the top of the chip container, in percent. */
  top: number;
  /** Resting inset from `side`, in percent. */
  x: number;
  side: "left" | "right";
  /** Degrees. Constant - the artboard writes it every tick but never varies it. */
  tilt: number;
  /** Disc fill. A token name, resolved to a Tailwind `bg-` class at the call site. */
  disc: "forest-900" | "forest-700" | "forest-500" | "lime-500";
  initials: string;
  name: string;
};

const CHIPS_AUTHORED: readonly CtaChip[] = [
  { top: 18, x: 18, side: "left", tilt: -6, disc: "forest-900", initials: "OL", name: "Occo Landscapers & Builders" },
  { top: 26, x: 12, side: "left", tilt: 3, disc: "lime-500", initials: "CG", name: "Coastal Gardens" },
  { top: 30, x: 34, side: "left", tilt: -2, disc: "forest-700", initials: "BR", name: "BuildRight" },
  { top: 18, x: 28, side: "right", tilt: 2, disc: "lime-500", initials: "HP", name: "Harbour Pools" },
  /* Chips 4 and 9 were the two `forest-500` discs. At 11px/800 white on #4D8F6C
     they measure 3.85:1 and fail AA (spec §9.3, D18). Shipped as drawn and
     escalated rather than silently recoloured - RULINGS.md principle 2 puts a
     visible authoring change with the client. The minimal fix, if they accept
     it, is `forest-700` here and nowhere else. */
  { top: 13, x: 6, side: "right", tilt: -3, disc: "forest-700", initials: "EO", name: "Elm & Oak" },
  { top: 46, x: 10, side: "right", tilt: 6, disc: "forest-900", initials: "GS", name: "GreenScape" },
  { top: 64, x: 12, side: "left", tilt: -6, disc: "lime-500", initials: "RL", name: "Ridgeline" },
  /* Chip 7 settles 48% from the left, 66% down - directly behind the CTA button
     row. The copy block's z-10 keeps it behind, so nothing is obscured, but it
     is the one chip to look at in the visual diff (D6). */
  { top: 66, x: 48, side: "left", tilt: 3, disc: "forest-700", initials: "TF", name: "Terra Firma" },
  { top: 68, x: 8, side: "right", tilt: -2, disc: "lime-500", initials: "BC", name: "Bluestone Co." },
  { top: 76, x: 24, side: "right", tilt: 6, disc: "forest-700", initials: "FS", name: "Fern & Stone" },
  { top: 80, x: 28, side: "left", tilt: -3, disc: "forest-900", initials: "PP", name: "Palm & Pine" },
];

export type CtaChipPlaced = CtaChip & {
  /** Horizontal start offset from rest, in container percent, already signed. */
  dx0: number;
  /** Vertical start offset from rest, in container percent. */
  dy0: number;
  /** `p` at which this chip reaches opacity 1 and zero blur. */
  fadeAt: number;
};

export const CTA_CHIPS: readonly CtaChipPlaced[] = CHIPS_AUTHORED.map((chip, i) => ({
  ...chip,
  dx0: 0.6 * (50 - chip.x) * (chip.side === "left" ? 1 : -1),
  dy0: 0.65 * (50 - chip.top),
  fadeAt: 0.06 + i * 0.012,
}));

/**
 * The five words of the scrubbed second line.
 *
 * They are an array rather than a string because each one carries its index as
 * a custom property and the reveal ramp is written per index; splitting a
 * string at render time would put the same data in two places.
 *
 * The apostrophe in "They’ve" is U+2019. The artboard writes U+0027;
 * normalising it is typographic, not a copy edit (RULINGS.md §02 ruling 10).
 */
export const CTA_TAIL_WORDS: readonly string[] = ["They’ve", "got", "Confyde", "doing", "it."];

/**
 * The three chips the mobile band carries (spec §8.2).
 *
 * The three shortest labels, so they fit a 288px measure in two rows rather
 * than five, and three distinct disc colours so the row reads as a set. Coastal
 * Gardens moves from `lime-500` to `forest-900` for that reason; neither
 * `forest-500` disc appears here at all, because §9.3's AA failure is not
 * something to carry into a composition we are designing from scratch.
 */
export const CTA_CHIPS_MOBILE: readonly Pick<CtaChip, "disc" | "initials" | "name">[] = [
  { disc: "lime-500", initials: "RL", name: "Ridgeline" },
  { disc: "forest-700", initials: "BR", name: "BuildRight" },
  { disc: "forest-900", initials: "CG", name: "Coastal Gardens" },
];
