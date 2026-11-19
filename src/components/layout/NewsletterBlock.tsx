import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '../ui/Button'
import { Field } from '../ui/Field'

export function NewsletterBlock() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Please enter a valid email address.')
    setError('')
    setDone(true) // TODO: send to email provider
  }

  return (
    <section aria-labelledby="newsletter-h" className="bg-blush py-10 md:py-16">
      <div className="container-page">
        <h2 id="newsletter-h" className="text-4xl md:text-5xl">Lovely things, in your inbox.</h2>
        <p className="mt-4 text-muted">New little treasures, gifting inspiration and a little Adore.</p>
        {done ? (
          <p role="status" className="mt-8 flex items-center gap-2 text-base">
            <Check className="h-5 w-5" aria-hidden="true" /> You’re on the list. Welcome to the hive.
          </p>
        ) : (
          <form onSubmit={submit} noValidate className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-start">
            <Field className="flex-1" label="Email address" type="email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
            <Button type="submit" className="h-14 sm:px-8">Join the hive</Button>
          </form>
        )}
        <p className="mt-4 text-xs text-muted">
          By subscribing, you agree to our <Link to="/policies/privacy" className="underline underline-offset-4 hover:text-ink">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  )
}
