// Shared class strings for the form controls (select, combobox, date, slider inputs), so they stay visually identical.

/** Closed trigger: 48px, 1px light border, 8px radius, white. The border turns ink only on keyboard focus. */
export const triggerBase =
  'flex h-12 w-full items-center justify-between gap-2 rounded-md border bg-white px-3.5 text-left text-base text-ink outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-55 focus-visible:border-ink focus-visible:ring-1 focus-visible:ring-ink data-[placeholder]:text-muted'

export const triggerBorder = (invalid?: boolean) => (invalid ? 'border-error' : 'border-edge hover:border-line-strong')

/** Dropdown panel: 12px radius, 1px light border, 6px padding, layered soft shadow, fades and scales in. */
export const panelBase =
  'z-50 overflow-hidden rounded-panel border border-line bg-white p-1.5 font-sans shadow-pop data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out'

/** Option row: 40px, 8px radius. Highlight is a light blush; the chosen one is a faint blush with a check on the right. */
export const itemBase =
  'relative flex h-10 cursor-pointer select-none items-center rounded-md px-3 pr-9 text-sm text-ink outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-45'
export const itemHighlight = 'data-[highlighted]:bg-blush-soft data-[state=checked]:bg-blush/60'

export const labelCls = 'mb-1.5 block text-xs text-muted'
