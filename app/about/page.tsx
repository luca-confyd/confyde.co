import type { Metadata } from "next";

import { CaseStudyBody } from "@/components/case-study/case-study-body";
import { CaseStudyCta } from "@/components/case-study/case-study-cta";
import { CaseStudyHero } from "@/components/case-study/case-study-hero";
import { CaseStudyNumbers } from "@/components/case-study/case-study-numbers";
import { CaseStudyQuote } from "@/components/case-study/case-study-quote";
import { PageEffects } from "@/components/primitives/page-effects";
import { ABOUT } from "@/content/about";

/**
 * The about page, `/about`.
 *
 * Built from the client's design doc ("About Page.dc.html"), which is the case
 * study board with a different article in it: the same dark hero with facts
 * down the right, the overlapping numbers card, the railed article, the pull
 * quote and the closing band. So it is rendered by the case study components
 * rather than a second set of near-copies, and every translation noted in
 * app/case-studies/[slug]/page.tsx - type, colour, radii, one responsive
 * composition - applies here unchanged.
 *
 * The one section it drops is "More of where we've worked": the design has no
 * such band. Like the case studies it sits outside `(with-footer)`, because it
 * closes on its own CTA band.
 */

const title = "About | Confyde";

export const metadata: Metadata = {
  title,
  description: ABOUT.lede,
  openGraph: { title, description: ABOUT.lede, type: "website", locale: "en_GB" },
};

export default function AboutPage() {
  return (
    <>
      <PageEffects />

      <main id="top">
        <CaseStudyHero eyebrow={ABOUT.eyebrow} study={ABOUT} />
        <CaseStudyNumbers eyebrow={ABOUT.numbersEyebrow} wordFigures study={ABOUT} />
        <CaseStudyBody railPrompt={ABOUT.railPrompt} study={ABOUT} />
        <CaseStudyQuote study={ABOUT} />
        {/* The quote is the last band before the CTA here, where on a study
            "More of where we've worked" pays for the gap. Same bottom padding
            that band carries. */}
        <div aria-hidden="true" className="h-16 desk:h-20" />
        <CaseStudyCta heading={ABOUT.ctaHeading} body={ABOUT.ctaBody} />
      </main>
    </>
  );
}

