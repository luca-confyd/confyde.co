import type { CSSProperties } from "react";

/**
 * The carousel's geometry, as one number per breakpoint rather than three.
 *
 * WHY THIS IS A MODULE AND NOT THREE TAILWIND CLASSES
 * ---------------------------------------------------
 * The artboard hardcodes the arrow step as `480 + 24` while its cards are 380
 * wide with a 24px gap - a 404px pitch driven 504px at a time. Every click
 * therefore lands 100px past a card edge, mandatory snap drags it back to the
 * nearest snap point, and the carousel visibly stutters and skips. Ruled a
 * defect: the step has to be the real pitch.
 *
 * Fixing the number alone would leave two copies of the card width in the
 * codebase - one in the markup's `w-[380px]`, one in the step - free to drift
 * apart again. So the width and the gap are declared once here, the markup
 * consumes them as custom properties, and the step is derived. There is no
 * second copy to get wrong.
 */
export type CardGeometry = {
  /** px. The card is square on desktop, so this is its height too. */
  width: number;
  /** px. The gap between cards in the track. */
  gap: number;
};

/** >=1024px. A 380px square card, 24px apart. */
export const DESKTOP_CARD: CardGeometry = { width: 380, gap: 24 };

/** <1024px. Shorter than it is wide, and tighter. */
export const MOBILE_CARD: CardGeometry = { width: 270, gap: 12 };

/**
 * Card pitch: the distance from one card's leading edge to the next one's, and
 * therefore exactly one snap point. Both the arrow buttons and the arrow-key
 * handler scroll by this.
 */
export function cardPitch({ width, gap }: CardGeometry): number {
  return width + gap;
}

/**
 * The same two numbers as custom properties, for the markup to size itself
 * from. Set on the scroll container; the cards inherit them.
 */
export function cardVars({ width, gap }: CardGeometry): CSSProperties {
  return {
    "--testi-card": `${width}px`,
    "--testi-gap": `${gap}px`,
    // `as` because React's CSSProperties has no index signature for custom
    // properties. The values above are the only things it hides.
  } as CSSProperties;
}
