'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface AuthButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  children: ReactNode
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'oauth'
  icon?: ReactNode
}

export function AuthButton({ 
  children, 
  loading = false, 
  variant = 'primary',
  icon,
  disabled,
  className = '',
  ...props 
}: AuthButtonProps) {
  const baseStyles = `
    relative w-full px-6 py-3 rounded-xl
    font-medium text-sm
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2
  `

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-treez-purple to-treez-pink
      text-white
      hover:shadow-lg hover:shadow-treez-purple/50
      hover:scale-[1.02]
      active:scale-[0.98]
    `,
    secondary: `
      bg-white/5 backdrop-blur-sm
      border border-white/10
      text-white
      hover:bg-white/10
      hover:border-treez-cyan
      active:scale-[0.98]
    `,
    oauth: `
      bg-white/5 backdrop-blur-sm
      border border-white/10
      text-white
      hover:bg-white/10
      hover:border-white/20
      active:scale-[0.98]
    `
  }

  return (
    <button
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  )
}
