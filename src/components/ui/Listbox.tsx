import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { Check, ChevronDown, Search } from 'lucide-react'

export interface ListboxOption {
  value: string
  label: string
}

interface Props {
  options: ListboxOption[]
  value: string
  onChange: (value: string) => void
  /** Id for the trigger button, so an external element can point at it */
  id?: string
  /** Accessible name for the trigger when there is no visible label element */
  ariaLabel?: string
  /** Accessible name for the list itself (defaults to ariaLabel) */
  listLabel?: string
  /** Id of a visible label element */
  labelledBy?: string
  /** Text on the button when no option matches the value */
  placeholder?: string
  /** Trigger content override (the Sort control shows "Sort: Featured") */
  renderValue?: (selected: ListboxOption | undefined) => ReactNode
  /** Trigger classes */
  triggerClass: string
  /** Panel width: match the trigger, or size to the content */
  panelWidth?: 'trigger' | 'content'
  align?: 'left' | 'right'
  invalid?: boolean
  describedBy?: string
  onBlur?: () => void
  /** Adds a search box (combobox pattern): type to filter the options */
  searchable?: boolean
  searchLabel?: string
}

/**
 * Accessible custom select.
 * Plain: a button opens a listbox. Enter, Space or arrows open it; arrows move; Enter chooses; Escape closes;
 * typing a letter jumps to a match; a click outside closes it.
 * Searchable: the panel starts with a combobox input that filters the list as you type (Space types, Enter chooses).
 * Focus moves into the panel while it is open and returns to the button afterwards.
 */
export function Listbox({ options, value, onChange, id, ariaLabel, listLabel, labelledBy, placeholder, renderValue, triggerClass, panelWidth = 'trigger', align = 'left', invalid, describedBy, onBlur, searchable, searchLabel = 'Search options' }: Props) {
  const auto = useId()
  const listId = `${auto}-list`
  const reduce = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const typed = useRef({ text: '', at: 0 })
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [up, setUp] = useState(false)
  const [query, setQuery] = useState('')

  const shown = useMemo(() => {
    const t = query.trim().toLowerCase()
    return t ? options.filter((o) => o.label.toLowerCase().includes(t)) : options
  }, [options, query])

  const selected = options.find((o) => o.value === value)

  const show = () => {
    setQuery('')
    setActive(Math.max(0, options.findIndex((o) => o.value === value)))
    setOpen(true)
  }
  const close = (refocus = true) => {
    setOpen(false)
    if (refocus) button.current?.focus()
  }
  const choose = (i: number) => {
    const o = shown[i]
    if (o) onChange(o.value)
    close()
  }

  // Open upwards when there is not enough room below
  useLayoutEffect(() => {
    if (!open || !button.current) return
    const r = button.current.getBoundingClientRect()
    setUp(window.innerHeight - r.bottom < 340 && r.top > window.innerHeight - r.bottom)
  }, [open])

  // Move focus into the panel, and keep the active option in view
  useEffect(() => {
    if (!open) return
    ;(searchable ? input.current : list.current)?.focus({ preventScroll: true })
  }, [open, searchable])
  useEffect(() => {
    if (open) document.getElementById(`${auto}-o-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active, auto])

  useEffect(() => {
    if (!open) return
    const down = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) close(false)
    }
    document.addEventListener('pointerdown', down)
    return () => document.removeEventListener('pointerdown', down)
  }, [open])

  const onButtonKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      show()
    }
  }

  const onPanelKey = (e: KeyboardEvent) => {
    const last = shown.length - 1
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(last, a + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)) }
    else if (e.key === 'Enter') { e.preventDefault(); choose(active) }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close() }
    else if (e.key === 'Tab') close(false)
    else if (!searchable) {
      if (e.key === 'Home') { e.preventDefault(); setActive(0) }
      else if (e.key === 'End') { e.preventDefault(); setActive(last) }
      else if (e.key === ' ') { e.preventDefault(); choose(active) }
      else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const now = Date.now()
        typed.current = { text: (now - typed.current.at < 700 ? typed.current.text : '') + e.key.toLowerCase(), at: now }
        const hit = shown.findIndex((o) => o.label.toLowerCase().startsWith(typed.current.text))
        if (hit >= 0) setActive(hit)
      }
    }
  }

  const activeId = shown.length ? `${auto}-o-${active}` : undefined
  const name = listLabel ?? ariaLabel

  const options_ = (
    <ul
      ref={list}
      id={listId}
      role="listbox"
      tabIndex={searchable ? undefined : -1}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : name}
      aria-activedescendant={searchable ? undefined : activeId}
      onKeyDown={searchable ? undefined : onPanelKey}
      className={`max-h-64 overflow-y-auto overscroll-contain py-1.5 outline-none ${searchable ? '' : ''}`}
    >
      {shown.map((o, i) => {
        const isSel = o.value === value
        return (
          <li
            key={o.value || '__empty'}
            id={`${auto}-o-${i}`}
            role="option"
            aria-selected={isSel}
            onClick={() => choose(i)}
            onPointerMove={() => active !== i && setActive(i)}
            className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 px-4 text-sm text-ink ${isSel ? 'bg-blush' : i === active ? 'bg-[#fdf1f0]' : ''} ${i === active ? 'ring-1 ring-inset ring-ink/30' : ''}`}
          >
            <span>{o.label}</span>
            {isSel && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
          </li>
        )
      })}
    </ul>
  )

  return (
    <div ref={root} className="relative">
      <button
        ref={button}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={labelledBy ? undefined : ariaLabel}
        aria-labelledby={labelledBy ? `${labelledBy} ${id ?? ''}`.trim() : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? close() : show())}
        onKeyDown={onButtonKey}
        onBlur={onBlur}
        className={triggerClass}
      >
        {renderValue ? renderValue(selected) : <span className={`truncate ${selected && selected.value !== '' ? 'text-ink' : 'text-muted'}`}>{selected?.label ?? placeholder ?? ''}</span>}
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            onBlur={(e) => { if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false) }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: reduce ? 0 : 0.18 } }}
            exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.12 } }}
            className={`absolute z-40 overflow-hidden rounded-lg border border-line bg-white font-sans shadow-drawer ${up ? 'bottom-full mb-1.5' : 'top-full mt-1.5'} ${align === 'right' ? 'right-0' : 'left-0'} ${panelWidth === 'trigger' ? 'w-full min-w-[12rem]' : 'min-w-[13rem]'}`}
          >
            {searchable && (
              <div className="relative border-b border-line p-2">
                <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  ref={input}
                  type="text"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls={listId}
                  aria-autocomplete="list"
                  aria-activedescendant={activeId}
                  aria-label={searchLabel}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActive(0) }}
                  onKeyDown={onPanelKey}
                  className="h-11 w-full rounded-md border border-line-strong bg-white pl-9 pr-3 text-base text-ink outline-none focus:border-ink focus:ring-1 focus:ring-ink"
                />
              </div>
            )}
            {shown.length === 0 ? <p className="px-4 py-4 text-sm text-muted">No matches</p> : options_}
            {searchable && <p role="status" aria-live="polite" className="sr-only">{shown.length === 0 ? 'No matches' : `${shown.length} ${shown.length === 1 ? 'option' : 'options'} available`}</p>}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
