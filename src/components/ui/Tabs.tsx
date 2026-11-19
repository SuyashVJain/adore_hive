import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'

export interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface Props {
  tabs: Tab[]
  value: string
  onChange: (id: string) => void
  label: string
}

/** Accessible tabs: roving tabindex, arrow/Home/End keys, tabpanel wired with ids. */
export function Tabs({ tabs, value, onChange, label }: Props) {
  const base = useId()
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const onKey = (e: KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.id === value)
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key]
    if (next === undefined) return
    e.preventDefault()
    const t = tabs[(next + tabs.length) % tabs.length]
    onChange(t.id)
    refs.current[t.id]?.focus()
  }
  const active = tabs.find((t) => t.id === value) ?? tabs[0]
  return (
    <div>
      <div role="tablist" aria-label={label} onKeyDown={onKey} className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const on = t.id === active.id
          return (
            <button
              key={t.id}
              ref={(el) => { refs.current[t.id] = el }}
              role="tab"
              type="button"
              id={`${base}-t-${t.id}`}
              aria-selected={on}
              aria-controls={`${base}-p-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => onChange(t.id)}
              className={`min-h-11 rounded-md border px-4 text-sm transition-colors ${on ? 'border-ink bg-blush' : 'border-line-strong bg-surface hover:bg-blush/60'}`}
            >
              {t.label}
            </button>
          )
        })}
      </div>
      <div role="tabpanel" id={`${base}-p-${active.id}`} aria-labelledby={`${base}-t-${active.id}`} tabIndex={0} className="mt-6 outline-offset-4">
        {active.content}
      </div>
    </div>
  )
}
