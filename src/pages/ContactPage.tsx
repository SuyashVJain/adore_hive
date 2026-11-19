import { useState, type FormEvent } from 'react'
import { Check } from 'lucide-react'
import { Button, Field } from '@/components/ui'
import { ContactDetails } from '@/components/ui/ContactDetails'
import { StubPage } from './StubPage'

type Errors = Partial<Record<'name' | 'email' | 'message', string>>

export function Contact() {
  const [v, setV] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const er: Errors = {}
    if (!v.name.trim()) er.name = 'Please tell us your name.'
    if (!/^\S+@\S+\.\S+$/.test(v.email)) er.email = 'Please enter a valid email address so we can reply.'
    if (v.message.trim().length < 10) er.message = 'Add a few words so we know how to help.'
    setErrors(er)
    if (!Object.keys(er).length) setSent(true) // TODO: send to backend / email provider
  }

  return (
    <StubPage crumbs={[{ label: 'Contact Us' }]} eyebrow="Contact the hive" title="We’d love to hear from you." subtitle="Questions, custom orders or just a hello: write to us and we’ll get back to you soon.">
      <div className="grid gap-10 pb-16 md:grid-cols-[1fr_1.3fr]">
        <div>
          <h2 className="font-display text-3xl">Find us</h2>
          <ContactDetails className="mt-3" />
        </div>
        {sent ? (
          <p role="status" className="flex items-start gap-2 text-base"><Check className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" /> Thank you, {v.name.trim()}. Your message is on its way to the hive.</p>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            <Field label="Your name" name="name" autoComplete="name" required value={v.name} onChange={set('name')} error={errors.name} />
            <Field label="Your email" name="email" type="email" autoComplete="email" required value={v.email} onChange={set('email')} error={errors.email} />
            <Field label="Message" name="message" required value={v.message} onChange={set('message')} error={errors.message} />
            <Button type="submit">Send message</Button>
          </form>
        )}
      </div>
    </StubPage>
  )
}
