// Lighthouse for /checkout, which needs a bag in localStorage (otherwise it redirects to /bag).
// Launches a browser with a debugging port, seeds the bag, then points Lighthouse at that same browser.
// Usage: npm run build && npx vite preview --port 4173, then: node scripts/lighthouse-checkout.mjs [baseUrl]
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright-core'

const BASE = process.argv[2] ?? 'http://localhost:4173'
const PORT = 9333
const candidates = [process.env.CHROME_PATH, 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean)
const exe = candidates.find((p) => existsSync(p))
if (!exe) throw new Error('No browser found. Set CHROME_PATH.')

const chrome = spawn(exe, [`--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'lh-'))}`, '--headless=new', '--no-sandbox', 'about:blank'], { stdio: 'ignore' })
await new Promise((r) => setTimeout(r, 2500))

try {
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${PORT}`)
  const ctx = browser.contexts()[0]
  const page = await ctx.newPage()
  await page.goto(BASE + '/')
  await page.evaluate(() => localStorage.setItem('adore-bag', JSON.stringify({ state: { items: [{ key: 'k1', productId: 'pearl-cloud-claw-clip', options: {}, qty: 1 }], note: '' }, version: 2 })))
  await page.close()
  await browser.close()

  const out = join(tmpdir(), 'lh-checkout.json')
  spawnSync('npx', ['--yes', 'lighthouse@12', `${BASE}/checkout`, `--port=${PORT}`, '--disable-storage-reset', '--quiet', '--output=json', `--output-path=${out}`, '--only-categories=performance,accessibility,best-practices,seo'], { stdio: 'ignore', shell: true })
  const cats = JSON.parse(readFileSync(out, 'utf8')).categories
  console.log('checkout ', Object.entries(cats).map(([k, v]) => `${k.slice(0, 4)} ${Math.round(v.score * 100)}`).join('  '))
} finally {
  chrome.kill()
}
