'use client'

import { useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import type { ButtonVariant, ButtonSize } from '@/types'

interface UpgradeButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
  /**
   * Where to redirect unauthenticated users. Defaults to /signup with a next
   * param back to /pricing so they land here after creating an account.
   */
  signInHref?: string
}

/**
 * Starts a Stripe Checkout session and redirects the user to the hosted
 * payment page. Replaces the naive `<Link href="/api/stripe/checkout">`
 * pattern (which does a GET and returns 405 because the route only accepts
 * POST).
 *
 * Handles:
 *   - Loading state (disables button, shows "Redirecting…")
 *   - 401 Unauthorized → sends the user to the sign-in / sign-up page
 *   - Non-2xx / missing url → surfaces a user-visible error message
 *   - Network errors → generic retry message
 */
export function UpgradeButton({
  variant = 'primary',
  size = 'lg',
  className = '',
  children,
  signInHref = '/signup?next=/pricing',
}: UpgradeButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })

      if (res.status === 401) {
        router.push(signInHref)
        return
      }

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        setError(body?.error || 'Could not start checkout. Please try again.')
        return
      }

      const { url } = (await res.json()) as { url?: string }
      if (!url) {
        setError('No checkout URL returned from Stripe.')
        return
      }

      window.location.href = url
    } catch (err) {
      console.error('Stripe checkout failed:', err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Redirecting…' : children}
      </Button>
      {error && (
        <p
          className="mt-2 text-sm text-error text-center"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  )
}
