import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-space via-[#0a0a0a] to-cosmic-gray">
      {children}
    </div>
  )
}
