import Image from "next/image";

import type { CaseStudy } from "@/content/case-studies";

/**
 * The pull quote.
 *
 * The design's panel is a cream-to-sage gradient; this is the same two tones
 * from the site's own palette (card-muted to forest-100), interpolated in srgb
 * because the stops are the brand's hex values and oklab - Tailwind v4's
 * default - bends the midpoint somewhere neither of them is.
 *
 * The plate carries a headshot where the study has one and the speaker's
 * initials where it does not - initials being the design's own answer, from
 * when there were no client photographs at all. Both are drawn at the same
 * 44px square with the same corner, so the caption's geometry does not move
 * between studies.
 *
 * The photograph is `aria-hidden` for the same reason the initials are: the
 * name it stands for is set immediately beside it.
 */
export function CaseStudyQuote({ study }: { study: CaseStudy }) {
  return (
    <section
      data-section="case-study-quote"
      className="mx-auto w-full max-w-[1232px] px-4 pt-12 sm-only:px-8 desk:px-6 desk:pt-16"
    >
      <figure className="m-0 flex flex-col gap-7 rounded-xl bg-linear-to-br/srgb from-card-muted to-forest-100 px-7 py-9 desk:px-14 desk:py-12">
        <blockquote className="m-0">
          {/* Fraunces at the `.display-3` slot, which is the design's 28px at
              desk. The curly quotes are in content, not added here. */}
          <p className="display display-3 max-w-[900px] text-balance leading-[1.45] text-pf-ink-900">
            “{study.quote.text}”
          </p>
        </blockquote>

        <figcaption className="flex items-center gap-3.5">
          {study.quote.portrait ? (
            <Image
              src={study.quote.portrait}
              alt=""
              aria-hidden="true"
              width={44}
              height={44}
              className="size-11 flex-none rounded-lg object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex size-11 flex-none items-center justify-center rounded-lg bg-forest-900 text-[14px] font-semibold tracking-[0.04em] text-pf-ink-100"
            >
              {study.quote.initials}
            </span>
          )}
          <span className="flex flex-col">
            <span className="text-[16px] font-semibold text-pf-ink-900">{study.quote.name}</span>
            <span className="text-[15px] text-slate-600">{study.quote.role}</span>
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
