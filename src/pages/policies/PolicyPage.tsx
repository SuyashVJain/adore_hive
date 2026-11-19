import { useParams } from 'react-router-dom'
import { NotFound } from '../pages'
import { Privacy } from './Privacy'
import { Returns } from './Returns'
import { Shipping } from './Shipping'
import { Terms } from './Terms'

const pages = { shipping: Shipping, returns: Returns, privacy: Privacy, terms: Terms } as const

export function PolicyPage() {
  const slug = useParams().slug as keyof typeof pages
  const Page = pages[slug]
  return Page ? <Page /> : <NotFound />
}
