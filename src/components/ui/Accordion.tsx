import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { collapse } from '@/lib/motion'

export interface AccordionItem {
  id: string
  title: string
  content: ReactNode
}

interface Props {
  items: AccordionItem[]
  defaultOpen?: string[]
  multiple?: boolean
  /** Heading level for the item titles; match the surrounding outline */
  headingLevel?: 2 | 3
}

export function Accordion({ items, defaultOpen = [], multiple, headingLevel = 3 }: Props) {
  const H = `h${headingLevel}` as 'h2' | 'h3'
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
            <H className="font-sans text-base">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={pid}
                onClick={() => toggle(it.id)}
                className="flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left transition-colors hover:text-muted"
              >
                {it.title}
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
            </H>
            <AnimatePresence initial={false}>
              {isOpen && (
                <m.div id={pid} role="region" aria-label={it.title} className="overflow-hidden" {...collapse}>
                  <div className="pb-4 text-sm text-muted">{it.content}</div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
