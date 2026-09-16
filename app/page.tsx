import { BeforeAfter } from "@/components/home/before-after/before-after";
import { Chapter1 } from "@/components/home/chapter-1/chapter-1";
import { Chapter2 } from "@/components/home/chapter-2/chapter-2";
import { CtaStage } from "@/components/home/cta-stage/cta-stage";
import { CustomerStories } from "@/components/home/customer-stories/customer-stories";
import { Faq } from "@/components/home/faq/faq";
import { Hero } from "@/components/home/hero/hero";
import { Integrations } from "@/components/home/integrations/integrations";
import { LogoMarqueeDesktop } from "@/components/home/logo-marquee/logo-marquee-desktop";
import { LogoMarqueeMobile } from "@/components/home/logo-marquee/logo-marquee-mobile";
import { PullQuotes } from "@/components/home/proof/pull-quotes";
import { RepeatWork } from "@/components/home/repeat-work/repeat-work";
import { SocialProof } from "@/components/home/social-proof/social-proof";
import { Testimonials } from "@/components/home/testimonials/testimonials";
import { WhatYouGetBack } from "@/components/home/what-you-get-back/what-you-get-back";
import { PageEffects } from "@/components/primitives/page-effects";

/**
 * The homepage, in the artboards' own order.
 *
 * Three chapter bands are still to come and slot in where the comments mark
 * them. The order here is the one thing that cannot be derived from the section
 * components themselves, which is why the page owns it and no section imports
 * another.
 */
export default function HomePage() {
  return (
    <>
      <PageEffects />
      <main id="top">
        {/*
          The two marquees are composed separately because the artboards put them
          in different places: on desktop the strip is the last child of the
          hero's card, so the card's bottom edge falls below it; on mobile it is
          a band of its own on the page canvas.
        */}
        <Hero cardFooter={<LogoMarqueeDesktop />} />
        <LogoMarqueeMobile />
        <SocialProof />
        <BeforeAfter />
        <Chapter1 />
        <Chapter2 />
        <Integrations />
        {/* Chapter 3 - playbook */}
        <PullQuotes />
        <RepeatWork />
        <WhatYouGetBack />
        <Testimonials />
        <CtaStage />
        <CustomerStories />
        <Faq />
      </main>
    </>
  );
}
