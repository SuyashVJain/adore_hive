import { useId } from 'react'
import { AlertCircle } from 'lucide-react'
import { labelCls } from './controls'
import { Select } from './Select'

interface Props {
  label: string
  options: string[]
  value?: string
  /** Called with a change-like object so existing `e.target.value` handlers keep working */
  onChange?: (e: { target: { value: string } }) => void
  /** Shown while nothing is chosen */
  placeholder?: string
  error?: string
  id?: string
  name?: string
  required?: boolean
  autoComplete?: string
  disabled?: boolean
  className?: string
  onBlur?: () => void
}

/** Labelled select (Radix). Label sits above the 48px trigger. */
export function SelectField({ label, options, value = '', onChange, placeholder, error, id, name, required, autoComplete, disabled, className = '', onBlur }: Props) {
  const auto = useId()
  const fid = id ?? auto
  return (
    <div className={className}>
      <label htmlFor={fid} className={labelCls}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      <Select
        id={fid}
        name={name}
        required={required}
        autoComplete={autoComplete}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        invalid={!!error}
        describedBy={error ? `${fid}-err` : undefined}
        options={options.map((o) => ({ value: o, label: o }))}
        onValueChange={(v) => onChange?.({ target: { value: v } })}
        onBlur={onBlur}
      />
      {error && (
        <p id={`${fid}-err`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-error">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  )
}
