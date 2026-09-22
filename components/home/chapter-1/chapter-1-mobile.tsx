import { ChapterShellMobile } from "@/components/home/chapter/chapter-shell-mobile";

// import { DiscoveryTabs } from "./discovery-tabs";

/**
 * Chapter 1 below 1024px.
 *
 * [LOG] THE SUB-BLOCK ORDER IS DIFFERENT, DELIBERATELY. Desktop runs the two
 * lower panels side by side; mobile stacks them in the artboard's own order,
 * which was the reverse of desktop's when each panel closed on a product card
 * (RULINGS.md §02 ruling 12 - two different moments, not ours to unify). The
 * cards are gone now, so the order carries less weight than it did, but it is
 * still the client's edit rather than ours.
 *
 * The sub-heads are `<h3>`, matching desktop, so the chapter's outline reads
 * h2 → h3, h3, h3 at both breakpoints.
 *
 * NO EYEBROWS HERE. The mobile artboard writes none in this chapter - the
 * sub-blocks open on their sub-head - so the muted eyebrow pair the desktop
 * panel needs has no call site on this side.
 *
 * Every sub-block now runs the same copy at both breakpoints. The two lower
 * ones used to carry their own mobile sentences, preserved as a pair; the
 * replacement copy is identical on both, so there is no pair left to keep.
 *
 * THE TWO PRODUCT CARDS ARE GONE - see chapter-1-desktop.tsx for why.
 */
export function Chapter1Mobile() {
  return (
    <ChapterShellMobile
      dataSection="chapter-1-mobile"
      image="/images/studio-plans.webp"
      heading="Everyone’s telling you to use AI. Fewer people can tell you what for."
    >
      {/* `.m-h3` at 19px - see the take-off card for why the shared Fraunces
          cut is reached through `.marquee-heading-mobile`. The first sub-head
          has no top margin; the two below it carry the artboard's 26px. */}
      <h3 className="display marquee-heading-mobile text-[19px] text-ink">
        Thirty minutes to work out what’s worth doing.
      </h3>
      <p className="mt-2 mb-4 text-[14.5px] leading-[1.55] text-slate-700">
        We walk through your operations, your team and your roadmap, then map the handful of
        changes that would actually move the needle: AI where it earns its place, plus the
        software and technical decisions underneath it.
      </p>
      {/* Commented out, not deleted, as on desktop. */}
      {/* <DiscoveryTabs /> */}

      {/* Both remaining panels now carry the same words on desktop and mobile, so the
          per-breakpoint pairs the artboards drew here are gone. */}
      <h3 className="display marquee-heading-mobile mt-[26px] text-[19px] text-ink">
        It all starts with a <br />
        well-defined strategy.
      </h3>
      <p className="mt-2 mb-4 text-[14.5px] leading-[1.55] text-slate-700">
        We start by defining what is actually holding you back. Those become goals you can
        put a number against, then jobs with a name and a date on each. No vague promises,
        just what is done, what is next, and what it changed.
      </p>

      <h3 className="display marquee-heading-mobile mt-[26px] text-[19px] text-ink">
        Agency expertise, without the <br />
        agency price tag.
      </h3>
      <p className="mt-2 mb-4 text-[14.5px] leading-[1.55] text-slate-700">
        We work alongside you a day or two a week, and we scale up when a project needs it.
        You get the senior thinking and the judgement calls a good agency brings, without
        paying for one full time. Same people, same standard, a fraction of the cost.
      </p>
    </ChapterShellMobile>
  );
}
