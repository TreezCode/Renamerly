import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms that govern your use of Renamerly, including subscription, refund, and acceptable-use policies.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Renamerly Terms of Service',
    description:
      'The terms that govern your use of Renamerly, including subscription, refund, and acceptable-use policies.',
    url: '/terms',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

// TODO (pre-launch): replace placeholders and have a lawyer review.
const EFFECTIVE_DATE = 'April 19, 2026'
const CONTACT_EMAIL = 'legal@renamerly.com'
const GOVERNING_STATE = 'Pennsylvania'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-deep-space text-white px-6 py-24 sm:py-32">
      <article className="max-w-3xl mx-auto">
        <header className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-treez-purple mb-3">
            Legal
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-400 text-sm">Last updated: {EFFECTIVE_DATE}</p>
        </header>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of
              Renamerly, operated by <strong>Build With Treez</strong> (&ldquo;we,&rdquo;
              &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By creating an account or using the
              Service, you agree to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">1. Eligibility</h2>
            <p>
              You must be at least 13 years old (or the age of digital consent in your country)
              to use the Service. If you use the Service on behalf of an organization, you
              represent that you have authority to bind that organization to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">2. Your account</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for all activity under your account and for keeping your credentials secure.</li>
              <li>
                Notify us immediately at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-treez-cyan hover:text-treez-purple transition-colors">
                  {CONTACT_EMAIL}
                </a>{' '}
                if you suspect unauthorized access.
              </li>
              <li>One person or organization per account. Sharing credentials is not permitted on the Pro plan.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">
              3. Plans, billing, and refunds
            </h2>

            <h3 className="text-lg font-semibold text-white mt-4 mb-2">3.1 Free plan</h3>
            <p>
              The Free plan is offered at no cost and is subject to session limits (currently 20
              images per session) and feature restrictions described on the{' '}
              <Link href="/pricing" className="text-treez-cyan hover:text-treez-purple transition-colors">
                Pricing page
              </Link>
              . We may adjust Free plan limits with reasonable notice.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">3.2 Pro plan</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Pro is billed <strong>$19 per month</strong> in U.S. dollars, processed by Stripe.
                The subscription renews automatically until you cancel.
              </li>
              <li>You can cancel anytime from the billing page. Pro features remain available until the end of the current billing period.</li>
              <li>If you downgrade to Free, Pro-only data remains in your account but becomes read-only until you reactivate.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">3.3 Refunds</h3>
            <p>
              We offer a <strong>14-day money-back guarantee</strong> on your first Pro
              subscription payment. Email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-treez-cyan hover:text-treez-purple transition-colors">
                {CONTACT_EMAIL}
              </a>{' '}
              within 14 days of your first charge for a full refund. Subsequent renewal payments
              are non-refundable except where required by law.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">3.4 Price changes</h3>
            <p>
              We may change subscription prices with at least 30 days&apos; notice. Changes will
              not affect the current billing period.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">3.5 Taxes</h3>
            <p>Prices do not include taxes. You are responsible for any applicable sales, VAT, GST, or other taxes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">4. Acceptable use</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service to process images you do not have the right to rename or modify.</li>
              <li>Attempt to bypass Free plan limits, share accounts, or reverse-engineer the Service.</li>
              <li>Use automated tools, scrapers, or bots to access the Service beyond what is publicly permitted.</li>
              <li>Upload malicious files, probe for vulnerabilities, or interfere with the integrity of the Service.</li>
              <li>Use the Service for content that is illegal, infringing, or violates third-party rights.</li>
              <li>Resell, sublicense, or white-label the Service without our written permission.</li>
            </ul>
            <p className="mt-4">We may suspend or terminate accounts that violate these rules.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">5. Your content</h2>
            <p>
              You retain all rights to the images, filenames, templates, and other content you
              process through or save to the Service (&ldquo;Your Content&rdquo;). You grant us a
              limited license to store and display Your Content solely to provide the Service to
              you.
            </p>
            <p className="mt-4">
              <strong>Images processed in the Service stay in your browser</strong> and are never
              uploaded to our servers. See our{' '}
              <Link href="/privacy" className="text-treez-cyan hover:text-treez-purple transition-colors">
                Privacy Policy
              </Link>{' '}
              for details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">
              6. Our intellectual property
            </h2>
            <p>
              The Service itself — including the code, design, logos, and &ldquo;Renamerly&rdquo;
              name — is owned by Build With Treez and protected by copyright and trademark law.
              These Terms do not grant you any rights to our intellectual property beyond the
              right to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">
              7. Service availability
            </h2>
            <p>
              We aim for high availability but do not guarantee uninterrupted service. We may
              modify, suspend, or discontinue features with reasonable notice. We are not liable
              for downtime caused by third-party services (Supabase, Stripe, Vercel) or events
              beyond our reasonable control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">
              8. Disclaimer of warranties
            </h2>
            <p className="uppercase text-sm leading-relaxed">
              The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
              warranties of any kind, express or implied, including merchantability, fitness for
              a particular purpose, or non-infringement. We do not warrant that the Service will
              be error-free or uninterrupted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">
              9. Limitation of liability
            </h2>
            <p className="uppercase text-sm leading-relaxed">
              To the maximum extent permitted by law, Build With Treez shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages, or any loss
              of profits or revenue, arising from your use of the Service. Our total liability
              in any matter arising from these Terms or the Service shall not exceed the amount
              you paid us in the twelve (12) months preceding the claim, or $100, whichever is
              greater.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Build With Treez from any claim arising
              out of your breach of these Terms, your violation of applicable law, or your
              infringement of third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">11. Termination</h2>
            <p>
              You may cancel your account at any time from the billing page or by emailing{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-treez-cyan hover:text-treez-purple transition-colors">
                {CONTACT_EMAIL}
              </a>
              . We may suspend or terminate your account for breach of these Terms. Upon
              termination, your right to use the Service ends. Sections intended to survive
              termination (ownership, disclaimers, liability limits, governing law) will remain
              in effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">
              12. Governing law &amp; disputes
            </h2>
            <p>
              These Terms are governed by the laws of {GOVERNING_STATE}, United States, without
              regard to conflict-of-law principles. Any dispute arising under these Terms will be
              resolved in the state or federal courts located in {GOVERNING_STATE}, and you
              consent to the jurisdiction of those courts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">
              13. Changes to these Terms
            </h2>
            <p>
              We may update these Terms from time to time. Material changes will be announced on
              this page and, where appropriate, by email. Continued use of the Service after a
              change constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">14. Contact</h2>
            <p>
              Questions about these Terms:{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-treez-cyan hover:text-treez-purple transition-colors">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section className="pt-8 border-t border-white/10">
            <p className="text-sm text-gray-500">
              See also our{' '}
              <Link href="/privacy" className="text-treez-cyan hover:text-treez-purple transition-colors">
                Privacy Policy
              </Link>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
