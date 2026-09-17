import type { Metadata, Viewport } from "next";
import { Asap, Fraunces, Hanken_Grotesk, Nunito_Sans, Source_Serif_4 } from "next/font/google";

import { SiteFooter } from "@/components/chrome/footer/site-footer";
import { FloatingBars } from "@/components/chrome/floating-bars";
import { SiteHeaderDesktop } from "@/components/chrome/site-header-desktop";
import { SiteHeaderMobile } from "@/components/chrome/site-header-mobile";
import { StickyBottomBar } from "@/components/chrome/sticky-bottom-bar";
import "./globals.css";

/* -----------------------------------------------------------------------------
   Type.

   Four families carry the marketing layer and the product mockups embedded in
   it. All are loaded as variable fonts because the artboards drive them through
   font-variation-settings - Fraunces in particular is set at four different
   optical sizes and two different SOFT values across the page, which a static
   cut cannot reproduce.

   The artboards also link Caveat and Inter. Neither appears in any markup, so
   they are dropped.
----------------------------------------------------------------------------- */

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
  variable: "--font-nunito-sans",
});

/* The wordmark, and only the wordmark. The mobile artboard references Asap
   inline but never loads it, so its wordmark silently falls back - fixed here. */
const asap = Asap({
  subsets: ["latin"],
  display: "swap",
  weight: ["800"],
  variable: "--font-asap",
});

/* The real app's faces, used by the product UI mocked up inside the page. */
const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hanken",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
  variable: "--font-source-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://confydehq.co"),
  title: "Confyde | The AI sales and estimate partner for landscapers",
  description:
    "Confyde learns your prices, drafts your estimates, and sends a branded proposal in minutes. Then it tells you who to chase, so more of the jobs you quote turn into money in the bank.",
  openGraph: {
    title: "Confyde | The AI sales and estimate partner for landscapers",
    description:
      "Scope, price and send a quote in minutes, not late-night hours. Priced on your own materials, suppliers and margins.",
    type: "website",
    locale: "en_AU",
  },
};

export const viewport: Viewport = {
  themeColor: "#15301F",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-AU"
      className={`${fraunces.variable} ${nunitoSans.variable} ${asap.variable} ${hankenGrotesk.variable} ${sourceSerif.variable}`}
    >
      <body>
        {/*
          Neither artboard has a skip link. With a header pinned to the top and a
          bar pinned to the bottom, skipping matters more than usual, so it is
          the first focusable thing on the page. `#top` is the id `<main>`
          already carries.
        */}
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[80] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-[15px] focus:font-semibold focus:text-ink focus:outline-2 focus:outline-offset-2 focus:outline-forest-700"
        >
          Skip to content
        </a>

        {/* Two headers and two bar systems, mutually exclusive at 1024px.
            `display: none` takes the inactive pair out of the accessibility
            tree, so only one `Main` landmark is ever exposed. */}
        <SiteHeaderDesktop />
        <SiteHeaderMobile />

        {children}

        {/* The footer is page chrome, so it lives beside the nav and the bars
            rather than at the foot of the page component. */}
        <SiteFooter />

        <FloatingBars />
        <StickyBottomBar />
      </body>
    </html>
  );
}
