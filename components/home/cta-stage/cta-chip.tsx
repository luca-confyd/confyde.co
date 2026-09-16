import type { CSSProperties } from "react";

import type { CtaChip as CtaChipData, CtaChipPlaced } from "@/content/cta-stage";

/**
 * Disc fills, as classes rather than a template string so Tailwind's scanner
 * sees each one whole.
 */
const DISC: Record<CtaChipData["disc"], string> = {
  "forest-900": "bg-forest-900 text-white",
  "forest-700": "bg-forest-700 text-white",
  "forest-500": "bg-forest-500 text-white",
  "lime-500": "bg-lime-500 text-forest-900",
};

/* A 36px pill: 4px padding, a 28px disc, 4px padding. `border-radius: 9999px`
   on a 36px box already clamps to a capsule, so `rounded-full` is identical
   output and clearer code (RULINGS.md §02 ruling 6). */
const SHELL = "flex items-center gap-2 rounded-full bg-card py-1 pr-3 pl-1";
const DISC_SHELL = "flex size-7 items-center justify-center rounded-full text-[11px] font-extrabold";
const LABEL = "text-[14px] font-bold text-pf-ink-900";

/**
 * One scrubbed chip.
 *
 * The resting position is a static inline style and is written once. The
 * artboard rewrote `top`, `left` AND `right` on all eleven every tick, which
 * resolved eleven percentage insets against the container and relaid out eleven
 * boxes per frame; that is the single most expensive thing in the section
 * (spec §6.1). Here the only moving part is a `transform`, which the compositor
 * handles without touching layout at all.
 *
 * The artboard's `.pf-sticker` - a white keyline plus a drop shadow - is NOT
 * carried across, and that is deliberate. `ctaChips` wrote `filter: blur(Npx)`
 * inline on every tick, an inline `filter` beats a class `filter` outright, and
 * the two do not merge, so from the first scroll event onward the artboard's
 * chips have no keyline and no shadow at all - including at `blur(0.00px)`.
 * That is what the artboard renders, and the render is the acceptance test
 * (RULINGS.md principle 1, and §02 ruling 3 / §03-04 ruling 9 both deleted an
 * inert declaration rather than restoring its intent). The one-line composed-
 * filter fix is in the PR for the client, because it is a visible change and it
 * makes the filter permanent - eleven render surfaces for the life of the
 * section. Spec D1, §9.2.
 */
export function CtaChip({ chip }: { chip: CtaChipPlaced }) {
  const style = {
    top: `${chip.top}%`,
    [chip.side]: `${chip.x}%`,
    "--dx0": chip.dx0,
    "--dy0": chip.dy0,
    "--tilt": chip.tilt,
    "--fade-at": chip.fadeAt,
  } as CSSProperties;

  return (
    <div className={`cta-chip absolute ${SHELL}`} style={style}>
      <span className={`${DISC[chip.disc]} ${DISC_SHELL}`}>{chip.initials}</span>
      <span className={LABEL}>{chip.name}</span>
    </div>
  );
}

/** The mobile band's static chips: the same shell, plus the keyline the desktop
 *  ones lose. Nothing overwrites `filter` below 1024px, so `.sticker` is live
 *  here - which is also what makes a white pill legible on a white panel. */
export function CtaChipStatic({ chip }: { chip: Pick<CtaChipData, "disc" | "initials" | "name"> }) {
  return (
    <div className={`sticker ${SHELL}`}>
      <span className={`${DISC[chip.disc]} ${DISC_SHELL}`}>{chip.initials}</span>
      <span className={LABEL}>{chip.name}</span>
    </div>
  );
}
