import {
  Check,
  HardHat,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  PhoneMissed,
  Receipt,
  Sprout,
} from "lucide-react";

import type { PhoneIcon } from "@/content/before-after";
import type { LucideIcon } from "lucide-react";

/**
 * The nine glyphs the two phones draw, keyed by the names `content/before-after.ts`
 * stores.
 *
 * The content file holds strings rather than components so it stays a plain
 * data module with no React in it; this is the one place that binds the two.
 * Lucide is the only icon system on the page (docs/brand.md), and every glyph
 * here is the stock one - the artboard inlined the same path data by hand.
 */
export const PHONE_ICONS: Record<PhoneIcon, LucideIcon> = {
  "message-square": MessageSquare,
  mail: Mail,
  "message-circle": MessageCircle,
  "phone-missed": PhoneMissed,
  phone: Phone,
  check: Check,
  receipt: Receipt,
  sprout: Sprout,
  "hard-hat": HardHat,
};
