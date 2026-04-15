'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    priceSubtext: '/forever',
    description: 'Perfect for trying out Renamerly',
    features: [
      '20 images per session',
      'Auto-iteration naming',
      'RAW file preview',
      'Basic export (ZIP)',
    ],
    cta: 'Get Started Free',
    ctaLink: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    priceSubtext: '/month',
    description: 'For professionals who need unlimited power',
    badge: 'Most Popular',
    features: [
      'Unlimited images per session',
      'Unlimited saved projects',
      '10 saved templates',
      'RAW processing & conversion',
      'EXIF metadata editing',
      '30-day export history',
      'Priority support',
      'AI descriptor suggestions',
    ],
    cta: 'Upgrade to Pro',
    ctaLink: '/api/stripe/checkout',
    highlighted: true,
  },
]

const comparisonFeatures = [
  {
    category: 'Image Processing',
    features: [
      { name: 'Images per session', free: '20 max', pro: 'Unlimited' },
      { name: 'Auto-iteration naming', free: true, pro: true },
      { name: 'RAW file preview', free: true, pro: true },
      { name: 'RAW processing & conversion', free: false, pro: true },
      { name: 'EXIF metadata editing', free: false, pro: true },
    ],
  },
  {
    category: 'Organization',
    features: [
      { name: 'Saved projects', free: '0', pro: 'Unlimited' },
      { name: 'Saved templates', free: '0', pro: '10' },
      { name: 'Export history', free: '0 days', pro: '30 days' },
    ],
  },
  {
    category: 'Advanced Features',
    features: [
      { name: 'AI descriptor suggestions', free: false, pro: true },
      { name: 'Batch operations', free: false, pro: true },
      { name: 'Custom export formats', free: false, pro: true },
      { name: 'CSV manifest generation', free: false, pro: true },
    ],
  },
  {
    category: 'Support',
    features: [
      { name: 'Community support', free: true, pro: true },
      { name: 'Priority email support', free: false, pro: true },
      { name: 'Response time', free: '48 hours', pro: '24 hours' },
    ],
  },
]

const faqs = [
  {
    q: 'Can I upgrade or downgrade anytime?',
    a: 'Yes! You can upgrade to Pro anytime and your card will be charged immediately. If you downgrade, you will have access to Pro features until the end of your billing period.',
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
    a: 'Yes! All image processing happens in your browser, so you can work offline. You just need internet to save projects and sync templates.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-deep-space text-white py-16 sm:py-20 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-display">
            Simple, Transparent Pricing
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Start free and upgrade when you are ready for unlimited power
          </p>
        </motion.div>

        {/* Pricing Cards - Match Landing Page Style */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-24"
        >
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                show: { opacity: 1, scale: 1 },
              }}
              className={`group relative rounded-xl p-8 transition-all duration-500 isolate ${
                tier.highlighted
                  ? 'bg-white/3 backdrop-blur-2xl backdrop-saturate-150 border-2 border-treez-purple/50 shadow-xl shadow-treez-purple/20 md:scale-105 hover:shadow-2xl hover:shadow-treez-purple/30 hover:border-treez-purple/70'
                  : 'bg-white/2 backdrop-blur-xl backdrop-saturate-120 border border-white/10 shadow-lg shadow-black/20 hover:bg-white/4 hover:border-white/20 hover:shadow-xl hover:shadow-black/30 hover:scale-[1.02]'
              }`}
            >
              {/* Inner glow accent */}
              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                tier.highlighted
                  ? 'bg-linear-to-br from-treez-purple/10 via-transparent to-treez-cyan/10'
                  : 'bg-linear-to-br from-white/5 via-transparent to-white/5'
              }`} />

              {/* Badge */}
              {'badge' in tier && tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-linear-to-r from-treez-purple to-treez-pink text-white text-sm font-semibold shadow-lg shadow-treez-purple/50">
                  {tier.badge}
                </div>
              )}

              {/* Header */}
              <div className="relative text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold text-white">{tier.price}</span>
                  <span className="text-gray-400">{tier.priceSubtext}</span>
                </div>
                <p className="text-sm text-gray-400">{tier.description}</p>
              </div>

              {/* Features */}
              <ul className="relative space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="relative mt-auto">
                <Link href={tier.ctaLink} className="block">
                  <Button
                    variant={tier.highlighted ? 'primary' : 'secondary'}
                    size="lg"
                    className="w-full"
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 font-display">
            <span className="bg-linear-to-r from-treez-purple to-treez-cyan bg-clip-text text-transparent">
              Feature Comparison
            </span>
          </h2>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            {comparisonFeatures.map((category, catIdx) => (
              <div key={catIdx} className={catIdx !== 0 ? 'border-t border-white/10' : ''}>
                {/* Category Header */}
                <div className="bg-white/5 px-6 py-4">
                  <h3 className="text-lg font-semibold text-treez-purple">{category.category}</h3>
                </div>

                {/* Features */}
                {category.features.map((feature, featIdx) => (
                  <div
                    key={featIdx}
                    className="grid grid-cols-3 gap-4 px-6 py-4 border-t border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <div className="col-span-1 text-gray-300 font-medium">{feature.name}</div>
                    <div className="col-span-1 text-center">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <Check className="w-5 h-5 text-treez-cyan inline" />
                        ) : (
                          <X className="w-5 h-5 text-gray-600 inline" />
                        )
                      ) : (
                        <span className="text-gray-400">{feature.free}</span>
                      )}
                    </div>
                    <div className="col-span-1 text-center">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <Check className="w-5 h-5 text-treez-cyan inline" />
                        ) : (
                          <X className="w-5 h-5 text-gray-600 inline" />
                        )
                      ) : (
                        <span className="text-white font-semibold">{feature.pro}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Table Headers - positioned above table */}
          <div className="grid grid-cols-3 gap-4 px-6 py-4 -mt-2">
            <div className="col-span-1"></div>
            <div className="col-span-1 text-center text-sm font-semibold text-gray-400">Free</div>
            <div className="col-span-1 text-center text-sm font-semibold text-treez-purple">
              Pro
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto mb-24"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 font-display">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-display">
            Ready to transform your workflow?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Start free and upgrade when you need unlimited power.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button variant="primary" size="lg">
                Start Free
              </Button>
            </Link>
            <Link href="/app">
              <Button variant="secondary" size="lg">
                Try Demo First
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
