import { useState, type FormEvent } from 'react'
import { Check } from 'lucide-react'
import { Button } from '../ui/Button'
import { Field } from '../ui/Field'

export function NotifyForm({ name }: { name: string }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Please enter a valid email address.')
    setError('')
    setDone(true) // TODO: store the request / send to email provider
  }
  if (done) return <p role="status" className="flex items-center gap-2 text-sm"><Check className="h-4 w-4" aria-hidden="true" /> We’ll email {email} when {name} is back.</p>
  return (
    <form onSubmit={submit} noValidate aria-label="Notify me when back in stock" className="rounded-lg bg-blush p-5">
      <p className="eyebrow !text-ink">Notify me</p>
      <p className="mt-2 text-sm text-muted">This little treasure is sold out right now. Leave your email and we’ll tell you when it’s back.</p>
      <div className="mt-3 flex items-start gap-2">
        <Field className="flex-1" label="Email address" type="email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
        <Button type="submit" className="h-14">Notify me</Button>
      </div>
    </form>
  )
}
