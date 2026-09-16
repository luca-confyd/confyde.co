import { ChapterShellMobile } from "@/components/home/chapter/chapter-shell-mobile";

import { PriceLibraryCardMobile } from "./price-library-card-mobile";
import { ProposalCardMobile } from "./proposal-card-mobile";
import { TakeoffCardMobile } from "./takeoff-card-mobile";

/**
 * Chapter 1 below 1024px.
 *
 * [LOG] THE SUB-BLOCK ORDER IS DIFFERENT, DELIBERATELY. Desktop runs take-off →
 * price library → proposal, with the second and third side by side. Mobile runs
 * take-off → proposal → price library, stacked. That is not a reflow of the
 * desktop composition, it is a different edit: on a phone the proposal card is
 * the payoff and the price library is the supporting explanation, so the payoff
 * comes second rather than last. Both orders ship (RULINGS.md §02 ruling 12 -
 * two different moments, not ours to unify).
 *
 * The sub-heads are `<h3>`, matching desktop, so the chapter's outline reads
 * h2 → h3, h3, h3 at both breakpoints.
 *
 * NO EYEBROWS HERE. The mobile artboard writes none in this chapter - the
 * sub-blocks open on their sub-head - so the muted eyebrow pair the desktop
 * panel needs has no call site on this side.
 *
 * Every paragraph below is a DIFFERENT sentence from its desktop counterpart,
 * not a truncation of it, and the take-off one is the grammatical version of
 * the sentence desktop gets wrong. Both preserved; flagged as a pair.
 */
export function Chapter1Mobile() {
  return (
    <ChapterShellMobile
      dataSection="chapter-1-mobile"
      image="/images/photo-2.webp"
      heading="Meet Bramble. Quoting, taken off your plate."
    >
      {/* `.m-h3` at 19px - see the take-off card for why the shared Fraunces
          cut is reached through `.marquee-heading-mobile`. The first sub-head
          has no top margin; the two below it carry the artboard's 26px. */}
      <h3 className="display marquee-heading-mobile text-[19px] text-ink">
        Build a client-ready estimate in minutes, not your nights.
      </h3>
      <p className="mt-2 mb-4 text-[14.5px] leading-[1.55] text-slate-700">
        Bramble measures the job off the plan and prices it from your own suppliers, and
        rewrites it in language ready for your client. You just add your margin.
      </p>
      <TakeoffCardMobile />

      {/* The mobile artboard breaks this sub-head with a hard <br> where desktop
          runs it on one line, and writes a DIFFERENT paragraph below it - not a
          truncation of desktop's. Both preserved, as with the take-off copy. */}
      <h3 className="display marquee-heading-mobile mt-[26px] text-[19px] text-ink">
        Beautifully branded proposals, <br />
        sent in minutes, not days.
      </h3>
      <p className="mt-2 mb-4 text-[14.5px] leading-[1.55] text-slate-700">
        Professional templates, branded for your business, designed by sales experts. Your
        quote lands same day while your competitors are still promising theirs.
      </p>
      <ProposalCardMobile />

      <h3 className="display marquee-heading-mobile mt-[26px] text-[19px] text-ink">
        Bramble learns your real prices.
      </h3>
      <p className="mt-2 mb-4 text-[14.5px] leading-[1.55] text-slate-700">
        Bramble learns from your pricing, so every quote gets faster and easier, and it knows
        your margins.
      </p>
      <PriceLibraryCardMobile />
    </ChapterShellMobile>
  );
}
