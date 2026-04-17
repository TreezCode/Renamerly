'use client'

/**
 * Re-exports useSubscription from SubscriptionContext.
 * The actual DB query and Realtime channel live in SubscriptionProvider,
 * mounted once at the layout level — all callers share one connection.
 */
export { useSubscription } from '@/contexts/SubscriptionContext'
