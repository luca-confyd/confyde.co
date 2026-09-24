import { NavFlipSentinel } from "@/components/chrome/nav-flip-sentinel";
import type { CaseStudy } from "@/content/case-studies";

/**
 * The dark head of a case study: the eyebrow, the title, the lede, and the
 * engagement's facts down the right.
 *
 * NO NAV IN HERE. The design draws the nav pill inside this band because a
 * design doc has no page chrome; the real nav is in app/layout.tsx and flips
 * from dark to light as the dark pixels leave the top of the viewport. That is
 * what `NavFlipSentinel` is for, and it is why this section is `relative` -
 * the sentinel pins itself to the bottom edge. Without it the nav would stay
 * dark over the cream page below.
 *
 * THE GRID SURFACE IS THE SITE'S, NOT THE DESIGN'S. The design paints its own
 * 88px grid over a petrol gradient; `.grid-surface` is the same idea already
 * shipping on the hero and the footer, at the page's own 64px cell. Using it
 * means the case study's dark bands are the same surface as the homepage's
 * rather than a second, nearly-identical one.
 *
 * THE BOTTOM PADDING PAYS FOR THE NUMBERS CARD. `pb-44` is deep enough for the
 * card in <CaseStudyNumbers> to overlap it and still clear this band's own
 * copy - the design's 170px of padding against a -116px pull. The two numbers
 * belong together: change one and the card either floats off the band or eats
 * the lede.
 */
export function CaseStudyHero({
  eyebrow,
  study,
}: {
  /** "Case study / <client>" on a study; the about page brings its own. */
  eyebrow: string;
  study: Pick<CaseStudy, "title" | "lede" | "meta">;
}) {
  return (
    <section
      data-section="case-study-hero"
      className="grid-surface relative px-4 pt-28 pb-36 sm-only:px-8 desk:px-0 desk:pt-40 desk:pb-44"
    >
      <div className="mx-auto flex w-full max-w-[1232px] flex-col gap-10 desk:grid desk:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] desk:items-end desk:gap-16 desk:px-6">
        <div className="flex flex-col gap-5">
          {/*
            The design sets every eyebrow in IBM Plex Mono. The site loads no
            mono face and the brand's eyebrow is this - the body font, 12px,
            extrabold, 0.14em - so the eyebrows are translated rather than
            transcribed, and no fifth family is added to the page for three
            labels. forest-300 is the dark-surface eyebrow tone: 7.1:1 on the
            grid surface, where the design's #7FBFBA sits at 6.4.
          */}
          <span className="text-[12px] font-extrabold tracking-[0.14em] text-forest-300 uppercase">
            {eyebrow}
          </span>

          {/* `.display-1` is the page's own h1 scale (4.75rem at desk against
              the design's 62px) - the case study is not a different typographic
              system from the homepage, so it does not get a different h1. */}
          <h1 className="display display-1 text-balance text-pf-ink-100">{study.title}</h1>

          <p className="max-w-[560px] text-[18px] leading-[1.6] text-cream">{study.lede}</p>
        </div>

        {/* The facts, hairline-separated. A description list rather than the
            design's stack of spans: these are label/value pairs, and `<dl>` is
            what says so to anything that is not looking at them. */}
        <dl className="flex flex-col gap-4 desk:pb-1.5">
          {study.meta.map((entry, index) => (
            <div
              key={entry.label}
              className={
                "flex flex-col gap-1.5" +
                (index > 0 ? " border-t border-cream/[0.14] pt-4" : "")
              }
            >
              <dt className="text-[11px] font-extrabold tracking-[0.14em] text-forest-300 uppercase">
                {entry.label}
              </dt>
              <dd className="m-0 text-[16px] text-pf-ink-100">{entry.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <NavFlipSentinel />
    </section>
  );
}
