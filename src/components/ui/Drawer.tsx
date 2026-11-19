import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Overlay } from './Overlay'

interface Props {
  open: boolean
  onClose: () => void
  /** Accessible name */
  label: string
  side?: 'left' | 'right'
  className?: string
  children: ReactNode
}

export function Drawer({ open, onClose, label, side = 'right', className = '', children }: Props) {
  if (!open) return null
  const pos = side === 'right' ? 'right-0 animate-slide-left' : 'left-0 animate-slide-right'
  return (
    <Overlay onClose={onClose}>
      <div role="dialog" aria-modal="true" aria-label={label} className={`absolute inset-y-0 ${pos} flex w-full max-w-[480px] flex-col bg-page shadow-drawer ${className}`}>
        <div className="flex items-center justify-between px-5 pb-1 pt-5 sm:px-7">
          <span className="eyebrow !text-ink">Adore Hive</span>
          <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-blush active:bg-[#f0cfcf]">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </Overlay>
  )
}
