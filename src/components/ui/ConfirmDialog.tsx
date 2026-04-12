'use client'

import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { Dialog } from './Dialog'
import { Button } from './Button'

export interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  confirmDisabled?: boolean
}

const variantConfig = {
  danger: {
    icon: AlertCircle,
    iconColor: 'text-red-400',
    iconBg: 'bg-red-500/10',
    confirmButton: 'danger' as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-500/10',
    confirmButton: 'primary' as const,
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    confirmButton: 'primary' as const,
  },
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'info',
  confirmDisabled = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !confirmDisabled) {
      handleConfirm()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      showCloseButton={false}
    >
      <div onKeyDown={handleKeyDown}>
        {/* Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className={`p-3 rounded-full ${config.iconBg}`}>
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 text-center mb-6">
          {description}
        </p>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            className="w-full sm:flex-1"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={config.confirmButton}
            size="md"
            onClick={handleConfirm}
            disabled={confirmDisabled}
            className="w-full sm:flex-1"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
