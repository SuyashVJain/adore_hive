import { useEffect } from 'react'
import { site } from '@/config/site'

const DEFAULT_DESC = `${site.name}: thoughtfully curated accessories, handmade crochet and personalized gifts. ${site.tagline}`

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

interface Options {
  /** Keep private or transient pages (bag, checkout, account) out of search results */
  noindex?: boolean
  /** Absolute or root-relative image for social previews */
  image?: string
}

/** Per-route title, description, canonical URL, Open Graph tags and robots hint. */
export function useSeo(title: string, description: string = DEFAULT_DESC, { noindex, image = '/logo.png' }: Options = {}) {
  useEffect(() => {
    const origin = (import.meta.env.VITE_SITE_URL as string | undefined) ?? window.location.origin
    const full = `${title} | ${site.name}`
    const url = origin + window.location.pathname
    const img = image.startsWith('http') ? image : origin + image
    const prev = document.title
    document.title = full
    setMeta('name', 'description', description)
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    setMeta('property', 'og:title', full)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', img)
    setMeta('name', 'twitter:card', 'summary')
    setCanonical(url)
    return () => { document.title = prev }
  }, [title, description, noindex, image])
}

/** Back-compat: title only (private pages should pass noindex via useSeo). */
export const useDocumentTitle = (title: string, description?: string) => useSeo(title, description)
