import { useParams } from 'react-router-dom'
import { categoryListings, shopAllListing } from '@/data/listings'
import type { CategorySlug } from '@/data/products'
import { GiftingRequest } from './GiftingRequest'
import { NotFound } from './pages'
import { ProductListing } from './ProductListing'

export const Shop = () => <ProductListing config={shopAllListing} />

export function Category() {
  const slug = useParams().category as CategorySlug
  const config = categoryListings[slug]
  if (!config) return <NotFound />
  // key: reset local UI state when moving between categories
  return <ProductListing key={slug} config={config} after={slug === 'customized-gifting' ? <GiftingRequest /> : undefined} />
}
