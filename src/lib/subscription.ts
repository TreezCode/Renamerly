/**
 * Subscription tier utilities and feature gating
 */

export type SubscriptionTier = 'free' | 'pro'

export interface SubscriptionLimits {
  maxImagesPerSession: number
  maxSavedProjects: number
  maxSavedTemplates: number
  canSaveProjects: boolean
  canSaveTemplates: boolean
  hasRawProcessing: boolean
  hasExifEditing: boolean
  hasAiSuggestions: boolean
  hasPrioritySupport: boolean
  hasExportHistory: boolean
}

/**
 * Get feature limits for a subscription tier
 */
export function getSubscriptionLimits(tier: SubscriptionTier): SubscriptionLimits {
  switch (tier) {
    case 'pro':
      return {
        maxImagesPerSession: Infinity,
        maxSavedProjects: Infinity,
        maxSavedTemplates: 10,
        canSaveProjects: true,
        canSaveTemplates: true,
        hasRawProcessing: true,
        hasExifEditing: true,
        hasAiSuggestions: true,
        hasPrioritySupport: true,
        hasExportHistory: true,
      }
    case 'free':
    default:
      return {
        maxImagesPerSession: 20,
        maxSavedProjects: 0,
        maxSavedTemplates: 0,
        canSaveProjects: false,
        canSaveTemplates: false,
        hasRawProcessing: false,
        hasExifEditing: false,
        hasAiSuggestions: false,
        hasPrioritySupport: false,
        hasExportHistory: false,
      }
  }
}

/**
 * Check if a feature is available for a tier
 */
export function hasFeature(
  tier: SubscriptionTier,
  feature: keyof Omit<SubscriptionLimits, 'maxImagesPerSession' | 'maxSavedProjects' | 'maxSavedTemplates'>
): boolean {
  const limits = getSubscriptionLimits(tier)
  return limits[feature]
}

/**
 * Check if image count is within limits
 */
export function canAddImages(tier: SubscriptionTier, currentCount: number, toAdd: number = 1): boolean {
  const limits = getSubscriptionLimits(tier)
  return currentCount + toAdd <= limits.maxImagesPerSession
}

/**
 * Check if project count is within limits
 */
export function canCreateProject(tier: SubscriptionTier, currentCount: number): boolean {
  const limits = getSubscriptionLimits(tier)
  return limits.canSaveProjects && currentCount < limits.maxSavedProjects
}

/**
 * Check if template count is within limits
 */
export function canCreateTemplate(tier: SubscriptionTier, currentCount: number): boolean {
  const limits = getSubscriptionLimits(tier)
  return limits.canSaveTemplates && currentCount < limits.maxSavedTemplates
}

/**
 * Get upgrade message for a feature
 */
export function getUpgradeMessage(feature: string): string {
  const messages: Record<string, string> = {
    images: 'Upgrade to Pro for unlimited images per session',
    projects: 'Upgrade to Pro to save unlimited projects',
    templates: 'Upgrade to Pro to save up to 10 templates',
    raw: 'Upgrade to Pro for RAW processing and conversion',
    exif: 'Upgrade to Pro for EXIF metadata editing',
    ai: 'Upgrade to Pro for AI-powered descriptor suggestions',
    history: 'Upgrade to Pro to access 30-day export history',
  }
  return messages[feature] || 'Upgrade to Pro to unlock this feature'
}

/**
 * Feature gate wrapper for UI components
 */
export interface FeatureGateProps {
  tier: SubscriptionTier
  feature: keyof Omit<SubscriptionLimits, 'maxImagesPerSession' | 'maxSavedProjects' | 'maxSavedTemplates'>
  children: React.ReactNode
  fallback?: React.ReactNode
}
