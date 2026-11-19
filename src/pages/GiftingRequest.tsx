import { useRef, useState, type FormEvent } from 'react'
import { Check } from 'lucide-react'
import { Button, Field } from '@/components/ui'
import { SelectField } from '@/components/ui/SelectField'
import { images } from '@/data/images'

const kinds = ['Customized gift box', 'Personalized jewellery', 'Crochet bouquet', 'Occasion surprise', 'Something else']
const emailRe = /^\S+@\S+\.\S+$/

type Key = 'name' | 'contact' | 'ideas' | 'budget'

function validContact(v: string) {
  const t = v.trim()
  if (emailRe.test(t)) return true
  const digits = t.replace(/\D/g, '')
  return /^[+\d][\d\s\-()]*$/.test(t) && digits.length >= 10 && digits.length <= 13
}

export function GiftingRequest() {
  const form = useRef<HTMLFormElement>(null)
  const [v, setV] = useState({ name: '', contact: '', kind: kinds[0], occasion: '', budget: '', ideas: '' })
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({})
  const [sent, setSent] = useState(false)
  const bind = (k: keyof typeof v) => ({ value: v[k], onChange: (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value }) })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const er: typeof errors = {}
    if (!v.name.trim()) er.name = 'Please tell us your name.'
    if (!v.contact.trim()) er.contact = 'Add an email address or WhatsApp number so we can reach you.'
    else if (!validContact(v.contact)) er.contact = 'Enter a valid email, or a WhatsApp number with at least 10 digits.'
    if (v.budget && !(Number(v.budget) > 0)) er.budget = 'Enter a budget in rupees, like 1500, or leave it blank.'
    if (v.ideas.trim().length < 10) er.ideas = 'Share a few words about what you have in mind (at least 10 characters).'
    setErrors(er)
    if (Object.keys(er).length) {
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    setSent(true) // TODO: send to backend / email provider
  }

  return (
    <>
      <section aria-labelledby="personal-h" className="bg-blush py-14 md:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow mb-3">A little something, just for them</p>
            <h2 id="personal-h" className="text-4xl md:text-5xl">Let’s make it personal.</h2>
            <p className="mt-4 max-w-xl text-muted">Dreaming of customized gift boxes, personalized jewellery gifting, crochet bouquets, occasion surprises or your own product combinations? Tell us what you have in mind.</p>
            <img src={images.personal} alt="" width={616} height={310} loading="lazy" className="mt-8 aspect-[616/310] w-full rounded-xl object-cover" />
            <Button to="/hamper-studio" className="mt-6">Create your personalized gift</Button>
          </div>
          <div>
            {sent ? (
              <div role="status" className="rounded-lg bg-surface p-8">
                <p className="flex items-center gap-2 font-display text-3xl"><Check className="h-6 w-6" aria-hidden="true" /> Thank you, {v.name.trim()}.</p>
                <p className="mt-3 text-muted">Your request is in the hive. We’ll reach out on {v.contact.trim()} soon to talk it through.</p>
                <Button variant="outline" className="mt-6" onClick={() => { setSent(false); setV({ name: '', contact: '', kind: kinds[0], occasion: '', budget: '', ideas: '' }) }}>Send another request</Button>
              </div>
            ) : (
              <form ref={form} onSubmit={submit} noValidate aria-label="Customization request" className="space-y-4">
                <Field label="Your name" name="name" autoComplete="name" required error={errors.name} {...bind('name')} />
                <Field label="Email or WhatsApp" name="contact" autoComplete="email" required error={errors.contact} {...bind('contact')} />
                <SelectField label="What would you love to create?" name="kind" options={kinds} {...bind('kind')} />
                <Field label="Occasion & recipient" name="occasion" hint="For example: Birthday, for my sister" {...bind('occasion')} />
                <Field label="Budget · INR (optional)" name="budget" inputMode="numeric" error={errors.budget} {...bind('budget')} />
                <Field multiline label="Your ideas & preferred products" name="ideas" required error={errors.ideas} {...bind('ideas')} />
                <Button type="submit" full>Send customization request</Button>
                <p className="text-xs text-muted">Availability and final quote will be confirmed personally.</p>
              </form>
            )}
          </div>
        </div>
      </section>
      <section className="bg-surface py-14 md:py-16">
        <div className="container-page">
          <p className="eyebrow mb-3">The little details matter</p>
          <h2 className="max-w-3xl text-3xl md:text-4xl">For everyday moments and thoughtful gestures.</h2>
          <p className="mt-3 text-muted">Make it a little more personal with a handwritten note or a beautifully chosen gift combination.</p>
          <Button to="/hamper-studio" variant="outline" className="mt-6">Explore the gifting studio</Button>
        </div>
      </section>
    </>
  )
}
