'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '/pricing' },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const isLanding = pathname === '/'

  useEffect(() => {
    const supabase = createClient()
    
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Close mobile menu first
    setIsMobileMenuOpen(false)
    
    if (href.startsWith('#')) {
      e.preventDefault()
      
      if (isLanding) {
        // On landing page, use native scrollIntoView which respects CSS scroll-margin-top
        // Add slight delay to ensure menu closes first
        setTimeout(() => {
          const id = href.replace('#', '')
          const element = document.getElementById(id)
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }
        }, 100)
      } else {
        // On other pages, navigate to landing page with section as query param
        const section = href.replace('#', '')
        router.push(`/?scrollTo=${section}`)
      }
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-deep-space/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/" 
            className="flex items-center gap-2 cursor-pointer"
            onClick={(e) => {
              if (isLanding) {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
          >
            <img
              src="/brand/logo-icon.webp"
              alt="Renamerly"
              width={435}
              height={472}
              className="h-9 w-auto"
            />
            <img
              src="/brand/logo-name.webp"
              alt=""
              aria-hidden="true"
              width={471}
              height={94}
              className="h-5 w-auto"
            />
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                {link.href.startsWith('#') ? (
                  <a
                    href={isLanding ? link.href : '/'}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-sm font-medium text-gray-400 hover:text-treez-cyan transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-treez-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-deep-space rounded-lg px-2 py-1"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-gray-400 hover:text-treez-cyan transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-treez-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-deep-space rounded-lg px-2 py-1"
                  >
                    {link.name}
                  </Link>
                )}
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

          <div className="hidden md:flex items-center gap-4">
            {!loading && (
              user ? (
                <Link href="/dashboard">
                  <Button variant="secondary" size="sm">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="primary" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )
            )}
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
                link.href.startsWith('#') ? (
                  <a
                    key={link.name}
                    href={isLanding ? link.href : '/'}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="block text-sm font-medium text-gray-400 hover:text-treez-cyan transition-colors duration-300 py-2"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm font-medium text-gray-400 hover:text-treez-cyan transition-colors duration-300 py-2"
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <Link
                href="/app"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-medium text-gray-400 hover:text-treez-cyan transition-colors duration-300 py-2"
              >
                App
              </Link>
              <div className="pt-2 space-y-2">
                {!loading && (
                  user ? (
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="secondary" size="sm" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="primary" size="sm" className="w-full">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
