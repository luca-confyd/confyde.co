import Image from "next/image";
import Link from "next/link";

import { type CaseStudy, caseStudyCover, caseStudyPath } from "@/content/case-studies";

/**
 * "More of where we've worked": the other case studies, two up.
 *
 * THE COVER IS THE STUDY'S OWN FIGURE, via `caseStudyCover`, so the card and the
 * article it opens show the same screen. A study with no artwork still draws
 * the hatched slot, which is what the article would draw too - the page says
 * "artwork pending" in one voice rather than two.
 *
 * NO "ALL CASE STUDIES" LINK. The design draws one beside the heading and it
 * shipped as an inert <NavItem>, because there is no index page for it to point
 * at: the three studies are reached from the homepage and from each other. It
 * is removed rather than left announcing itself as a disabled destination. If
 * /case-studies is ever built, this is where its link goes, and the heading row
 * is already a `justify-between` flex waiting for a second child.
 */
export function CaseStudyMore({ others }: { others: readonly CaseStudy[] }) {
  if (others.length === 0) return null;

  return (
    <section
      data-section="case-study-more"
      className="mx-auto flex w-full max-w-[1232px] flex-col gap-6 px-4 pt-14 pb-16 sm-only:px-8 desk:px-6 desk:pt-18 desk:pb-20"
    >
      <div className="flex flex-col gap-2 desk:flex-row desk:items-baseline desk:justify-between">
        <h2 className="display display-3 text-pf-ink-900">More of where we’ve worked</h2>
      </div>

      <div className="grid gap-6 desk:grid-cols-2">
        {others.map((study) => {
          const cover = caseStudyCover(study);

          return (
            <Link
              key={study.slug}
              href={caseStudyPath(study.slug)}
              className="group flex flex-col gap-4 rounded-xl bg-card p-3.5 no-underline shadow-border-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700"
            >
              {cover ? (
                /* Decorative: the client is named in the eyebrow and the title
                 directly below, and the article this opens carries the same
                 image with a real description on it. */
                <Image
                  src={cover}
                  alt=""
                  aria-hidden="true"
                  width={1200}
                  height={760}
                  sizes="(min-width: 1024px) 590px, 100vw"
                  className="h-[190px] w-full rounded-lg object-cover object-top"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-[190px] items-center justify-center rounded-lg bg-[repeating-linear-gradient(135deg,var(--color-card-muted)_0_10px,var(--color-rail)_10px_20px)]"
                >
                  <span className="text-[12px] text-slate-500">{study.client} cover</span>
                </span>
              )}

              <span className="flex flex-col gap-2 px-2.5 pb-3.5">
                {/* The client's name is not in the design's card, but the title
                  alone ("A club that runs itself") does not say whose story it
                  is - and on this page the reader has no photograph to tell
                  them. It takes the eyebrow treatment so it labels the card
                  rather than competing with the title. */}
                <span className="text-[11px] font-extrabold tracking-[0.14em] text-eyebrow uppercase">
                  {study.client}
                </span>
                <span className="display display-4 text-pf-ink-900 group-hover:text-eyebrow">
                  {study.card.title}
                </span>
                <span className="text-[16px] leading-[1.55] text-slate-600">
                  {study.card.blurb}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
