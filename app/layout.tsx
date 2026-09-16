import type { Metadata, Viewport } from "next";
import { Asap, Fraunces, Hanken_Grotesk, Nunito_Sans, Source_Serif_4 } from "next/font/google";
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
  metadataBase: new URL("https://bramblehq.co"),
  title: "Bramble | The AI sales and estimate partner for landscapers",
  description:
    "Bramble learns your prices, drafts your estimates, and sends a branded proposal in minutes. Then it tells you who to chase, so more of the jobs you quote turn into money in the bank.",
  openGraph: {
    title: "Bramble | The AI sales and estimate partner for landscapers",
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
      <body>{children}</body>
    </html>
  );
}
