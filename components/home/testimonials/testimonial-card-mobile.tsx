import Image from "next/image";

import type { Testimonial } from "@/content/testimonials";

import { AVATAR_FILL } from "./avatar-tone";

/**
 * Two blobs per card, not desktop's three, and hand-set per card rather than
 * alternating: the mobile board walks forest-100 -> lime-100 -> forest-300 down
 * the strip with no repeat, so there is no pattern to express. Card three's
 * first blob is also the one blob on either board at 50% rather than 60%,
 * which is why opacity is per blob here and a single group value on desktop.
 */
const BLOBS = [
  [
    { fill: "bg-forest-100", opacity: "opacity-[0.6]" },
    { fill: "bg-lime-100", opacity: "opacity-[0.6]" },
  ],
  [
    { fill: "bg-lime-100", opacity: "opacity-[0.6]" },
    { fill: "bg-forest-200", opacity: "opacity-[0.6]" },
  ],
  [
    { fill: "bg-forest-300", opacity: "opacity-[0.5]" },
    { fill: "bg-forest-100", opacity: "opacity-[0.6]" },
  ],
] as const;

/* Anchored outside the top-left and the lower-right, at 36px of blur against
   desktop's 40px - a smaller card wants a proportionally tighter falloff. */
const BLOB_BOX = ["-top-[60px] -left-10 size-55", "-right-[50px] bottom-5 size-45"] as const;

/**
 * One mobile testimonial, <1024px.
 *
 * Not a reflow of the desktop card: shorter than it is wide instead of square,
 * 12px radius instead of 8, two blobs instead of three, no grain at all, a
 * circular avatar instead of a rounded tile, and every type size a step down.
 * The two are built separately for the same reason the two heroes are.
 */
export function TestimonialCardMobile({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  const blobs = BLOBS[index % BLOBS.length];

  return (
    /*
      `snap-center`, where the desktop card snaps to its start: on a 430px
      column a 270px card centres with both neighbours showing, which is the
      affordance that says "this scrolls". Sized from the geometry module so the
      keyboard step and the card width cannot disagree.
    */
    <article className="relative flex h-[300px] w-[var(--testi-card)] flex-none snap-center flex-col overflow-hidden rounded-xl bg-card p-[18px]">
      {blobs.map(({ fill, opacity }, i) => (
        <span
          key={fill + i}
          aria-hidden="true"
          className={`absolute rounded-full blur-[36px] ${BLOB_BOX[i]} ${fill} ${opacity}`}
        />
      ))}

      <div className="relative flex h-full flex-col">
        {/*
          The mobile board's `.m-h3` cut: Fraunces wght 600, SOFT 60, opsz 24,
          line-height 1.2 and no tracking. That is byte-identical to
          `.marquee-heading-mobile` in styles/base.css, but that class is named
          for its one call site and this is not it, so the axes are written here
          rather than borrowing a marquee class - no new type value either way.
        */}
        <span className="font-display text-[17px] font-semibold [font-variation-settings:'wght'_600,'SOFT'_60,'opsz'_24] leading-[1.2] text-ink">
          {testimonial.org}
        </span>

        {/* `<blockquote>`, where the mobile board draws a bare `<p>` and the
            desktop board draws a blockquote for the same content. Semantics
            fixed to match, visuals unchanged - the element has no default
            styling left to leak once margin is zeroed. */}
        <blockquote className="m-0">
          <p className="mt-3 mb-0 text-[14.5px] leading-[1.5] text-slate-700">
            {testimonial.quote}
          </p>
        </blockquote>

        <footer className="mt-auto flex items-center gap-[9px]">
          {/* `aria-hidden="true"`; the board writes `aria-hidden=""`, which is
              not a valid value (RULINGS.md §03/04 ruling 7). */}
          {testimonial.portrait ? (
            /* The circle the tone fill draws on this board, at the same 32px. */
            <Image
              src={testimonial.portrait}
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
              className="size-8 flex-none rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className={`grid size-8 flex-none place-items-center rounded-full text-[11px] font-extrabold text-white ${AVATAR_FILL[testimonial.tone]}`}
            >
              {testimonial.initials}
            </span>
          )}
          <span>
            <span className="block text-[13px] font-bold text-ink">{testimonial.name}</span>
            <span className="block text-[12px] text-slate-500">{testimonial.role}</span>
          </span>
        </footer>
      </div>
    </article>
  );
}
