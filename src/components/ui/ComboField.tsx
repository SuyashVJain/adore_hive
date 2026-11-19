import { useId, useRef, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Command } from 'cmdk'
import { AlertCircle, Check, ChevronDown, Search } from 'lucide-react'
import { labelCls, panelBase, triggerBase, triggerBorder } from './controls'

interface Props {
  label: string
  options: string[]
  value?: string
  onChange?: (e: { target: { value: string } }) => void
  placeholder?: string
  error?: string
  id?: string
  name?: string
  required?: boolean
  autoComplete?: string
  className?: string
  onBlur?: () => void
}

/**
 * Searchable picker: Radix Popover + cmdk. Type to filter (substring match), arrows to move, Enter to choose.
 * A visually hidden native <select> still carries name, required and autocomplete, so form submission and
 * browser autofill keep working: choosing here sets it and fires a real change event.
 */
export function ComboField({ label, options, value = '', onChange, placeholder = 'Choose', error, id, name, required, autoComplete, className = '', onBlur }: Props) {
  const auto = useId()
  const fid = id ?? auto
  const [open, setOpen] = useState(false)
  const native = useRef<HTMLSelectElement>(null)

  const pick = (v: string) => {
    const el = native.current
    if (el) {
      Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')!.set!.call(el, v)
      el.dispatchEvent(new Event('change', { bubbles: true }))
    }
    setOpen(false)
  }

  return (
    <div className={className}>
      <label htmlFor={fid} className={labelCls}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            id={fid}
            type="button"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={open ? `${fid}-list` : undefined}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? `${fid}-err` : undefined}
            data-placeholder={value ? undefined : ''}
            onBlur={onBlur}
            className={`${triggerBase} ${triggerBorder(!!error)}`}
          >
            <span className="truncate">{value || placeholder}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content sideOffset={6} collisionPadding={12} align="start" className={`${panelBase} w-[var(--radix-popover-trigger-width)] !p-0`}>
            <Command label={`Search ${label.toLowerCase()}`} filter={(v, search) => (v.toLowerCase().includes(search.trim().toLowerCase()) ? 1 : 0)}>
              <div className="relative border-b border-line p-1.5">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <Command.Input placeholder={`Search ${label.toLowerCase()}`} className="h-10 w-full rounded-md bg-transparent pl-8 pr-2 text-base text-ink outline-none placeholder:text-muted" />
              </div>
              <Command.List id={`${fid}-list`} className="max-h-60 overflow-y-auto overscroll-contain p-1.5">
                <Command.Empty className="px-3 py-4 text-sm text-muted">No matches</Command.Empty>
                {options.map((o) => (
                  <Command.Item
                    key={o}
                    value={o}
                    onSelect={() => pick(o)}
                    className={`relative flex h-10 cursor-pointer select-none items-center rounded-md px-3 pr-9 text-sm text-ink data-[selected=true]:bg-blush-soft ${o === value ? 'bg-blush/60' : ''}`}
                  >
                    {o}
                    {o === value && <Check className="absolute right-3 h-4 w-4" aria-hidden="true" />}
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <select ref={native} name={name} value={value} required={required} autoComplete={autoComplete} onChange={(e) => onChange?.({ target: { value: e.target.value } })} tabIndex={-1} aria-hidden="true" className="sr-only">
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && (
        <p id={`${fid}-err`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-error">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  )
}
