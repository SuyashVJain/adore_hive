import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Overlay } from './Overlay'

interface Props {
  open: boolean
  onClose: () => void
  /** Accessible name */
  label: string
  className?: string
  children: ReactNode
}

export function Modal({ open, onClose, label, className = '', children }: Props) {
  if (!open) return null
  return (
    <Overlay onClose={onClose}>
      {/* Clicking the empty area around the dialog closes it */}
      <div className="absolute inset-0 overflow-y-auto" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className={`relative mx-auto my-4 w-[calc(100%-2rem)] max-w-[1060px] animate-rise rounded-xl bg-page p-5 sm:mb-14 sm:mt-36 sm:p-9 ${className}`}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="eyebrow !text-ink">Adore Hive</span>
            <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-blush active:bg-[#f0cfcf]">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </Overlay>
  )
}
