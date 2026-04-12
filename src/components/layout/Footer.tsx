'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

const quickLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
]

export function Footer() {
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
    }
  }

  return (
    <footer className="bg-deep-space border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Image
              src="/brand/logo-full.webp"
              alt="AssetFlow"
              width={160}
              height={40}
              className="h-10 w-auto mb-3"
            />
            <p className="text-sm text-gray-400">
              Product Image Renaming Tool
            </p>
            <p className="mt-4 text-xs text-gray-500">
              Built by{' '}
              <a
                href="https://buildwithtreez.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-treez-cyan hover:text-treez-purple transition-colors duration-300"
              >
                Build With Treez
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={isLanding ? link.href : '/'}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="group text-sm text-gray-400 hover:text-treez-cyan transition-colors duration-300 inline-flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-treez-cyan transition-colors duration-300" />
                  {link.name}
                </a>
              ))}
              <Link
                href="/app"
                className="group text-sm text-gray-400 hover:text-treez-cyan transition-colors duration-300 inline-flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-treez-cyan transition-colors duration-300" />
                App
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Get Started</h3>
            <p className="text-sm text-gray-400 mb-4">
              Start renaming your product images for free. No signup required.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 text-sm font-medium text-treez-purple hover:text-treez-cyan transition-colors duration-300"
            >
              Try It Free
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} AssetFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
