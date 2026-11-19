// Writes public/robots.txt (and public/sitemap.xml when indexing is on). Runs before every build.
//
//   VITE_INDEXABLE=true   emit sitemap.xml and a robots.txt that allows crawling
//   (default / false)     robots.txt disallows everything and no sitemap.xml is written
//   SITE_URL              production origin used in the sitemap, e.g. https://www.example.com
//
// Values come from the environment, .env.local or .env (in that order).
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

function readDotenv(file) {
  const path = new URL(`../${file}`, import.meta.url)
  if (!existsSync(path)) return {}
  return Object.fromEntries(
    readFileSync(path, 'utf8').split(/\r?\n/).map((l) => l.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]),
  )
}
const env = { ...readDotenv('.env'), ...readDotenv('.env.local'), ...process.env }

const indexable = env.VITE_INDEXABLE === 'true' || env.VITE_INDEXABLE === '1'
const SITE = (env.SITE_URL || env.VITE_SITE_URL || 'https://adorehive.in').replace(/\/$/, '')
const robotsPath = new URL('../public/robots.txt', import.meta.url)
const sitemapPath = new URL('../public/sitemap.xml', import.meta.url)

if (!indexable) {
  writeFileSync(robotsPath, 'User-agent: *\nDisallow: /\n')
  rmSync(sitemapPath, { force: true })
  console.log('indexing off: robots.txt disallows everything, no sitemap.xml')
} else {
  // Product slugs live in the image map; read the keys rather than duplicating the list
  const images = readFileSync(new URL('../src/data/images.ts', import.meta.url), 'utf8')
  const block = images.match(/products:\s*\{([\s\S]*?)\n  \},/)?.[1] ?? ''
  const products = [...block.matchAll(/'([a-z0-9-]+)':/g)].map((m) => m[1])

  const categories = ['jewellery', 'hair-accessories', 'handmade-crochet', 'customized-gifting']
  const paths = [
    '/', '/shop', ...categories.map((c) => `/shop/${c}`), ...products.map((p) => `/product/${p}`),
    '/about', '/contact', '/hamper-studio', '/letter-studio', '/gift-finder',
    '/policies/shipping', '/policies/returns', '/policies/privacy', '/policies/terms',
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${SITE}${p}</loc></url>`).join('\n')}\n</urlset>\n`
  writeFileSync(sitemapPath, xml)
  writeFileSync(robotsPath, `User-agent: *\nAllow: /\nDisallow: /bag\nDisallow: /checkout\nDisallow: /account\nDisallow: /wishlist\nDisallow: /search\nDisallow: /order-confirmation/\n\nSitemap: ${SITE}/sitemap.xml\n`)
  console.log(`indexing on: sitemap.xml (${paths.length} urls) and robots.txt written for ${SITE}`)
}
