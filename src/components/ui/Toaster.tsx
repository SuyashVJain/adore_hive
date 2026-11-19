import { useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { useToast } from '@/store/toast'
import { useUI } from '@/store/ui'

/** Single toast with a View bag action. Auto-dismisses; a new toast restarts the timer. */
export function Toaster() {
  const toast = useToast((s) => s.toast)
  const hide = useToast((s) => s.hide)
  const open = useUI((s) => s.open)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(hide, 5000)
    return () => clearTimeout(t)
  }, [toast, hide])

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex justify-center px-4">
      {toast && (
        <div key={toast.id} className="pointer-events-auto flex animate-rise items-center gap-3 rounded-md bg-ink py-1 pl-4 pr-1 text-sm text-white shadow-drawer">
          <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{toast.message}</span>
          <button type="button" onClick={() => { hide(); open('bag') }} className="inline-flex min-h-11 items-center px-2 font-medium underline underline-offset-4 hover:no-underline">
            View bag
          </button>
          <button type="button" onClick={hide} aria-label="Dismiss" className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/15">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}
