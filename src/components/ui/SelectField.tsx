import { useId, useRef, type ChangeEvent, type SelectHTMLAttributes } from 'react'
import { AlertCircle } from 'lucide-react'
import { Listbox } from './Listbox'

interface Props extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string
  options: string[]
  /** Adds an empty first option with this text, so nothing is preselected */
  placeholder?: string
  error?: string
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void
  /** Type to filter the options (use for long lists such as states) */
  searchable?: boolean
}

/**
 * Floating-label select built on the custom Listbox. A visually hidden native <select> still carries the
 * name, value, required and autocomplete, so form submission and browser autofill keep working.
 * Choosing an option sets the native select and fires a real change event, so existing onChange handlers are unchanged.
 */
export function SelectField({ label, options, placeholder, error, className = '', id, required, name, value, onChange, onBlur, autoComplete, disabled, searchable }: Props) {
  const auto = useId()
  const fid = id ?? auto
  const native = useRef<HTMLSelectElement>(null)
  const items = [...(placeholder ? [{ value: '', label: placeholder }] : []), ...options.map((o) => ({ value: o, label: o }))]

  const pick = (v: string) => {
    const el = native.current
    if (!el) return
    // The native value setter plus a bubbling change event is what React's onChange listens for
    Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')!.set!.call(el, v)
    el.dispatchEvent(new Event('change', { bubbles: true }))
  }

  return (
    <div className={`relative ${className}`}>
      <Listbox
        id={fid}
        labelledBy={`${fid}-label`}
        options={items}
        value={String(value ?? '')}
        onChange={pick}
        placeholder={placeholder}
        searchable={searchable}
        searchLabel={`Search ${label.toLowerCase()}`}
        invalid={!!error}
        describedBy={error ? `${fid}-err` : undefined}
        onBlur={onBlur as (() => void) | undefined}
        triggerClass={`flex h-14 w-full items-center justify-between gap-2 rounded-md border bg-surface px-3.5 pb-1.5 pt-6 text-left text-base outline-none transition-colors hover:border-ink focus-visible:border-ink focus-visible:ring-1 focus-visible:ring-ink disabled:opacity-60 ${error ? 'border-error' : 'border-line-strong'}`}
      />
      <span id={`${fid}-label`} className="pointer-events-none absolute left-3.5 top-2.5 text-xs text-muted">
        {label}{required && <span aria-hidden="true"> *</span>}
      </span>
      <select ref={native} name={name} value={value} required={required} disabled={disabled} autoComplete={autoComplete} onChange={onChange} tabIndex={-1} aria-hidden="true" className="sr-only">
        {placeholder && <option value="">{placeholder}</option>}
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
