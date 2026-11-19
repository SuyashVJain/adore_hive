import type { ReactNode } from 'react'
import { categories, colours, occasions, type Colour } from '@/data/products'
import type { Filters, Finish } from '@/lib/listing'
import { Checkbox } from '../ui/Checkbox'
import { Chip } from '../ui/Chip'
import { PriceRange } from './PriceRange'

interface Props {
  value: Filters
  onChange: (f: Filters) => void
  /** Show the collection checkboxes (Shop All only) */
  showCollections: boolean
  showColour: boolean
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-line py-5 first:border-t-0 first:pt-0">
      <legend className="eyebrow !text-ink mb-3 float-left w-full">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  )
}

const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

export function FilterPanel({ value, onChange, showCollections, showColour }: Props) {
  return (
    <div>
      {showCollections && (
        <Group title="Collection">
          {categories.map((c) => (
            <Checkbox key={c.slug} checked={value.collections.includes(c.slug)} onChange={() => onChange({ ...value, collections: toggle(value.collections, c.slug) })}>
              {c.label}
            </Checkbox>
          ))}
        </Group>
      )}
      <Group title="Price · INR">
        <PriceRange min={value.min} max={value.max} onCommit={(min, max) => onChange({ ...value, min, max })} />
      </Group>
      {showColour && (
        <Group title="Colour">
          <div className="flex flex-wrap gap-2">
            {colours.map((c: Colour) => (
              <Chip key={c} selected={value.colours.includes(c)} onClick={() => onChange({ ...value, colours: toggle(value.colours, c) })}>{c}</Chip>
            ))}
          </div>
        </Group>
      )}
      <Group title="Occasion">
        <div className="flex flex-wrap gap-2">
          {occasions.map((o) => (
            <Chip key={o.slug} selected={value.occasions.includes(o.slug)} onClick={() => onChange({ ...value, occasions: toggle(value.occasions, o.slug) })}>{o.label}</Chip>
          ))}
        </div>
      </Group>
      <Group title="Finish & personal touches">
        {(['handmade', 'personalizable'] as Finish[]).map((f) => (
          <Checkbox key={f} checked={value.finish.includes(f)} onChange={() => onChange({ ...value, finish: toggle(value.finish, f) })}>
            {f === 'handmade' ? 'Handmade' : 'Personalizable'}
          </Checkbox>
        ))}
      </Group>
    </div>
  )
}
