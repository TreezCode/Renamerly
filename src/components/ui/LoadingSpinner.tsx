import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

export function LoadingSpinner({ size = 'md', className = '', label }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-solid border-t-transparent',
          'border-treez-cyan',
          sizeClasses[size]
        )}
        role="status"
        aria-label={label || 'Loading'}
      />
      {label && (
        <p className="text-sm text-gray-400 animate-pulse">{label}</p>
      )}
    </div>
  )
}

export function LoadingOverlay({ label }: { label?: string }) {
  return (
    <div className="absolute inset-0 bg-deep-space/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
      <LoadingSpinner size="lg" label={label} />
    </div>
  )
}
