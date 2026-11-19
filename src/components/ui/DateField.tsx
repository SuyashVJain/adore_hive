import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { AlertCircle, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { MONTHS, WEEKDAYS, WEEKDAYS_LONG, addDays, addMonths, fromISO, isoToText, textToISO, toISO, todayISO } from '@/lib/dates'
import { Drawer } from './Drawer'

interface Props {
  label: string
  /** ISO date (YYYY-MM-DD) or empty */
  value: string
  onChange: (iso: string) => void
  /** Earliest selectable date (ISO). Earlier days are disabled and rejected when typed. */
  min?: string
  error?: string
  hint?: string
  id?: string
  name?: string
  required?: boolean
  className?: string
}

function useNarrow() {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const f = () => setNarrow(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])
  return narrow
}

/** Month grid. Roving tabindex: one day is tabbable, arrows move by day and week, PageUp/PageDown by month. */
function Calendar({ value, min, onPick, onClose }: { value: string; min: string; onPick: (iso: string) => void; onClose: () => void }) {
  const start = value ? fromISO(value) : fromISO(min > todayISO() ? min : todayISO())
  const [cursor, setCursor] = useState(start)
  const grid = useRef<HTMLDivElement>(null)
  const heading = useId()

  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const lead = (first.getDay() + 6) % 7 // Monday-first
  const days = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  const minDate = fromISO(min)
  const disabled = (d: Date) => toISO(d) < min
  const prevDisabled = new Date(cursor.getFullYear(), cursor.getMonth(), 0) < minDate
  const move = (to: Date) => {
    setCursor(to)
    requestAnimationFrame(() => grid.current?.querySelector<HTMLElement>(`[data-iso="${toISO(to)}"]`)?.focus())
  }

  useEffect(() => {
    // focus the selected (or first valid) day when the calendar opens
    grid.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus()
  }, [])

  const onKey = (e: KeyboardEvent) => {
    const steps: Record<string, Date> = {
      ArrowLeft: addDays(cursor, -1), ArrowRight: addDays(cursor, 1), ArrowUp: addDays(cursor, -7), ArrowDown: addDays(cursor, 7),
      PageUp: addMonths(cursor, -1), PageDown: addMonths(cursor, 1), Home: addDays(cursor, -((cursor.getDay() + 6) % 7)), End: addDays(cursor, 6 - ((cursor.getDay() + 6) % 7)),
    }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose(); return }
    const to = steps[e.key]
    if (!to) return
    e.preventDefault()
    if (disabled(to)) return // cannot move into the past
    move(to)
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <button type="button" aria-label="Previous month" disabled={prevDisabled} onClick={() => setCursor(addMonths(cursor, -1))} className="grid h-11 w-11 place-items-center rounded-full hover:bg-blush disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent">
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <p id={heading} aria-live="polite" className="font-product text-lg">{MONTHS[cursor.getMonth()]} {cursor.getFullYear()}</p>
        <button type="button" aria-label="Next month" onClick={() => setCursor(addMonths(cursor, 1))} className="grid h-11 w-11 place-items-center rounded-full hover:bg-blush">
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div ref={grid} role="grid" aria-labelledby={heading} onKeyDown={onKey}>
        <div role="row" className="grid grid-cols-7">
          {WEEKDAYS.map((w, i) => <span key={w} role="columnheader" aria-label={WEEKDAYS_LONG[i]} className="grid h-8 place-items-center text-xs text-muted">{w}</span>)}
        </div>
        {Array.from({ length: Math.ceil(cells.length / 7) }, (_, r) => (
          <div key={r} role="row" className="grid grid-cols-7">
            {cells.slice(r * 7, r * 7 + 7).concat(Array(7).fill(null)).slice(0, 7).map((day, c) => {
              if (day === null) return <span key={c} role="gridcell" />
              const d = new Date(cursor.getFullYear(), cursor.getMonth(), day)
              const iso = toISO(d)
              const off = disabled(d)
              const sel = iso === value
              const isToday = iso === todayISO()
              const focusable = day === cursor.getDate()
              return (
                <span key={c} role="gridcell" aria-selected={sel} aria-disabled={off || undefined} className="grid place-items-center">
                  <button
                    type="button"
                    data-iso={iso}
                    tabIndex={focusable ? 0 : -1}
                    aria-disabled={off || undefined}
                    aria-label={`${day} ${MONTHS[d.getMonth()]} ${d.getFullYear()}${isToday ? ', today' : ''}${off ? ', unavailable' : ''}`}
                    aria-current={isToday ? 'date' : undefined}
                    onClick={() => !off && onPick(iso)}
                    className={`grid h-11 w-11 place-items-center rounded-full text-sm transition-colors ${off ? 'cursor-not-allowed text-muted/60 line-through' : sel ? 'bg-blush font-medium ring-2 ring-ink' : 'hover:bg-[#fdf1f0]'} ${isToday && !sel ? 'ring-1 ring-ink/40' : ''}`}
                  >
                    {day}
                  </button>
                </span>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Brand date field. A text input you can type dd-mm-yyyy into, plus a calendar button that opens a month grid
 * (a popover on desktop, a bottom sheet on phones). The value is an ISO string, same as a native date input.
 */
export function DateField({ label, value, onChange, min = todayISO(), error, hint, id, name, required, className = '' }: Props) {
  const auto = useId()
  const fid = id ?? auto
  const narrow = useNarrow()
  const reduce = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const [text, setText] = useState(isoToText(value))
  const [local, setLocal] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => { setText(isoToText(value)); setLocal('') }, [value])

  useEffect(() => {
    if (!open || narrow) return
    const down = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', down)
    return () => document.removeEventListener('pointerdown', down)
  }, [open, narrow])

  const commit = () => {
    if (text.trim() === '') { setLocal(''); onChange(''); return }
    const iso = textToISO(text)
    if (!iso) { setLocal('Enter the date as dd-mm-yyyy, like 25-12-2026.'); return }
    if (iso < min) { setLocal('That date has already passed. Pick today or a later date.'); return }
    setLocal(''); onChange(iso)
  }
  const pick = (iso: string) => { onChange(iso); setOpen(false); requestAnimationFrame(() => trigger.current?.focus()) }
  const close = () => { setOpen(false); trigger.current?.focus() }
  const shownError = local || error
  const msg = shownError ? `${fid}-err` : hint ? `${fid}-hint` : undefined

  return (
    <div ref={root} className={`relative ${className}`}>
      <div className="relative">
        <input
          id={fid}
          name={name}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder=" "
          required={required}
          value={text}
          aria-invalid={!!shownError}
          aria-describedby={msg}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); commit() }
            else if (e.key === 'ArrowDown' && e.altKey) { e.preventDefault(); setOpen(true) }
          }}
          className={`peer h-14 w-full rounded-md border bg-surface pb-1.5 pl-3.5 pr-14 pt-6 text-base text-ink outline-none transition-colors hover:border-ink focus:border-ink focus:ring-1 focus:ring-ink ${shownError ? 'border-error' : 'border-line-strong'}`}
        />
        <label htmlFor={fid} className="pointer-events-none absolute left-3.5 top-2.5 text-xs text-muted">
          {label}{required && <span aria-hidden="true"> *</span>}
        </label>
        <button
          ref={trigger}
          type="button"
          aria-label={value ? `Change date, ${isoToText(value)}` : 'Choose date'}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="absolute right-1.5 top-1.5 grid h-11 w-11 place-items-center rounded-md text-ink hover:bg-blush"
        >
          <CalendarDays className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {shownError ? (
        <p id={`${fid}-err`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-error"><AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {shownError}</p>
      ) : hint ? (
        <p id={`${fid}-hint`} className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}

      {narrow ? (
        <Drawer open={open} onClose={() => setOpen(false)} side="bottom" title="Choose a date" label="Choose a date">
          <div className="px-3 pb-6 pt-2"><Calendar value={value} min={min} onPick={pick} onClose={close} /></div>
        </Drawer>
      ) : (
        <AnimatePresence>
          {open && (
            <m.div
              role="dialog"
              aria-label="Choose a date"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: reduce ? 0 : 0.18 } }}
              exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.12 } }}
              className="absolute left-0 top-full z-40 mt-1.5 w-[21.5rem] max-w-full rounded-xl border border-line bg-white p-3 shadow-drawer"
            >
              <Calendar value={value} min={min} onPick={pick} onClose={close} />
            </m.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
