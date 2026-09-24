import { BOOKING_URL } from "@/lib/booking";
import { NavItem } from "@/components/chrome/nav-item";

/**
 * The closing band. The same surface as the hero and the same petrol button as
 * the homepage's, so the page opens and closes on the one dark treatment the
 * site already has.
 *
 * The copy is fixed across the studies: it is the site's ask, not the case
 * study's, and it is the same sentence chapter 1 opens with. The about page
 * asks the shorter question its design draws, so the heading can be passed.
 */
export function CaseStudyCta({
  heading = "Not sure where your version of this starts?",
}: {
  heading?: string;
}) {
  return (
    <section
      data-section="case-study-cta"
      className="grid-surface grid-surface-fade-top relative px-4 py-16 sm-only:px-8 desk:px-0 desk:py-20"
    >
      <div className="mx-auto flex w-full max-w-[1232px] flex-col gap-7 desk:flex-row desk:items-center desk:justify-between desk:gap-12 desk:px-6">
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <h2 className="display display-2 text-pf-ink-100">{heading}</h2>
          <p className="m-0 text-[17px] leading-[1.6] text-cream">
            Thirty minutes to work out what’s worth doing, and what isn’t.
          </p>
        </div>

        <NavItem
          href={BOOKING_URL}
          tone="dark"
          className="btn-lime inline-flex h-12 flex-none items-center justify-center rounded-xl bg-lime-500 px-8 text-[17px] font-bold whitespace-nowrap text-white"
        >
          Book a discovery call
        </NavItem>
      </div>
    </section>
  );
}
