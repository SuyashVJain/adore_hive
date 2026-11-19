import { useState, type ComponentProps } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Field } from './Field'

/** Password input with a show/hide toggle. */
export function PasswordField(props: Omit<ComponentProps<typeof Field>, 'type' | 'inputClassName'>) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Field {...props} type={show ? 'text' : 'password'} inputClassName="pr-14" />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-pressed={show}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute right-1.5 top-1.5 grid h-11 w-11 place-items-center rounded-md text-muted hover:bg-blush hover:text-ink"
      >
        {show ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
      </button>
    </div>
  )
}
