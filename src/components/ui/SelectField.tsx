import { useId, type SelectHTMLAttributes } from 'react'
import { AlertCircle, ChevronDown } from 'lucide-react'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: string[]
  /** Adds an empty first option with this text, so nothing is preselected */
  placeholder?: string
  error?: string
}

export function SelectField({ label, options, placeholder, error, className = '', id, required, ...rest }: Props) {
  const auto = useId()
  const fid = id ?? auto
  return (
    <div className={className}>
      <div className="relative">
        <select
          id={fid}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${fid}-err` : undefined}
          className={`h-14 w-full appearance-none rounded-md border bg-surface px-3.5 pb-1.5 pt-6 text-base outline-none transition-colors hover:border-ink focus:border-ink focus:ring-1 focus:ring-ink ${error ? 'border-error' : 'border-line-strong'}`}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <label htmlFor={fid} className="pointer-events-none absolute left-3.5 top-2.5 text-xs text-muted">
          {label}{required && <span aria-hidden="true"> *</span>}
        </label>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2" aria-hidden="true" />
      </div>
      {error && (
        <p id={`${fid}-err`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-error">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  )
}
