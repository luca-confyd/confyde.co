import { Hero } from "@/components/home/hero/hero";
import { LogoMarqueeDesktop } from "@/components/home/logo-marquee/logo-marquee-desktop";
import { LogoMarqueeMobile } from "@/components/home/logo-marquee/logo-marquee-mobile";
import { SocialProof } from "@/components/home/social-proof/social-proof";
import { PageEffects } from "@/components/primitives/page-effects";

export default function HomePage() {
  return (
    <>
      <PageEffects />
      <main id="top">
        {/*
          The two marquees are composed separately because the artboards put
          them in different places: on desktop the strip is the last child of the
          hero's card, so the card's bottom edge falls below it; on mobile it is
          a band of its own on the page canvas.
        */}
        <Hero cardFooter={<LogoMarqueeDesktop />} />
        <LogoMarqueeMobile />
        <SocialProof />
      </main>
    </>
  );
}
