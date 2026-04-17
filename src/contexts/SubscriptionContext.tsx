'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SubscriptionTier, getSubscriptionLimits } from '@/lib/subscription'

interface SubscriptionContextValue {
  tier: SubscriptionTier
  limits: ReturnType<typeof getSubscriptionLimits>
  loading: boolean
  isPro: boolean
  isFree: boolean
}

const SubscriptionContext = createContext<SubscriptionContextValue>({
  tier: 'free',
  limits: getSubscriptionLimits('free'),
  loading: true,
  isPro: false,
  isFree: true,
})

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<SubscriptionTier>('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function loadSubscription() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user ?? null

        if (!user) {
          setTier('free')
          setLoading(false)
          return
        }

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single()

        if (profile) {
          setTier((profile.subscription_tier as SubscriptionTier) || 'free')
        }
      } catch (error) {
        console.error('Error loading subscription:', error)
        setTier('free')
      } finally {
        setLoading(false)
      }
    }

    loadSubscription()

    const channel = supabase
      .channel('subscription-live')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'user_profiles' },
        (payload) => {
          if (payload.new.subscription_tier) {
            setTier(payload.new.subscription_tier as SubscriptionTier)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const limits = getSubscriptionLimits(tier)

  return (
    <SubscriptionContext.Provider
      value={{ tier, limits, loading, isPro: tier === 'pro', isFree: tier === 'free' }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  return useContext(SubscriptionContext)
}
