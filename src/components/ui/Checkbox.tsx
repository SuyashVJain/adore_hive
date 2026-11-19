import type { InputHTMLAttributes, ReactNode } from 'react'
import { Check } from 'lucide-react'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children: ReactNode
}

export function Checkbox({ children, className = '', ...rest }: Props) {
  return (
    <label className={`flex min-h-11 cursor-pointer items-center gap-3 py-2 text-sm has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 ${className}`}>
      <input type="checkbox" className="peer sr-only" {...rest} />
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-sm border border-line-strong bg-surface text-white transition-colors peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <span>{children}</span>
    </label>
  )
}
