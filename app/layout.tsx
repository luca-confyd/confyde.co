import type { Metadata, Viewport } from "next";
import { Asap, Fraunces, Hanken_Grotesk, Nunito_Sans, Source_Serif_4 } from "next/font/google";

import { SiteHeaderDesktop } from "@/components/chrome/site-header-desktop";
import { SiteHeaderMobile } from "@/components/chrome/site-header-mobile";
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

/* One sentence for the page description and both social cards. The template's
   quoting-software copy it replaces was never Confyde's. */
const SITE_DESCRIPTION =
  "Senior technical guidance for owner-led businesses without a CTO. Technical strategy, AI and software delivery, in plain English.";

export const metadata: Metadata = {
  metadataBase: new URL("https://confydehq.co"),
  title: "Confyde | The AI consultancy you hire to build, not just plan",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "Confyde | The AI consultancy you hire to build, not just plan",
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary",
    title: "Confyde | The AI consultancy you hire to build, not just plan",
    description: SITE_DESCRIPTION,
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

        {/* Two headers, mutually exclusive at 1024px.
            `display: none` takes the inactive pair out of the accessibility
            tree, so only one `Main` landmark is ever exposed. */}
        <SiteHeaderDesktop />
        <SiteHeaderMobile />

        {/* The footer and the floating promo bar are NOT here. Nor is the
            mobile "Try Confyde free" bar any more: it sold a free trial of a
            product Confyde does not have, and went with the rest of the
            template's leftovers. Both belong to
            the pages that want them, so they live in
            app/(with-footer)/layout.tsx - see the note there. The case studies
            close on their own CTA band instead. */}
        {children}
      </body>
    </html>
  );
}
