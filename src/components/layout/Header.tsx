'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const navLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isLanding = pathname === '/'

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      
      if (isLanding) {
        // On landing page, smooth scroll to section with header offset
        const id = href.replace('#', '')
        const element = document.getElementById(id)
        if (element) {
          const headerOffset = 64
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      } else {
        // On other pages, navigate to landing page with section as query param
        const section = href.replace('#', '')
        router.push(`/?scrollTo=${section}`)
      }
      
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-deep-space/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/brand/logo-full.webp"
              alt="AssetFlow"
              width={160}
              height={40}
              priority
              className="h-10 w-auto"
            />
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={isLanding ? link.href : '/'}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm font-medium text-gray-400 hover:text-treez-cyan transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-treez-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-deep-space rounded-lg px-2 py-1"
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/app"
                className="text-sm font-medium text-gray-400 hover:text-treez-cyan transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-treez-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-deep-space rounded-lg px-2 py-1"
              >
                App
              </Link>
            </li>
          </ul>

          <div className="hidden md:block">
            <Link href="/app">
              <Button variant="primary" size="sm">
                Try It Free
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg border border-white/10 hover:border-treez-purple transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-treez-purple focus-visible:ring-offset-2 focus-visible:ring-offset-deep-space"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/10 bg-deep-space/98 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={isLanding ? link.href : '/'}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block text-sm font-medium text-gray-400 hover:text-treez-cyan transition-colors duration-300 py-2"
                >
                  {link.name}
                </a>
              ))}
              <Link
                href="/app"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-medium text-gray-400 hover:text-treez-cyan transition-colors duration-300 py-2"
              >
                App
              </Link>
              <div className="pt-2">
                <Link href="/app" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Try It Free
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
