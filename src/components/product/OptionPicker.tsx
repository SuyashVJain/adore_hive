import type { Product } from '@/data/products'
import { Chip } from '../ui/Chip'

interface Props {
  product: Product
  selected: Record<string, string>
  onSelect: (name: string, value: string) => void
  /** Prefix for ids when two pickers could be on one page */
  idPrefix?: string
}

/** Required options, one group per option. Nothing is preselected on purpose. */
export function OptionPicker({ product, selected, onSelect, idPrefix = 'opt' }: Props) {
  return (
    <div className="space-y-5">
      {product.options.map((o) => (
        <div key={o.name} id={`${idPrefix}-${o.name}`} role="group" aria-labelledby={`${idPrefix}-${o.name}-l`}>
          <p id={`${idPrefix}-${o.name}-l`} className="eyebrow !text-ink mb-2.5">
            {o.name}
            {selected[o.name] && <span className="sr-only">: {selected[o.name]} selected</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            {o.values.map((v) => (
              <Chip key={v} selected={selected[o.name] === v} onClick={() => onSelect(o.name, v)}>{v}</Chip>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
