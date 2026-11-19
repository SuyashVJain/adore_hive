import { useSearchParams } from 'react-router-dom'
import { useDocumentTitle } from '@/lib/useDocumentTitle'
import type { ListingConfig } from '@/data/listings'
import { ProductListing } from './ProductListing'

export function SearchPage() {
  const q = useSearchParams()[0].get('q')?.trim() ?? ''
  useDocumentTitle(q ? `Search: ${q}` : 'Search')
  const config: ListingConfig = {
    search: true,
    showColour: true,
    eyebrow: 'Search results',
    title: q ? `“${q}”` : 'Search the hive',
    subtitle: q ? 'Everything in the hive that matches your search.' : 'Type what you’re looking for to see lovely matches.',
  }
  return <ProductListing config={config} />
}
