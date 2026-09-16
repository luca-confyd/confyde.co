import Image from "next/image";

import { Reveal } from "@/components/primitives/reveal";
import { PULL_QUOTE_AVATAR, type PullQuote as PullQuoteRecord } from "@/content/proof";

/**
 * One mid-page pull quote: a forest panel carrying a testimonial, the person
 * who said it and their photograph.
 *
 * ONE TREE, TWO ARRANGEMENTS. The artboards move the photograph rather than
 * redrawing the panel - desktop stands it to the left of a quote-and-name
 * column, mobile tucks it under the quote beside a stacked name and
 * organisation. A two-column grid expresses both without duplicating the
 * quotation in the DOM, which a `hidden` / `desk:hidden` pair would:
 *
 *   below 1024   row 1  quote across both columns
 *                row 2  photograph | name over organisation
 *   at desk      col 1  photograph, spanning both rows
 *                col 2  row 1 quote, row 2 name beside organisation
 *
 * MARKUP. `<figure>` + `<blockquote>` + `<figcaption>` + `<cite>`, because this
 * is a quotation with an attribution and the artboard's stack of `<div>`s and
 * `<span>`s says none of that. `<cite>` names the work or, as here by
 * long-standing practice, the speaker; it is italic by default in every browser
 * and docs/brand.md bans italics in both families, so `not-italic` is a brand
 * rule rather than a preference.
 *
 * TYPE. The quotation is `--font-ui-serif` and the attribution `--font-ui` at
 * BOTH breakpoints - see `pull-quotes.tsx` for why the desktop artboard's faces
 * win.
 */
export function PullQuote({ quote }: { quote: PullQuoteRecord }) {
  return (
    /*
      [LOG] The quotation is pure white where docs/brand.md names cream as the
      on-forest text tone. Both artboards draw #fff and it is the brighter of
      the two against forest-900, so it ships as drawn (RULINGS.md principle 1).
      The attribution below it IS cream, so the panel already carries the
      brand's tone on the line that sits at a smaller size.
    */
    <Reveal
      as="figure"
      anim="up-blur"
      duration={0.5}
      className="m-0 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-4 rounded-xl bg-forest-900 px-[18px] pt-[26px] pb-6 desk:gap-x-9 desk:gap-y-[18px] desk:px-12 desk:py-11"
    >
      {/*
        `44ch` is a measure, not a width, so it only bites at desk where the
        column is wide enough to exceed it.
      */}
      <blockquote
        className={`col-span-2 m-0 font-ui-serif font-semibold ${quote.mobileSize} leading-[1.35] text-white desk:col-span-1 desk:col-start-2 desk:row-start-1 desk:max-w-[44ch] desk:text-2xl`}
      >
        {quote.quote}
      </blockquote>

      {/*
        Decorative: the person is named in the `<figcaption>` immediately
        beside it, so a description here would be announced twice.

        [LOG] The mobile radius is 10px, off the brand's 4/6/8/12 scale, where
        desktop uses the 12px card radius. As drawn, like the mobile nav's own
        10px radii (RULINGS.md §01 defect 8).
      */}
      <Image
        src={quote.photo}
        alt=""
        width={PULL_QUOTE_AVATAR.intrinsic}
        height={PULL_QUOTE_AVATAR.intrinsic}
        sizes={PULL_QUOTE_AVATAR.sizes}
        className="col-start-1 row-start-2 size-11 flex-none rounded-[10px] object-cover desk:row-span-2 desk:row-start-1 desk:size-26 desk:rounded-xl"
      />

      <figcaption className="col-start-2 row-start-2 flex flex-col gap-px desk:flex-wrap desk:flex-row desk:items-baseline desk:gap-2">
        <cite className="font-ui text-[14px] font-bold text-cream not-italic desk:text-[15px] desk:font-semibold">
          {quote.name}
        </cite>
        <span className="font-ui text-[13px] text-forest-300 desk:text-[14px]">{quote.org}</span>
      </figcaption>
    </Reveal>
  );
}
