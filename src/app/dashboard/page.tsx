import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LogOut, User } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-space via-[#0a0a0a] to-cosmic-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-treez-purple via-treez-cyan to-treez-pink bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Welcome back, {user.email}</p>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 hover:border-treez-cyan transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>

        {/* Welcome Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-treez-purple to-treez-cyan rounded-full flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Authentication Configured! 🎉
              </h2>
              <p className="text-gray-300 mb-4">
                Your Supabase authentication is now set up and working. You&apos;re currently logged in as{' '}
                <span className="text-treez-cyan font-medium">{user.email}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/app"
                  className="px-6 py-3 bg-gradient-to-r from-treez-purple to-treez-pink text-white rounded-xl font-medium hover:shadow-lg hover:shadow-treez-purple/50 transition-all duration-300"
                >
                  Go to App
                </Link>
                <Link
                  href="/account"
                  className="px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 hover:border-treez-cyan transition-all duration-300"
                >
                  Account Settings
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">User ID</h3>
            <p className="text-sm text-gray-400 font-mono break-all">{user.id}</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
            <p className="text-sm text-gray-400">{user.email}</p>
            {user.email_confirmed_at && (
              <p className="text-xs text-success mt-1">✓ Verified</p>
            )}
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Account Created</h3>
            <p className="text-sm text-gray-400">
              {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-gradient-to-r from-treez-purple/10 to-treez-cyan/10 border border-treez-purple/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Next Steps</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-treez-cyan mt-1">→</span>
              <span>Integrate the existing app with user authentication</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-treez-cyan mt-1">→</span>
              <span>Set up database tables for user projects and saved templates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-treez-cyan mt-1">→</span>
              <span>Implement premium features and payment processing</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
