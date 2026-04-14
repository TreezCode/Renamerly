'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ReactNode } from 'react'

interface AuthCardProps {
  children: ReactNode
  title: string
  subtitle?: string
  footer?: {
    text: string
    linkText: string
    linkHref: string
  }
}

export function AuthCard({ children, title, subtitle, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Gradient background accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-treez-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-treez-cyan/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glass morphism card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-treez-purple via-treez-cyan to-treez-pink bg-clip-text text-transparent mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-400 text-sm">{subtitle}</p>
            )}
          </div>

          {/* Content */}
          {children}

          {/* Footer */}
          {footer && (
            <div className="mt-6 text-center text-sm text-gray-400">
              {footer.text}{' '}
              <Link
                href={footer.linkHref}
                className="text-treez-cyan hover:text-treez-purple transition-colors duration-300"
              >
                {footer.linkText}
              </Link>
            </div>
          )}
        </div>

        {/* Build With Treez branding */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Powered by{' '}
            <a
              href="https://buildwithtreez.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-treez-purple hover:text-treez-cyan transition-colors duration-300"
            >
              Build With Treez
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
