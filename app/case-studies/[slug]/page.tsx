import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudyBody } from "@/components/case-study/case-study-body";
import { CaseStudyCta } from "@/components/case-study/case-study-cta";
import { CaseStudyHero } from "@/components/case-study/case-study-hero";
import { CaseStudyMore } from "@/components/case-study/case-study-more";
import { CaseStudyNumbers } from "@/components/case-study/case-study-numbers";
import { CaseStudyQuote } from "@/components/case-study/case-study-quote";
import { PageEffects } from "@/components/primitives/page-effects";
import { CASE_STUDIES, findCaseStudy, otherCaseStudies } from "@/content/case-studies";

/**
 * The case study template, `/case-studies/<slug>`.
 *
 * Built from the client's design doc ("Case Study Page.dc.html", option 1A),
 * which draws one 1280px board and nothing below it. So:
 *
 *   - THERE IS NO SECOND COMPOSITION. Every other section on this site forks
 *     into a desktop and a mobile component because the client drew both. Here
 *     there is one artboard, and inventing a mobile edit of it would be design
 *     work rather than a port. Each section is one responsive composition
 *     instead: the article's rail moves above the prose, the four figures
 *     become two by two, and the numbers card stops overlapping the hero.
 *     If mobile boards land later, fork the sections that disagree with them.
 *
 *   - THE DESIGN'S OWN TYPE AND COLOUR ARE TRANSLATED, NOT TRANSCRIBED. It
 *     names Bitter, Figtree and IBM Plex Mono and a petrol palette of its own;
 *     the page renders in Fraunces, Nunito Sans and the site's tokens, and the
 *     eyebrows take the brand's eyebrow recipe rather than a mono face the
 *     site does not load. Radii come down to the palette's 12px ceiling from
 *     the design's 16-20px (docs/brand.md bans 16px+). Every one of those is
 *     noted at the section that makes it.
 *
 * STILL MISSING, deliberately: the rail marks no current section (that needs a
 * scroll-spy and a client boundary - see <CaseStudyBody>), and there is no
 * /case-studies index - the design's "All case studies" link is gone with it.
 * The three articles carry real artwork now; the covers in "More of where we've
 * worked" are still hatched slots. See the header of content/case-studies.ts
 * for what must be checked before this is public.
 */

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = findCaseStudy(slug);
  if (!study) return {};

  const title = `${study.client} case study | Confyde`;
  return {
    title,
    description: study.lede,
    openGraph: { title, description: study.lede, type: "article", locale: "en_GB" },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const study = findCaseStudy(slug);

  /* An unknown slug is a 404, not an empty template. `generateStaticParams`
     covers the three that exist, so this only fires on a URL nobody linked. */
  if (!study) notFound();

  return (
    <>
      {/* The reveal observer and the page-wide effects the homepage mounts.
          Without it every `Reveal` on the page would stay at its idle opacity -
          which is why this page uses none of them yet, but it is mounted so
          adding one is not a debugging session. */}
      <PageEffects />

      <main id="top">
        <CaseStudyHero eyebrow={`Case study / ${study.client}`} study={study} />
        <CaseStudyNumbers study={study} />
        <CaseStudyBody study={study} />
        <CaseStudyQuote study={study} />
        <CaseStudyMore others={otherCaseStudies(study.slug)} />
        <CaseStudyCta />
      </main>
    </>
  );
}
