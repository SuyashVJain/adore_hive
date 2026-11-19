import { useId, type InputHTMLAttributes } from 'react'
import { AlertCircle } from 'lucide-react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

/** Floating-label input. The label rests inside the box and lifts when focused or filled. */
export function Field({ label, error, hint, className = '', id, required, ...rest }: Props) {
  const auto = useId()
  const fid = id ?? auto
  const msg = error ? `${fid}-err` : hint ? `${fid}-hint` : undefined
  return (
    <div className={className}>
      <div className="relative">
        <input
          id={fid}
          placeholder=" "
          required={required}
          aria-invalid={!!error}
          aria-describedby={msg}
          className={`peer h-14 w-full rounded-md border bg-surface px-3.5 pb-1.5 pt-5 text-base text-ink outline-none transition-colors hover:border-ink focus:border-ink focus:ring-1 focus:ring-ink disabled:cursor-not-allowed disabled:bg-page disabled:opacity-60 ${
            error ? 'border-error' : 'border-line-strong'
          }`}
          {...rest}
        />
        <label
          htmlFor={fid}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted transition-all peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
        >
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      </div>
      {error ? (
        <p id={`${fid}-err`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-error">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${fid}-hint`} className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
}
