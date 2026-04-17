import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'

export default async function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile for display name
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  return (
    <SubscriptionProvider>
      <DashboardLayout
        user={{
          email: user.email || '',
          full_name: profile?.full_name || undefined,
        }}
      >
        {children}
      </DashboardLayout>
    </SubscriptionProvider>
  )
}
