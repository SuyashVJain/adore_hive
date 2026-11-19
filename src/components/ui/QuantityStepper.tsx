import { Minus, Plus } from 'lucide-react'

interface Props {
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
  label?: string
}

export function QuantityStepper({ value, onChange, min = 1, max = 10, label = 'Quantity' }: Props) {
  const btn =
    'grid h-11 w-11 place-items-center transition-colors hover:bg-blush active:bg-[#f0cfcf] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-md border border-line-strong bg-surface">
      <button type="button" className={`${btn} rounded-l-md`} aria-label={`Decrease ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)}>
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <output aria-live="polite" className="min-w-8 text-center text-sm">{value}</output>
      <button type="button" className={`${btn} rounded-r-md`} aria-label={`Increase ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
