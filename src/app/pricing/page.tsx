'use client'

import { motion } from 'framer-motion'
import { Check, X, Zap, Crown, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const pricingPlans = {
  free: {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out Renamerly',
    icon: Zap,
    features: [
      { name: '20 images per session', included: true },
      { name: 'Auto-iteration naming', included: true },
      { name: 'RAW file preview', included: true },
      { name: 'Basic export (ZIP)', included: true },
      { name: 'Saved projects', included: false },
      { name: 'Saved templates', included: false },
      { name: 'RAW processing & conversion', included: false },
      { name: 'EXIF metadata editing', included: false },
      { name: 'Export history', included: false },
      { name: 'Priority support', included: false },
      { name: 'AI descriptor suggestions', included: false },
    ],
    cta: 'Get Started Free',
    ctaLink: '/signup',
    highlighted: false,
  },
  pro: {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'For professionals who need unlimited power',
    icon: Crown,
    features: [
      { name: 'Unlimited images per session', included: true },
      { name: 'Auto-iteration naming', included: true },
      { name: 'RAW file preview', included: true },
      { name: 'Advanced export options', included: true },
      { name: 'Unlimited saved projects', included: true },
      { name: '10 saved templates', included: true },
      { name: 'RAW processing & conversion', included: true },
      { name: 'EXIF metadata editing', included: true },
      { name: '30-day export history', included: true },
      { name: 'Priority support', included: true },
      { name: 'AI descriptor suggestions', included: true },
    ],
    cta: 'Upgrade to Pro',
    ctaLink: '/api/stripe/checkout',
    highlighted: true,
  },
}

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

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-deep-space text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-treez-purple via-treez-cyan to-treez-pink bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Start free and upgrade when you're ready for unlimited power
          </p>

          {/* Annual toggle (future feature) */}
          {/* <div className="flex items-center justify-center gap-4 mt-8">
            <span className={!isAnnual ? 'text-white' : 'text-gray-400'}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 bg-white/10 rounded-full transition-all duration-300"
            >
              <div className={`absolute top-1 left-1 w-5 h-5 bg-treez-purple rounded-full transition-transform duration-300 ${isAnnual ? 'translate-x-7' : ''}`} />
            </button>
            <span className={isAnnual ? 'text-white' : 'text-gray-400'}>
              Annual <span className="text-green-400 text-sm">(Save 20%)</span>
            </span>
          </div> */}
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          {Object.entries(pricingPlans).map(([key, plan], index) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`relative bg-white/5 backdrop-blur-xl border rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
                  plan.highlighted
                    ? 'border-treez-purple shadow-lg shadow-treez-purple/20 lg:-mt-4 lg:pb-12'
                    : 'border-white/10'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="px-4 py-1 bg-gradient-to-r from-treez-purple to-treez-pink rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-treez-purple/20 to-treez-cyan/20 border border-treez-purple/30 mb-6">
                  <Icon className="w-8 h-8 text-treez-purple" />
                </div>

                {/* Plan name */}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.ctaLink}
                  className={`group relative w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 overflow-hidden flex items-center justify-center gap-2 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-treez-purple to-treez-pink shadow-lg hover:shadow-treez-purple/50'
                      : 'bg-white/10 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  <span className="relative z-10">{plan.cta}</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  {plan.highlighted && (
                    <div className="absolute inset-0 bg-gradient-to-r from-treez-pink to-treez-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </Link>

                {/* Features */}
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-treez-cyan shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-gray-300' : 'text-gray-600'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-treez-purple to-treez-cyan bg-clip-text text-transparent">
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

          {/* Table Headers */}
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
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
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
            ].map((faq, idx) => (
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
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-24"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to transform your workflow?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Start free and upgrade when you need unlimited power.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group relative px-8 py-4 bg-gradient-to-r from-treez-purple to-treez-pink rounded-xl font-semibold text-white shadow-lg hover:shadow-treez-purple/50 transition-all duration-300 hover:scale-105 overflow-hidden flex items-center gap-2"
            >
              <span className="relative z-10">Start Free</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-treez-pink to-treez-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link
              href="/app"
              className="px-8 py-4 border-2 border-treez-cyan rounded-xl font-semibold text-treez-cyan hover:bg-treez-cyan/10 transition-all duration-300 hover:scale-105"
            >
              Try Demo First
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
