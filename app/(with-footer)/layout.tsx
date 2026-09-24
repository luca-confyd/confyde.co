import { FloatingBars } from "@/components/chrome/floating-bars";
import { SiteFooter } from "@/components/chrome/footer/site-footer";

/**
 * The pages that end in the site footer, and carry the floating promo bar.
 *
 * A ROUTE GROUP, so the footer is owned by the pages that want it rather than
 * switched off by the ones that do not. `(with-footer)` adds no URL segment -
 * the homepage is still `/`.
 *
 * The case studies sit outside this group: each one closes on its own dark
 * "Not sure where your version of this starts?" band, so the footer under it
 * put a second closing block, a second set of links and a second CTA at the
 * foot of the page - and the floating "Not sure where to start?" bar put a
 * third CTA over the top of them.
 *
 * The nav stays in app/layout.tsx as chrome on every page.
 */
export default function WithFooterLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {children}
      <SiteFooter />
      <FloatingBars />
    </>
  );
}
