import type { Metadata } from "next";
import type { ReactNode } from "react";

import { NavFlipSentinel } from "@/components/chrome/nav-flip-sentinel";
import { PageEffects } from "@/components/primitives/page-effects";

/**
 * The privacy policy, `/privacy`.
 *
 * A dark hero and a single column of prose, closed by the site footer - which
 * is why it lives in `(with-footer)`. No design doc; it borrows the case
 * study's hero surface and article type so it reads as the same site.
 *
 * STILL TO FILL BEFORE THIS IS PUBLIC. The bracketed stubs render as written,
 * so an unfinished policy looks unfinished rather than complete:
 *
 *   - the company number and the ICO registration number (pay the ICO data
 *     protection fee first if it has not been paid)
 *   - the accounting provider and the accountant
 *
 * COOKIES. The source offered two paragraphs. The site runs no analytics or
 * tracking scripts, so this carries the strictly-necessary one, and the
 * "When you visit our website" paragraph drops its analytics sentence. If
 * analytics is ever added, both need revisiting.
 */

const title = "Privacy policy | Confyde";
const description = "How Confyde collects, uses and protects your personal data.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", locale: "en_GB" },
};

const EMAIL = "privacy@confyde.co";

export default function PrivacyPage() {
  return (
    <>
      <PageEffects />

      <main id="top">
        <section
          data-section="privacy-hero"
          className="grid-surface relative px-4 pt-28 pb-16 sm-only:px-8 desk:px-0 desk:pt-40 desk:pb-20"
        >
          <div className="mx-auto flex w-full max-w-[1232px] flex-col gap-5 desk:px-6">
            <h1 className="display display-1 text-balance text-pf-ink-100">Privacy policy</h1>
            <p className="m-0 text-[16px] text-cream">Last updated: 24 September 2026</p>
          </div>

          <NavFlipSentinel />
        </section>

        <article className="mx-auto flex w-full max-w-[1232px] flex-col gap-6 px-4 pt-14 pb-20 sm-only:px-8 desk:px-6 desk:pt-19 desk:pb-28 [&>*]:max-w-[720px]">
          <H2>Who we are</H2>
          <P>
            Confyde is the trading name of Confyd Ltd, a company registered in England and Wales
            (company number [stub]), based in London. We’re the controller of the personal data
            described in this policy. We’re registered with the Information Commissioner’s Office
            (ICO), registration number [stub].
          </P>
          <P>
            If you have any questions about this policy or how we use your data, email <Email />.
          </P>

          <H2>What we collect and why</H2>
          <P>
            <strong>If you contact us or book a call,</strong> we collect your name, email address,
            company name, and anything you choose to tell us. We use this to reply to you and to
            prepare for and hold the call. Our lawful basis is legitimate interests: responding to
            people who’ve asked to speak to us.
          </P>
          <P>
            <strong>If you become a client,</strong> we collect the contact details of the people we
            work with and the business information you share with us during the engagement. We use
            this to deliver the work, send invoices and keep proper records. Our lawful bases are
            contract (to deliver what we’ve agreed) and legal obligation (to keep financial records).
          </P>
          <P>
            <strong>If we contact you about our services,</strong> we may have found your name, role
            and business contact details from public sources such as your company website or
            LinkedIn. We use them to send you a short, relevant message about our work. Our lawful
            basis is legitimate interests: telling businesses about services that may help them.
            Every message tells you how to opt out, and if you do, we’ll stop.
          </P>
          <P>
            <strong>When you visit our website,</strong> our hosting provider records basic technical
            information, such as your IP address and browser type, to keep the site running and
            secure.
          </P>
          <P>We don’t sell your data, and we don’t use it to make automated decisions about you.</P>

          <H2>Who we share it with</H2>
          <P>
            We only share your data with suppliers who help us run the business, and only what they
            need:
          </P>
          <UL>
            <li>
              <strong>Google</strong> provides our email, calendar and call booking.
            </li>
            <li>
              <strong>Vercel</strong> hosts our website.
            </li>
            <li>
              <strong>[Accounting provider]</strong> handles invoicing, and{" "}
              <strong>[accountant]</strong> prepares our accounts.
            </li>
          </UL>
          <P>We may also share data if the law requires it.</P>

          <H2>Transfers outside the UK</H2>
          <P>
            Some of these suppliers store data in the United States. Where that happens, we rely on
            approved safeguards, such as the UK–US data bridge or the ICO’s International Data
            Transfer Agreement, to make sure your data stays protected.
          </P>

          <H2>How long we keep it</H2>
          <UL>
            <li>
              <strong>Enquiries and prospective client contacts:</strong> up to 2 years after our
              last contact, unless you ask us to delete them sooner.
            </li>
            <li>
              <strong>Client records and invoices:</strong> 6 years after the engagement ends, as
              required for tax purposes.
            </li>
            <li>
              <strong>Opt-outs:</strong> we keep a minimal record that you’ve opted out, so we don’t
              contact you again.
            </li>
          </UL>

          <H2>Your rights</H2>
          <P>You have the right to:</P>
          <UL>
            <li>Ask for a copy of the data we hold about you.</li>
            <li>Ask us to correct it.</li>
            <li>Ask us to delete it.</li>
            <li>Object to us using it, including for marketing, at any time.</li>
            <li>Ask us to restrict how we use it.</li>
            <li>Ask us to transfer it to you or to another organisation.</li>
          </UL>
          <P>
            To use any of these rights, email <Email />. We’ll respond within one month.
          </P>

          <H2>Complaints</H2>
          <P>
            If you’re unhappy with how we’ve handled your data, please complain to us first by
            emailing <Email />. We’ll acknowledge your complaint within 30 days, look into it
            properly, and tell you what we find and what we’re doing about it.
          </P>
          <P>
            You also have the right to complain to the Information Commissioner’s Office at{" "}
            <A href="https://ico.org.uk">ico.org.uk</A> or on{" "}
            <A href="tel:+443031231113">0303 123 1113</A>.
          </P>

          <H2>Cookies</H2>
          <P>
            Our website only uses cookies that are strictly necessary for it to work. We don’t use
            advertising or tracking cookies.
          </P>

          <H2>Changes to this policy</H2>
          <P>We’ll update this page if anything changes and show the date at the top.</P>
        </article>
      </main>
    </>
  );
}

/* The case study article's type, so the two long-form pages read alike. */

function H2({ children }: { children: ReactNode }) {
  return <h2 className="display display-3 mt-6 text-pf-ink-900 first:mt-0">{children}</h2>;
}

function P({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 text-[17px] leading-[1.7] text-pf-ink-700 [&_strong]:font-semibold [&_strong]:text-pf-ink-900">
      {children}
    </p>
  );
}

function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="m-0 flex list-disc flex-col gap-2.5 pl-6 text-[17px] leading-[1.7] text-pf-ink-700 marker:text-eyebrow [&_strong]:font-semibold [&_strong]:text-pf-ink-900">
      {children}
    </ul>
  );
}

function A({ href, children }: { href: string; children: ReactNode }) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-eyebrow underline decoration-1 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700"
    >
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}

function Email() {
  return <A href={`mailto:${EMAIL}`}>{EMAIL}</A>;
}
