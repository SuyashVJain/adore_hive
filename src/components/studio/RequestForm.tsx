import { useRef, useState, type FormEvent } from 'react'
import { Check } from 'lucide-react'
import { Button, Field } from '@/components/ui'
import { isEmailOrPhone } from '@/lib/validate'

/** Small "send customization request" form used by both studios. Mock submit (TODO: send to the team). */
export function RequestForm({ summary, onClose }: { summary: string; onClose?: () => void }) {
  const form = useRef<HTMLFormElement>(null)
  const [v, setV] = useState({ name: '', contact: '', message: '' })
  const [errors, setErrors] = useState<Partial<Record<'name' | 'contact', string>>>({})
  const [sent, setSent] = useState(false)
  const bind = (k: keyof typeof v) => ({ value: v[k], onChange: (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value }) })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const er: typeof errors = {}
    if (!v.name.trim()) er.name = 'Please tell us your name.'
    if (!v.contact.trim()) er.contact = 'Add an email address or WhatsApp number so we can reach you.'
    else if (!isEmailOrPhone(v.contact)) er.contact = 'Enter a valid email, or a WhatsApp number with at least 10 digits.'
    setErrors(er)
    if (Object.keys(er).length) {
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    setSent(true)
  }

  if (sent)
    return (
      <div role="status" className="rounded-lg bg-surface p-6">
        <p className="flex items-center gap-2 font-display text-3xl"><Check className="h-6 w-6" aria-hidden="true" /> Thank you, {v.name.trim()}.</p>
        <p className="mt-2 text-muted">Your request is with the hive. We’ll reach out on {v.contact.trim()} to talk through the details and confirm the final quote.</p>
        {onClose && <Button variant="outline" className="mt-4" onClick={onClose}>Close</Button>}
      </div>
    )

  return (
    <form ref={form} onSubmit={submit} noValidate aria-label="Customization request" className="space-y-4 rounded-lg bg-surface p-5 sm:p-6">
      <p className="text-sm text-muted">Prefer to talk it through first? We’ll send your selections to the team: {summary}.</p>
      <Field label="Your name" name="name" autoComplete="name" required error={errors.name} {...bind('name')} />
      <Field label="Email or WhatsApp" name="contact" autoComplete="email" required error={errors.contact} {...bind('contact')} />
      <Field multiline label="Anything else we should know? (optional)" name="message" {...bind('message')} />
      <div className="flex flex-wrap gap-3">
        <Button type="submit">Send request</Button>
        {onClose && <Button variant="outline" onClick={onClose}>Cancel</Button>}
      </div>
    </form>
  )
}
