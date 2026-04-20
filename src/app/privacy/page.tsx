import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Renamerly collects, uses, and protects your information. Images are processed entirely in your browser and never uploaded.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Renamerly Privacy Policy',
    description:
      'Images are processed entirely in your browser and never uploaded. Learn how we handle account data.',
    url: '/privacy',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// TODO (pre-launch): replace placeholders marked [PLACEHOLDER] with real values
// and have a lawyer review before public launch.
const EFFECTIVE_DATE = 'April 19, 2026'
const CONTACT_EMAIL = 'privacy@renamerly.com'
const GOVERNING_STATE = 'Pennsylvania'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-deep-space text-white px-6 py-24 sm:py-32">
      <article className="max-w-3xl mx-auto">
        <header className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-treez-purple mb-3">
            Legal
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-sm">Last updated: {EFFECTIVE_DATE}</p>
        </header>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <p>
              This Privacy Policy explains how Renamerly (&ldquo;we,&rdquo; &ldquo;us,&rdquo;
              or &ldquo;our&rdquo;), operated by <strong>Build With Treez</strong>, collects,
              uses, and protects information when you use{' '}
              <a
                href="https://renamerly.com"
                className="text-treez-cyan hover:text-treez-purple transition-colors"
              >
                renamerly.com
              </a>{' '}
              (the &ldquo;Service&rdquo;).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">
              1. The short version
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Your images never leave your browser.</strong> All renaming, RAW
                preview, and export happens client-side.
              </li>
              <li>
                We only store data you explicitly save (accounts, saved projects,
                templates) and we use Supabase to host it.
              </li>
              <li>
                We use Stripe to process Pro subscriptions. We never see or store your
                full payment card details.
              </li>
              <li>We don&apos;t sell your data. Ever.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">
              2. Information we collect
            </h2>

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">
              2.1 Information you provide
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account info:</strong> email, optional full name, and
                password (or OAuth identifier from Google/GitHub).
              </li>
              <li>
                <strong>Saved projects &amp; templates:</strong> project names,
                template rules, filename metadata, and exported manifest data you
                choose to save to your account.
              </li>
              <li>
                <strong>Billing info (Pro):</strong> handled by Stripe. We receive
                only a customer ID, subscription status, and the last 4 digits of
                your card for display purposes.
              </li>
              <li>
                <strong>Support requests:</strong> any messages you send us via
                email.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">
              2.2 Information collected automatically
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Usage analytics:</strong> page views, feature usage, and
                conversion events (sign-up, subscribe, file export) via Google
                Analytics 4 and Vercel Analytics. No personally identifying
                information is sent.
              </li>
              <li>
                <strong>Technical data:</strong> browser type, operating system,
                and approximate region (derived from IP) used to debug and improve
                the Service.
              </li>
              <li>
                <strong>Cookies:</strong> session cookies from Supabase for
                authentication. Analytics cookies from GA4 and Vercel. No
                advertising cookies.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">
              2.3 Information we do <em>not</em> collect
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Your product images. They are processed entirely in your browser
                and never transmitted to our servers.
              </li>
              <li>EXIF metadata of your images (unless you export a CSV manifest, in which case the data stays in the ZIP/CSV on your device).</li>
              <li>Full payment card numbers — Stripe handles these directly.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">
              3. How we use your information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve the Service.</li>
              <li>Authenticate your account and secure your session.</li>
              <li>Process Pro subscription payments via Stripe.</li>
              <li>
                Send transactional emails (account confirmation, password reset,
                receipts). We do not send marketing emails without explicit
                opt-in.
              </li>
              <li>Aggregate usage analytics to understand which features to build.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">
              4. Third-party services
            </h2>
            <p className="mb-4">We rely on a small set of processors:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Supabase</strong> — database, authentication, and file
                storage.{' '}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-treez-cyan hover:text-treez-purple transition-colors"
                >
                  Privacy policy
                </a>
                .
              </li>
              <li>
                <strong>Stripe</strong> — payment processing for Pro
                subscriptions.{' '}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-treez-cyan hover:text-treez-purple transition-colors"
                >
                  Privacy policy
                </a>
                .
              </li>
              <li>
                <strong>Vercel</strong> — hosting, edge network, analytics.{' '}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-treez-cyan hover:text-treez-purple transition-colors"
                >
                  Privacy policy
                </a>
                .
              </li>
              <li>
                <strong>Google Analytics 4</strong> — aggregate usage analytics.{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-treez-cyan hover:text-treez-purple transition-colors"
                >
                  Privacy policy
                </a>
                .
              </li>
              <li>
                <strong>Google / GitHub OAuth</strong> — optional sign-in
                providers. We receive only your email and basic profile info.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">
              5. Your rights
            </h2>
            <p className="mb-4">
              Depending on where you live, you may have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Correct inaccurate data.</li>
              <li>Delete your account and associated data.</li>
              <li>Export your data in a portable format.</li>
              <li>Opt out of analytics tracking (use your browser&apos;s Do Not Track or an ad blocker).</li>
            </ul>
            <p className="mt-4">
              Email{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-treez-cyan hover:text-treez-purple transition-colors"
              >
                {CONTACT_EMAIL}
              </a>{' '}
              to exercise any of these rights. We aim to respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">
              6. Data retention
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Active accounts:</strong> retained as long as the account
                is active.
              </li>
              <li>
                <strong>Cancelled Pro accounts:</strong> account and project data
                retained for 30 days to allow reactivation, then deleted.
              </li>
              <li>
                <strong>Deleted accounts:</strong> permanently removed from our
                database within 30 days. Backups are purged on a rolling 90-day
                cycle.
              </li>
              <li>
                <strong>Analytics:</strong> GA4 retains event data according to
                its default retention (currently 14 months).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">
              7. Security
            </h2>
            <p>
              We use industry-standard encryption in transit (HTTPS/TLS) and at
              rest for all data stored in Supabase. Passwords are hashed with
              bcrypt. Payment data is handled exclusively by Stripe and never
              touches our servers. No online service is 100% secure — if we
              detect a breach affecting your data, we will notify you promptly
              and, where required, the relevant authorities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">
              8. Children&apos;s privacy
            </h2>
            <p>
              The Service is not directed at children under 13. We do not
              knowingly collect personal information from children under 13. If
              you believe we have, contact{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-treez-cyan hover:text-treez-purple transition-colors"
              >
                {CONTACT_EMAIL}
              </a>{' '}
              and we will delete it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">
              9. International users
            </h2>
            <p>
              The Service is operated from the United States. If you access it
              from outside the U.S., your data will be transferred to and
              processed in the U.S. By using the Service, you consent to this
              transfer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">
              10. Changes to this policy
            </h2>
            <p>
              We may update this policy from time to time. Material changes will
              be announced on this page and, where appropriate, by email. The
              &ldquo;Last updated&rdquo; date at the top reflects the most recent
              revision.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-display">
              11. Contact
            </h2>
            <p>
              Questions, complaints, or data requests:{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-treez-cyan hover:text-treez-purple transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <p className="mt-4 text-sm text-gray-500">
              This Service is operated by Build With Treez and governed by the
              laws of {GOVERNING_STATE}, United States.
            </p>
          </section>

          <section className="pt-8 border-t border-white/10">
            <p className="text-sm text-gray-500">
              See also our{' '}
              <Link
                href="/terms"
                className="text-treez-cyan hover:text-treez-purple transition-colors"
              >
                Terms of Service
              </Link>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
