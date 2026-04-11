'use client'

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 
        px-4 py-2 bg-treez-purple text-white rounded-lg 
        focus:outline-none focus:ring-2 focus:ring-treez-cyan focus:ring-offset-2 focus:ring-offset-deep-space
        transition-all duration-300"
    >
      Skip to main content
    </a>
  )
}
