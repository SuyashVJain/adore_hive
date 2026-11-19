// Pre-renders per-route <title>, meta description, canonical and Open Graph tags into dist/ at build time.
// The app is still a single-page app: each generated file is the normal index.html with its head tags swapped,
// so view-source (and crawlers that do not run scripts) see the right text, and the SPA boots as usual.
// The robots meta (noindex while VITE_INDEXABLE is off) is already in index.html and is carried over.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function readDotenv(file) {
  const p = join(root, file)
  if (!existsSync(p)) return {}
  return Object.fromEntries(
    readFileSync(p, 'utf8').split(/\r?\n/).map((l) => l.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]),
  )
}
const env = { ...readDotenv('.env'), ...readDotenv('.env.local'), ...process.env }
const SITE = (env.SITE_URL || env.VITE_SITE_URL || 'https://adorehive.in').replace(/\/$/, '')

// Bundle the route list (TypeScript, with the @ alias) into one in-memory ES module
const out = await build({
  entryPoints: [join(root, 'src/seo/routes.ts')],
  bundle: true, write: false, format: 'esm', platform: 'node',
  alias: { '@': join(root, 'src') },
  outdir: 'out',
})
const { routeMetas } = await import('data:text/javascript;base64,' + Buffer.from(out.outputFiles[0].text).toString('base64'))

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const dist = join(root, 'dist')
const template = readFileSync(join(dist, 'index.html'), 'utf8').replace(/\s*<link rel="canonical"[^>]*>/g, '').replace(/\s*<link rel="modulepreload" href="\/assets\/(?!index-)[^"]*" \/>/g, '')

const setMeta = (html, attr, key, content) => {
  const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*" ?/?>`)
  const tag = `<meta ${attr}="${key}" content="${esc(content)}" />`
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`)
}

// Route chunks are lazy, so the browser would otherwise find them only after the entry script runs.
// Preloading the right ones in each pre-rendered page lets them download in parallel with it.
const manifestPath = join(dist, '.vite', 'manifest.json')
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {}
const entryFor = (path) => {
  if (path === '/') return 'src/pages/Home.tsx'
  if (path.startsWith('/shop')) return 'src/pages/ShopPages.tsx'
  if (path.startsWith('/product/')) return 'src/pages/ProductPage.tsx'
  if (path.startsWith('/policies/')) return 'src/pages/policies/PolicyPage.tsx'
  return { '/about': 'AboutPage', '/contact': 'ContactPage', '/hamper-studio': 'HamperStudio', '/letter-studio': 'LetterStudio', '/gift-finder': 'GiftFinder' }[path] && `src/pages/${{ '/about': 'AboutPage', '/contact': 'ContactPage', '/hamper-studio': 'HamperStudio', '/letter-studio': 'LetterStudio', '/gift-finder': 'GiftFinder' }[path]}.tsx`
}
const chunksFor = (key, seen = new Set()) => {
  const e = manifest[key]
  if (!e || seen.has(key)) return seen
  seen.add(key)
  for (const i of e.imports ?? []) chunksFor(i, seen)
  return seen
}
const entryFile = Object.values(manifest).find((e) => e.isEntry)?.file

let n = 0
for (const r of routeMetas()) {
  const title = `${r.title} | Adore Hive`
  const url = SITE + (r.path === '/' ? '/' : r.path)
  const image = r.image ? SITE + r.image : `${SITE}/og-image.png`
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
  html = setMeta(html, 'name', 'description', r.description)
  html = setMeta(html, 'property', 'og:title', title)
  html = setMeta(html, 'property', 'og:description', r.description)
  html = setMeta(html, 'property', 'og:url', url)
  html = setMeta(html, 'property', 'og:image', image)
  html = setMeta(html, 'name', 'twitter:image', image)
  const key = process.env.NO_PRELOAD ? undefined : entryFor(r.path)
  const preload = key ? [...chunksFor(key)].map((k) => manifest[k]?.file).filter((f) => f && f !== entryFile).map((f) => `    <link rel="modulepreload" href="/${f}" />
`).join('') : ''
  html = html.replace('</head>', `${preload}    <link rel="canonical" href="${url}" />
  </head>`)
  const file = r.path === '/' ? join(dist, 'index.html') : join(dist, r.path, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
  n++
}
console.log(`pre-rendered head tags for ${n} routes`)
