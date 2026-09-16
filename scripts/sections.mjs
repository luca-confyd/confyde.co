/**
 * The comparison manifest.
 *
 * One entry per build section. `site` is the selector in our port; `web` and
 * `mobile` are the matching selectors in the two artboards. A null selector
 * means "shoot the whole page".
 *
 * Widths: 1280 is the width the desktop artboard was authored at and is the
 * only one it claims to be correct at. 1440 and 1024 verify the fluid behaviour
 * we are adding on top. 768 and 390 compare against the mobile artboard, which
 * is a fixed 430px column with no media queries of its own.
 */
export const DESKTOP_WIDTHS = [1440, 1280, 1024];
export const MOBILE_WIDTHS = [768, 390];

export const SECTIONS = {
  page: {
    title: "Whole page",
    site: null,
    web: null,
    mobile: null,
    fullPage: true,
  },
};

export const ARTBOARDS = {
  web: "/Bramble%20Home%20Web.dc.html",
  mobile: "/Bramble%20Home%20Mobile.dc.html",
};

/** The artboards render into #dc-root once support.js has booted React. */
export const ARTBOARD_READY = "#dc-root";
