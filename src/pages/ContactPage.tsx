import { useRef, useState, type FormEvent } from 'react'
import { Check } from 'lucide-react'
import { Breadcrumbs, Button, Field } from '@/components/ui'
import { ContactDetails } from '@/components/ui/ContactDetails'
import { SelectField } from '@/components/ui/SelectField'
import { site } from '@/config/site'
import { useSeo } from '@/lib/useDocumentTitle'
import { isEmail, isPhone } from '@/lib/validate'

const topics = ['Personalized gifting', 'A product question', 'An order I placed', 'Something else']

type Key = 'name' | 'email' | 'phone' | 'message'

export function Contact() {
  useSeo('Contact us', 'Get in touch with Adore Hive about a gifting idea, a product question or an order.')
  const form = useRef<HTMLFormElement>(null)
  const [v, setV] = useState({ name: '', email: '', phone: '', topic: topics[0], order: '', message: '' })
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({})
  const [sent, setSent] = useState(false)
  const bind = (k: keyof typeof v) => ({ value: v[k], onChange: (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value }) })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const er: typeof errors = {}
    if (!v.name.trim()) er.name = 'Please tell us your name.'
    if (!isEmail(v.email)) er.email = 'Please enter a valid email address so we can reply.'
    if (v.phone.trim() && !isPhone(v.phone)) er.phone = 'Enter a 10-digit mobile number, or leave this blank.'
    if (v.message.trim().length < 10) er.message = 'Add a few words so we know how to help.'
    setErrors(er)
    if (Object.keys(er).length) {
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    setSent(true) // TODO: send to backend / email provider
  }

  return (
    <div className="container-page pb-16 pt-5 md:pt-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact Us' }]} />
      <header className="py-8 text-center md:py-12">
        <p className="eyebrow mb-3">Let’s make something lovely</p>
        <h1 className="text-[2.5rem] leading-tight md:text-6xl">A little hello goes a long way.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">A gifting idea, a product question, a personal request: we’d love to hear from you.</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div>
          <img src="/images/about-hero.webp" alt="" width={580} height={360} loading="lazy" className="aspect-[16/10] w-full rounded-xl object-cover" />
          <h2 className="mt-6 font-display text-4xl">Talk to the hive.</h2>
          <p className="mt-3 text-muted">Tell us a little about what you’re looking for. For a personalized gift, share the occasion, preferred products and the little details that make it personal.</p>
          <div className="mt-5 border-t border-line pt-4">
            <ContactDetails />
            <div className="mt-3"><Button href={site.whatsappUrl} variant="outline">Chat on WhatsApp</Button></div>
          </div>
        </div>

        <div className="rounded-xl bg-surface p-5 sm:p-8">
          <h2 className="font-display text-4xl">Leave a little note.</h2>
          {sent ? (
            <p role="status" className="mt-5 flex items-start gap-2"><Check className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" /> Thank you, {v.name.trim()}. Your note is on its way to the hive, and we’ll reply to {v.email.trim()} soon.</p>
          ) : (
            <form ref={form} onSubmit={submit} noValidate aria-label="Contact form" className="mt-5 space-y-4">
              <Field label="Your name" name="name" autoComplete="name" required error={errors.name} {...bind('name')} />
              <Field label="Email address" type="email" name="email" autoComplete="email" required error={errors.email} {...bind('email')} />
              <Field label="Phone / WhatsApp (optional)" type="tel" name="phone" autoComplete="tel" inputMode="tel" error={errors.phone} {...bind('phone')} />
              <SelectField label="What’s on your mind?" name="topic" options={topics} {...bind('topic')} />
              <Field label="Order reference (if applicable)" name="order" {...bind('order')} />
              <Field multiline label="Your message" name="message" required error={errors.message} {...bind('message')} />
              <Button type="submit" full>Send message</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
