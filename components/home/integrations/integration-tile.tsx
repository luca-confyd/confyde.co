import type { Integration, IntegrationId } from "@/content/integrations";

import {
  CustomMark,
  GoogleMark,
  HubSpotMark,
  MicrosoftMark,
  QuickBooksMark,
  ShopifyMark,
  SlackMark,
  StripeMark,
  WhatsAppMark,
  XeroMark,
} from "./brand-marks";

/**
 * `id` -> mark. A `Record` over the union rather than a lookup with a
 * fallback, so adding an id to `IntegrationId` without drawing its mark is a
 * type error here rather than a hole in the row at runtime.
 */
const MARKS: Record<IntegrationId, () => React.JSX.Element> = {
  microsoft: MicrosoftMark,
  google: GoogleMark,
  xero: XeroMark,
  quickbooks: QuickBooksMark,
  stripe: StripeMark,
  hubspot: HubSpotMark,
  slack: SlackMark,
  shopify: ShopifyMark,
  whatsapp: WhatsAppMark,
  custom: CustomMark,
};

/**
 * One partner tile: a 34px mark beside a name and a category.
 *
 * One component at both breakpoints. The two artboards draw the same tile at
 * two scales and the records exist once in the DOM, exactly as
 * `LandscaperCard` does for section 04.
 */
export function IntegrationTile({ integration }: { integration: Integration }) {
  const Mark = MARKS[integration.id];

  return (
    /*
      Two different shadows, one per artboard: below 1024 the mobile board's two
      warm layers with no hairline, above it the desktop board's hairline plus
      four blurs. `shadow-card-mobile` is already scoped below 1024 in
      styles/base.css and `shadow-border-default` is now an `@utility`, so it
      takes the `desk:` variant and the two never overlap.

      12px is the brand's card radius; a tile nested inside the card-muted panel
      is still a card, not a panel, because it is a thing you read.
    */
    <div className="shadow-card-mobile flex items-center gap-[10px] rounded-xl bg-card px-3 py-[11px] desk:gap-3 desk:px-4 desk:py-[14px] desk:shadow-border-default">
      {/*
        A fixed box rather than a sized mark, so every logo lands on the same
        baseline whatever shape it is. The disc marks fill it; the free-standing
        ones (Microsoft, Google, Slack, HubSpot) carry their own inset inside
        their 24x24 canvas, which is what keeps the row optically even without
        the tile knowing which is which.

        The whole box is `aria-hidden`: the product is named in text right
        beside it, and the previous lettermark discs were read aloud as "Q
        QuickBooks" because the artboards wrote `aria-hidden=""`, which is not a
        valid value and does nothing (RULINGS.md §03/04 ruling 7).
      */}
      <span aria-hidden="true" className="block size-[30px] flex-none desk:size-[34px]">
        <Mark />
      </span>

      {/* `min-w-0` is load-bearing: without it this flex item will not shrink
          below its content width, so it would push the tile wider than its grid
          track instead of wrapping (and, at desk, the ellipsis would never
          fire). */}
      <span className="flex min-w-0 flex-col gap-px">
        {/*
          The name WRAPS below 1024 and truncates above it, where both artboards
          declare `text-overflow: ellipsis` and nothing ever reaches it anyway.
          Measured across 320-1440px: nothing clipped at 430px, the mobile
          artboard's own width, or at any width above it - but the two-word
          names lose their second word at 360-390px. Those are ordinary phone
          widths, so that is content loss rather than a rendering choice: ruled
          a defect and fixed the way section 04's organisation line was.

          `break-words` is the guard the ellipsis used to be. Every name here has
          a space to break at, but a future partner with one long word would
          otherwise push the tile wider than its grid track.
        */}
        <span className="font-ui text-[13px] font-semibold break-words text-ink desk:truncate desk:text-[14px] desk:text-charcoal-900">
          {integration.name}
        </span>
        {/* Both artboards set this line to slate-500; only the size differs. */}
        <span className="font-ui text-[11px] text-slate-500 desk:text-[12px]">
          {integration.sub}
        </span>
      </span>
    </div>
  );
}
