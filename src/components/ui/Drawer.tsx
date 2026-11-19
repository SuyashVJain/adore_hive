import type { ReactNode } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { X } from 'lucide-react'
import { panel } from '@/lib/motion'
import { Overlay } from './Overlay'

interface Props {
  open: boolean
  onClose: () => void
  /** Accessible name */
  label: string
  side?: 'left' | 'right' | 'bottom'
  /** Visible heading in the top bar (defaults to the brand eyebrow) */
  title?: string
  /** Move focus to the first control on open. Turn off when the content focuses something better itself. */
  autoFocus?: boolean
  className?: string
  children: ReactNode
}

const pos = {
  right: 'inset-y-0 right-0 max-w-[480px]',
  left: 'inset-y-0 left-0 max-w-[480px]',
  bottom: 'inset-x-0 bottom-0 max-h-[88vh] rounded-t-2xl',
}

export function Drawer({ open, onClose, label, side = 'right', title = 'Adore Hive', autoFocus = true, className = '', children }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <Overlay key="drawer" onClose={onClose} autoFocus={autoFocus}>
          <m.div role="dialog" aria-modal="true" aria-label={label} className={`absolute flex w-full flex-col bg-page shadow-drawer ${pos[side]} ${className}`} {...panel[side]}>
            <div className="flex items-center justify-between px-5 pb-1 pt-5 sm:px-7">
              <span className="eyebrow !text-ink">{title}</span>
              <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-blush active:bg-[#f0cfcf]">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            {children}
          </m.div>
        </Overlay>
      )}
    </AnimatePresence>
  )
}
