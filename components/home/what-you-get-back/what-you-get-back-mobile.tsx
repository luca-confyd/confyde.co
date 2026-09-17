import { Reveal } from "@/components/primitives/reveal";
import { GET_BACK, GET_BACK_CARDS } from "@/content/what-you-get-back";

/**
 * "What you get back", mobile composition.
 *
 * No plate: the heading and the three cards sit straight on the page's canvas
 * beige, and the cards are white with a hairline and a soft drop rather than
 * near-white on forest. That is the whole reason this is a second composition
 * rather than a set of `desk:` forks - the desktop band's dark plate would have
 * to be conjured and removed, and its eyebrow, heading and card bodies all
 * change tone with it.
 *
 * Plain `sm:` is safe inside this subtree - it is `desk:hidden`, so nothing
 * here sets a property at both breakpoints.
 */
export function WhatYouGetBackMobile() {
  return (
    <section
      data-section="what-you-get-back-mobile"
      className="mx-auto w-full max-w-[592px] px-4 pb-[34px] sm:max-w-[624px] sm:px-8 desk:hidden"
    >
      <Reveal anim="up-blur" duration={0.5}>
        {/* `--color-eyebrow-mobile`, the corrected tone, not the artboard's
            #7E9A2B (~2.8:1 on canvas where AA needs 4.5:1). */}
        <div className="text-[10.5px] font-extrabold tracking-[0.12em] text-eyebrow-mobile uppercase">
          {GET_BACK.eyebrow}
        </div>

        {/* One `<h2>`, at the same level as the desktop composition's and the
            rest of the page. The mobile artboard sets the two sentences as one
            run with no hard break. */}
        <h2 className="display display-2-mobile mt-2.5 mb-5 text-[26px] text-ink">
          {GET_BACK.headingFirst} {GET_BACK.headingSecond}
        </h2>
      </Reveal>

      <div className="flex flex-col gap-[14px]">
        {GET_BACK_CARDS.map((card, index) => (
          /*
            [LOG] 14px radius, off the brand's 4/6/8/12 scale - and off the
            desktop composition's 18px for the same card. Both as drawn.

            A hairline plus one soft warm drop: neither of the four
            `.shadow-border-*` recipes and not `.shadow-card-mobile` either,
            which has two layers and no hairline. rgb(51 56 58) is the body-text warm grey #33383A - shadows tint
     to the text family, not to the raspberry primary.
          */
          <Reveal
            key={card.lead}
            anim="up-blur"
            delay={index * 0.08}
            duration={0.5}
            className="flex flex-col gap-2 rounded-[14px] bg-card px-[18px] py-[22px] shadow-[0_0_0_1px_var(--color-hairline),0_6px_14px_-10px_rgb(51_56_58/0.2)]"
          >
            <span className="text-[10.5px] font-extrabold tracking-[0.12em] text-eyebrow-mobile uppercase">
              {card.eyebrow}
            </span>

            {/* The mobile artboard's own Fraunces cut (opsz 32), tightened to
                1.05 for the figure. Desktop voices the same figure at a plain
                weight 600 - both as drawn. */}
            <span className="display display-2-mobile text-[28px] leading-[1.05] text-ink">
              {card.figure}
            </span>

            <span className="text-[14.5px] leading-[1.35] font-bold text-ink">{card.lead}</span>

            <p className="mt-2.5 border-t border-hairline pt-3 text-[13.5px] leading-[1.55] text-slate-500">
              {card.body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
