import { useId, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: string[]
}

export function SelectField({ label, options, className = '', id, ...rest }: Props) {
  const auto = useId()
  const fid = id ?? auto
  return (
    <div className={`relative ${className}`}>
      <select
        id={fid}
        className="h-14 w-full appearance-none rounded-md border border-line-strong bg-surface px-3.5 pb-1.5 pt-6 text-base outline-none transition-colors hover:border-ink focus:border-ink focus:ring-1 focus:ring-ink"
        {...rest}
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <label htmlFor={fid} className="pointer-events-none absolute left-3.5 top-2.5 text-xs text-muted">{label}</label>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2" aria-hidden="true" />
    </div>
  )
}
