import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import type { ListingConfig } from '@/data/listings'
import { emptyFilters, type Filters } from '@/lib/listing'
import { FilterPanel } from './FilterPanel'

export function FilterSheet({ open, onClose, value, onApply, config }: { open: boolean; onClose: () => void; value: Filters; onApply: (f: Filters) => void; config: ListingConfig }) {
  return (
    <Drawer open={open} onClose={onClose} side="bottom" title="Filters" label="Filters" className="lg:hidden">
      <SheetBody value={value} onApply={(f) => { onApply(f); onClose() }} config={config} />
    </Drawer>
  )
}

function SheetBody({ value, onApply, config }: { value: Filters; onApply: (f: Filters) => void; config: ListingConfig }) {
  const [draft, setDraft] = useState(value)
  return (
    <>
      <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-7">
        <FilterPanel value={draft} onChange={setDraft} showCollections={!config.slug} showColour={config.showColour} />
      </div>
      <div className="flex gap-3 border-t border-line bg-page px-5 pb-5 pt-4 sm:px-7">
        <Button variant="outline" className="flex-1" onClick={() => setDraft({ ...emptyFilters(draft.sort, config.search ? draft.q : undefined), type: draft.type })}>Clear</Button>
        <Button className="flex-1" onClick={() => onApply(draft)}>Apply</Button>
      </div>
    </>
  )
}
