import Image from "next/image";
import { Check } from "lucide-react";

import { Reveal } from "@/components/primitives/reveal";
import { CLIENT_ROWS_MOBILE, CLIENT_ROW_AVATAR, REPEAT_WORK } from "@/content/repeat-work";

/**
 * The repeat-work panel, mobile composition.
 *
 * The same argument in one column: the "worth a call" list narrows to two
 * clients and loses its action chips and its footer, and the stat card moves
 * below it rather than beside it. Mutually exclusive with
 * `repeat-work-desktop.tsx` at 1024px.
 *
 * The panel tone is `card-muted` here where desktop uses `pf-surface-300`,
 * because the two artboards sit on different page surfaces: below 1024 the page
 * is canvas beige, so a panel that should recede has to step DOWN to
 * `card-muted`; above it the page is near-white and the same panel steps up.
 * Both read as "the space this argument happens in" against their own page.
 *
 * Plain `sm:` is safe inside this subtree - it is `desk:hidden`, so nothing
 * here ever sets a property at both breakpoints.
 */
export function RepeatWorkMobile() {
  return (
    <section
      data-section="repeat-work-mobile"
      className="mx-auto w-full max-w-[592px] px-4 pb-[34px] sm:max-w-[624px] sm:px-8 desk:hidden"
    >
      {/* `overflow-hidden` clips the botanical wash to the panel's radius; the
          wash runs to the panel edge without it. */}
      <div className="canvas-botanical overflow-hidden rounded-xl bg-card-muted px-4 pt-6 pb-5">
        {/*
          `--color-eyebrow-mobile`, the corrected tone, not the artboard's
          #7E9A2B: that measures ~2.8:1 on this surface where AA needs 4.5:1.
          Same substitution the mobile social-proof band makes.
        */}
        <Reveal
          as="div"
          anim="up-blur"
          duration={0.5}
          className="text-[11px] font-bold tracking-[0.14em] text-eyebrow-mobile uppercase"
        >
          {REPEAT_WORK.eyebrow}
        </Reveal>

        {/* `<h2>`, matching the desktop composition's level and the rest of the
            page outline. `.display-2-mobile` is the mobile artboard's own
            Fraunces cut (opsz 32) and falls away above 1024, which this subtree
            never reaches. */}
        <Reveal
          as="h2"
          anim="up-blur"
          delay={0.05}
          duration={0.5}
          className="display display-2-mobile mt-2.5 mb-2 text-[24px] text-ink"
        >
          {REPEAT_WORK.heading}
        </Reveal>

        <Reveal
          as="p"
          anim="up-blur"
          delay={0.1}
          duration={0.5}
          className="mb-4 text-[14.5px] leading-[1.55] text-slate-700"
        >
          {REPEAT_WORK.intro}
        </Reveal>

        <Reveal anim="scale" delay={0.15} duration={0.5}>
          {/*
            Three warm layers, not the two of `.shadow-card-mobile` - this card
            sits on the muted panel rather than on the page, so it needs the
            extra reach to separate from it. Expressed here rather than added to
            the shared utility, which has exactly one other call site and a
            different job.
          */}
          <div className="overflow-hidden rounded-xl bg-card shadow-[0_1px_2px_rgb(51_56_58/0.05),0_6px_14px_-6px_rgb(51_56_58/0.14),0_18px_30px_-18px_rgb(51_56_58/0.18)]">
            {/* One child now the count is gone - see the desktop card. */}
            <div className="border-b border-hairline px-[14px] py-3">
              {/* `<h3>` under this composition's `<h2>`; the artboard writes
                  `<h4>` (RULINGS.md §03/04 ruling 8). */}
              <h3 className="m-0 font-ui-serif text-[16px] font-semibold text-ink">
                {REPEAT_WORK.listTitle}
              </h3>
            </div>

            <ul className="m-0 list-none p-0">
              {CLIENT_ROWS_MOBILE.map((row) => (
                <li
                  key={row.name}
                  className="flex items-start gap-[11px] border-t border-slate-100 px-[14px] py-3 first:border-t-0"
                >
                  {/* Decorative: the client is named in the text beside it. */}
                  <Image
                    src={row.photo}
                    alt=""
                    width={CLIENT_ROW_AVATAR.intrinsic}
                    height={CLIENT_ROW_AVATAR.intrinsic}
                    sizes={CLIENT_ROW_AVATAR.sizes}
                    className="size-10 flex-none rounded-md object-cover"
                  />

                  {/* `min-w-0`: without it the flex item will not shrink below
                      its content width and the note pushes the row wider than
                      the card. */}
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex flex-wrap items-baseline gap-[7px]">
                      <span className="font-ui text-[14px] font-semibold text-ink">{row.name}</span>
                      <span className="font-ui text-[12px] text-slate-500">{row.place}</span>
                    </span>
                    <span className="font-ui text-[12.5px] leading-[1.45] text-slate-500">
                      {row.note}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-[14px] flex flex-col gap-4 rounded-xl bg-forest-900 px-4 py-5">
            <div className="flex flex-wrap items-start gap-4">
              {REPEAT_WORK.stats.map((stat, index) => (
                <div
                  key={stat.figure}
                  className={
                    index === 0
                      ? "min-w-[110px] flex-[1_1_110px]"
                      : "min-w-[120px] flex-[1_1_120px] border-l border-cream/[0.18] pl-4"
                  }
                >
                  <div
                    className={
                      index === 0
                        ? "font-ui-serif text-[26px] leading-[1.14] font-semibold text-white"
                        : "font-ui-serif text-[34px] leading-[1.14] font-semibold tracking-[-0.01em] text-lime-500 tabular-nums"
                    }
                  >
                    {stat.figure}
                  </div>
                  <div className="mt-[5px] font-ui text-[12.5px] leading-[1.4] text-forest-200">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <ul className="m-0 flex list-none flex-col gap-2.5 border-t border-cream/[0.18] p-0 pt-[15px]">
              {REPEAT_WORK.ticks.map((tick) => (
                <li
                  key={tick}
                  className="flex items-start gap-[9px] font-ui text-[13.5px] leading-[1.5] text-cream"
                >
                  {/* `aria-hidden="true"`, where the artboard writes
                      `aria-hidden=""` - not a valid value, so the four ticks
                      are currently announced (RULINGS.md §03/04 ruling 7). */}
                  <Check
                    aria-hidden="true"
                    size={15}
                    strokeWidth={3}
                    className="mt-[3px] flex-none text-lime-500"
                  />
                  {tick}
                </li>
              ))}
            </ul>

            {/* [LOG] 10px radius, off the brand's 4/6/8/12 scale, where the
                desktop composition draws the same well at 8px. As drawn. */}
            <div className="flex flex-col gap-2 rounded-[10px] bg-cream/[0.09] p-[14px] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-cream)_14%,transparent)]">
              <span className="font-ui-serif text-[16px] leading-[1.3] font-semibold text-white">
                {REPEAT_WORK.callout.title}
              </span>
              <span className="font-ui text-[12.5px] leading-[1.5] text-forest-200">
                {REPEAT_WORK.callout.bodyMobile}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
