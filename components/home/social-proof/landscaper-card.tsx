import Image from "next/image";

import { LANDSCAPER_TILE, LANDSCAPERS } from "@/content/landscapers";

type Landscaper = (typeof LANDSCAPERS)[number];

/**
 * One testimonial tile: a 4:3 photograph over a name and an organisation.
 *
 * One component at both breakpoints - the two artboards draw the same card at
 * two scales, so forking it would mean two copies of four records. The three
 * genuine differences are all `desk:` variants below.
 */
export function LandscaperCard({ landscaper }: { landscaper: Landscaper }) {
  return (
    /*
      `overflow-hidden` is load-bearing: it is what clips the photograph to the
      card's top two corners. 12px is the brand's card radius.

      `.shadow-card-mobile` is scoped below 1024 in styles/base.css, so the
      desktop card has no shadow and no border at all - as both artboards draw
      them, and as docs/brand.md wants for a card (RULINGS.md §03/04 ruling 13).

      The artboard's desktop card also carries `position: relative` with nothing
      positioned against it; dropped, per principle 1's corollary.
    */
    <div className="shadow-card-mobile flex flex-col overflow-hidden rounded-xl bg-card">
      {/* `card-muted` is the placeholder tone behind the image while it loads.
          No `object-position`: every crop is centred, as drawn. */}
      <div className="relative aspect-[4/3] overflow-hidden bg-card-muted">
        <Image
          src={landscaper.photo}
          /* Decorative: the person is named in text immediately below, so a
             description here would be announced twice. */
          alt=""
          fill
          /* No `priority` - this band is below the fold at every width - and
             the default quality 75, which 296px tiles do not need to beat. */
          sizes={LANDSCAPER_TILE.sizes}
          className="object-cover"
        />
      </div>

      <div className="flex items-center gap-[10px] px-3 pt-[11px] pb-[13px] desk:gap-3 desk:px-4 desk:pt-[14px] desk:pb-4">
        {/*
          `aria-hidden="true"`, where both artboards write `aria-hidden=""`. The
          empty string is not a valid value, so the attribute did nothing and a
          screen reader read "AR Adam Robinson" (RULINGS.md §03/04 ruling 7).

          The artboard's `box-shadow: 0 0 0 3px #fff` is not here: it draws white
          on the card's own white, in a row where nothing overlaps the avatar, so
          it produces no pixels. Reproduce the render, drop the dead declaration
          (RULINGS.md §03/04 ruling 9).

          `font-ui` per the client's font decision - see social-proof.tsx.
        */}
        <span
          aria-hidden="true"
          className="grid size-[34px] flex-none place-items-center rounded-full bg-forest-700 font-ui text-[12px] font-bold text-white desk:size-10 desk:text-[13px]"
        >
          {landscaper.initials}
        </span>

        {/* `min-w-0` is load-bearing: without it this flex item will not shrink
            below its content width and the ellipsis never fires. */}
        <span className="flex min-w-0 flex-col gap-px">
          <span className="truncate font-ui text-[13.5px] font-semibold text-ink desk:text-[14.5px] desk:text-charcoal-900">
            {landscaper.name}
          </span>
          {/*
            The artboard truncates this line on desktop. Measured at 1024px, the
            organisation gets ~148px and three of the four need more - "Adam
            Robinson Design, Sydney" 174px, "Occo Landscapers & Builders" 164px,
            "Fig Landscapes, Melbourne" 153px - so at exactly the width we switch
            layouts, three of four cards would silently ellipsis a real person's
            company. Ruled a defect: the line wraps at every width, which is the
            mobile artboard's own behaviour. The name above still truncates.
          */}
          <span className="font-ui text-[11.5px] leading-[1.3] text-slate-500 desk:text-[12.5px] desk:leading-normal">
            {landscaper.org}
          </span>
        </span>
      </div>
    </div>
  );
}
