import { Check, Lock } from 'lucide-react'
import { STEPS } from '@/lib/hamper'

interface Props {
  current: number
  max: number
  onGo: (n: number) => void
}

/** Desktop/tablet: five labelled buttons (done, current, locked). Mobile: one compact bar so it never wraps. */
export function StepIndicator({ current, max, onGo }: Props) {
  const pct = (current / STEPS.length) * 100
  return (
    <nav aria-label="Hamper steps">
      <div className="md:hidden">
        <p className="flex items-baseline justify-between text-sm">
          <span className="font-medium">Step {current} of {STEPS.length}</span>
          <span className="text-muted">{STEPS[current - 1]}</span>
        </p>
        <div role="progressbar" aria-label="Hamper progress" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={current} aria-valuetext={`Step ${current} of ${STEPS.length}: ${STEPS[current - 1]}`} className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-ink transition-[width]" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <ol className="hidden gap-2 md:flex">
        {STEPS.map((label, i) => {
          const n = i + 1
          const isCurrent = n === current
          const done = n < current
          const locked = n > max
          return (
            <li key={label} className="min-w-0 flex-1">
              <button
                type="button"
                disabled={locked}
                aria-current={isCurrent ? 'step' : undefined}
                onClick={() => onGo(n)}
                className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-md border px-3 text-sm transition-colors disabled:cursor-not-allowed ${
                  isCurrent ? 'border-ink bg-ink text-white' : done ? 'border-ink bg-blush hover:bg-[#f0cfcf]' : locked ? 'border-line bg-page text-muted' : 'border-line-strong bg-surface hover:bg-blush/60'
                }`}
              >
                {done ? <Check className="h-4 w-4 shrink-0" aria-hidden="true" /> : locked ? <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
                <span className="truncate">{n} / {label}</span>
                <span className="sr-only">{done ? ' (done)' : locked ? ' (locked until earlier steps are complete)' : ''}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
