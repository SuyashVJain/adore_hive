import type { ReactNode } from 'react'
import * as RS from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { itemBase, itemHighlight, panelBase, triggerBase, triggerBorder } from './controls'

export interface SelectOption {
  value: string
  label: string
}

interface Props {
  options: SelectOption[]
  value: string
  onValueChange: (v: string) => void
  placeholder?: string
  id?: string
  name?: string
  required?: boolean
  autoComplete?: string
  disabled?: boolean
  invalid?: boolean
  describedBy?: string
  ariaLabel?: string
  /** Replace the default trigger content (the Sort control shows "Sort: Featured") */
  renderValue?: ReactNode
  className?: string
  onBlur?: () => void
}

/**
 * Radix Select in the brand style. Inside a <form> Radix renders a hidden native select that carries
 * name, required and autocomplete, so submission and browser autofill keep working.
 * The panel is exactly as wide as the trigger.
 */
export function Select({ options, value, onValueChange, placeholder, id, name, required, autoComplete, disabled, invalid, describedBy, ariaLabel, renderValue, className = '', onBlur }: Props) {
  return (
    <RS.Root value={value || undefined} onValueChange={onValueChange} name={name} required={required} autoComplete={autoComplete} disabled={disabled}>
      <RS.Trigger id={id} aria-label={ariaLabel} aria-invalid={invalid || undefined} aria-describedby={describedBy} onBlur={onBlur} className={`${triggerBase} ${triggerBorder(invalid)} ${className}`}>
        {renderValue ?? <span className="truncate"><RS.Value placeholder={placeholder} /></span>}
        <RS.Icon asChild><ChevronDown className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" /></RS.Icon>
      </RS.Trigger>
      <RS.Portal>
        <RS.Content position="popper" sideOffset={6} collisionPadding={12} className={`${panelBase} w-[var(--radix-select-trigger-width)] max-h-[min(var(--radix-select-content-available-height),18rem)]`}>
          <RS.Viewport>
            {options.map((o) => (
              <RS.Item key={o.value} value={o.value} className={`${itemBase} ${itemHighlight}`}>
                <RS.ItemText>{o.label}</RS.ItemText>
                <RS.ItemIndicator className="absolute right-3 inline-flex"><Check className="h-4 w-4" aria-hidden="true" /></RS.ItemIndicator>
              </RS.Item>
            ))}
          </RS.Viewport>
        </RS.Content>
      </RS.Portal>
    </RS.Root>
  )
}
