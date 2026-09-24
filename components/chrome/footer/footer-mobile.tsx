import { FOOTER_BLURB, FOOTER_COLUMNS, FOOTER_COPYRIGHT } from "@/content/footer";
import { NavItem } from "../nav-item";
import { Wordmark } from "../wordmark";

/* The mobile artboard sets its footer text in plain white at three opacities -
   76% for the blurb and links, 52% for the copyright, 16% for the rule - where
   desktop uses a warm #FFFDFC. Both ship as drawn. */
const COLUMN_LINK = "text-[13.5px] font-semibold text-[rgb(255_255_255/0.76)] transition-colors duration-150 hover:text-white";

/**
 * The footer's mobile composition, <1024px.
 *
 * Not a narrow version of the desktop one: its own type sizes, colours and
 * spacing, from its own artboard. The links are the same list as desktop's -
 * see content/footer.ts. Two compositions, two components - the same split the
 * two headers and the two marquees already use.
 */
export function FooterMobile() {
  return (
    <div className="relative z-20 px-[18px] pt-8 pb-5 desk:hidden">
      {/* 19px and no negative tracking, where `.wordmark` carries 24px/-0.02em.
          The mobile bar draws its own cut the same way (§01 ruling 7: ship as
          drawn, do not correct it to the utility) - though note this one, unlike
          the bar's, sets no letter-spacing at all. */}
      <Wordmark className="text-[19px] tracking-normal text-white" />

      <p className="mt-2.5 mb-0 text-[13.5px] leading-[1.6] text-[rgb(255_255_255/0.76)]">{FOOTER_BLURB}</p>

      <div className="mt-[22px] grid grid-cols-2 gap-5">
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.heading}>
            {/* Lime-500 on forest, which §05 ruling 6 settles: the corrected
                `--color-eyebrow-*` tokens exist for lime-700 on light surfaces
                and do not belong here. The artboard's `.m-eyebrow` cut with its
                own 10.5px size override. */}
            <h2 className="m-0 block text-[10.5px] font-bold tracking-[0.14em] text-lime-500 uppercase">{column.heading}</h2>

            {/* A list, where the artboard uses a <span> of bare anchors. */}
            <ul className="m-0 mt-2 flex list-none flex-col gap-[7px] p-0">
              {column.links.map((link) => (
                <li key={link.label}>
                  <NavItem href={link.href} tone="dark" className={COLUMN_LINK}>
                    {link.label}
                  </NavItem>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* No `border-t`, matching desktop - see the note there. The 26px above
          and 14px below are the artboard's spacing and stay. */}
      <div className="mt-[26px] pt-[14px] text-[11.5px] text-[rgb(255_255_255/0.52)]">
        {FOOTER_COPYRIGHT}
      </div>
    </div>
  );
}
