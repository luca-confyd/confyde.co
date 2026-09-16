import type { AvatarTone } from "@/content/testimonials";

/**
 * The record's tone name resolved to a fill.
 *
 * One map for both breakpoints, because the tone travels with the person: Dave
 * Nguyen is forest-700 and Tom Reeves forest-900 on the desktop board and on
 * the mobile one, at different indices. A per-file map would let the two
 * disagree the first time a card was reordered.
 *
 * All three tones carry white 11-14px text at weight 800, so all three have to
 * clear AA against white. The artboard's lightest disc was forest-500, which
 * cannot: measured, it is 3.85:1 against white, 3.70 against forest-900 ink and
 * 3.01 against cream, so no text colour in the system rescues it. The tone
 * itself moved to forest-800, which keeps three visually distinct discs and
 * changes exactly one person's avatar.
 */
export const AVATAR_FILL: Record<AvatarTone, string> = {
  "forest-800": "bg-forest-800",
  "forest-700": "bg-forest-700",
  "forest-900": "bg-forest-900",
};
