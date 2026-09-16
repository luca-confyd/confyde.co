import { Clock, Layers, Phone } from "lucide-react";

import type { LucideIcon } from "lucide-react";

/**
 * The three glyphs card 2 draws, keyed by the names `content/home.ts` stores.
 *
 * The artboard inlines the same three path sets by hand at both breakpoints.
 * They are Lucide `Phone`, `Layers` and `Clock` verbatim, and Lucide is the
 * only icon system on the page (docs/brand.md), so they come from the package
 * rather than from the copied paths - a hand-copied glyph is one that cannot
 * follow the set when the set is updated.
 */
export const NUDGE_ICONS: Record<string, LucideIcon> = {
  phone: Phone,
  layers: Layers,
  clock: Clock,
};
