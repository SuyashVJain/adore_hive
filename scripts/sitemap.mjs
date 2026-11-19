// Writes public/sitemap.xml and public/robots.txt. Runs before every build.
// Set SITE_URL to your production origin, e.g. SITE_URL=https://www.example.com npm run build
import { readFileSync, writeFileSync } from 'node:fs'

const SITE = (process.env.SITE_URL ?? 'https://adorehive.in').replace(/\/$/, '')

// Product slugs live in the image map; read the keys rather than duplicating the list
const images = readFileSync(new URL('../src/data/images.ts', import.meta.url), 'utf8')
const block = images.match(/products:\s*\{([\s\S]*?)\n  \},/)?.[1] ?? ''
const products = [...block.matchAll(/'([a-z0-9-]+)':/g)].map((m) => m[1])

const categories = ['jewellery', 'hair-accessories', 'handmade-crochet', 'customized-gifting']
const paths = [
  '/', '/shop', ...categories.map((c) => `/shop/${c}`), ...products.map((p) => `/product/${p}`),
  '/about', '/contact', '/hamper-studio', '/letter-studio',
  '/policies/shipping', '/policies/returns', '/policies/privacy', '/policies/terms',
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${SITE}${p}</loc></url>`).join('\n')}\n</urlset>\n`
writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml)

const robots = `User-agent: *\nAllow: /\nDisallow: /bag\nDisallow: /checkout\nDisallow: /account\nDisallow: /wishlist\nDisallow: /search\nDisallow: /order-confirmation/\n\nSitemap: ${SITE}/sitemap.xml\n`
writeFileSync(new URL('../public/robots.txt', import.meta.url), robots)
console.log(`sitemap.xml (${paths.length} urls) and robots.txt written for ${SITE}`)
