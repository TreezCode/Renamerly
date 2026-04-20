import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Pricing — Free & Pro Plans',
  description:
    'Simple, transparent pricing for Renamerly. Start free with 20 images per session, or upgrade to Pro for unlimited batch renaming, RAW processing, and AI descriptor suggestions.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Renamerly Pricing — Free & Pro Plans',
    description:
      'Start free, upgrade to Pro for unlimited batch image renaming, RAW processing, and AI suggestions. No hidden fees.',
    url: '/pricing',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Renamerly Pricing — Free & Pro Plans',
    description:
      'Start free, upgrade to Pro for unlimited batch image renaming, RAW processing, and AI suggestions.',
  },
}

// Keep these in sync with pricing/page.tsx. The page is a client component so
// schema lives here in the server layout where it can render a <script> tag in
// the response HTML (not bundled into client JS).
const pricingFaqs = [
  {
    q: 'Can I upgrade or downgrade anytime?',
    a: 'Yes. You can upgrade to Pro anytime and your card will be charged immediately. If you downgrade, you will have access to Pro features until the end of your billing period.',
  },
  {
    q: 'What happens to my projects if I cancel?',
    a: 'Your projects remain in our database for 30 days after cancellation. You can reactivate your subscription anytime to restore full access.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'We offer a 14-day money-back guarantee. If you are not satisfied with Pro, contact us for a full refund.',
  },
  {
    q: 'Are there any hidden fees?',
    a: 'No. The price you see is what you pay. No setup fees, no hidden charges.',
  },
  {
    q: 'Can I use Renamerly offline?',
    a: 'Yes. All image processing happens in your browser, so you can work offline. You just need internet to save projects and sync templates.',
  },
]

export default function PricingLayout({ children }: { children: ReactNode }) {
  const siteUrl = 'https://renamerly.com'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/pricing#faq`,
        mainEntity: pricingFaqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      },
      {
        '@type': 'Product',
        '@id': `${siteUrl}/pricing#free-plan`,
        name: 'Renamerly Free',
        description:
          'Free plan: 20 images per session, auto-iteration naming, RAW preview, and ZIP export.',
        brand: { '@type': 'Brand', name: 'Renamerly' },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          url: `${siteUrl}/signup`,
          availability: 'https://schema.org/InStock',
          category: 'Free',
        },
      },
      {
        '@type': 'Product',
        '@id': `${siteUrl}/pricing#pro-plan`,
        name: 'Renamerly Pro',
        description:
          'Pro plan: unlimited images, unlimited projects, 10 saved templates, RAW processing, EXIF editing, AI descriptor suggestions, 30-day export history, and priority support.',
        brand: { '@type': 'Brand', name: 'Renamerly' },
        offers: {
          '@type': 'Offer',
          price: '9',
          priceCurrency: 'USD',
          url: `${siteUrl}/pricing`,
          availability: 'https://schema.org/InStock',
          category: 'Subscription',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '9',
            priceCurrency: 'USD',
            billingIncrement: 1,
            unitCode: 'MON',
            unitText: 'month',
          },
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
