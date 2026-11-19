import { useRef, useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { Button, Field } from '@/components/ui'
import { SelectField } from '@/components/ui/SelectField'
import { indianStates } from '@/config/india'
import { isPin } from '@/lib/validate'
import { defaultAddress, useAuth, type SavedAddress, type User } from '@/store/auth'
import { Badge } from '../ui/Badge'

type Fields = Omit<SavedAddress, 'id' | 'isDefault'>
const blank: Fields = { firstName: '', lastName: '', address: '', apartment: '', city: '', state: '', pin: '' }

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {}
  if (!f.firstName.trim()) e.firstName = 'Enter a first name.'
  if (!f.lastName.trim()) e.lastName = 'Enter a last name.'
  if (!f.address.trim()) e.address = 'Enter the house, flat, building and street.'
  if (!f.city.trim()) e.city = 'Enter the city.'
  if (!f.state) e.state = 'Choose a state.'
  if (!f.pin.trim()) e.pin = 'Enter the PIN code.'
  else if (!isPin(f.pin)) e.pin = 'PIN codes have exactly 6 digits.'
  return e
}

function AddressForm({ initial, onSave, onCancel }: { initial: Fields; onSave: (f: Fields) => void; onCancel: () => void }) {
  const ref = useRef<HTMLFormElement>(null)
  const [f, setF] = useState(initial)
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const errors = validate(f)
  const show = (k: keyof Fields) => (touched[k] || submitted ? errors[k] : undefined)
  const bind = (k: keyof Fields) => ({
    id: `ad-${k}`, value: f[k], error: show(k),
    onChange: (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value }),
    onBlur: () => setTouched((t) => ({ ...t, [k]: true })),
  })
  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const first = (Object.keys(errors) as (keyof Fields)[])[0]
    if (first) return document.getElementById(`ad-${first}`)?.focus()
    onSave({ ...f, firstName: f.firstName.trim(), lastName: f.lastName.trim(), address: f.address.trim(), apartment: f.apartment.trim(), city: f.city.trim(), pin: f.pin.trim() })
  }
  return (
    <form ref={ref} onSubmit={submit} noValidate aria-label="Address" className="space-y-4 rounded-lg bg-surface p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" autoComplete="given-name" required {...bind('firstName')} />
        <Field label="Last name" autoComplete="family-name" required {...bind('lastName')} />
      </div>
      <Field label="Address" autoComplete="address-line1" required hint="House, flat, building and street" {...bind('address')} />
      <Field label="Apartment / landmark (optional)" autoComplete="address-line2" {...bind('apartment')} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="City" autoComplete="address-level2" required {...bind('city')} />
        <SelectField label="State" required placeholder="Choose state" searchable options={indianStates} autoComplete="address-level1" {...bind('state')} />
        <Field label="PIN code" autoComplete="postal-code" inputMode="numeric" maxLength={6} required {...bind('pin')} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="submit">Save address</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

/** Saved addresses: add, edit, delete and choose a default. The default prefills checkout. */
export function Addresses({ user }: { user: User }) {
  const { saveAddress, removeAddress, setDefaultAddress } = useAuth.getState()
  const [editing, setEditing] = useState<null | 'new' | string>(null)
  const def = defaultAddress(user)
  const editingAddress = user.addresses.find((a) => a.id === editing)

  if (editing) {
    const initial: Fields = editingAddress ? { firstName: editingAddress.firstName, lastName: editingAddress.lastName, address: editingAddress.address, apartment: editingAddress.apartment, city: editingAddress.city, state: editingAddress.state, pin: editingAddress.pin } : blank
    return (
      <div>
        <h3 className="mb-4 font-display text-3xl">{editingAddress ? 'Edit address' : 'Add an address'}</h3>
        <AddressForm initial={initial} onCancel={() => setEditing(null)} onSave={(f) => { saveAddress({ ...f, id: editingAddress?.id }); setEditing(null) }} />
      </div>
    )
  }

  return (
    <div>
      {user.addresses.length === 0 ? (
        <div className="rounded-lg bg-surface p-8 text-center">
          <p className="font-display text-3xl">No saved addresses.</p>
          <p className="mt-2 text-muted">Add an address and it will be ready for your next checkout.</p>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {user.addresses.map((a) => (
            <li key={a.id} className="flex flex-col rounded-lg bg-surface p-5">
              {def?.id === a.id && <div className="mb-2"><Badge tone="blush">Default</Badge></div>}
              <address className="flex-1 text-sm not-italic leading-relaxed">{a.firstName} {a.lastName}<br />{a.address}{a.apartment ? `, ${a.apartment}` : ''}<br />{a.city}, {a.state} {a.pin}<br />India</address>
              <div className="mt-3 flex flex-wrap gap-x-4">
                <button type="button" onClick={() => setEditing(a.id)} aria-label={`Edit address for ${a.firstName} ${a.lastName}, ${a.pin}`} className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">Edit</button>
                {def?.id !== a.id && <button type="button" onClick={() => setDefaultAddress(a.id)} aria-label={`Make address for ${a.firstName} ${a.lastName}, ${a.pin} the default`} className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">Make default</button>}
                <button type="button" onClick={() => removeAddress(a.id)} aria-label={`Delete address for ${a.firstName} ${a.lastName}, ${a.pin}`} className="inline-flex min-h-11 items-center text-sm text-muted underline underline-offset-4 hover:text-ink">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Button className="mt-5" onClick={() => setEditing('new')}>Add an address <Plus className="h-3.5 w-3.5" aria-hidden="true" /></Button>
    </div>
  )
}
