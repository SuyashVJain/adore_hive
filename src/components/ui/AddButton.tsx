import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { Button } from './Button'

type Phase = 'idle' | 'adding' | 'added'

interface Props {
  /** Return false if nothing was added (for example a missing option) */
  onAdd: () => boolean | void
  idleLabel: ReactNode
  disabled?: boolean
  full?: boolean
  variant?: 'primary' | 'outline'
  className?: string
  'aria-describedby'?: string
  'aria-label'?: string
}

/** Add to bag with three states: Adding, then a check mark and Added, then back to normal. */
export function AddButton({ onAdd, idleLabel, disabled, full, variant = 'primary', className = '', ...aria }: Props) {
  const [phase, setPhase] = useState<Phase>('idle')
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const click = () => {
    if (phase !== 'idle') return
    if (onAdd() === false) return
    setPhase('adding')
    timers.current.push(
      window.setTimeout(() => setPhase('added'), 350),
      window.setTimeout(() => setPhase('idle'), 1900),
    )
  }

  return (
    <>
      <Button variant={variant} full={full} disabled={disabled} onClick={click} aria-busy={phase === 'adding'} className={`min-w-[9.5rem] ${className}`} {...aria}>
        {phase === 'adding' ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Adding</> : phase === 'added' ? <><Check className="h-4 w-4" aria-hidden="true" /> Added</> : idleLabel}
      </Button>
      <span role="status" className="sr-only">{phase === 'added' ? 'Added to bag' : ''}</span>
    </>
  )
}
