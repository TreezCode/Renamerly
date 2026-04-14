'use client'

import { useState } from 'react'
import { AuthCard } from '@/components/auth/AuthCard'
import { AuthInput } from '@/components/auth/AuthInput'
import { AuthButton } from '@/components/auth/AuthButton'
import { createClient } from '@/lib/supabase/client'
import { Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) throw resetError

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthCard
        title="Check Your Email"
        subtitle="Password reset link sent"
        footer={{
          text: 'Remember your password?',
          linkText: 'Back to login',
          linkHref: '/login',
        }}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-treez-purple to-treez-cyan rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-300">
            We sent a password reset link to <strong className="text-treez-cyan">{email}</strong>
          </p>
          <p className="text-sm text-gray-400">
            Click the link in the email to reset your password. The link will expire in 1 hour.
          </p>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Enter your email to receive a reset link"
      footer={{
        text: 'Remember your password?',
        linkText: 'Back to login',
        linkHref: '/login',
      }}
    >
      <form onSubmit={handleResetRequest} className="space-y-4">
        {error && (
          <div className="p-4 bg-error/10 border border-error/50 rounded-xl text-error text-sm">
            {error}
          </div>
        )}

        <AuthInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <AuthButton type="submit" loading={loading}>
          Send Reset Link
        </AuthButton>
      </form>
    </AuthCard>
  )
}
