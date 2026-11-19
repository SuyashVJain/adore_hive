import { useEffect, useId, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { AlertCircle, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { fromISO, isoToText, textToISO, toISO, todayISO } from '@/lib/dates'
import { Drawer } from './Drawer'
import { labelCls, panelBase } from './controls'

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

function Calendar({ value, min, onPick }: { value: string; min: string; onPick: (iso: string) => void }) {
  const minDate = fromISO(min)
  return (
    <DayPicker
      mode="single"
      className="ah-cal"
      weekStartsOn={1}
      selected={value ? fromISO(value) : undefined}
      defaultMonth={value ? fromISO(value) : minDate}
      startMonth={minDate}
      disabled={{ before: minDate }}
      onSelect={(d) => d && onPick(toISO(d))}
      autoFocus
      components={{ Chevron: ({ orientation }) => (orientation === 'left' ? <ChevronLeft className="h-4 w-4" aria-hidden="true" /> : <ChevronRight className="h-4 w-4" aria-hidden="true" />) }}
    />
  )
}

/**
 * Date field: type dd-mm-yyyy, or open the calendar (react-day-picker in a Radix Popover; a bottom sheet on phones).
 * The value is an ISO string, the same format a native date input uses.
 */
export function DateField({ label, value, onChange, min = todayISO(), error, hint, id, name, required, className = '' }: Props) {
  const auto = useId()
  const fid = id ?? auto
  const narrow = useNarrow()
  const [text, setText] = useState(isoToText(value))
  const [local, setLocal] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => { setText(isoToText(value)); setLocal('') }, [value])

  const commit = () => {
    if (text.trim() === '') { setLocal(''); onChange(''); return }
    const iso = textToISO(text)
    if (!iso) { setLocal('Enter the date as dd-mm-yyyy, like 25-12-2026.'); return }
    if (iso < min) { setLocal('That date has already passed. Pick today or a later date.'); return }
    setLocal(''); onChange(iso)
  }
  const pick = (iso: string) => { onChange(iso); setOpen(false) }
  const shownError = local || error
  const msg = shownError ? `${fid}-err` : hint ? `${fid}-hint` : undefined

  const trigger = (
    <button
      type="button"
      aria-label={value ? `Change date, ${isoToText(value)}` : 'Choose date'}
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={narrow ? () => setOpen(true) : undefined}
      className="absolute right-1 top-1 grid h-10 w-10 place-items-center rounded-md text-muted outline-none hover:bg-blush-soft hover:text-ink focus-visible:ring-1 focus-visible:ring-ink"
    >
      <CalendarDays className="h-5 w-5" aria-hidden="true" />
    </button>
  )

  return (
    <div className={className}>
      <label htmlFor={fid} className={labelCls}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      <Popover.Root open={!narrow && open} onOpenChange={setOpen}>
        <Popover.Anchor asChild>
          <div className="relative">
            <input
              id={fid}
              name={name}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="dd-mm-yyyy"
              required={required}
              value={text}
              aria-invalid={!!shownError}
              aria-describedby={msg}
              onChange={(e) => setText(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit() } }}
              className={`h-12 w-full rounded-md border bg-white pl-3.5 pr-12 text-base text-ink outline-none transition-colors placeholder:text-muted focus-visible:border-ink focus-visible:ring-1 focus-visible:ring-ink ${shownError ? 'border-error' : 'border-edge hover:border-line-strong'}`}
            />
            {narrow ? trigger : <Popover.Trigger asChild>{trigger}</Popover.Trigger>}
          </div>
        </Popover.Anchor>
        <Popover.Portal>
          <Popover.Content align="start" sideOffset={6} collisionPadding={12} aria-label="Choose a date" className={`${panelBase} !p-3`}>
            <Calendar value={value} min={min} onPick={pick} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {narrow && (
        <Drawer open={open} onClose={() => setOpen(false)} side="bottom" title="Choose a date" label="Choose a date">
          <div className="flex justify-center px-3 pb-6 pt-2"><Calendar value={value} min={min} onPick={pick} /></div>
        </Drawer>
      )}

      {shownError ? (
        <p id={`${fid}-err`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-error"><AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {shownError}</p>
      ) : hint ? (
        <p id={`${fid}-hint`} className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
}
