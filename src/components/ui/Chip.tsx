import { Check } from 'lucide-react'

interface ChipProps {
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
  children: string
}

export function Chip({ selected, disabled, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={!!selected}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-md border px-4 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
        selected ? 'border-ink bg-blush' : 'border-line-strong bg-surface hover:bg-blush/60 active:bg-blush'
      }`}
    >
      {selected && <Check className="h-4 w-4" aria-hidden="true" />}
      {children}
    </button>
  )
}

interface GroupProps {
  label: string
  options: string[]
  value: string[]
  onChange: (v: string[]) => void
  multiple?: boolean
}

/** Option selector: single or multi select, announced as a labelled group of toggle buttons. */
export function ChipGroup({ label, options, value, onChange, multiple }: GroupProps) {
  const pick = (o: string) =>
    onChange(multiple ? (value.includes(o) ? value.filter((v) => v !== o) : [...value, o]) : [o])
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Chip key={o} selected={value.includes(o)} onClick={() => pick(o)}>{o}</Chip>
      ))}
    </div>
  )
}
