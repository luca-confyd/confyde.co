import type { CSSProperties } from "react";

/**
 * The dappled-forest wash.
 *
 * Ported from the design system's `.bg-dappled-forest`
 * (`_ds/.../tokens/effects.css`), which the desktop artboard calls by class
 * name but never ships the stylesheet for. Four layers over forest-900: a
 * forest-500 veil falling away down the panel, one cream pool lifting the top
 * centre where the heading sits, and two forest-500 pools either side at a
 * third of the height. It is what stops a 700px-tall forest plate reading as a
 * flat rectangle.
 *
 * Carried as an inline style rather than a utility because `styles/base.css` is
 * not this band's to edit, and because it has exactly one call site. Every
 * colour is a token - no new values - so promoting it into base.css as
 * `.bg-dappled-forest` later is a copy-paste. Recommended, if the wash is ever
 * wanted on a second panel.
 *
 * `oklab` and the percentages are the design system's own, unchanged: mixing
 * these in sRGB instead visibly muddies the two side pools.
 */
export const DAPPLED_FOREST: CSSProperties = {
  backgroundColor: "var(--color-forest-900)",
  backgroundImage: [
    "linear-gradient(180deg, color-mix(in oklab, var(--color-forest-500) 20%, transparent) 0%, transparent 78%)",
    "radial-gradient(ellipse 70% 160% at 50% 16%, color-mix(in oklab, var(--color-cream) 7%, transparent), transparent 68%)",
    "radial-gradient(ellipse 45% 150% at 22% 32%, color-mix(in oklab, var(--color-forest-500) 16%, transparent), transparent 72%)",
    "radial-gradient(ellipse 45% 150% at 78% 32%, color-mix(in oklab, var(--color-forest-500) 16%, transparent), transparent 72%)",
  ].join(", "),
};
