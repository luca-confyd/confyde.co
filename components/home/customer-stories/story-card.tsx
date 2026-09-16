import Image from "next/image";

import type { CustomerStory } from "@/content/customer-stories";
import { STORY_TILE } from "@/content/customer-stories";
import { Reveal } from "@/components/primitives/reveal";

/**
 * One customer story: a photograph with the studio's name set over it, and the
 * article's title and blurb beneath.
 *
 * INERT BY DEFAULT. The artboard draws each card as `<a href="#">`, but no
 * story pages exist. With no `href` this renders
 * `<button type="button" aria-disabled="true">`, exactly as
 * components/chrome/nav-item.tsx does for the nav's unbuilt destinations: in
 * the natural tab order, announced honestly, no `#` in the URL bar and no
 * scroll-to-top on activation. `aria-disabled` rather than `disabled` so it
 * stays keyboard-reachable. There is no `onClick`; pressing it is a silent
 * no-op. The accessible name comes from the card's own text.
 *
 * The reveal sits on the card element itself, as in the artboard, rather than
 * wrapping it - so the DOM has no extra box for the flex row to lay out.
 */
export function StoryCard({ story, delay }: { story: CustomerStory; delay: number }) {
  const inert = story.href === undefined;

  return (
    <Reveal
      as={inert ? "button" : "a"}
      anim="up-scale"
      delay={delay}
      duration={0.5}
      {...(inert ? { type: "button", "aria-disabled": "true" } : { href: story.href })}
      /*
        Below 1024 the three cards stack full width inside the page's mobile
        column; at desk they become the artboard's three-up row, where
        `calc(33.333% - 16px)` is one third of the row minus two thirds of the
        24px gap.

        `shadow-card-mobile` / `shadow-border-default`: the mobile sections on
        this page carry the warm two-layer card shadow (styles/base.css scopes
        it below 1024 on purpose), and the desktop artboard draws these cards
        with the layered hairline recipe. Each width keeps its own.

        `text-left` because a `<button>` centres its text by default and the
        artboard's `<a>` does not.

        Focus ring per docs/brand.md and RULINGS.md: 2px forest, because this
        card sits on the light page surface. Cream is for dark forest surfaces
        and lime is banned as a focus colour.
      */
      className={
        "story shadow-card-mobile flex w-full flex-col gap-4 overflow-hidden rounded-xl " +
        "bg-card p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 " +
        "focus-visible:outline-forest-700 desk:w-[calc(33.333%-16px)] " +
        "desk:shadow-border-default" +
        (inert ? " cursor-default" : "")
      }
    >
      {/*
        `overflow-hidden` is load-bearing here: it is what clips the photograph
        and its veil to the tile's 8px radius - one notch down from the card's
        12px, as the brand's nesting rule wants. The forest fill underneath is
        the placeholder tone while the image loads, and it is what the veil's
        own colour is mixed from, so the tile never flashes a foreign hue.
      */}
      <span className="relative flex h-[200px] items-center justify-center overflow-hidden rounded-lg bg-forest-900">
        <Image
          src={story.photo}
          /* Decorative: the studio is named over the photograph and again in
             the title directly below, so a description here would be the third
             announcement of the same thing. */
          alt=""
          fill
          /* No `priority` - deprecated in Next 16, and this band is far below
             the fold at every width. */
          sizes={STORY_TILE.sizes}
          className="object-cover"
        />

        {/* The veil that buys the white name its contrast. `to-t` with the
            heavier stop at the bottom is the artboard's own direction, and the
            two stops are forest-900 at 86% and 34%. `/srgb` because Tailwind v4
            interpolates gradients in oklab by default and the artboard's stops
            are plain `rgba()` - here the two stops share a colour so only the
            alpha ramps and the pixels match either way, but the declaration
            should say which space it means. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t/srgb from-forest-900/86 to-forest-900/34"
        />

        {/*
          Fraunces at the mobile cut (wght 600, SOFT 60, opsz 40) rather than
          the `.display` class, which flips to the desktop cut (wght 420,
          SOFT 100, opsz 10) at 1024 - the artboard keeps the heavy cut here at
          every width, because the name is competing with a photograph.

          `text-center` and the 16px inset are in the artboard on the first card
          only. Applied to all three: the other two names are short enough that
          the flex centring already places them identically, and without the
          inset the long one collides with the tile edge at 320px.

          `.story-logo` is the hover scale, in styles/motion/customer-stories.css.
        */}
        <span className="story-logo relative px-4 text-center font-display text-[26px] font-semibold text-white [font-variation-settings:'wght'_600,'SOFT'_60,'opsz'_40]">
          {story.studio}
        </span>
      </span>

      <span className="flex flex-col gap-2 px-1 pb-1">
        {/* `.pf-h4` in the artboard, which is `.display` + `.display-4` here.
            Fraunces owns the heading; the colour is the same ink as the blurb,
            per the brand's "a heading is a heading through family, weight and
            size, not colour". */}
        <span className="display display-4 text-pf-ink-900">{story.title}</span>
        <span className="text-[14px] leading-[1.5] text-pf-ink-700">{story.blurb}</span>
      </span>
    </Reveal>
  );
}
