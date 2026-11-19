import { useId, useState } from 'react'
import { Gift as GiftIcon } from 'lucide-react'
import { GIFT_NOTE_MAX, giftWraps } from '@/config/shop'
import { formatINR } from '@/lib/format'
import type { Gift } from '@/lib/bag'
import { Button } from '../ui/Button'
import { Radio } from '../ui/Radio'

interface Props {
  value?: Gift
  onChange: (g?: Gift) => void
}

/** "Make it a gift": wrap choice + short note, stored on the bag line. */
export function GiftPanel({ value, onChange }: Props) {
  const [open, setOpen] = useState(!!value)
  const id = useId()
  const toggle = () => {
    const next = !open
    setOpen(next)
    onChange(next ? value ?? { wrap: giftWraps[0].id, note: '' } : undefined)
  }
  return (
    <div>
      <Button variant="outline" full aria-expanded={open} aria-controls={id} onClick={toggle}>
        <GiftIcon className="h-4 w-4" aria-hidden="true" /> {open ? 'Remove gift options' : 'Make it a gift'}
      </Button>
      {open && value && (
        <div id={id} className="mt-3 rounded-lg bg-blush p-5">
          <p className="eyebrow !text-ink">Add a little love</p>
          <fieldset className="mt-3">
            <legend className="sr-only">Gift wrap</legend>
            {giftWraps.map((w) => (
              <Radio key={w.id} name={`${id}-wrap`} checked={value.wrap === w.id} onChange={() => onChange({ ...value, wrap: w.id })}>
                <span className="flex w-full justify-between gap-4">{w.label} <span className="text-muted">+ {formatINR(w.fee)}</span></span>
              </Radio>
            ))}
          </fieldset>
          <label htmlFor={`${id}-note`} className="mt-3 block text-sm">A short note (optional)</label>
          <textarea
            id={`${id}-note`}
            rows={3}
            maxLength={GIFT_NOTE_MAX}
            value={value.note}
            onChange={(e) => onChange({ ...value, note: e.target.value })}
            className="mt-1.5 w-full rounded-md border border-line-strong bg-surface p-3 text-base outline-none hover:border-ink focus:border-ink focus:ring-1 focus:ring-ink"
          />
          <p className="mt-1 text-right text-xs text-muted">{value.note.length}/{GIFT_NOTE_MAX}</p>
        </div>
      )}
    </div>
  )
}
