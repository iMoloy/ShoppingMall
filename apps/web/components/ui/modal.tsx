'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  confirmText?: string
  onConfirm?: () => void
  confirmVariant?: 'primary' | 'destructive'
  loading?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmText,
  onConfirm,
  confirmVariant = 'primary',
  loading = false,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 transition-opacity"
        aria-hidden="true"
      />

      {/* Dialog box */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-lg rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl transition-all"
      >
        <div className="mb-4">
          <h2 id="modal-title" className="text-lg font-semibold text-[var(--color-text-primary)]">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description}</p>
          )}
        </div>

        <div className="mb-6">{children}</div>

        <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-4">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          {confirmText && onConfirm && (
            <Button
              variant={confirmVariant}
              onClick={onConfirm}
              loading={loading}
              disabled={loading}
            >
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
