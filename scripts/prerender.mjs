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
const template = readFileSync(join(dist, 'index.html'), 'utf8').replace(/\s*<link rel="canonical"[^>]*>/g, '')

const setMeta = (html, attr, key, content) => {
  const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*" ?/?>`)
  const tag = `<meta ${attr}="${key}" content="${esc(content)}" />`
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`)
}

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
  html = html.replace('</head>', `    <link rel="canonical" href="${url}" />\n  </head>`)
  const file = r.path === '/' ? join(dist, 'index.html') : join(dist, r.path, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
  n++
}
console.log(`pre-rendered head tags for ${n} routes`)
