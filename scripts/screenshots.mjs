// Regenerates docs/screenshots/*.png (desktop and mobile) for the README.
// Usage: npm run dev (or build + preview), then: npm run screenshots [-- http://localhost:5173]
import { existsSync, mkdirSync } from 'node:fs'
import { chromium } from 'playwright-core'

const BASE = process.argv[2] ?? 'http://localhost:5173'
const OUT = new URL('../docs/screenshots/', import.meta.url)
mkdirSync(OUT, { recursive: true })

const candidates = [process.env.CHROME_PATH, 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean)
const executablePath = candidates.find((p) => existsSync(p))
if (!executablePath) throw new Error('No browser found. Set CHROME_PATH.')

// A populated bag, wishlist and hamper make the stateful pages worth looking at
const seed = () => {
  localStorage.setItem('adore-bag', JSON.stringify({ state: { items: [
    { key: 'k1', productId: 'pearl-cloud-claw-clip', options: {}, qty: 1 },
    { key: 'k2', productId: 'blush-satin-bow', options: { Colour: 'Blush' }, qty: 1, gift: { wrap: 'blush-ribbon', note: 'Happy birthday!' } },
  ], note: '' }, version: 2 }))
  localStorage.setItem('adore-wishlist', JSON.stringify({ state: { ids: ['golden-hour-necklace', 'little-daisy-bouquet', 'rosewater-scrunchie'] }, version: 0 }))
  localStorage.setItem('adore-hamper', JSON.stringify({ state: { draft: {
    occasion: 'Birthday', recipient: 'Meera', date: '', box: 'blush-keepsake', ribbon: 'ivory-satin',
    items: { 'pearl-cloud-claw-clip': { qty: 1, options: {} }, 'little-daisy-bouquet': { qty: 1, options: {} }, chocolates: { qty: 1, options: {} } },
    note: { on: true, to: 'Meera', message: 'A little box of lovely things, chosen just for you.', from: 'Asha', instructions: '', includePrices: false, surprise: false }, letter: null,
  } }, version: 0 }))
}

const pages = [
  ['home', '/'],
  ['shop', '/shop'],
  ['product', '/product/pearl-whisper-earrings'],
  ['hamper-studio', '/hamper-studio?step=3'],
  ['letter-studio', '/letter-studio'],
  ['bag', '/bag'],
  ['checkout', '/checkout'],
  ['about', '/about'],
]

const browser = await chromium.launch({ executablePath })
for (const [device, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: device === 'mobile' ? 2 : 1 })
  await ctx.addInitScript(seed)
  const page = await ctx.newPage()
  for (const [name, path] of pages) {
    await page.goto(BASE + path)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    await page.screenshot({ path: new URL(`${name}-${device}.png`, OUT).pathname.replace(/^\/([A-Za-z]:)/, '$1') })
    console.log(`${name}-${device}.png`)
  }
  await ctx.close()
}
await browser.close()
