import type { InputHTMLAttributes, ReactNode } from 'react'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children: ReactNode
}

export function Radio({ children, className = '', ...rest }: Props) {
  return (
    <label className={`flex min-h-11 cursor-pointer items-center gap-3 py-2 text-sm has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 ${className}`}>
      <input type="radio" className="peer sr-only" {...rest} />
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-line-strong bg-surface transition-colors peer-checked:border-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink [&>i]:scale-0 peer-checked:[&>i]:scale-100">
        <i className="h-2.5 w-2.5 rounded-full bg-ink transition-transform" />
      </span>
      <span>{children}</span>
    </label>
  )
}
