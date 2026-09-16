import Image from "next/image";

import { INTEGRATION_MARK, type Integration } from "@/content/integrations";

/**
 * One partner tile: a 34px mark beside a name and a category.
 *
 * One component at both breakpoints. The two artboards draw the same tile at
 * two scales and the eight records exist once in the DOM, exactly as
 * `LandscaperCard` does for section 04.
 */
export function IntegrationTile({ integration }: { integration: Integration }) {
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
      {integration.mark ? (
        <Image
          src={integration.mark}
          /* Decorative: the partner is named in text immediately beside it, so
             a description here would be announced twice. */
          alt=""
          width={INTEGRATION_MARK.size}
          height={INTEGRATION_MARK.size}
          /* No `sizes`, and no `fill` - see INTEGRATION_MARK. */
          className="size-[30px] flex-none rounded-full desk:size-[34px]"
        />
      ) : (
        /*
          A lettermark, not an image: type on a coloured circle. `aria-hidden`
          is "true" where both artboards write the empty string, which is not a
          valid value - so a screen reader currently reads "M MYOB"
          (RULINGS.md §03/04 ruling 7).

          `font-ui` at both breakpoints, per the client's font decision at the
          end of RULINGS.md: the desktop artboard sets these in Hanken Grotesk
          and the mobile one lets them inherit Nunito Sans, and desktop is the
          side the client confirmed.

          [LOG - CONTRAST, RULED.] White on three of these seven discs measures
          below WCAG AA on the composited pixels at 1280 and 390: QuickBooks
          #2CA01C 3.41:1, Google Drive #F9AB00 1.93:1, WhatsApp #25D366 1.98:1,
          where body text at these sizes would need 4.5:1. They ship unchanged.
          WCAG 1.4.3 exempts text that is part of a logo or brand name, and a
          partner's initial set on that partner's own brand colour is exactly
          that - recolouring it would be an edit to someone else's mark. The
          exemption is not load-bearing either way: the disc is `aria-hidden`
          and the partner's full name sits beside it in passing ink, so the
          letter carries nothing on its own.

          Worth recording, because it constrains any future fix: QuickBooks
          cannot be rescued by darkening the letter at all. #2CA01C measures
          4.38:1 against charcoal-900, 4.17:1 against forest-900 and 4.08:1
          against ink - nothing in the palette clears 4.5:1 on that green.
        */
        <span
          aria-hidden="true"
          // WCAG 1.4.3 exempts text that is part of a logo or brand name from
          // contrast requirements, and that is what this is: a partner's initial
          // standing in for their mark, on their own brand colour. Three of them
          // do not clear 4.5:1 and are not meant to - QuickBooks' #2CA01C cannot
          // be rescued by any ink in the palette. The attribute marks them for
          // the audit's documented exclusion so the gate stays honest elsewhere.
          data-brand-mark
          className="grid size-[30px] flex-none place-items-center rounded-full font-ui text-[11.5px] font-bold text-white desk:size-[34px] desk:text-[13px]"
          style={{ backgroundColor: integration.disc }}
        >
          {integration.initials}
        </span>
      )}

      {/* `min-w-0` is load-bearing: without it this flex item will not shrink
          below its content width, so it would push the tile wider than its grid
          track instead of wrapping (and, at desk, the ellipsis would never
          fire). */}
      <span className="flex min-w-0 flex-col gap-px">
        {/*
          The name WRAPS below 1024 and truncates above it, where both artboards
          declare `text-overflow: ellipsis` and nothing ever reaches it anyway.
          Measured across 320-1440px: nothing clipped at 430px, the mobile
          artboard's own width, or at any width above it - but "Google Calendar"
          and "Gmail & Outlook" lose their second word at 360-390px, and five of
          the eight do at 320px. Those are ordinary phone widths, so that is
          content loss rather than a rendering choice: ruled a defect and fixed
          the way section 04's organisation line was.

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
