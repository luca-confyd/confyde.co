import { MobileNavMenu } from "./mobile-nav-menu";
import { NavItem } from "./nav-item";
import { MobileNavHeader } from "./nav-theme-header";
import { Wordmark } from "./wordmark";

/*
 * Unlike desktop this is a sticky, full-bleed bar carrying its own translucent
 * surface, and it is 64px tall exactly (12 + 40 + 12). That 64 is load-bearing:
 * the hero cancels it with `margin-top: -64px` and the nav flip observes the
 * hero at a `-64px` rootMargin. If this padding ever changes, all three change
 * together.
 *
 * The blur is declared in both states - `.on-light` is a blurred 82%-canvas wash
 * over the beige page, not an opaque bar - so it is gated on `@supports` only.
 * Without backdrop-filter the dark state rises to a flat 72% forest so the
 * wordmark still holds.
 */
const HEADER =
  "group sticky top-0 right-0 left-0 z-[60] px-4 py-3 transition-[background,box-shadow] duration-[250ms] md:px-6 desk:hidden " +
  "supports-[(backdrop-filter:blur(1px))_or_(-webkit-backdrop-filter:blur(1px))]:backdrop-blur-[16px] " +
  "supports-[(backdrop-filter:blur(1px))_or_(-webkit-backdrop-filter:blur(1px))]:backdrop-saturate-[1.15] " +
  "data-[nav-state=dark]:shadow-[inset_0_1px_0_rgb(255_255_255/0.1)] " +
  "data-[nav-state=dark]:supports-[(backdrop-filter:blur(1px))_or_(-webkit-backdrop-filter:blur(1px))]:bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--color-forest-900)_42%,transparent),color-mix(in_srgb,var(--color-forest-900)_28%,transparent))] " +
  "data-[nav-state=dark]:not-supports-[((backdrop-filter:blur(1px))_or_(-webkit-backdrop-filter:blur(1px)))]:bg-[color-mix(in_srgb,var(--color-forest-900)_72%,transparent)] " +
  "data-[nav-state=light]:bg-none data-[nav-state=light]:bg-[color-mix(in_oklab,var(--color-canvas)_82%,transparent)] " +
  "data-[nav-state=light]:shadow-[inset_0_1px_0_var(--color-hairline)]";

/**
 * The sticky bar, <1024px.
 *
 * The artboard is a fixed 430px device frame with no media queries; the frame is
 * not a layout constraint, so this bar is full-bleed. Its gutter steps 16px to
 * 24px at 768px, matching the page's own, and the row caps at 720px so the
 * wordmark and the CTA do not drift to opposite screen edges and stop reading as
 * one control group.
 *
 * The artboard has no `<nav>` and no landmark label here, and its wordmark is a
 * bare `<span>`; both are fixed below to match desktop.
 */
export function SiteHeaderMobile() {
  return (
    <MobileNavHeader className={HEADER}>
      <nav
        aria-label="Main"
        className="mx-auto flex w-full items-center justify-between gap-2.5 md:max-w-[720px]"
      >
        <NavItem href="/" aria-label="Confyde home" className="flex items-center">
          {/* 19px / -0.01em, not the 24px wordmark utility: the mobile bar is a
              different composition rather than a scale of the desktop one. */}
          <Wordmark className="text-[19px] tracking-[-0.01em] group-data-[nav-state=dark]:text-white group-data-[nav-state=light]:text-forest-900" />
        </NavItem>

        <span className="flex items-center gap-2">
          {/* Lime is the page's one primary action and reads on both surfaces,
              so this button does not change across the flip. The 10px radius is
              off the brand's 4/6/8/12 scale and is what the artboard draws. */}
          <NavItem
            tone="light"
            className="btn-lime inline-flex h-10 items-center rounded-[10px] bg-lime-500 px-4 text-[14px] font-bold text-white"
          >
            Get started
          </NavItem>

          <MobileNavMenu />
        </span>
      </nav>
    </MobileNavHeader>
  );
}
