import { FOOTER_BLURB, FOOTER_COLUMNS_DESKTOP, FOOTER_COPYRIGHT } from "@/content/footer";
import { NavItem } from "../nav-item";
import { Wordmark } from "../wordmark";
import { InstagramMark, LinkedInMark, XMark, YouTubeMark } from "./social-marks";

/* -----------------------------------------------------------------------------
   Two un-tokened tones live in this file, written out as literal arbitrary
   values rather than constants because Tailwind scans source text and cannot
   see a class assembled from one.

     rgb(255 253 252)  #FFFDFC - the warm near-white every text tone here is an
                       opacity of. One step off `card` white, used nowhere else
                       on the page, so it stays local rather than becoming a
                       token (§02 ruling 5). The mobile artboard draws the same
                       text in plain #fff; both ship as drawn.
     rgb(220 232 223)  #DCE8DF - the column-heading tint. Same reasoning.
----------------------------------------------------------------------------- */

const SOCIALS = [
  { label: "X", Mark: XMark },
  { label: "Instagram", Mark: InstagramMark },
  { label: "LinkedIn", Mark: LinkedInMark },
  { label: "YouTube", Mark: YouTubeMark },
] as const;

/* 16px of glyph inside a 44px target, taken from the ::before pad so the mark
   itself does not move - the same trick the floating bars' dismiss button uses.
   The hover step is ours: the artboard draws no hover on any footer link, and a
   link with no hover affordance on a photograph is hard to aim at. */
const SOCIAL_LINK =
  "relative inline-flex text-[rgb(255_253_252/0.6)] transition-colors duration-150 " +
  "before:absolute before:-inset-[14px] before:content-[''] hover:text-[rgb(255_253_252/0.9)]";

const COLUMN_LINK =
  "inline-flex items-center gap-2 text-[14px] font-semibold text-[rgb(255_253_252/0.7)] " +
  "transition-colors duration-150 hover:text-[rgb(255_253_252/0.95)]";

/**
 * The footer's desktop composition, >=1024px.
 *
 * `desk:contents` rather than a wrapper of its own: the two rows are direct
 * flex children of the 660px photo panel, and the bottom row is pushed down by
 * `mt-auto`. A wrapper would need to re-declare the panel's column layout, and
 * `justify-between` would not do the same job - the panel's height is fixed, so
 * the top row has to stay pinned under its own 80px of padding regardless of
 * how tall the columns turn out.
 */
export function FooterDesktop() {
  return (
    <div className="hidden desk:contents">
      <div className="relative z-20 mx-auto w-full max-w-[1440px] px-12 pt-20">
        <div className="flex justify-between gap-12">
          <div className="flex max-w-[420px] flex-col gap-[14px]">
            {/* The artboard's `.pf-logo` is our `.wordmark` verbatim - 24px,
                -0.02em - so only the colour is set here. */}
            <Wordmark className="text-white" />

            <p className="m-0 text-[14px] leading-[1.6] text-[rgb(255_253_252/0.72)]">{FOOTER_BLURB}</p>

            {/* A list, because it is one. The artboard's extra 4px sits on this
                row alone rather than in the column's gap. */}
            <ul className="m-0 mt-1 flex list-none gap-[14px] p-0">
              {SOCIALS.map(({ label, Mark }) => (
                <li key={label}>
                  {/* Icon-only, so the name lives in `aria-label` and the mark
                      is decorative. */}
                  <NavItem tone="dark" aria-label={label} className={SOCIAL_LINK}>
                    <Mark />
                  </NavItem>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-20">
            {FOOTER_COLUMNS_DESKTOP.map((column) => (
              <div key={column.heading} className="flex flex-col gap-3">
                {/* A real heading, not the artboard's bare <span>: these three
                    words are what makes the link lists navigable by heading.
                    Level and type size are independent (§03/04 ruling 8), so the
                    12px bold cut is untouched. */}
                <h2 className="m-0 text-[12px] font-bold text-[rgb(220_232_223/0.8)]">{column.heading}</h2>

                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <NavItem tone="dark" className={COLUMN_LINK}>
                        {link.label}
                        {link.badge ? (
                          // rgba(200,232,74,.14) is lime-500 at 14%. Lime means
                          // forward motion, and an open role is exactly that, so
                          // this is one of the accent's sanctioned uses.
                          <span className="rounded-full bg-lime-500/14 px-[7px] py-px text-[10px] font-bold tracking-[0.06em] text-lime-500 uppercase">
                            {link.badge}
                          </span>
                        ) : null}
                      </NavItem>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The artboard pads this row 48px horizontally and caps the rule at
          1440px, so the rule lines up with the columns above it rather than
          running the full 1920px panel. */}
      <div className="relative z-20 mt-auto w-full px-12 pb-[22px]">
        <div className="mx-auto max-w-[1440px] border-t border-[rgb(255_253_252/0.14)] pt-[18px]">
          <span className="text-[12px] text-[rgb(255_253_252/0.5)]">{FOOTER_COPYRIGHT}</span>
        </div>
      </div>
    </div>
  );
}
