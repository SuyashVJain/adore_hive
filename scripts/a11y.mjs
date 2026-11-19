// Accessibility sweep: loads every route (and key overlay states) at 390, 834 and 1440 and reports axe violations.
// Usage: start the dev server (npm run dev), then: npm run a11y [-- http://localhost:5173]
// Needs a Chromium-based browser; set CHROME_PATH if it is not found automatically.
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { chromium } from 'playwright-core'

const require = createRequire(import.meta.url)
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')
const BASE = process.argv[2] ?? 'http://localhost:5173'

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)
const executablePath = candidates.find((p) => existsSync(p))
if (!executablePath) {
  console.error('No browser found. Set CHROME_PATH.')
  process.exit(2)
}

const routes0 = [
  '/', '/about', '/our-story', '/shop', '/shop/jewellery', '/shop/hair-accessories', '/shop/handmade-crochet', '/shop/customized-gifting',
  '/product/pearl-whisper-earrings', '/product/forever-tulip-stem', '/product/does-not-exist', '/search?q=pearl', '/search?q=zzzz', '/search',
  '/wishlist', '/bag', '/checkout', '/order-confirmation/AH-TEST1', '/order-confirmation/nope', '/account', '/contact',
  '/hamper-studio', '/letter-studio', '/policies/shipping', '/policies/returns', '/policies/privacy', '/policies/terms', '/not-a-page',
]

// ONLY=/about,/ narrows the sweep; NO_STATES=1 skips the overlay states
const only = process.env.ONLY?.split(',')
const routes = only ? routes0.filter((r) => only.includes(r)) : routes0

// Seed a bag, wishlist and order so the stateful pages have something to show
const seed = () => {
  localStorage.setItem('adore-bag', JSON.stringify({ state: { items: [{ key: 'k1', productId: 'pearl-cloud-claw-clip', options: {}, qty: 1 }, { key: 'k2', productId: 'blush-satin-bow', options: { Colour: 'Blush' }, qty: 2, gift: { wrap: 'blush-ribbon', note: 'Happy birthday' } }], note: '' }, version: 2 }))
  localStorage.setItem('adore-wishlist', JSON.stringify({ state: { ids: ['blush-satin-bow', 'rosewater-scrunchie'] }, version: 0 }))
  localStorage.setItem('adore-orders', JSON.stringify({ state: { orders: [{ id: 'AH-TEST1', createdAt: '2026-11-01T10:00:00.000Z', status: 'Awaiting confirmation', email: 'test@example.com', phone: '9876543210', address: { firstName: 'Asha', lastName: 'Rao', address: '12 Park Street', apartment: '', city: 'Indore', state: 'Madhya Pradesh', pin: '452010', country: 'India' }, delivery: 'standard', payment: 'UPI', note: '', lines: [{ productId: 'pearl-cloud-claw-clip', name: 'Pearl Cloud Claw Clip', image: '/images/p-pearl-cloud-claw-clip.webp', options: {}, qty: 1, unitPrice: 449 }], totals: { subtotal: 449, giftFees: 0, shipping: 60, total: 509 } }] }, version: 0 }))
}

const states = [
  ['bag drawer', async (p) => { await p.getByRole('button', { name: /Open bag/ }).click() }],
  ['search overlay', async (p) => { await p.getByRole('button', { name: 'Search', exact: true }).click(); await p.keyboard.type('pearl') }],
  ['shop menu', async (p, w) => { if (w >= 1024) await p.hover('button[data-shop-trigger]') }],
  ['mobile menu', async (p, w) => { if (w < 1024) await p.getByRole('button', { name: 'Open menu' }).click() }],
  ['quick view', async (p, w) => { if (w >= 1024) { await p.goto(`${BASE}/shop`); await p.getByRole('button', { name: 'Quick view Pearl Whisper Earrings' }).click() } }],
  ['filter sheet', async (p, w) => { if (w < 1024) { await p.goto(`${BASE}/shop`); await p.getByRole('button', { name: /^Filter/ }).click() } }],
]

const browser = await chromium.launch({ executablePath })
const unverified = new Set() // contrast checks axe could not decide (text over images etc.)
const found = new Map() // key -> { impact, id, help, nodes:Set, where:Set }
let pages = 0

async function audit(page, label) {
  await page.addScriptTag({ content: axeSource })
  const res = await page.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }))
  pages++
  for (const i of res.incomplete) if (i.id === 'color-contrast') for (const n of i.nodes) unverified.add(`${n.target.join(' ')}  [${label}]`)
  for (const v of res.violations) {
    const key = v.id
    const e = found.get(key) ?? { impact: v.impact, id: v.id, help: v.help, nodes: new Set(), where: new Set() }
    for (const n of v.nodes) e.nodes.add(`${n.target.join(' ')}  [${label}]`)
    e.where.add(label)
    found.set(key, e)
  }
}

for (const [name, w, h] of [['mobile', 390, 844], ['tablet', 834, 1100], ['desktop', 1440, 900]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } })
  await ctx.addInitScript(seed)
  const page = await ctx.newPage()
  for (const r of routes) {
    await page.goto(BASE + r)
    await page.waitForLoadState('networkidle')
    await audit(page, `${name} ${r}`)
  }
  for (const [label, act] of process.env.NO_STATES ? [] : states) {
    await page.goto(`${BASE}/`)
    await page.waitForLoadState('networkidle')
    await act(page, w)
    await page.waitForTimeout(400)
    await audit(page, `${name} [${label}]`)
  }
  await ctx.close()
}
await browser.close()

const order = { critical: 0, serious: 1, moderate: 2, minor: 3 }
const list = [...found.values()].sort((a, b) => order[a.impact] - order[b.impact])
console.log(`Audited ${pages} page states.`)
if (!list.length) console.log('No violations.')
for (const v of list) {
  console.log(`\n[${v.impact}] ${v.id}: ${v.help}  (${v.nodes.size} nodes, ${v.where.size} pages)`)
  for (const n of [...v.nodes].slice(0, 5)) console.log('   ', n)
}
if (unverified.size) {
  console.log(`\n${unverified.size} contrast checks need a manual look (text over images or gradients):`)
  for (const n of [...unverified].slice(0, 8)) console.log('   ', n)
}
const bad = list.filter((v) => v.impact === 'critical' || v.impact === 'serious')
process.exit(bad.length ? 1 : 0)
