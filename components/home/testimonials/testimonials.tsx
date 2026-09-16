import { TestimonialsDesktop } from "./testimonials-desktop";
import { TestimonialsMobile } from "./testimonials-mobile";

/**
 * Section 06.
 *
 * Two compositions, mutually exclusive at 1024px, shipped as siblings like the
 * hero and the marquee. They are not the same band at two scales: the desktop
 * board carries six testimonials and the mobile board three, with two of the
 * three shortened and one organisation renamed, so `hidden` / `desk:hidden` is
 * what keeps exactly one set of quotes in the accessibility tree.
 */
export function Testimonials() {
  return (
    <>
      <TestimonialsDesktop />
      <TestimonialsMobile />
    </>
  );
}
