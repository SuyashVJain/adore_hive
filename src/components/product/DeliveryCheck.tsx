import { useState, type FormEvent } from 'react'
import { Truck } from 'lucide-react'
import { estimateDelivery } from '@/config/shop'
import { Button } from '../ui/Button'
import { Field } from '../ui/Field'

export function DeliveryCheck() {
  const [pin, setPin] = useState('')
  const [result, setResult] = useState<ReturnType<typeof estimateDelivery> | null>(null)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    setResult(estimateDelivery(pin))
  }
  return (
    <form onSubmit={submit} noValidate aria-label="Check delivery">
      <p className="eyebrow !text-ink mb-2.5 flex items-center gap-2"><Truck className="h-4 w-4" aria-hidden="true" /> Delivery</p>
      <div className="flex items-start gap-2">
        <Field className="flex-1" label="PIN code" name="pin" inputMode="numeric" maxLength={6} autoComplete="postal-code" value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setResult(null) }} error={result && !result.ok ? result.message : undefined} />
        <Button type="submit" variant="outline" className="h-14">Check</Button>
      </div>
      {result?.ok && <p role="status" className="mt-2 text-sm">{result.message}</p>}
    </form>
  )
}
