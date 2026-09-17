/* -----------------------------------------------------------------------------
   The integration brand marks.

   SAME EXCEPTION AS `chrome/footer/social-marks.tsx`, for the same reason. The
   brand doc makes Lucide the only icon system and §02 ruling 8 made that
   binding - but lucide-react ships no brand icons at all, so there is no glyph
   for Xero or Slack to reach for. That file resolved it by carrying the marks
   as paths in one place; this one does the same, and the two should move
   together if an icon set that covers brand marks is ever adopted.

   WHAT THESE ARE, AND WHAT THEY ARE NOT. These are renderings of each
   company's mark, drawn to its published geometry and brand colours. They are
   NOT the official asset files. For anything public-facing the marks should be
   replaced with the SVGs from each company's own brand or press page, which is
   also where their usage terms live - several of these (Microsoft, Shopify,
   WhatsApp) place conditions on partner and integration use. Treated as a
   placeholder set until someone has been through those terms.

   Unlike the social marks these are NOT `currentColor`. A brand mark's colour
   is part of the mark, and the whole point of the row is that a reader
   recognises the products at a glance - so each carries its own palette and
   none of them is ours to retint. That is also why none of these colours is a
   token: a token is a decision our design system has made, and none of these
   is (see the note in content/integrations.ts).

   Every mark draws on a 24x24 canvas and is rendered into a 34px box by
   `IntegrationTile`. The disc-shaped marks fill that canvas edge to edge; the
   free-standing ones carry their own inset, so the row optically aligns
   without the tile having to special-case any of them.
----------------------------------------------------------------------------- */

import { Plus } from "lucide-react";

/* Decorative in every call site: the product is named in text immediately
   beside the mark, so announcing it here would read the name twice. */
const SVG = {
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  focusable: "false",
  className: "size-full",
} as const;

/* The two letterform marks below set type rather than paths. Both companies'
   marks ARE letterforms on a coloured disc, so this is the shape of the real
   thing rather than a lettermark standing in for one - and it stays crisp at
   every size where a traced outline would not. */
const LETTER = {
  fill: "#fff",
  textAnchor: "middle",
  fontFamily: "var(--font-ui), system-ui, sans-serif",
  fontWeight: 700,
} as const;

export function MicrosoftMark() {
  return (
    <svg {...SVG}>
      <rect x="1.5" y="1.5" width="9.5" height="9.5" fill="#F25022" />
      <rect x="13" y="1.5" width="9.5" height="9.5" fill="#7FBA00" />
      <rect x="1.5" y="13" width="9.5" height="9.5" fill="#00A4EF" />
      <rect x="13" y="13" width="9.5" height="9.5" fill="#FFB900" />
    </svg>
  );
}

export function GoogleMark() {
  return (
    <svg {...SVG}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function XeroMark() {
  return (
    <svg {...SVG}>
      <circle cx="12" cy="12" r="12" fill="#13B5EA" />
      {/* Two crossing strokes with rounded caps, which is how the mark is
          drawn - not a letter X set in a typeface. */}
      <path
        d="M7.6 7.6 16.4 16.4M16.4 7.6 7.6 16.4"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function QuickBooksMark() {
  return (
    <svg {...SVG}>
      <circle cx="12" cy="12" r="12" fill="#2CA01C" />
      <text {...LETTER} x="12" y="16.6" fontSize="11.5" letterSpacing="-0.5">
        qb
      </text>
    </svg>
  );
}

export function StripeMark() {
  return (
    <svg {...SVG}>
      <rect width="24" height="24" rx="5" fill="#635BFF" />
      <path
        fill="#fff"
        d="M11.36 10.6c0-.66.54-.92 1.44-.92 1.29 0 2.92.39 4.21 1.09V6.8c-1.41-.56-2.8-.78-4.21-.78C9.35 6.02 7 7.82 7 10.83c0 4.69 6.45 3.94 6.45 5.96 0 .78-.68 1.03-1.63 1.03-1.4 0-3.2-.58-4.62-1.36v3.98c1.57.68 3.16.97 4.62.97 3.53 0 5.98-1.75 5.98-4.8 0-5.06-6.44-4.16-6.44-6.01z"
      />
    </svg>
  );
}

export function HubSpotMark() {
  return (
    <svg {...SVG} fill="none" stroke="#FF7A59">
      {/* The sprocket, its node, and the stem on the left. */}
      <circle cx="10.5" cy="15.5" r="5.2" strokeWidth="2.4" />
      <circle cx="19.4" cy="5.6" r="2.6" fill="#FF7A59" stroke="none" />
      <path d="M14.1 11.6 17.6 7.7" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M3.3 8.2v7.4" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function SlackMark() {
  return (
    <svg {...SVG}>
      <path
        fill="#E01E5A"
        d="M5.04 15.17a2.53 2.53 0 0 1-2.52 2.52A2.53 2.53 0 0 1 0 15.17a2.53 2.53 0 0 1 2.52-2.52h2.52v2.52zM6.31 15.17a2.53 2.53 0 0 1 2.52-2.52 2.53 2.53 0 0 1 2.52 2.52v6.31A2.53 2.53 0 0 1 8.83 24a2.53 2.53 0 0 1-2.52-2.52v-6.31z"
      />
      <path
        fill="#36C5F0"
        d="M8.83 5.04a2.53 2.53 0 0 1-2.52-2.52A2.53 2.53 0 0 1 8.83 0a2.53 2.53 0 0 1 2.52 2.52v2.52H8.83zM8.83 6.31a2.53 2.53 0 0 1 2.52 2.52 2.53 2.53 0 0 1-2.52 2.52H2.52A2.53 2.53 0 0 1 0 8.83a2.53 2.53 0 0 1 2.52-2.52h6.31z"
      />
      <path
        fill="#2EB67D"
        d="M18.96 8.83a2.53 2.53 0 0 1 2.52-2.52A2.53 2.53 0 0 1 24 8.83a2.53 2.53 0 0 1-2.52 2.52h-2.52V8.83zM17.69 8.83a2.53 2.53 0 0 1-2.52 2.52 2.53 2.53 0 0 1-2.52-2.52V2.52A2.53 2.53 0 0 1 15.17 0a2.53 2.53 0 0 1 2.52 2.52v6.31z"
      />
      <path
        fill="#ECB22E"
        d="M15.17 18.96a2.53 2.53 0 0 1 2.52 2.52A2.53 2.53 0 0 1 15.17 24a2.53 2.53 0 0 1-2.52-2.52v-2.52h2.52zM15.17 17.69a2.53 2.53 0 0 1-2.52-2.52 2.53 2.53 0 0 1 2.52-2.52h6.31A2.53 2.53 0 0 1 24 15.17a2.53 2.53 0 0 1-2.52 2.52h-6.31z"
      />
    </svg>
  );
}

export function ShopifyMark() {
  return (
    <svg {...SVG}>
      {/* The bag, and the handle that sits proud of it. */}
      <path
        fill="#95BF47"
        d="M5.4 6.9h13.2l1.5 13.8a1.7 1.7 0 0 1-1.69 1.88H5.59A1.7 1.7 0 0 1 3.9 20.7L5.4 6.9z"
      />
      <path
        d="M9.1 8V5.7a2.9 2.9 0 0 1 5.8 0V8"
        fill="none"
        stroke="#5E8E3E"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <text {...LETTER} x="12" y="18.2" fontSize="9.5">
        S
      </text>
    </svg>
  );
}

export function WhatsAppMark() {
  return (
    <svg {...SVG}>
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        fill="#fff"
        d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z"
      />
    </svg>
  );
}

/**
 * The "anything else" tile.
 *
 * LUCIDE, DELIBERATELY. Every other mark in this file is a brand mark and
 * carries the exception documented at the top. This one is not a brand - it is
 * our own tile saying the list is not the limit - so the brand doc's rule
 * applies to it unchanged and it takes a Lucide glyph on a petrol disc. That
 * difference is the point: the tile reads as ours rather than as a tenth
 * company nobody recognises.
 */
export function CustomMark() {
  return (
    <span className="grid size-full place-items-center rounded-full bg-forest-700">
      <Plus aria-hidden="true" size={18} strokeWidth={2.5} className="text-white" />
    </span>
  );
}
