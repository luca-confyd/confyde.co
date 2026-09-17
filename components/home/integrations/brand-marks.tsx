/* -----------------------------------------------------------------------------
   The integration brand marks.

   SAME EXCEPTION AS `chrome/footer/social-marks.tsx`, for the same reason. The
   brand doc makes Lucide the only icon system and §02 ruling 8 made that
   binding - but lucide-react ships no brand icons at all, so there is no glyph
   for Xero or Slack to reach for. That file resolved it by carrying the marks
   as paths in one place; this one does the same, and the two should move
   together if an icon set that covers brand marks is ever adopted.

   WHERE THE GEOMETRY COMES FROM. Seven of these are the official paths, taken
   from the `simple-icons` set (v16) and inlined here rather than added as a
   dependency - the same call `social-marks.tsx` makes, and it keeps the whole
   row in one readable file with no runtime cost. Those seven are Xero,
   QuickBooks, Stripe, HubSpot, Shopify and WhatsApp, plus their official brand
   hexes, which is why Shopify is #7AB55C and not the #95BF47 a first pass
   guessed at.

   Microsoft 365, Google and Slack are NOT from that set. simple-icons carries
   no Microsoft or Slack mark - both were withdrawn from it on trademark
   request - and its Google icon is a single-colour silhouette that loses the
   four-colour G. So those three are drawn here: Microsoft is four squares,
   Google is the standard four-path G, Slack the four-path pinwheel. All three
   are geometric enough to be reproduced exactly; they are the only ones in
   this file not traceable to a published path set.

   NONE OF THESE ARE THE OFFICIAL ASSET FILES. Official geometry is not the
   same as an official asset, and it says nothing about permission: several of
   these brands (Microsoft, Shopify, WhatsApp) put conditions on partner and
   integration use of their marks. Treat the set as a placeholder until someone
   has read those terms and dropped in the real files.

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

/**
 * One mark, optically sized.
 *
 * WHY `k` EXISTS. Every mark renders into the same 34px box, and that is not
 * the same thing as every mark looking the same size. Measured as ink on the
 * 24-unit canvas, the raw marks run from 17.1 units wide (Stripe) to a full 24
 * (Xero, QuickBooks, WhatsApp, Slack) - and the solid discs read heavier still,
 * because a filled circle carries far more ink than an open glyph inside the
 * same square. Left alone the row has Xero and QuickBooks looming over
 * Microsoft and Stripe.
 *
 * So `k` scales each mark about its own centre to land them all on roughly 21
 * units of optical size, which is where Microsoft's four squares and Google's
 * G already sat. The solid discs come down hardest (0.875), the airy pinwheel
 * and stroke marks barely at all, and the two that were already right are left
 * at 1. These are judged by eye against each other, not computed - optical
 * size is a perception, and the arithmetic only gets you close.
 */
function Mark({ k = 1, children }: { k?: number; children: React.ReactNode }) {
  const offset = (24 - 24 * k) / 2;
  return (
    <svg {...SVG}>
      {k === 1 ? (
        children
      ) : (
        <g transform={"translate(" + offset + " " + offset + ") scale(" + k + ")"}>{children}</g>
      )}
    </svg>
  );
}

export function MicrosoftMark() {
  return (
    <Mark>
      <rect x="1.5" y="1.5" width="9.5" height="9.5" fill="#F25022" />
      <rect x="13" y="1.5" width="9.5" height="9.5" fill="#7FBA00" />
      <rect x="1.5" y="13" width="9.5" height="9.5" fill="#00A4EF" />
      <rect x="13" y="13" width="9.5" height="9.5" fill="#FFB900" />
    </Mark>
  );
}

export function GoogleMark() {
  return (
    <Mark>
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
    </Mark>
  );
}

export function XeroMark() {
  return (
    <Mark k={0.875}>
      <path fill="#13B5EA" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.585 14.655c-1.485 0-2.69-1.206-2.69-2.689 0-1.485 1.207-2.691 2.69-2.691 1.485 0 2.69 1.207 2.69 2.691s-1.207 2.689-2.69 2.689zM7.53 14.644c-.099 0-.192-.041-.267-.116l-2.043-2.04-2.052 2.047c-.069.068-.16.108-.258.108-.202 0-.368-.166-.368-.368 0-.099.04-.191.111-.263l2.04-2.05-2.038-2.047c-.075-.069-.113-.162-.113-.261 0-.203.166-.366.368-.366.098 0 .188.037.258.105l2.055 2.048 2.048-2.045c.069-.071.162-.108.26-.108.211 0 .375.165.375.366 0 .098-.029.188-.104.258l-2.056 2.055 2.055 2.051c.068.069.104.16.104.258 0 .202-.165.368-.365.368h-.01zm8.017-4.591c-.796.101-.882.476-.882 1.404v2.787c0 .202-.165.366-.366.366-.203 0-.367-.165-.368-.366v-4.53c0-.204.16-.366.362-.366.166 0 .316.125.346.289.27-.209.6-.317.93-.317h.105c.195 0 .359.165.359.368 0 .201-.164.352-.375.359 0 0-.09 0-.164.008l.053-.002zm-3.091 2.205H8.625c0 .019.003.037.006.057.02.105.045.211.083.31.194.531.765 1.275 1.829 1.29.33-.003.631-.086.9-.229.21-.12.391-.271.525-.428.045-.058.09-.112.12-.168.18-.229.405-.186.54-.083.164.135.18.391.045.57l-.016.016c-.21.27-.435.495-.689.66-.255.164-.525.284-.811.345-.33.09-.645.104-.975.06-1.095-.135-2.01-.93-2.28-2.01-.06-.21-.09-.42-.09-.645 0-.855.421-1.695 1.125-2.205.885-.615 2.085-.66 3-.075.63.405 1.035 1.021 1.185 1.771.075.419-.21.794-.734.81l.068-.046zm6.129-2.223c-1.064 0-1.931.865-1.931 1.931 0 1.064.866 1.931 1.931 1.931s1.931-.867 1.931-1.931c0-1.065-.866-1.933-1.931-1.933v.002zm0 2.595c-.367 0-.666-.297-.666-.666 0-.367.3-.665.666-.665.367 0 .667.299.667.665 0 .369-.3.667-.667.666zm-8.04-2.603c-.91 0-1.672.623-1.886 1.466v.03h3.776c-.203-.855-.973-1.494-1.891-1.494v-.002z" />
    </Mark>
  );
}

export function QuickBooksMark() {
  return (
    <Mark k={0.875}>
      <path fill="#2CA01C" d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm.642 4.1335c.9554 0 1.7296.776 1.7296 1.7332v9.0667h1.6c1.614 0 2.9275-1.3156 2.9275-2.933 0-1.6173-1.3136-2.9333-2.9276-2.9333h-.6654V7.3334h.6654c2.5722 0 4.6577 2.0897 4.6577 4.667 0 2.5774-2.0855 4.6666-4.6577 4.6666H12.642zM7.9837 7.333h3.3291v12.533c-.9555 0-1.73-.7759-1.73-1.7332V9.0662H7.9837c-1.6146 0-2.9277 1.316-2.9277 2.9334 0 1.6175 1.3131 2.9333 2.9277 2.9333h.6654v1.7332h-.6654c-2.5725 0-4.6577-2.0892-4.6577-4.6665 0-2.5771 2.0852-4.6666 4.6577-4.6666Z" />
    </Mark>
  );
}

export function StripeMark() {
  return (
    <Mark k={0.9}>
      <path fill="#635BFF" d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
    </Mark>
  );
}

export function HubSpotMark() {
  return (
    <Mark k={0.93}>
      <path fill="#FF7A59" d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z" />
    </Mark>
  );
}

export function SlackMark() {
  return (
    <Mark k={0.92}>
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
    </Mark>
  );
}

export function ShopifyMark() {
  return (
    <Mark k={0.9}>
      <path fill="#7AB55C" d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z" />
    </Mark>
  );
}

export function WhatsAppMark() {
  return (
    <Mark k={0.875}>
      <path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </Mark>
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
    // 87.5%, the same optical inset the solid brand discs take above.
    <span className="grid size-full place-items-center">
      <span className="grid size-[87.5%] place-items-center rounded-full bg-forest-700">
        <Plus aria-hidden="true" size={16} strokeWidth={2.5} className="text-white" />
      </span>
    </span>
  );
}
