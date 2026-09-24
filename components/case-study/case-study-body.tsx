import Image from "next/image";

import { BOOKING_URL } from "@/lib/booking";
import { NavItem } from "@/components/chrome/nav-item";
import type { CaseStudy, CaseStudyBlock } from "@/content/case-studies";

/**
 * The article: a sticky "On this page" rail beside the prose.
 *
 * THE RAIL IS DERIVED. The design lists its four entries by hand, one of which
 * ("Where it landed") has no heading under it. Here it is built from
 * `study.sections`, so the rail and the article cannot disagree and a study
 * with two sections or five needs no second edit.
 *
 * WHICH ENTRY IS CURRENT IS NOT MARKED. The design bolds "The problem", which
 * implies a scroll-spy. That is real behaviour - an IntersectionObserver and a
 * client boundary - and the page does not have it yet, so every entry ships in
 * the same weight rather than one being permanently bold against a reader who
 * has scrolled past it. Worth adding; see the note in the page component.
 *
 * `scroll-mt` on the headings is what stops the sticky nav covering a heading
 * the rail has just jumped to.
 */
export function CaseStudyBody({
  railPrompt = "Want the same read on your business?",
  study,
}: {
  /** The line above the rail's booking link. */
  railPrompt?: string;
  study: Pick<CaseStudy, "sections">;
}) {
  return (
    <section
      data-section="case-study-body"
      className="mx-auto w-full max-w-[1232px] px-4 pt-14 sm-only:px-8 desk:grid desk:grid-cols-[240px_minmax(0,1fr)] desk:gap-18 desk:px-6 desk:pt-19"
    >
      <nav
        aria-label="On this page"
        className="mb-10 flex flex-col gap-3.5 desk:sticky desk:top-24 desk:mb-0 desk:self-start"
      >
        <span className="text-[11px] font-extrabold tracking-[0.16em] text-slate-500 uppercase">
          On this page
        </span>

        {study.sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="text-[16px] text-pf-ink-700 no-underline hover:text-eyebrow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700"
          >
            {section.heading}
          </a>
        ))}

        <div aria-hidden="true" className="my-2.5 h-px bg-hairline" />

        <span className="text-[14px] leading-[1.5] text-slate-600">
          {railPrompt}
        </span>
        {/* The one real destination on this page, and the same one every
            "Book a discovery call" on the site points at. */}
        <NavItem
          href={BOOKING_URL}
          tone="light"
          className="text-[15px] font-semibold text-eyebrow underline decoration-1 underline-offset-4"
        >
          Book a discovery call →
        </NavItem>
      </nav>

      <div className="flex max-w-[720px] flex-col gap-7">
        {study.sections.map((section) => (
          <section key={section.id} className="flex flex-col gap-7">
            {/* `scroll-mt-24` clears the sticky desktop nav; the mobile nav is
                shorter and the same value is harmless there. */}
            <h2
              id={section.id}
              className="display display-2 scroll-mt-24 text-pf-ink-900"
            >
              {section.heading}
            </h2>

            {section.blocks.map((block, index) => (
              <Block key={index} block={block} />
            ))}
          </section>
        ))}
      </div>
    </section>
  );
}

/**
 * One block of the article. A switch rather than a lookup table: six cases,
 * each with its own markup, and TypeScript checks the union is covered.
 */
function Block({ block }: { block: CaseStudyBlock }) {
  switch (block.kind) {
    case "prose":
      return <p className="m-0 text-[18px] leading-[1.72] text-pf-ink-700">{block.text}</p>;

    case "statement":
      return <p className="display display-4 m-0 leading-[1.4] text-pf-ink-900">{block.text}</p>;

    case "points":
      return (
        <div className="flex flex-col gap-5">
          {block.heading ? (
            <h3 className="display display-4 m-0 text-pf-ink-900">{block.heading}</h3>
          ) : null}
          {/* Hairline rows, the same rhythm as the numbered steps, so the two
              lists on a page read as one family. */}
          <ul className="m-0 flex list-none flex-col p-0">
            {block.points.map((point) => (
              <li
                key={point.lead}
                className="border-t border-hairline py-5 text-[17px] leading-[1.65] text-slate-600 last:border-b"
              >
                <span className="font-semibold text-pf-ink-900">{point.lead}</span> {point.text}
              </li>
            ))}
          </ul>
        </div>
      );

    case "callout":
      return (
        <div className="flex flex-col gap-2.5 rounded-xl bg-card-muted px-7 py-7">
          {/* `text-eyebrow-muted` and not `text-eyebrow`: this panel is
              card-muted, the one surface the brighter petrol does not clear AA
              on - the same pair chapter 1's eyebrows use. */}
          <span className="text-[11px] font-extrabold tracking-[0.16em] text-eyebrow-muted uppercase">
            {block.eyebrow}
          </span>
          <span className="display display-4 leading-[1.4] text-pf-ink-900">
            {block.statement}
          </span>
        </div>
      );

    case "steps":
      return (
        /* An ordered list, because the design's 01/02/03 IS the order. The
           numbers are drawn by the list rather than stored in content, so
           inserting a step renumbers the rest for free. */
        <ol className="m-0 flex list-none flex-col p-0">
          {block.steps.map((step, index) => (
            <li
              key={step.title}
              className="grid grid-cols-[34px_minmax(0,1fr)] gap-5 border-t border-hairline py-5 last:border-b desk:grid-cols-[44px_minmax(0,1fr)]"
            >
              <span
                aria-hidden="true"
                className="pt-1 text-[13px] font-semibold tabular-nums text-eyebrow"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex flex-col gap-1.5">
                <span className="text-[19px] font-semibold text-pf-ink-900">{step.title}</span>
                <span className="text-[17px] leading-[1.65] text-slate-600">{step.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      );

    case "figure":
      /*
        The artwork, where a study has any: the same 16:9 frame and the same
        corner as the placeholder below, so a study with a picture and a study
        without lay out identically. `caption` is the alt text here, which is
        why the type asks for a description rather than a brief.
      */
      if (block.src) {
        return (
          <Image
            src={block.src}
            alt={block.caption}
            width={1600}
            height={900}
            sizes="(min-width: 1024px) 720px, 100vw"
            className="aspect-[16/9] w-full rounded-xl object-cover shadow-border-default"
          />
        );
      }

      /*
        The hatched placeholder, as the design draws it. It is deliberately not
        an <Image> with a stand-in photograph: a wrong photograph reads as a
        finished page, where this reads as a slot. 16:9 by aspect ratio rather
        than the design's fixed 340px, so it holds its proportion at every
        width.
      */
      return (
        <div
          role="img"
          aria-label={`Placeholder: ${block.caption}`}
          className="flex aspect-[16/9] items-center justify-center rounded-xl bg-[repeating-linear-gradient(135deg,var(--color-card-muted)_0_10px,var(--color-rail)_10px_20px)] shadow-border-default"
        >
          <span className="rounded-md bg-pf-surface-50 px-3.5 py-2 text-[12px] tracking-[0.1em] text-slate-500">
            {block.caption}
          </span>
        </div>
      );
  }
}
