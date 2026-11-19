import { useId, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

export interface AccordionItem {
  id: string
  title: string
  content: ReactNode
}

interface Props {
  items: AccordionItem[]
  defaultOpen?: string[]
  multiple?: boolean
}

export function Accordion({ items, defaultOpen = [], multiple }: Props) {
  const [open, setOpen] = useState<string[]>(defaultOpen)
  const base = useId()
  const toggle = (id: string) =>
    setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : multiple ? [...o, id] : [id]))
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it) => {
        const isOpen = open.includes(it.id)
        const pid = `${base}-${it.id}`
        return (
          <div key={it.id}>
            <h3 className="font-sans text-base">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={pid}
                onClick={() => toggle(it.id)}
                className="flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left transition-colors hover:text-muted"
              >
                {it.title}
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
            </h3>
            <div id={pid} role="region" aria-label={it.title} hidden={!isOpen} className="pb-4 text-sm text-muted">
              {it.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}
