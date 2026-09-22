import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Which focus ring a control takes. `auto` follows the nav's own dark/light
 * state; the two explicit values are for controls whose surface does not flip
 * with it - the lime CTA and the dropdown sheet's white rows.
 */
type FocusTone = "auto" | "dark" | "light";

/**
 * Neither artboard defines a single focus style, so these come from the brand:
 * cream on dark forest surfaces, forest everywhere else, 2px with 2px of offset,
 * and `:focus-visible` rather than `:focus`. Lime is banned as a focus colour
 * and sage is form-field focus only.
 */
const FOCUS_RING: Record<FocusTone, string> = {
  auto:
    "focus-visible:outline-2 focus-visible:outline-offset-2 " +
    "group-data-[nav-state=dark]:focus-visible:outline-cream " +
    "group-data-[nav-state=light]:focus-visible:outline-forest-700",
  dark: "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream",
  light: "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700",
};

type NavItemProps = {
  children: ReactNode;
  className?: string;
  /**
   * The destination, when one exists. The homepage is the only page the client
   * scoped, so every nav item but the wordmark ships without one - see below.
   * Adding `href` is the whole switch when real routes land. An absolute
   * `http(s)` URL is treated as off-site and opens in a new tab.
   */
  href?: string;
  tone?: FocusTone;
  "aria-label"?: string;
};

/**
 * One nav destination, real or not yet.
 *
 * With no `href` this renders `<button type="button" aria-disabled="true">`
 * rather than the artboard's `href="#"`: keyboard-focusable in the natural tab
 * order, announced honestly, no `#` in the URL bar and no scroll-to-top on
 * click. `aria-disabled` and not `disabled`, because the brief requires these
 * stay reachable by keyboard. `cursor-default` because it promises no
 * navigation. There is no `onClick` - activating it is a silent no-op.
 *
 * The chevron items (`Product`, `Customers`, `Login`) deliberately do not get
 * `aria-haspopup`: it would advertise a menu that does not exist.
 */
export function NavItem({
  children,
  className,
  href,
  tone = "auto",
  "aria-label": ariaLabel,
}: NavItemProps) {
  const classes = [className, FOCUS_RING[tone]].filter(Boolean).join(" ");

  // An absolute URL leaves the site, so it gets a plain <a> rather than
  // next/link - there is nothing to prefetch or client-navigate to - opened in
  // a new tab, with `rel` closing the opener hole. The sr-only tail is how the
  // new tab is announced; sighted users get no icon because the artboards have
  // none. `aria-label`, when given, has to carry it itself: it overrides the
  // whole accessible name, tail included.
  if (href && /^https?:\/\//.test(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={classes}
      >
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" aria-disabled="true" aria-label={ariaLabel} className={`${classes} cursor-default`}>
      {children}
    </button>
  );
}
