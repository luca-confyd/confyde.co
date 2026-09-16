import Image from "next/image";

import { FooterDesktop } from "./footer-desktop";
import { FooterMobile } from "./footer-mobile";

/* -----------------------------------------------------------------------------
   The scrims.

   Two different gradients, and they are not two roundings of one value. Mobile
   washes forest-900 (#15301F) from 94% to 66% over the whole panel; desktop
   washes #152414 - a darker, greener one-off that is in neither palette - from
   92% through 50% at 45% to 15%. Desktop can afford to open right up because
   its panel is 660px tall and all of its text sits in the top third; mobile's
   panel is barely taller than its content, so the wash has to stay heavy the
   whole way down.

   #152414 stays a literal rather than becoming a token: it has no role in the
   system and appears exactly once (§02 ruling 5).
----------------------------------------------------------------------------- */
const SCRIM_MOBILE =
  "bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--color-forest-900)_94%,transparent),color-mix(in_oklab,var(--color-forest-900)_66%,transparent))] desk:hidden";

const SCRIM_DESKTOP =
  "hidden desk:block bg-[linear-gradient(to_bottom,rgb(21_36_20/0.92),rgb(21_36_20/0.5)_45%,rgb(21_36_20/0.15))]";

/**
 * The site footer: one landmark, two compositions.
 *
 * The photograph and its rounded top are the only things the two artboards
 * share, so they live here and the two layouts are gated inside. That keeps a
 * single `<footer>` in the accessibility tree at every width, rather than the
 * two-mutually-exclusive-landmarks shape the headers use - the headers have to
 * do that because each carries its own `<nav>` and its own sticky behaviour;
 * this is one box with two fillings.
 *
 * Server Component. Nothing here reacts to scroll, hover state or the nav flip.
 */
export function SiteFooter() {
  return (
    <footer className="relative mx-auto flex w-full max-w-[1920px] flex-col overflow-hidden rounded-t-xl desk:h-[660px]">
      <div className="absolute inset-0 z-0">
        {/*
          Full-bleed background, so the rendered width is the viewport width up
          to the panel's own 1920px cap - one of the largest images on the page.
          `100vw` is the honest description; anything narrower would have Next
          pick a source that upscales.

          No `priority`: it is deprecated in Next 16, and this is the last thing
          on a long page, so lazy is right on the merits too.
        */}
        <Image
          src="/images/photo-4.webp"
          alt=""
          fill
          sizes="(min-width: 1920px) 1920px, 100vw"
          className="object-cover object-bottom"
        />
        <div aria-hidden="true" className={`absolute inset-0 ${SCRIM_MOBILE}`} />
        <div aria-hidden="true" className={`absolute inset-0 ${SCRIM_DESKTOP}`} />
      </div>

      <FooterDesktop />
      <FooterMobile />
    </footer>
  );
}
